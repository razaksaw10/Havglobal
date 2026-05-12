// Gestionnaire de catalogues - Permet ajouter/supprimer des produits
class CatalogManager {
  constructor(catalogId) {
    this.catalogId = catalogId;
    this.storageKey = `catalog_${catalogId}`;
    this.products = this.loadProducts();
    this.container = null;
  }

  // Charger les produits depuis localStorage ou utiliser les produits par défaut
  loadProducts() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  // Sauvegarder les produits
  saveProducts() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.products));
    this.render();
  }

  // Ajouter un produit
  addProduct(name, description, image = 'https://via.placeholder.com/400x300?text=No+Image') {
    const product = {
      id: Date.now(),
      name: name,
      description: description,
      image: image,
      createdAt: new Date().toISOString()
    };
    this.products.push(product);
    this.saveProducts();
    return product;
  }

  // Supprimer un produit
  removeProduct(productId) {
    this.products = this.products.filter(p => p.id !== productId);
    this.saveProducts();
  }

  // Mettre à jour l'image d'un produit
  updateProductImage(productId, imageUrl) {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      product.image = imageUrl;
      this.saveProducts();
    }
  }

  // Créer l'élément HTML pour un produit
  createProductElement(product) {
    const div = document.createElement('div');
    div.className = 'catalog-product';
    div.style.cssText = `
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      position: relative;
      transition: transform 0.3s;
    `;

    const isPlaceholder = product.image.includes('placeholder');

    div.innerHTML = `
      <div style="position: relative;">
        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 250px; object-fit: cover;">
        <button class="delete-btn" onclick="window.catalogManager_${this.catalogId}.removeProduct(${product.id})" 
          style="position: absolute; top: 8px; right: 8px; background: rgba(255,0,0,0.8); color: white; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: background 0.2s;">
          ×
        </button>
        ${isPlaceholder ? `<div style="position: absolute; bottom: 8px; right: 8px; background: var(--gold); color: white; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; cursor: pointer;" onclick="document.getElementById('img-upload-${product.id}').click();">Ajouter image</div>` : ''}
        <input type="file" id="img-upload-${product.id}" style="display: none;" accept="image/*" onchange="window.catalogManager_${this.catalogId}.handleImageUpload(${product.id}, event)">
      </div>
      <div style="padding: 20px;">
        <h3 style="color: var(--dark); margin-bottom: 10px;">${product.name}</h3>
        <p style="color: #666; font-size: 0.95rem; margin-bottom: 15px;">${product.description}</p>
        <a href="contact.html" style="display: inline-block; background: var(--gold); color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Demander un devis →</a>
      </div>
    `;

    return div;
  }

  // Gérer l'upload d'image
  handleImageUpload(productId, event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.updateProductImage(productId, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // Afficher tous les produits
  render() {
    if (!this.container) return;

    this.container.innerHTML = '';

    if (this.products.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 40px; color: #999;';
      emptyDiv.innerHTML = '<p style="font-size: 1.1rem; margin-bottom: 20px;">Aucun produit pour le moment</p><p style="font-size: 0.9rem;">Cliquez sur "Ajouter un produit" pour commencer</p>';
      this.container.appendChild(emptyDiv);
    } else {
      this.products.forEach(product => {
        const el = this.createProductElement(product);
        this.container.appendChild(el);
      });
    }
  }

  // Initialiser le gestionnaire
  init(containerSelector) {
    this.container = document.querySelector(containerSelector);
    window[`catalogManager_${this.catalogId}`] = this;
    this.render();
  }
}

// Fonction pour afficher le formulaire d'ajout de produit
function showAddProductForm(catalogId) {
  const name = prompt('Nom du produit:');
  if (!name) return;
  
  const description = prompt('Description du produit:');
  if (!description) return;

  window[`catalogManager_${catalogId}`].addProduct(name, description);
}
