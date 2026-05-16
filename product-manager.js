// Product manager with server-side API storage
const API_BASE = '/api';

class ProductAPI {
  static async request(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} ${errorBody}`);
    }
    if (response.status === 204) {
      return null;
    }
    return response.json();
  }

  static getAllProducts() {
    return this.request('/products');
  }

  static getProducts(category) {
    let path = '/products';
    if (category) {
      path += `?category=${encodeURIComponent(category)}`;
    }
    return this.request(path);
  }

  static getProduct(id) {
    return this.request(`/products/${encodeURIComponent(id)}`);
  }

  static createProduct(product) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
  }

  static updateProduct(id, product) {
    return this.request(`/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(product)
    });
  }

  static deleteProduct(id) {
    return this.request(`/products/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  }
}

class CatalogManager {
  constructor(category) {
    this.category = category;
    this.container = null;
    this.products = [];
  }

  async loadProducts() {
    try {
      this.products = await ProductAPI.getProducts(this.category);
    } catch (error) {
      console.error('Unable to load products:', error);
      this.products = [];
    }
    return this.products;
  }

  async addProduct(product) {
    if (!isAdminMode()) {
      alert('Acces reserve a l administrateur.');
      return;
    }
    try {
      const createdProduct = await ProductAPI.createProduct(product);
      this.products.push(createdProduct);
      await this.render();
    } catch (error) {
      console.error('Unable to add product:', error);
      alert('Erreur lors de l ajout du produit.');
    }
  }

  createProductHTML(product) {
    const specsHTML = product.specs && product.specs.length > 0
      ? product.specs.map(spec => `<li style="margin-bottom: 5px; font-size: 0.9rem; color: #666;">• ${spec}</li>`).join('')
      : '<li style="margin-bottom: 5px; font-size: 0.9rem; color: #666;">Details disponibles</li>';

    const adminButtonsHTML = isAdminMode() ? `
          <div style="position: absolute; top: 12px; right: 12px; display: flex; gap: 8px;">
            <button type="button" onclick="window.catalogManager_${this.category}.removeProduct(${product.id})" style="background: rgba(255, 75, 75, 0.95); color: white; border: none; border-radius: 50%; width: 34px; height: 34px; cursor: pointer; font-size: 18px;">×</button>
            <button type="button" onclick="window.catalogManager_${this.category}.editProduct(${product.id})" style="background: rgba(0, 0, 0, 0.75); color: white; border: none; border-radius: 50%; width: 34px; height: 34px; cursor: pointer; font-size: 16px;">✎</button>
          </div>
        ` : '';

    return `
      <div style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); transition: transform 0.3s; position: relative;">
        <div style="position: relative;">
          <img src="${product.image}" alt="${product.name}" style="width: 100%; height: auto; max-height: 250px; object-fit: contain; display: block;">
          ${adminButtonsHTML}
        </div>
        <div style="padding: 20px;">
          <h3 style="color: var(--dark); margin: 0 0 10px 0; font-size: 1.2rem;">${product.name}</h3>
          <ul style="list-style: none; padding: 0; margin: 0 0 20px 0;">
            ${specsHTML}
          </ul>
          <a href="contact.html" style="display: inline-block; background: var(--gold); color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 0.95rem;">Demander un devis →</a>
        </div>
      </div>
    `;
  }

  async removeProduct(productId) {
    if (!isAdminMode()) {
      alert('Acces reserve a l administrateur.');
      return;
    }
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await ProductAPI.deleteProduct(productId);
      this.products = this.products.filter(product => product.id !== productId);
      await this.render();
    } catch (error) {
      console.error('Unable to delete product:', error);
      alert('Erreur lors de la suppression du produit.');
    }
  }

  async updateProduct(productId, updatedProduct) {
    if (!isAdminMode()) {
      alert('Acces reserve a l administrateur.');
      return;
    }
    try {
      const savedProduct = await ProductAPI.updateProduct(productId, updatedProduct);
      this.products = this.products.map(product =>
        product.id === productId ? savedProduct : product
      );
      await this.render();
    } catch (error) {
      console.error('Unable to update product:', error);
      alert('Erreur lors de la mise a jour du produit.');
    }
  }

  async getProduct(productId) {
    if (!this.products || this.products.length === 0) {
      await this.loadProducts();
    }
    return this.products.find(product => product.id === productId);
  }

  async displayProducts() {
    if (!this.container) return;
    await this.loadProducts();
    this.container.innerHTML = '';

    if (!this.products || this.products.length === 0) {
      this.container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px; font-style: italic;">Aucun produit disponible dans cette categorie pour le moment.</p>';
      return;
    }

    this.products.forEach(product => {
      const div = document.createElement('div');
      div.innerHTML = this.createProductHTML(product);
      this.container.appendChild(div.firstElementChild);
    });
  }

  async render() {
    await this.displayProducts();
  }

  async init(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (this.container) {
      await this.displayProducts();
      window[`catalogManager_${this.category}`] = this;
      updateAdminUI();
    }
  }
}

const ADMIN_PASSWORD = 'Razak@1234';
const ADMIN_SESSION_KEY = 'havaCatalogAdminMode';
const SHOW_ADMIN_LOGIN_BY_DEFAULT = true;

function isAdminMode() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

function setAdminMode(enabled) {
  sessionStorage.setItem(ADMIN_SESSION_KEY, enabled ? 'true' : 'false');
  updateAdminUI();
}

function toggleAdminLoginVisibility() {
  const loginButtons = document.querySelectorAll('[data-admin-login]');
  const isVisible = loginButtons.length > 0 && loginButtons[0].style.display !== 'none';
  loginButtons.forEach(btn => {
    btn.style.display = isVisible ? 'none' : 'inline-flex';
  });
}

function adminLogin() {
  if (isAdminMode()) {
    setAdminMode(false);
    return;
  }
  const password = prompt('Mot de passe administrateur');
  if (password === ADMIN_PASSWORD) {
    setAdminMode(true);
    alert('Mode administrateur activé. Vous pouvez maintenant ajouter ou modifier les produits.');
  } else {
    alert('Mot de passe incorrect.');
  }
}

function updateAdminUI() {
  const showAdmin = isAdminMode();
  document.querySelectorAll('[data-admin-only]').forEach(el => {
    el.style.display = showAdmin ? 'inline-flex' : 'none';
  });
  document.querySelectorAll('[data-admin-login]').forEach(el => {
    el.textContent = showAdmin ? 'Deconnexion admin' : 'Connexion admin';
  });
  Object.keys(window).forEach(key => {
    if (key.startsWith('catalogManager_')) {
      const manager = window[key];
      if (manager && typeof manager.render === 'function') {
        manager.render();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateAdminUI();
  if (!SHOW_ADMIN_LOGIN_BY_DEFAULT) {
    document.querySelectorAll('[data-admin-login]').forEach(btn => {
      btn.style.display = 'none';
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      toggleAdminLoginVisibility();
    }
  });
});

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function resizeImage(file, maxWidth, maxHeight) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let { width, height } = img;
      const aspectRatio = width / height;
      if (width > height) {
        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }
      } else {
        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    };
    img.src = URL.createObjectURL(file);
  });
}

async function showProductForm(category, productId = null) {
  if (!isAdminMode()) {
    adminLogin();
    if (!isAdminMode()) return;
  }

  if (document.querySelector('.product-modal-overlay')) return;
  const manager = window[`catalogManager_${category}`];
  if (!manager) return;

  const isEdit = productId !== null;
  const product = isEdit ? await manager.getProduct(productId) : null;
  const placeholderImage = 'https://via.placeholder.com/500x300?text=Apercu';
  const initialImage = product ? product.image : placeholderImage;

  const overlay = document.createElement('div');
  overlay.className = 'product-modal-overlay';
  overlay.innerHTML = `
    <div class="product-modal">
      <button type="button" class="product-modal-close" aria-label="Fermer">×</button>
      <h2>${isEdit ? 'Modifier le produit' : 'Ajouter un produit'}</h2>
      <form id="product-form">
        <label>Nom du produit</label>
        <input type="text" name="name" required placeholder="Nom du produit" value="${product ? product.name : ''}">
        <label>Prix (€)</label>
        <input type="number" name="price" required step="0.01" min="0" placeholder="Prix" value="${product ? product.price : ''}">
        <label>Image locale</label>
        <input type="file" name="imageFile" accept="image/*">
        <label>Taille de l'image</label>
        <select name="imageSize">
          <option value="small">Petit (400x300)</option>
          <option value="medium" selected>Moyen (600x400)</option>
          <option value="large">Grand (800x600)</option>
        </select>
        <div class="product-image-preview">
          <img src="${initialImage}" alt="Apercu de l'image" style="width: 100%; height: auto; max-height: 200px; object-fit: cover; border-radius: 4px;">
        </div>
        <label>Specifications</label>
        <textarea name="specs" placeholder="Une ligne par specification">${product && product.specs ? product.specs.join('\n') : ''}</textarea>
        <p class="form-error" aria-live="polite"></p>
        <button type="submit">${isEdit ? 'Enregistrer' : 'Ajouter'}</button>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  const form = overlay.querySelector('form');
  const fileInput = form.querySelector('input[name="imageFile"]');
  const previewImg = overlay.querySelector('.product-image-preview img');
  const errorMessage = overlay.querySelector('.form-error');
  let selectedFile = null;

  overlay.querySelector('.product-modal-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', event => {
    if (event.target === overlay) overlay.remove();
  });

  const sizes = {
    small: { w: 400, h: 300 },
    medium: { w: 600, h: 400 },
    large: { w: 800, h: 600 }
  };

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (file) {
      try {
        const size = sizes[form.imageSize.value];
        const resizedBlob = await resizeImage(file, size.w, size.h);
        selectedFile = resizedBlob;
        previewImg.src = URL.createObjectURL(resizedBlob);
      } catch (error) {
        console.error('Error resizing image:', error);
        selectedFile = file;
        previewImg.src = URL.createObjectURL(file);
      }
    } else {
      selectedFile = null;
      previewImg.src = initialImage;
    }
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    errorMessage.textContent = '';

    const name = form.name.value.trim();
    const price = parseFloat(form.price.value);
    const specs = form.specs.value
      .split(/\r?\n|,/) 
      .map(item => item.trim())
      .filter(Boolean);

    if (!name) {
      errorMessage.textContent = 'Le nom du produit est requis.';
      return;
    }

    if (Number.isNaN(price) || price < 0) {
      errorMessage.textContent = 'Le prix doit etre un nombre positif.';
      return;
    }

    let image = product ? product.image : placeholderImage;
    if (selectedFile) {
      try {
        image = await readFileAsDataURL(selectedFile);
      } catch (error) {
        errorMessage.textContent = 'Impossible de lire l image.';
        return;
      }
    }

    const updatedProduct = {
      category,
      name,
      price,
      image,
      specs
    };

    if (isEdit) {
      await manager.updateProduct(productId, updatedProduct);
    } else {
      await manager.addProduct(updatedProduct);
    }

    overlay.remove();
  });
}

function showAddProductForm(category) {
  showProductForm(category);
}

function initCatalog(category, containerSelector) {
  const manager = new CatalogManager(category);
  manager.init(containerSelector);
}
