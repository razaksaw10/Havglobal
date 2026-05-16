// Gestionnaire complet des catalogues et produits
class CatalogManager {
  constructor(category) {
    this.category = category;
    this.container = null;
  }

  loadProducts() {
    const allProducts = JSON.parse(localStorage.getItem('havaProducts') || '[]');
    return allProducts.filter(product => product.category === this.category);
  }

  getAllProducts() {
    return JSON.parse(localStorage.getItem('havaProducts') || '[]');
  }

  saveProducts(products) {
    this.products = products;
    localStorage.setItem('havaProducts', JSON.stringify(products));
  }

  addProduct(product) {
    if (!isAdminMode()) {
      alert('Accès réservé à l\'administrateur.');
      return;
    }
    const allProducts = this.getAllProducts();
    allProducts.push(product);
    this.saveProducts(allProducts);
    this.render();
  }

  createProductHTML(product) {
    const specsHTML = product.specs && product.specs.length > 0 
      ? product.specs.map(spec => `<li style="margin-bottom: 5px; font-size: 0.9rem; color: #666;">• ${spec}</li>`).join('')
      : '<li style="margin-bottom: 5px; font-size: 0.9rem; color: #666;">Détails disponibles</li>';

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

  removeProduct(productId) {
    if (!isAdminMode()) {
      alert('Accès réservé à l\'administrateur.');
      return;
    }
    if (!confirm('Supprimer ce produit ?')) return;
    this.products = this.products.filter(product => product.id !== productId);
    this.saveProducts(this.products);
    this.render();
  }

  updateProduct(productId, updatedProduct) {
    if (!isAdminMode()) {
      alert('Accès réservé à l\'administrateur.');
      return;
    }
    this.products = this.products.map(product =>
      product.id === productId ? { ...product, ...updatedProduct } : product
    );
    this.saveProducts(this.products);
    this.render();
  }

  getProduct(productId) {
    return this.products.find(product => product.id === productId);
  }

  editProduct(productId) {
    if (!isAdminMode()) {
      adminLogin();
      if (!isAdminMode()) return;
    }
    showProductForm(this.category, productId);
  }

  displayProducts() {
    if (!this.container) return;
    
    this.products = this.loadProducts();
    this.container.innerHTML = '';

    if (this.products.length === 0) {
      this.container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px; font-style: italic;">Aucun produit disponible dans cette catégorie pour le moment.</p>';
      return;
    }

    this.products.forEach(product => {
      const div = document.createElement('div');
      div.innerHTML = this.createProductHTML(product);
      this.container.appendChild(div.firstElementChild);
    });
  }

  render() {
    this.displayProducts();
  }

  init(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (this.container) {
      this.displayProducts();
      window[`catalogManager_${this.category}`] = this;
      updateAdminUI();
    }
  }
}

const ADMIN_PASSWORD = 'Razak@1234';
const ADMIN_SESSION_KEY = 'havaCatalogAdminMode';
const SHOW_ADMIN_LOGIN_BY_DEFAULT = true; // Mets à true pour afficher le bouton au chargement

function generateNewProductId() {
  const products = JSON.parse(localStorage.getItem('havaProducts') || '[]');
  return products.reduce((maxId, product) => Math.max(maxId, product.id || 0), 0) + 1;
}

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
    el.textContent = showAdmin ? 'Déconnexion admin' : 'Connexion admin';
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
  const product = isEdit ? manager.getProduct(productId) : null;
  const placeholderImage = 'https://via.placeholder.com/500x300?text=Aperçu';
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
          <img src="${initialImage}" alt="Aperçu de l'image" style="width: 100%; height: auto; max-height: 200px; object-fit: cover; border-radius: 4px;">
        </div>

        <label>Spécifications</label>
        <textarea name="specs" placeholder="Une ligne par spécification">${product && product.specs ? product.specs.join('\n') : ''}</textarea>

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
        console.error('Erreur lors du redimensionnement:', error);
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
      errorMessage.textContent = 'Le prix doit être un nombre positif.';
      return;
    }

    let image = product ? product.image : placeholderImage;
    if (selectedFile) {
      try {
        image = await readFileAsDataURL(selectedFile);
      } catch (error) {
        errorMessage.textContent = 'Impossible de lire l’image.';
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
      manager.updateProduct(productId, updatedProduct);
    } else {
      manager.addProduct({ id: generateNewProductId(), ...updatedProduct });
    }

    overlay.remove();
  });
}

function showAddProductForm(category) {
  showProductForm(category);
}

// Fonction pour initialiser un catalogue
function initCatalog(category, containerSelector) {
  const manager = new CatalogManager(category);
  manager.init(containerSelector);
}