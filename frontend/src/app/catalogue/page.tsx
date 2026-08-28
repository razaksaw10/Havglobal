'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, ArrowUpDown, Loader2, Factory, Send, Package } from 'lucide-react';
import { api } from '../../lib/api';
import { Category, Product } from '../../types';
import ProductCard from '../../components/ProductCard';
import ProductModal from '../../components/ProductModal';
import QuoteModal from '../../components/QuoteModal';

import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from '../../lib/fallbackData';

function CatalogueContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(false);

  const initialCategory = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  // Sync category param
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  // Load categories
  useEffect(() => {
    api
      .getCategories()
      .then((res) => {
        if (res.categories && res.categories.length > 0) {
          setCategories(res.categories);
        }
      })
      .catch((err) => {
        console.warn('Utilisation des catégories locales :', err.message);
      });
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    api
      .getProducts({
        category: activeCategory === 'all' ? undefined : activeCategory,
        search: searchTerm.trim() || undefined,
        sort: sortBy === 'default' ? undefined : sortBy,
        limit: 50,
      })
      .then((res) => {
        if (res.products && res.products.length > 0) {
          setProducts(res.products);
        } else if (activeCategory !== 'all' || searchTerm.trim()) {
          // If filtering locally
          let filtered = [...FALLBACK_PRODUCTS];
          if (activeCategory !== 'all') {
            filtered = filtered.filter((p) => p.categorySlug === activeCategory);
          }
          if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            filtered = filtered.filter(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q),
            );
          }
          if (sortBy === 'price_asc') {
            filtered.sort((a, b) => a.price - b.price);
          } else if (sortBy === 'price_desc') {
            filtered.sort((a, b) => b.price - a.price);
          }
          setProducts(filtered);
        }
      })
      .catch((err) => {
        console.warn('Utilisation des produits de secours :', err.message);
        let filtered = [...FALLBACK_PRODUCTS];
        if (activeCategory !== 'all') {
          filtered = filtered.filter((p) => p.categorySlug === activeCategory);
        }
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q),
          );
        }
        if (sortBy === 'price_asc') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_desc') {
          filtered.sort((a, b) => b.price - a.price);
        }
        setProducts(filtered);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeCategory, searchTerm, sortBy]);

  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);
    if (slug === 'all') {
      router.push('/catalogue', { scroll: false });
    } else {
      router.push(`/catalogue?category=${slug}`, { scroll: false });
    }
  };

  const handleOpenQuote = (prod?: Product) => {
    if (prod) {
      setSelectedProduct(prod);
    }
    setQuoteModalOpen(true);
  };

  return (
    <>
      {/* PAGE HERO */}
      <section
        style={{
          padding: '130px 0 50px',
          background:
            'linear-gradient(180deg, var(--slate-100) 0%, var(--white) 100%)',
          borderBottom: '1px solid var(--slate-200)',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px' }}>
          <span className="section-eyebrow">Catalogue d&apos;Exportation</span>
          <h1 className="section-title" style={{ marginBottom: '14px' }}>
            Gammes Industrielles & Produits d&apos;Usine
          </h1>
          <p className="section-subtitle">
            Découvrez nos références certifiées prêtes pour l&apos;exportation internationale. Tarifs direct usine, contrôle qualité rigoureux et logistique complète.
          </p>
        </div>
      </section>

      {/* CATALOGUE CONTROLS & GRID */}
      <section className="section" style={{ paddingTop: '40px' }}>
        <div className="container">
          {/* Category Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              paddingBottom: '14px',
              marginBottom: '24px',
              borderBottom: '1px solid var(--slate-200)',
            }}
          >
            <button
              onClick={() => handleCategoryClick('all')}
              className={`btn btn-sm ${activeCategory === 'all' ? 'btn-dark' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              <span>🌐</span> Tous les Secteurs ({categories.reduce((acc, c) => acc + (c.productsCount || 0), 0) || '16+'})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`btn btn-sm ${activeCategory === cat.slug ? 'btn-dark' : 'btn-outline'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                <span>{cat.icon}</span> {cat.name} ({cat.productsCount || 0})
              </button>
            ))}
          </div>

          {/* Search & Sort bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                position: 'relative',
                flexGrow: 1,
                maxWidth: '400px',
              }}
            >
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--slate-400)',
                }}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Rechercher par nom, matière, référence..."
                style={{ paddingLeft: '40px', borderRadius: 'var(--radius-full)' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.86rem', color: 'var(--slate-400)' }}>
                Trier par :
              </span>
              <select
                className="form-select"
                style={{ width: 'auto', borderRadius: 'var(--radius-full)', padding: '8px 14px' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Par défaut (Vedettes)</option>
                <option value="price_asc">Prix : Croissant</option>
                <option value="price_desc">Prix : Décroissant</option>
                <option value="name_asc">Nom : A ➔ Z</option>
                <option value="newest">Plus récents</option>
              </select>
            </div>
          </div>

          {/* Count Badge */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-600)' }}>
              {loading ? 'Chargement des références...' : `${products.length} références trouvées`}
            </span>
            <span style={{ fontSize: '0.84rem', color: 'var(--gold-500)', fontWeight: 600 }}>
              ⭐ Direct Fabricants Istanbul & Régions
            </span>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '80px 0',
                color: 'var(--gold-500)',
              }}
            >
              <Loader2 size={36} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : products.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'var(--slate-50)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--slate-200)',
              }}
            >
              <Package size={48} style={{ color: 'var(--slate-400)', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-950)', marginBottom: '8px' }}>
                Aucun produit ne correspond à vos critères
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Essayez d&apos;ajuster vos filtres de recherche ou contactez notre bureau de sourcing pour une demande personnalisée.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchTerm('');
                  setSortBy('default');
                }}
                className="btn btn-outline btn-sm"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onViewDetails={(p) => setSelectedProduct(p)}
                  onRequestQuote={(p) => handleOpenQuote(p)}
                />
              ))}
            </div>
          )}

          {/* SOURCING BANNER */}
          <div
            style={{
              marginTop: '70px',
              background: 'linear-gradient(135deg, var(--navy-950) 0%, var(--navy-900) 100%)',
              color: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: '44px 36px',
              textAlign: 'center',
              border: '1px solid var(--navy-800)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🏭</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', color: '#fff', marginBottom: '10px' }}>
              Vous cherchez une référence spécifique non listée ?
            </h3>
            <p style={{ maxWidth: '650px', margin: '0 auto 24px', color: 'var(--slate-400)', fontSize: '0.95rem' }}>
              Notre département de Sourcing Industriel à Istanbul prospecte directement les manufactures turques pour trouver exactement votre produit aux meilleures conditions du marché.
            </p>
            <button onClick={() => handleOpenQuote()} className="btn btn-gold btn-lg">
              <Send size={18} /> Soumettre un Cahier des Charges de Sourcing
            </button>
          </div>
        </div>
      </section>

      {/* MODALS */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onRequestQuote={(p) => handleOpenQuote(p)}
      />

      {quoteModalOpen && (
        <QuoteModal
          product={selectedProduct}
          onClose={() => {
            setQuoteModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </>
  );
}

export default function CataloguePage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--gold-500)' }} />
        </div>
      }
    >
      <CatalogueContent />
    </Suspense>
  );
}
