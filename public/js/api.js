/**
 * HAVA Global Trade - API Client v2 & Utility Functions
 */

const API_BASE = '/api/v1';

const Api = {
  getToken() {
    return localStorage.getItem('hava_admin_token');
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('hava_admin_token', token);
    } else {
      localStorage.removeItem('hava_admin_token');
    }
  },

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = { ...options.headers };

    // Si on n'envoie pas de FormData (upload), on met Content-Type JSON
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);

      // Traitement des téléchargements directs (ex: CSV)
      if (response.headers.get('content-type')?.includes('text/csv')) {
        const blob = await response.blob();
        return blob;
      }

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401 && !endpoint.includes('/auth/login')) {
          this.setToken(null);
          if (window.location.pathname.includes('admin')) {
            window.location.reload();
          }
        }
        throw new Error(json.error || `Erreur ${response.status}: Impossible de compléter l'opération.`);
      }

      // Déballe automatiquement la structure standardisée { success: true, data: { ... } }
      if (json && typeof json === 'object' && json.success !== undefined && json.data !== undefined) {
        // Préserve pagination si présente
        if (json.pagination) {
          json.data.pagination = json.pagination;
        }
        return json.data;
      }

      return json;
    } catch (err) {
      console.error(`[API Error] ${endpoint}:`, err.message);
      throw err;
    }
  },

  // Auth
  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  },

  getMe() {
    return this.request('/auth/me');
  },

  changePassword(currentPassword, newPassword) {
    return this.request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  },

  // Categories
  getCategories() {
    return this.request('/categories');
  },

  getCategory(slug) {
    return this.request(`/categories/${slug}`);
  },

  // Products
  getProducts(params = {}) {
    const qs = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        qs.append(key, params[key]);
      }
    });
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return this.request(`/products${query}`);
  },

  getProduct(id) {
    return this.request(`/products/${id}`);
  },

  createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  // File Upload (Images, PDFs)
  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    return this.request('/upload', {
      method: 'POST',
      body: formData
    });
  },

  // Inquiries & Quotes
  submitInquiry(inquiryData) {
    return this.request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiryData)
    });
  },

  getInquiries(params = {}) {
    const qs = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        qs.append(key, params[key]);
      }
    });
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return this.request(`/inquiries${query}`);
  },

  getInquiry(id) {
    return this.request(`/inquiries/${id}`);
  },

  updateInquiryStatus(id, status, notes = null) {
    return this.request(`/inquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    });
  },

  deleteInquiry(id) {
    return this.request(`/inquiries/${id}`, {
      method: 'DELETE'
    });
  },

  async downloadInquiriesCsv() {
    const blob = await this.request('/inquiries/export/csv');
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hava_devis_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  // Stats
  getStats() {
    return this.request('/stats/dashboard');
  }
};

/**
 * Toast Notification System
 */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
