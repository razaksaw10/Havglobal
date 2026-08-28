/**
 * HAVA Global Trade - Admin Portal Logic v2 (Prisma Enterprise)
 */

let currentAdminTab = 'dashboard';
let allProductsCache = [];
let allInquiriesCache = [];
let editingProductId = null;

// Pagination states
let productsPagination = { page: 1, limit: 20, totalPages: 1, total: 0 };
let inquiriesPagination = { page: 1, limit: 25, totalPages: 1, total: 0 };

let productSearchTimeout = null;
let inquirySearchTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
  displayCurrentDate();
  checkAuth();
  initAdminTabs();
  initLoginForm();
  initProductForm();
  initModalBackdropClicks();
});

function displayCurrentDate() {
  const badge = document.getElementById('current-date-badge');
  if (badge) {
    const now = new Date();
    badge.innerText = now.toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  }
}

// Check if admin is authenticated
async function checkAuth() {
  const token = Api.getToken();
  const loginOverlay = document.getElementById('admin-login-overlay');
  const adminMainLayout = document.getElementById('admin-main-layout');

  if (!token) {
    if (loginOverlay) loginOverlay.style.display = 'flex';
    if (adminMainLayout) adminMainLayout.style.display = 'none';
    return;
  }

  try {
    const data = await Api.getMe();
    if (loginOverlay) loginOverlay.style.display = 'none';
    if (adminMainLayout) adminMainLayout.style.display = 'flex';
    
    const adminNameEl = document.getElementById('admin-display-name');
    if (adminNameEl && data.admin) {
      adminNameEl.innerText = data.admin.name || data.admin.email;
    }

    loadDashboardStats();
    loadAdminProducts();
    loadAdminInquiries();
  } catch (err) {
    Api.setToken(null);
    if (loginOverlay) loginOverlay.style.display = 'flex';
    if (adminMainLayout) adminMainLayout.style.display = 'none';
  }
}

// Handle Login Form
function initLoginForm() {
  const form = document.getElementById('admin-login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!email || !password) {
      showToast('Veuillez renseigner votre email et mot de passe.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = 'Connexion en cours...';

    try {
      const res = await Api.login(email, password);
      showToast('Connexion réussie ! Bienvenue.', 'success');
      form.reset();
      checkAuth();
    } catch (err) {
      showToast(err.message || 'Identifiants invalides.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Se connecter au tableau de bord';
    }
  });
}

function adminLogout() {
  if (confirm('Voulez-vous vraiment vous déconnecter du panneau d’administration ?')) {
    Api.setToken(null);
    window.location.reload();
  }
}

// Tab navigation
function initAdminTabs() {
  document.querySelectorAll('.nav-admin-link[data-tab]').forEach(link => {
    link.addEventListener('click', () => {
      const tab = link.getAttribute('data-tab');
      switchTab(tab);
    });
  });
}

function switchTab(tabName) {
  currentAdminTab = tabName;
  document.querySelectorAll('.nav-admin-link[data-tab]').forEach(l => {
    l.classList.toggle('active', l.getAttribute('data-tab') === tabName);
  });

  document.querySelectorAll('.admin-tab-content').forEach(pane => {
    pane.classList.toggle('active', pane.id === `tab-${tabName}`);
  });

  const titleEl = document.getElementById('admin-page-title');
  if (titleEl) {
    if (tabName === 'dashboard') titleEl.innerText = 'Tableau de Bord';
    if (tabName === 'products') titleEl.innerText = 'Gestion du Catalogue Produits';
    if (tabName === 'inquiries') titleEl.innerText = 'Gestion des Devis & Messages B2B';
  }

  if (tabName === 'dashboard') loadDashboardStats();
  if (tabName === 'products') loadAdminProducts();
  if (tabName === 'inquiries') loadAdminInquiries();
}

function refreshDashboard() {
  loadDashboardStats();
  if (currentAdminTab === 'products') loadAdminProducts();
  if (currentAdminTab === 'inquiries') loadAdminInquiries();
  showToast('Données actualisées.', 'info');
}

// Close modals when clicking backdrop
function initModalBackdropClicks() {
  const productModal = document.getElementById('product-form-modal');
  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) closeProductFormModal();
    });
  }

  const inquiryModal = document.getElementById('inquiry-detail-modal');
  if (inquiryModal) {
    inquiryModal.addEventListener('click', (e) => {
      if (e.target === inquiryModal) closeInquiryDetailModal();
    });
  }
}

// ==================== 1. DASHBOARD STATS ====================
async function loadDashboardStats() {
  try {
    const data = await Api.getStats();
    const kpis = data.kpis || {};

    const elProd = document.getElementById('kpi-products');
    const elInq = document.getElementById('kpi-inquiries');
    const elNew = document.getElementById('kpi-new-inquiries');
    const elResolved = document.getElementById('kpi-resolved-inquiries');

    if (elProd) elProd.innerText = kpis.totalProducts || 0;
    if (elInq) elInq.innerText = kpis.totalInquiries || 0;
    if (elNew) elNew.innerText = kpis.newInquiries || 0;
    if (elResolved) elResolved.innerText = kpis.resolvedInquiries || 0;

    // Distribution des catégories
    const distContainer = document.getElementById('category-distribution-list');
    if (distContainer && data.categoryDistribution) {
      distContainer.innerHTML = data.categoryDistribution.map(cat => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--admin-border);">
          <span>${cat.icon || '📦'} <strong>${escapeHtml(cat.name)}</strong></span>
          <span style="background: var(--admin-primary); color: #000; font-weight: 700; font-size: 0.78rem; padding: 2px 8px; border-radius: 12px;">${cat.count} réf.</span>
        </div>
      `).join('');
    }

    // Derniers produits
    const recentProdContainer = document.getElementById('recent-products-list');
    if (recentProdContainer && data.recentProducts) {
      recentProdContainer.innerHTML = data.recentProducts.map(p => `
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
          <span>${p.is_featured ? '⭐ ' : ''}<strong>${escapeHtml(p.name)}</strong></span>
          <span style="color: var(--admin-primary); font-weight: 600;">${p.price > 0 ? `${p.price.toFixed(2)} ${p.currency}` : 'Sur devis'}</span>
        </div>
      `).join('');
    }

    // Render Recent Inquiries in Dashboard
    const recentInqTbody = document.getElementById('recent-inquiries-tbody');
    if (recentInqTbody) {
      if (!data.recentInquiries || data.recentInquiries.length === 0) {
        recentInqTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--admin-muted); padding:20px;">Aucune demande récente.</td></tr>`;
      } else {
        recentInqTbody.innerHTML = data.recentInquiries.map(inq => `
          <tr>
            <td><strong>${escapeHtml(inq.name)}</strong><br><small style="color:var(--admin-muted);">${escapeHtml(inq.email)}</small></td>
            <td>${escapeHtml(inq.company || 'Particulier')}</td>
            <td>${escapeHtml(inq.subject)}</td>
            <td><span class="status-pill ${inq.status}">${getStatusLabel(inq.status)}</span></td>
            <td><small>${formatDate(inq.created_at)}</small></td>
          </tr>
        `).join('');
      }
    }
  } catch (err) {
    console.error('Erreur stats dashboard:', err);
  }
}

// ==================== 2. PRODUCTS MANAGEMENT ====================
async function loadAdminProducts() {
  const tbody = document.getElementById('admin-products-tbody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px;">Chargement des produits...</td></tr>`;

  try {
    const search = document.getElementById('admin-product-search')?.value.trim() || '';
    const category = document.getElementById('admin-product-cat-filter')?.value || 'all';

    const params = {
      page: productsPagination.page,
      limit: productsPagination.limit
    };
    if (search) params.search = search;
    if (category && category !== 'all') params.category = category;

    const data = await Api.getProducts(params);
    allProductsCache = data.products || (Array.isArray(data) ? data : []);
    
    if (data.pagination) {
      productsPagination = { ...productsPagination, ...data.pagination };
    }

    renderAdminProductsTable(allProductsCache);
    updateProductsPaginationControls();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#ef4444; padding:20px;">Erreur lors du chargement des produits.</td></tr>`;
  }
}

function updateProductsPaginationControls() {
  const infoEl = document.getElementById('products-page-info');
  const prevBtn = document.getElementById('btn-prev-products');
  const nextBtn = document.getElementById('btn-next-products');

  if (infoEl) {
    infoEl.innerText = `Page ${productsPagination.page} sur ${productsPagination.totalPages || 1} (${productsPagination.total || allProductsCache.length} produits au total)`;
  }
  if (prevBtn) prevBtn.disabled = productsPagination.page <= 1;
  if (nextBtn) nextBtn.disabled = productsPagination.page >= (productsPagination.totalPages || 1);
}

function changeProductsPage(delta) {
  const newPage = productsPagination.page + delta;
  if (newPage >= 1 && newPage <= productsPagination.totalPages) {
    productsPagination.page = newPage;
    loadAdminProducts();
  }
}

function renderAdminProductsTable(products) {
  const tbody = document.getElementById('admin-products-tbody');
  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--admin-muted);">Aucun produit trouvé.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}" class="product-row-img" onerror="this.src='/file/HAVA GLOBAL TRADİNG.png'">
      </td>
      <td>
        <strong>${escapeHtml(p.name)}</strong>
        ${p.is_featured ? '<span class="status-pill resolved" style="font-size:0.68rem; margin-left:6px;">⭐ Vedette</span>' : ''}
      </td>
      <td><span style="text-transform:capitalize;">${escapeHtml(p.category_name || p.category_slug)}</span></td>
      <td><strong>${p.price > 0 ? `${Number(p.price).toFixed(2)} ${p.currency || 'EUR'}` : 'Sur devis'}</strong></td>
      <td>${p.stock || 0}</td>
      <td><small>${formatDate(p.created_at)}</small></td>
      <td>
        <div style="display:flex; gap:6px;">
          <button type="button" class="btn-action-icon" title="Modifier" onclick="openEditProductModal(${p.id})">✏️</button>
          <button type="button" class="btn-action-icon delete" title="Supprimer" onclick="deleteProductConfirm(${p.id})">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function debounceFilterProducts() {
  clearTimeout(productSearchTimeout);
  productSearchTimeout = setTimeout(() => {
    productsPagination.page = 1;
    loadAdminProducts();
  }, 300);
}

function filterAdminProducts() {
  productsPagination.page = 1;
  loadAdminProducts();
}

function openAddProductModal() {
  editingProductId = null;
  const modal = document.getElementById('product-form-modal');
  const title = document.getElementById('modal-product-form-title');
  const form = document.getElementById('product-form');

  if (title) title.innerText = 'Ajouter un Produit au Catalogue';
  if (form) form.reset();

  const specsEl = document.getElementById('prod-specs');
  if (specsEl) specsEl.value = '';

  const featEl = document.getElementById('prod-featured');
  if (featEl) featEl.checked = false;

  const preview = document.getElementById('prod-image-preview');
  if (preview) {
    preview.src = '';
    preview.style.display = 'none';
  }

  if (modal) modal.classList.add('active');

  setTimeout(() => {
    document.getElementById('prod-name')?.focus();
  }, 100);
}

function openEditProductModal(id) {
  const p = allProductsCache.find(item => Number(item.id) === Number(id));
  if (!p) {
    showToast('Produit introuvable.', 'error');
    return;
  }

  editingProductId = Number(id);
  const modal = document.getElementById('product-form-modal');
  const title = document.getElementById('modal-product-form-title');

  if (title) title.innerText = `Modifier : ${p.name}`;

  document.getElementById('prod-name').value = p.name || '';
  document.getElementById('prod-category').value = p.category_slug || 'textile';
  document.getElementById('prod-price').value = p.price !== undefined ? p.price : 0;
  document.getElementById('prod-currency').value = p.currency || 'EUR';
  document.getElementById('prod-moq').value = p.min_order_qty || 1;
  document.getElementById('prod-stock').value = p.stock !== undefined ? p.stock : 100;
  document.getElementById('prod-image').value = p.image_url || '';
  document.getElementById('prod-desc').value = p.description || '';

  // Format specs for textarea
  if (Array.isArray(p.specs)) {
    document.getElementById('prod-specs').value = p.specs.map(s => {
      if (typeof s === 'object' && s !== null) {
        return `${s.label}: ${s.value}`;
      }
      return String(s);
    }).join('\n');
  } else {
    document.getElementById('prod-specs').value = '';
  }

  document.getElementById('prod-featured').checked = Boolean(p.is_featured);

  previewProductImage(p.image_url);

  if (modal) modal.classList.add('active');
}

function closeProductFormModal() {
  const modal = document.getElementById('product-form-modal');
  if (modal) modal.classList.remove('active');
  editingProductId = null;
}

function previewProductImage(url) {
  const preview = document.getElementById('prod-image-preview');
  if (!preview) return;
  if (url && url.trim()) {
    preview.src = url.trim();
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }
}

async function handleProductImageUpload(input) {
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];

  const imgInput = document.getElementById('prod-image');
  showToast('Téléversement de l’image en cours...', 'info');

  try {
    const result = await Api.uploadFile(file);
    if (result && result.url) {
      if (imgInput) imgInput.value = result.url;
      previewProductImage(result.url);
      showToast('Image téléversée avec succès !', 'success');
    }
  } catch (err) {
    showToast(err.message || 'Échec de l’upload de l’image.', 'error');
  }
}

function initProductForm() {
  const form = document.getElementById('product-form');
  if (!form) return;
  form.addEventListener('submit', handleProductFormSubmit);
}

async function handleProductFormSubmit(e) {
  if (e) e.preventDefault();

  const name = document.getElementById('prod-name')?.value?.trim();
  const categorySlug = document.getElementById('prod-category')?.value;
  const price = parseFloat(document.getElementById('prod-price')?.value) || 0;
  const currency = document.getElementById('prod-currency')?.value || 'EUR';
  const minOrderQty = parseInt(document.getElementById('prod-moq')?.value, 10) || 1;
  const stock = parseInt(document.getElementById('prod-stock')?.value, 10) || 100;
  const imageUrl = document.getElementById('prod-image')?.value?.trim();
  const description = document.getElementById('prod-desc')?.value?.trim();
  const specsRaw = document.getElementById('prod-specs')?.value?.trim() || '';
  const isFeatured = document.getElementById('prod-featured')?.checked || false;

  if (!name) {
    showToast('Le nom du produit est obligatoire.', 'error');
    document.getElementById('prod-name')?.focus();
    return;
  }

  if (!imageUrl) {
    showToast('L’image du produit est obligatoire (upload ou URL).', 'error');
    document.getElementById('prod-image')?.focus();
    return;
  }

  // Parse specs
  const specs = specsRaw ? specsRaw.split('\n').map(line => {
    const trimmed = line.trim();
    if (!trimmed) return null;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx > 0) {
      return {
        label: trimmed.slice(0, colonIdx).trim(),
        value: trimmed.slice(colonIdx + 1).trim()
      };
    }
    return { label: 'Caractéristique', value: trimmed };
  }).filter(Boolean) : [];

  const payload = {
    name,
    categorySlug,
    price,
    currency,
    minOrderQty,
    stock,
    imageUrl,
    description,
    specs,
    isFeatured
  };

  const submitBtn = document.getElementById('btn-save-product');
  const origBtnText = submitBtn ? submitBtn.innerText : 'Enregistrer';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerText = 'Enregistrement en cours...';
  }

  try {
    if (editingProductId) {
      await Api.updateProduct(editingProductId, payload);
      showToast('Produit mis à jour avec succès !', 'success');
    } else {
      await Api.createProduct(payload);
      showToast('Nouveau produit ajouté au catalogue !', 'success');
    }
    closeProductFormModal();
    loadAdminProducts();
    loadDashboardStats();
  } catch (err) {
    showToast(err.message || 'Erreur lors de l’enregistrement du produit.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = origBtnText;
    }
  }
}

async function deleteProductConfirm(id) {
  const p = allProductsCache.find(item => Number(item.id) === Number(id));
  const name = p ? `"${p.name}"` : 'ce produit';

  if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement ${name} du catalogue ?`)) {
    return;
  }

  try {
    await Api.deleteProduct(id);
    showToast('Produit supprimé avec succès.', 'success');
    loadAdminProducts();
    loadDashboardStats();
  } catch (err) {
    showToast(err.message || 'Erreur lors de la suppression.', 'error');
  }
}

// ==================== 3. INQUIRIES & DEVIS ====================
async function loadAdminInquiries() {
  const tbody = document.getElementById('admin-inquiries-tbody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px;">Chargement des demandes...</td></tr>`;

  try {
    const search = document.getElementById('admin-inquiry-search')?.value.trim() || '';
    const status = document.getElementById('admin-inquiry-status-filter')?.value || 'all';

    const params = {
      page: inquiriesPagination.page,
      limit: inquiriesPagination.limit
    };
    if (search) params.search = search;
    if (status && status !== 'all') params.status = status;

    const data = await Api.getInquiries(params);
    allInquiriesCache = data.inquiries || (Array.isArray(data) ? data : []);

    if (data.pagination) {
      inquiriesPagination = { ...inquiriesPagination, ...data.pagination };
    }

    renderAdminInquiriesTable(allInquiriesCache);
    updateInquiriesPaginationControls();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#ef4444; padding:20px;">Erreur lors du chargement des demandes.</td></tr>`;
  }
}

function updateInquiriesPaginationControls() {
  const infoEl = document.getElementById('inquiries-page-info');
  const prevBtn = document.getElementById('btn-prev-inquiries');
  const nextBtn = document.getElementById('btn-next-inquiries');

  if (infoEl) {
    infoEl.innerText = `Page ${inquiriesPagination.page} sur ${inquiriesPagination.totalPages || 1} (${inquiriesPagination.total || allInquiriesCache.length} demandes au total)`;
  }
  if (prevBtn) prevBtn.disabled = inquiriesPagination.page <= 1;
  if (nextBtn) nextBtn.disabled = inquiriesPagination.page >= (inquiriesPagination.totalPages || 1);
}

function changeInquiriesPage(delta) {
  const newPage = inquiriesPagination.page + delta;
  if (newPage >= 1 && newPage <= inquiriesPagination.totalPages) {
    inquiriesPagination.page = newPage;
    loadAdminInquiries();
  }
}

function renderAdminInquiriesTable(inquiries) {
  const tbody = document.getElementById('admin-inquiries-tbody');
  if (!tbody) return;

  if (inquiries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--admin-muted);">Aucune demande trouvée.</td></tr>`;
    return;
  }

  tbody.innerHTML = inquiries.map(inq => `
    <tr>
      <td><strong>${escapeHtml(inq.name)}</strong></td>
      <td>
        <a href="mailto:${escapeHtml(inq.email)}" style="color:var(--admin-primary); font-weight:600;">${escapeHtml(inq.email)}</a><br>
        <small style="color:var(--admin-muted);">${escapeHtml(inq.phone || 'Non renseigné')}</small>
      </td>
      <td>${escapeHtml(inq.company || 'Particulier')}<br><small style="color:var(--admin-muted);">${escapeHtml(inq.country || '')}</small></td>
      <td><strong>${escapeHtml(inq.subject)}</strong></td>
      <td>
        <select class="form-select" style="padding:4px 8px; font-size:0.8rem; width:auto;" onchange="changeInquiryStatus(${inq.id}, this.value)">
          <option value="new" ${inq.status === 'new' ? 'selected' : ''}>Nouveau</option>
          <option value="in_progress" ${inq.status === 'in_progress' ? 'selected' : ''}>En cours</option>
          <option value="resolved" ${inq.status === 'resolved' ? 'selected' : ''}>Traité</option>
          <option value="archived" ${inq.status === 'archived' ? 'selected' : ''}>Archivé</option>
        </select>
      </td>
      <td><small>${formatDate(inq.createdAt || inq.created_at)}</small></td>
      <td>
        <div style="display:flex; gap:6px;">
          <button type="button" class="btn-action-icon" title="Voir le message complet" onclick="viewInquiryDetail(${inq.id})">👁️</button>
          <button type="button" class="btn-action-icon delete" title="Supprimer" onclick="deleteInquiryConfirm(${inq.id})">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function debounceFilterInquiries() {
  clearTimeout(inquirySearchTimeout);
  inquirySearchTimeout = setTimeout(() => {
    inquiriesPagination.page = 1;
    loadAdminInquiries();
  }, 300);
}

function filterAdminInquiries() {
  inquiriesPagination.page = 1;
  loadAdminInquiries();
}

async function changeInquiryStatus(id, newStatus) {
  try {
    await Api.updateInquiryStatus(id, newStatus);
    showToast('Statut de la demande mis à jour.', 'success');
    loadDashboardStats();
  } catch (err) {
    showToast(err.message || 'Erreur de mise à jour.', 'error');
  }
}

function viewInquiryDetail(id) {
  const inq = allInquiriesCache.find(i => Number(i.id) === Number(id));
  if (!inq) return;

  const content = document.getElementById('inquiry-modal-body');
  content.innerHTML = `
    <div style="margin-bottom:16px;">
      <h4 style="font-size:1.3rem; margin-bottom:6px; color:var(--admin-dark);">${escapeHtml(inq.subject)}</h4>
      <span class="status-pill ${inq.status}">${getStatusLabel(inq.status)}</span>
      <span style="color:var(--admin-muted); font-size:0.85rem; margin-left:10px;">Reçu le ${formatDate(inq.createdAt || inq.created_at)}</span>
    </div>
    <div style="background:var(--admin-bg); padding:16px; border-radius:8px; margin-bottom:20px; display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.9rem;">
      <div><strong>Nom :</strong> ${escapeHtml(inq.name)}</div>
      <div><strong>Email :</strong> <a href="mailto:${escapeHtml(inq.email)}" style="color:var(--admin-primary);">${escapeHtml(inq.email)}</a></div>
      <div><strong>Téléphone / WhatsApp :</strong> ${escapeHtml(inq.phone || 'Non renseigné')}</div>
      <div><strong>Entreprise :</strong> ${escapeHtml(inq.company || 'Particulier')}</div>
      <div><strong>Pays de destination :</strong> ${escapeHtml(inq.country || 'Non spécifié')}</div>
      <div><strong>Secteur concerné :</strong> ${escapeHtml(inq.categorySlug || inq.category_slug || 'Général')}</div>
    </div>
    <div>
      <h5 style="font-weight:700; margin-bottom:8px; color:var(--admin-dark);">Message / Cahier des charges :</h5>
      <div style="white-space:pre-wrap; background:#ffffff; border:1px solid var(--admin-border); padding:14px; border-radius:8px; font-size:0.92rem; line-height:1.6;">${escapeHtml(inq.message)}</div>
    </div>
    <div style="margin-top:24px; display:flex; justify-content:flex-end; gap:10px; border-top:1px solid var(--admin-border); padding-top:16px;">
      <button type="button" class="btn btn-outline btn-sm" onclick="closeInquiryDetailModal()">Fermer</button>
      <a href="mailto:${escapeHtml(inq.email)}?subject=Re: ${encodeURIComponent(inq.subject)}" class="btn btn-gold btn-sm">Répondre par Email ✉️</a>
      ${inq.phone ? `<a href="https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}" target="_blank" class="btn btn-whatsapp btn-sm">Contacter sur WhatsApp 💬</a>` : ''}
    </div>
  `;

  document.getElementById('inquiry-detail-modal').classList.add('active');
}

function closeInquiryDetailModal() {
  const modal = document.getElementById('inquiry-detail-modal');
  if (modal) modal.classList.remove('active');
}

async function deleteInquiryConfirm(id) {
  if (!confirm('Voulez-vous vraiment supprimer définitivement cette demande ?')) return;
  try {
    await Api.deleteInquiry(id);
    showToast('Demande supprimée avec succès.', 'success');
    loadAdminInquiries();
    loadDashboardStats();
  } catch (err) {
    showToast(err.message || 'Erreur lors de la suppression.', 'error');
  }
}

async function exportInquiriesToCsv() {
  try {
    showToast('Génération de l’export CSV en cours...', 'info');
    await Api.downloadInquiriesCsv();
    showToast('Fichier CSV téléchargé avec succès !', 'success');
  } catch (err) {
    showToast(err.message || 'Erreur lors du téléchargement du CSV.', 'error');
  }
}

// Helpers
function getStatusLabel(status) {
  if (status === 'new') return 'Nouveau';
  if (status === 'in_progress') return 'En cours';
  if (status === 'resolved') return 'Traité';
  if (status === 'archived') return 'Archivé';
  return status;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return dateStr;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Expose functions globally to window for HTML onclick/onsubmit access
window.openAddProductModal = openAddProductModal;
window.openEditProductModal = openEditProductModal;
window.closeProductFormModal = closeProductFormModal;
window.handleProductFormSubmit = handleProductFormSubmit;
window.deleteProductConfirm = deleteProductConfirm;
window.filterAdminProducts = filterAdminProducts;
window.debounceFilterProducts = debounceFilterProducts;
window.changeProductsPage = changeProductsPage;
window.filterAdminInquiries = filterAdminInquiries;
window.debounceFilterInquiries = debounceFilterInquiries;
window.changeInquiriesPage = changeInquiriesPage;
window.changeInquiryStatus = changeInquiryStatus;
window.viewInquiryDetail = viewInquiryDetail;
window.closeInquiryDetailModal = closeInquiryDetailModal;
window.deleteInquiryConfirm = deleteInquiryConfirm;
window.exportInquiriesToCsv = exportInquiriesToCsv;
window.handleProductImageUpload = handleProductImageUpload;
window.previewProductImage = previewProductImage;
window.refreshDashboard = refreshDashboard;
window.adminLogout = adminLogout;
window.switchTab = switchTab;
