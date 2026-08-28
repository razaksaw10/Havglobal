/**
 * HAVA Global Trade - Main Application Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initCounters();
  initFeaturedProducts();
});

// Header scroll effect
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Mobile Hamburger Menu
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // Close menu on link click
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });
}

// Interactive Number Counters
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const suffix = counter.getAttribute('data-suffix') || '';
        let count = 0;
        const speed = target > 50 ? 30 : 150;

        const updateCount = () => {
          const increment = Math.ceil(target / 30);
          count += increment;
          if (count >= target) {
            counter.innerText = target + suffix;
          } else {
            counter.innerText = count + suffix;
            setTimeout(updateCount, speed);
          }
        };

        updateCount();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// Load Featured Products on Home Page
async function initFeaturedProducts() {
  const container = document.getElementById('featured-products-container');
  if (!container) return;

  try {
    const data = await Api.getProducts({ featured: '1', limit: 4 });
    if (!data.products || data.products.length === 0) {
      container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Aucun produit en vedette pour le moment.</p>`;
      return;
    }

    container.innerHTML = data.products.map(p => renderProductCard(p)).join('');
  } catch (err) {
    console.error('Erreur de chargement des produits vedettes:', err);
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Impossible de charger les produits en vedette.</p>`;
  }
}

// Standard Product Card Renderer
function renderProductCard(product) {
  const specs = Array.isArray(product.specs) ? product.specs.slice(0, 3) : [];
  const specsHtml = specs.map(s => `<span class="spec-badge">${escapeHtml(s)}</span>`).join('');
  const priceDisplay = product.price > 0 ? `${product.price.toFixed(2)} ${product.currency}` : 'Sur devis';

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-thumb">
        <img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.name)}" loading="lazy">
        <span class="product-tag">${escapeHtml(product.category_name || product.category_slug)}</span>
        ${product.is_featured ? '<span class="product-badge-featured">Vedette</span>' : ''}
      </div>
      <div class="product-content">
        <h3 class="product-name">${escapeHtml(product.name)}</h3>
        <p class="product-desc">${escapeHtml(product.description || '')}</p>
        <div class="product-specs-list">${specsHtml}</div>
        <div class="product-footer">
          <div class="product-price-box">
            <span class="price-label">Prix indicatif</span>
            <span class="price-val">${priceDisplay}</span>
          </div>
          <a href="/contact.html?product=${encodeURIComponent(product.name)}&category=${product.category_slug}" class="btn btn-gold btn-sm">Devis →</a>
        </div>
      </div>
    </div>
  `;
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
