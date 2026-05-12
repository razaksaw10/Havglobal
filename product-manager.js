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

  createProductHTML(product) {
    const specsHTML = product.specs && product.specs.length > 0 
      ? product.specs.map(spec => `<li style="margin-bottom: 5px; font-size: 0.9rem; color: #666;">• ${spec}</li>`).join('')
      : '<li style="margin-bottom: 5px; font-size: 0.9rem; color: #666;">Détails disponibles</li>';

    return `
      <div style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); transition: transform 0.3s; hover: transform 0.2s scale(1.02);">
        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 250px; object-fit: cover;">
        <div style="padding: 20px;">
          <h3 style="color: var(--dark); margin: 0 0 10px 0; font-size: 1.2rem;">${product.name}</h3>
          <div style="font-size: 1.5rem; font-weight: bold; color: var(--gold); margin-bottom: 15px;">${product.price}€</div>
          <ul style="list-style: none; padding: 0; margin: 0 0 20px 0;">
            ${specsHTML}
          </ul>
          <a href="contact.html" style="display: inline-block; background: var(--gold); color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 0.95rem;">Demander un devis →</a>
        </div>
      </div>
    `;
  }

  displayProducts() {
    if (!this.container) return;
    
    const products = this.loadProducts();
    this.container.innerHTML = '';

    if (products.length === 0) {
      this.container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px; font-style: italic;">Aucun produit disponible dans cette catégorie pour le moment.</p>';
      return;
    }

    products.forEach(product => {
      const div = document.createElement('div');
      div.innerHTML = this.createProductHTML(product);
      this.container.appendChild(div.firstElementChild);
    });
  }

  init(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (this.container) {
      this.displayProducts();
    }
  }
}

// Fonction pour initialiser un catalogue
function initCatalog(category, containerSelector) {
  const manager = new CatalogManager(category);
  manager.init(containerSelector);
}