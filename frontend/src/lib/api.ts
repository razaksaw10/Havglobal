import {
  ApiResponse,
  Category,
  DashboardStats,
  Inquiry,
  Product,
} from '../types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('hava_admin_token');
}

export function setAuthToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('hava_admin_token', token);
}

export function removeAuthToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('hava_admin_token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg =
      data?.message ||
      (Array.isArray(data?.message) ? data.message.join(', ') : null) ||
      `Erreur requête HTTP ${res.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Categories
  async getCategories(): Promise<{ categories: Category[] }> {
    const res = await request<ApiResponse<{ categories: Category[] }>>(
      '/api/v1/categories',
    );
    return res.data;
  },

  async getCategoryBySlug(slug: string): Promise<Category & { products: Product[] }> {
    const res = await request<ApiResponse<Category & { products: Product[] }>>(
      `/api/v1/categories/${slug}`,
    );
    return res.data;
  },

  // Products
  async getProducts(params: {
    category?: string;
    search?: string;
    featured?: boolean | string;
    sort?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ products: Product[]; pagination: any }> {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all')
      query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.featured) query.set('featured', String(params.featured));
    if (params.sort) query.set('sort', params.sort);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    const endpoint = `/api/v1/products${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await request<ApiResponse<Product[]>>(endpoint);
    return {
      products: res.data || [],
      pagination: res.pagination || {
        total: (res.data || []).length,
        page: 1,
        limit: 20,
        totalPages: 1,
        hasMore: false,
      },
    };
  },

  async getProductById(id: number): Promise<Product> {
    const res = await request<ApiResponse<Product>>(`/api/v1/products/${id}`);
    return res.data;
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const res = await request<ApiResponse<Product>>('/api/v1/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return res.data;
  },

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    const res = await request<ApiResponse<Product>>(`/api/v1/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    return res.data;
  },

  async deleteProduct(id: number): Promise<{ message: string; id: number }> {
    const res = await request<ApiResponse<{ message: string; id: number }>>(
      `/api/v1/products/${id}`,
      {
        method: 'DELETE',
      },
    );
    return res.data;
  },

  // Inquiries
  async submitInquiry(inquiryData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    country?: string;
    subject?: string;
    categorySlug?: string;
    message: string;
  }): Promise<{ message: string; inquiry_id: number }> {
    const res = await request<ApiResponse<{ message: string; inquiry_id: number }>>(
      '/api/v1/inquiries',
      {
        method: 'POST',
        body: JSON.stringify(inquiryData),
      },
    );
    return res.data;
  },

  async getInquiries(params: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ inquiries: Inquiry[]; pagination: any }> {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'all')
      query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    const endpoint = `/api/v1/inquiries${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await request<ApiResponse<Inquiry[]>>(endpoint);
    return {
      inquiries: res.data || [],
      pagination: res.pagination || {
        total: (res.data || []).length,
        page: 1,
        limit: 50,
        totalPages: 1,
        hasMore: false,
      },
    };
  },

  async getInquiryById(id: number): Promise<Inquiry> {
    const res = await request<ApiResponse<Inquiry>>(`/api/v1/inquiries/${id}`);
    return res.data;
  },

  async updateInquiryStatus(
    id: number,
    status: string,
    notes?: string,
  ): Promise<Inquiry> {
    const res = await request<ApiResponse<Inquiry>>(
      `/api/v1/inquiries/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      },
    );
    return res.data;
  },

  async deleteInquiry(id: number): Promise<{ message: string }> {
    const res = await request<ApiResponse<{ message: string }>>(
      `/api/v1/inquiries/${id}`,
      {
        method: 'DELETE',
      },
    );
    return res.data;
  },

  async exportInquiriesCsv(): Promise<Blob> {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/api/v1/inquiries/export/csv`, {
      headers: {
        Authorization: `Bearer ${token || ''}`,
      },
    });
    if (!res.ok) {
      throw new Error('Erreur lors du téléchargement du fichier CSV');
    }
    return res.blob();
  },

  // Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await request<ApiResponse<DashboardStats>>(
      '/api/v1/stats/dashboard',
    );
    return res.data;
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; admin: any }> {
    const res = await request<ApiResponse<{ token: string; admin: any }>>(
      '/api/v1/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      },
    );
    return res.data;
  },

  async getMe(): Promise<{ admin: any }> {
    const res = await request<ApiResponse<{ admin: any }>>('/api/v1/auth/me');
    return res.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const res = await request<ApiResponse<{ message: string }>>(
      '/api/v1/auth/change-password',
      {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      },
    );
    return res.data;
  },

  // Upload
  async uploadImage(file: File): Promise<{ imageUrl: string }> {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/api/v1/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token || ''}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || 'Erreur lors de l’upload de l’image');
    }
    return data.data;
  },
};
