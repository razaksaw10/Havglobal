/**
 * HAVA Global Trade - Dynamic Catalogue Page Engine with Admin In-Place Editing
 */

let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'default';
let debounceTimer = null;
let allCatalogProducts = [];
let editingCatalogProductId = null;

document.addEventListener('DOMContentLoaded', () => {
  // Read URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('category');
  const searchParam = urlParams.get('search');

  if (catParam) {
    currentCategory = catParam;
  }
  if (searchParam) {
    currentSearch = searchParam;
    const searchInput = document.getElementById('catalog-search');
    if (searchInput) searchInput.value = currentSearch;
  }

  initAdminBanner();
  initCatalogueTabs();
  initSearchAndSort();
  loadProducts();
});

// Detect Admin & Display Top Admin Bar in Catalogue
function initAdminBanner() {
  const token = Api.getToken();
  let adminBanner = document.getElementById('catalog-admin-banner');

  if (token) {
    if (!adminBanner) {
      adminBanner = document.createElement('div');
      adminBanner.id = 'catalog-admin-banner';
      adminBanner.style.cssText = 'background: #0f172a; color: #fff; padding: 12px 24px; border-bottom: 2px solid var(--gold); display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; position: sticky; top: 72px; z-index: 999;';
      adminBanner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="background: var(--gold); color: #fff; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 0.75rem;">ADMIN</span>
          <span>Vous êtes connecté en tant qu'administrateur. Vous pouvez gérer les produits directement ici.</span>
        </div>
        <div style="display: flex; gap: 10px;">
          <button onclick="openAddProductModalCatalogue()" class="btn btn-gold btn-sm" style="padding: 6px 14px; font-size: 0.8rem;">+ Ajouter un Produit</button>
          <a href="/admin.html" class="btn btn-outline btn-sm" style="padding: 6px 14px; font-size: 0.8rem; color: #fff; border-color: rgba(255,255,255,0.3);">Dashboard Complet 📊</a>
        </div>
      `;
      const header = document.querySelector('.site-header');
      if (header && header.parentNode) {
        header.parentNode.insertBefore(adminBanner, header.nextSibling);
      }
    }
  } else {
    if (adminBanner) adminBanner.remove();
  }
}

// Initialize Category Tabs
async function initCatalogueTabs() {
  const tabsContainer = document.getElementById('category-tabs-container');
  if (!tabsContainer) return;

  try {
    const data = await Api.getCategories();
    const categories = data.categories || [];

    let tabsHtml = `
      <button class="tab-btn ${currentCategory === 'all' ? 'active' : ''}" data-category="all">
        Tous les produits
      </button>
    `;

    categories.forEach(cat => {
      const isActive = currentCategory === cat.slug ? 'active' : '';
      tabsHtml += `
        <button class="tab-btn ${isActive}" data-category="${cat.slug}">
          ${cat.icon} ${escapeHtml(cat.name)} (${cat.product_count || 0})
        </button>
      `;
    });

    tabsContainer.innerHTML = tabsHtml;

    // Attach click events
    tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        
        // Update URL query string without reloading
        const url = new URL(window.location);
        if (currentCategory === 'all') {
          url.searchParams.delete('category');
        } else {
          url.searchParams.set('category', currentCategory);
        }
        window.history.pushState({}, '', url);

        loadProducts();
      });
    });
  } catch (err) {
    console.error('Erreur lors du chargement des catégories:', err);
  }
}

// Search and Sorting handlers
function initSearchAndSort() {
  const searchInput = document.getElementById('catalog-search');
  const sortSelect = document.getElementById('catalog-sort');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        currentSearch = e.target.value.trim();
        loadProducts();
      }, 300);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      loadProducts();
    });
  }
}

// Fetch & Render Products
async function loadProducts() {
  const container = document.getElementById('catalog-products-container');
  const countBadge = document.getElementById('products-count-badge');
  if (!container) return;

  container.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 60px 0;">
      <div style="font-size: 2rem; margin-bottom: 12px;">⏳</div>
      <p style="color: var(--text-muted);">Chargement du catalogue HAVA Global...</p>
    </div>
  `;

  try {
    const params = {};
    if (currentCategory && currentCategory !== 'all') params.category = currentCategory;
    if (currentSearch) params.search = currentSearch;
    if (currentSort !== 'default') params.sort = currentSort;

    const data = await Api.getProducts(params);
    allCatalogProducts = data.products || [];
    const products = allCatalogProducts;
    const isAdmin = Boolean(Api.getToken());

    if (countBadge) {
      countBadge.innerText = `${products.length} référence${products.length > 1 ? 's' : ''} disponible${products.length > 1 ? 's' : ''}`;
    }

    if (products.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 80px 20px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <div style="font-size: 3rem; margin-bottom: 16px;">🔍</div>
          <h3 style="font-family: var(--font-serif); font-size: 1.8rem; margin-bottom: 8px;">Aucun produit trouvé</h3>
          <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 20px;">
            Aucun article ne correspond à votre sélection. Essayez un autre mot-clé ou demandez-nous un sourcing spécifique en Turquie.
          </p>
          <a href="/contact.html" class="btn btn-gold">Demander un Sourcing Spécifique →</a>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(p => `
      <div class="product-card" data-product-id="${p.id}">
        <div class="product-thumb">
          <img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.src='/file/HAVA GLOBAL TRADİNG.png'">
          <span class="product-tag">${escapeHtml(p.category_name || p.category_slug)}</span>
          ${p.is_featured ? '<span class="product-badge-featured">Sélection Export</span>' : ''}
          ${isAdmin ? `
            <div style="position: absolute; bottom: 10px; right: 10px; display: flex; gap: 6px; z-index: 10;">
              <button onclick="openEditProductModalCatalogue(${p.id})" style="background: rgba(255,255,255,0.95); border: 1px solid var(--border-color); border-radius: 4px; padding: 4px 8px; font-size: 0.8rem; cursor: pointer; font-weight: 600;" title="Modifier ce produit">✏️ Modif</button>
              <button onclick="deleteProductCatalogueConfirm(${p.id})" style="background: rgba(254,226,226,0.95); border: 1px solid #fca5a5; color: #ef4444; border-radius: 4px; padding: 4px 8px; font-size: 0.8rem; cursor: pointer; font-weight: 600;" title="Supprimer">🗑️</button>
            </div>
          ` : ''}
        </div>
        <div class="product-content">
          <h3 class="product-name">${escapeHtml(p.name)}</h3>
          <p class="product-desc">${escapeHtml(p.description || '')}</p>
          <div class="product-specs-list">
            ${(p.specs || []).map(s => `<span class="spec-badge">${escapeHtml(s)}</span>`).join('')}
          </div>
          <div class="product-footer">
            <div class="product-price-box">
              <span class="price-label">À partir de</span>
              <span class="price-val">${p.price > 0 ? `${p.price.toFixed(2)} ${p.currency}` : 'Sur Devis'}</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-outline btn-sm" onclick="openProductModal(${p.id})">Détails</button>
              <a href="/contact.html?product=${encodeURIComponent(p.name)}&category=${p.category_slug}" class="btn btn-gold btn-sm">Devis</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Erreur catalogue:', err);
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: #ef4444;">
        <p>Une erreur est survenue lors de la récupération des produits. Veuillez rafraîchir la page.</p>
      </div>
    `;
  }
}

// Product Detail Modal
async function openProductModal(productId) {
  let modal = document.getElementById('product-detail-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'product-detail-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3 id="modal-product-title">Détail du Produit</h3>
          <button class="modal-close" onclick="closeProductModal()">&times;</button>
        </div>
        <div class="modal-body" id="modal-product-content">
          <p>Chargement...</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProductModal();
    });
  }

  modal.classList.add('active');
  const content = document.getElementById('modal-product-content');

  try {
    const data = await Api.getProduct(productId);
    const p = data.product;

    document.getElementById('modal-product-title').innerText = p.name;
    content.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
        <img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}" style="width: 100%; height: 260px; object-fit: cover; border-radius: 8px;" onerror="this.src='/file/HAVA GLOBAL TRADİNG.png'">
        <div>
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--gold); text-transform: uppercase;">${escapeHtml(p.category_name || p.category_slug)}</span>
          <h4 style="font-size: 1.4rem; color: var(--dark); margin: 6px 0 12px;">${escapeHtml(p.name)}</h4>
          <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 16px;">${escapeHtml(p.description || '')}</p>
          <div style="background: var(--bg-alt); padding: 14px; border-radius: 8px; margin-bottom: 14px;">
            <div style="font-size: 0.82rem; color: var(--text-muted);">Prix indicatif FOB Turquie :</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--gold);">${p.price > 0 ? `${p.price.toFixed(2)} ${p.currency}` : 'Sur devis'}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Quantité min. commande (MOQ) : <strong>${p.min_order_qty || 1} unités</strong></div>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h5 style="font-weight: 700; color: var(--dark); margin-bottom: 10px;">Spécifications techniques & Caractéristiques :</h5>
        <ul style="list-style: none; padding: 0;">
          ${(p.specs || []).map(s => `<li style="padding: 6px 0; border-bottom: 1px solid var(--border-color); color: var(--text-main); font-size: 0.9rem;">✓ ${escapeHtml(s)}</li>`).join('')}
        </ul>
      </div>

      <div style="display: flex; gap: 14px; justify-content: flex-end; padding-top: 16px; border-top: 1px solid var(--border-color);">
        <button class="btn btn-outline" onclick="closeProductModal()">Fermer</button>
        <a href="/contact.html?product=${encodeURIComponent(p.name)}&category=${p.category_slug}" class="btn btn-gold">Demander une cotation conteneur / lot →</a>
      </div>
    `;
  } catch (err) {
    content.innerHTML = `<p style="color: #ef4444;">Impossible de charger les informations du produit.</p>`;
  }
}

function closeProductModal() {
  const modal = document.getElementById('product-detail-modal');
  if (modal) modal.classList.remove('active');
}

// ==================== IN-PLACE ADMIN PRODUCT MODAL (CATALOGUE) ====================

function ensureCatalogueEditModal() {
  let modal = document.getElementById('catalog-admin-product-modal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.id = 'catalog-admin-product-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card" style="max-width: 620px;">
      <div class="modal-header">
        <h3 id="cat-modal-title">Ajouter un Produit</h3>
        <button class="modal-close" onclick="closeProductModalCatalogue()">&times;</button>
      </div>
      <div class="modal-body">
        <form id="cat-admin-product-form">
          <div class="form-group">
            <label class="form-label">Nom du Produit *</label>
            <input type="text" id="cat-prod-name" class="form-input" placeholder="ex: Chemises Formelles 100% Coton" required>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">Secteur / Catégorie *</label>
              <select id="cat-prod-category" class="form-select" required>
                <option value="textile">👔 Textile & Confection</option>
                <option value="mobilier">🏠 Mobilier & Équipement</option>
                <option value="sante">💊 Santé & Cosmétiques</option>
                <option value="alimentaire">🍯 Agroalimentaire</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Prix Indicatif (€) *</label>
              <input type="number" step="0.01" id="cat-prod-price" class="form-input" placeholder="18.50" required>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">Devise</label>
              <select id="cat-prod-currency" class="form-select">
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">MOQ (Qté Min.)</label>
              <input type="number" id="cat-prod-moq" class="form-input" value="50">
            </div>
            <div class="form-group">
              <label class="form-label">Stock</label>
              <input type="number" id="cat-prod-stock" class="form-input" value="1000">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Image du Produit (URL ou chemin)</label>
            <input type="text" id="cat-prod-image" class="form-input" placeholder="https://images.unsplash.com/... ou /file/image.png">
          </div>

          <div class="form-group">
            <label class="form-label">Description commerciale</label>
            <textarea id="cat-prod-desc" class="form-textarea" rows="3" placeholder="Présentation du produit..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Spécifications techniques (1 par ligne)</label>
            <textarea id="cat-prod-specs" class="form-textarea" rows="3" placeholder="100% Coton d'Égée&#10;Tailles S à 3XL"></textarea>
          </div>

          <div class="form-group" style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="cat-prod-featured" style="width: 18px; height: 18px; cursor: pointer;">
            <label for="cat-prod-featured" style="font-size: 0.9rem; font-weight: 600; cursor: pointer;">Mettre en vedette</label>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn btn-outline btn-sm" onclick="closeProductModalCatalogue()">Annuler</button>
            <button type="submit" class="btn btn-gold btn-sm" id="cat-prod-submit-btn">Enregistrer le Produit</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeProductModalCatalogue();
  });

  const form = document.getElementById('cat-admin-product-form');
  form.addEventListener('submit', handleCatalogueProductSubmit);

  return modal;
}

function openAddProductModalCatalogue() {
  if (!Api.getToken()) {
    window.location.href = '/admin.html';
    return;
  }

  ensureCatalogueEditModal();
  editingCatalogProductId = null;
  document.getElementById('cat-modal-title').innerText = 'Ajouter un Produit au Catalogue';
  document.getElementById('cat-admin-product-form').reset();
  document.getElementById('cat-prod-category').value = currentCategory !== 'all' ? currentCategory : 'textile';
  document.getElementById('catalog-admin-product-modal').classList.add('active');
}

function openEditProductModalCatalogue(id) {
  if (!Api.getToken()) {
    window.location.href = '/admin.html';
    return;
  }

  const p = allCatalogProducts.find(item => Number(item.id) === Number(id));
  if (!p) {
    showToast('Produit introuvable.', 'error');
    return;
  }

  ensureCatalogueEditModal();
  editingCatalogProductId = Number(id);
  document.getElementById('cat-modal-title').innerText = `Modifier : ${p.name}`;
  document.getElementById('cat-prod-name').value = p.name || '';
  document.getElementById('cat-prod-category').value = p.category_slug || 'textile';
  document.getElementById('cat-prod-price').value = p.price !== undefined ? p.price : 0;
  document.getElementById('cat-prod-currency').value = p.currency || 'EUR';
  document.getElementById('cat-prod-moq').value = p.min_order_qty || 1;
  document.getElementById('cat-prod-stock').value = p.stock !== undefined ? p.stock : 100;
  document.getElementById('cat-prod-image').value = p.image_url || '';
  document.getElementById('cat-prod-desc').value = p.description || '';
  document.getElementById('cat-prod-specs').value = Array.isArray(p.specs) ? p.specs.join('\n') : '';
  document.getElementById('cat-prod-featured').checked = Boolean(p.is_featured);

  document.getElementById('catalog-admin-product-modal').classList.add('active');
}

function closeProductModalCatalogue() {
  const modal = document.getElementById('catalog-admin-product-modal');
  if (modal) modal.classList.remove('active');
  editingCatalogProductId = null;
}

async function handleCatalogueProductSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('cat-prod-name')?.value?.trim();
  const category_slug = document.getElementById('cat-prod-category')?.value;
  const price = parseFloat(document.getElementById('cat-prod-price')?.value) || 0;
  const currency = document.getElementById('cat-prod-currency')?.value || 'EUR';
  const min_order_qty = parseInt(document.getElementById('cat-prod-moq')?.value, 10) || 1;
  const stock = parseInt(document.getElementById('cat-prod-stock')?.value, 10) || 100;
  const image_url = document.getElementById('cat-prod-image')?.value?.trim();
  const description = document.getElementById('cat-prod-desc')?.value?.trim();
  const specsRaw = document.getElementById('cat-prod-specs')?.value?.trim() || '';
  const is_featured = document.getElementById('cat-prod-featured')?.checked || false;

  if (!name) {
    showToast('Le nom du produit est obligatoire.', 'error');
    return;
  }

  const specs = specsRaw ? specsRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];

  const payload = {
    name,
    category_slug,
    price,
    currency,
    min_order_qty,
    stock,
    image_url: image_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&fit=crop',
    description,
    specs,
    is_featured
  };

  const btn = document.getElementById('cat-prod-submit-btn');
  const origText = btn ? btn.innerText : 'Enregistrer';
  if (btn) {
    btn.disabled = true;
    btn.innerText = 'Enregistrement...';
  }

  try {
    if (editingCatalogProductId) {
      await Api.updateProduct(editingCatalogProductId, payload);
      showToast('Produit mis à jour avec succès !', 'success');
    } else {
      await Api.createProduct(payload);
      showToast('Nouveau produit ajouté au catalogue !', 'success');
    }
    closeProductModalCatalogue();
    loadProducts();
    initCatalogueTabs();
  } catch (err) {
    showToast(err.message || 'Erreur lors de l’enregistrement.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = origText;
    }
  }
}

async function deleteProductCatalogueConfirm(id) {
  const p = allCatalogProducts.find(item => Number(item.id) === Number(id));
  const name = p ? `"${p.name}"` : 'ce produit';

  if (!confirm(`Supprimer définitivement ${name} ?`)) return;

  try {
    await Api.deleteProduct(id);
    showToast('Produit supprimé.', 'success');
    loadProducts();
    initCatalogueTabs();
  } catch (err) {
    showToast(err.message || 'Erreur lors de la suppression.', 'error');
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

// Window global exports
window.openAddProductModalCatalogue = openAddProductModalCatalogue;
window.openEditProductModalCatalogue = openEditProductModalCatalogue;
window.closeProductModalCatalogue = closeProductModalCatalogue;
window.deleteProductCatalogueConfirm = deleteProductCatalogueConfirm;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
