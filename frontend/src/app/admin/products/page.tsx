'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  X,
  Check,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import AdminLayout from '../../../components/AdminLayout';
import { api } from '../../../lib/api';
import { Category, Product, SpecItem } from '../../../types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    categorySlug: 'textile',
    description: '',
    price: 0,
    currency: 'EUR',
    minOrderQty: 100,
    imageUrl: '',
    stock: 1000,
    isFeatured: false,
  });

  const [specs, setSpecs] = useState<SpecItem[]>([
    { label: 'Origine', value: 'Turquie' },
  ]);

  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    api
      .getProducts({
        category: categoryFilter === 'all' ? undefined : categoryFilter,
        search: searchTerm.trim() || undefined,
        limit: 100,
      })
      .then((res) => {
        setProducts(res.products || []);
      })
      .catch((err) => console.error('Error fetching products:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.getCategories().then((res) => setCategories(res.categories || []));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, searchTerm]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      categorySlug: categories[0]?.slug || 'textile',
      description: '',
      price: 0,
      currency: 'EUR',
      minOrderQty: 50,
      imageUrl: '',
      stock: 500,
      isFeatured: false,
    });
    setSpecs([{ label: 'Origine', value: 'Turquie' }]);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      categorySlug: prod.categorySlug,
      description: prod.description || '',
      price: prod.price || 0,
      currency: prod.currency || 'EUR',
      minOrderQty: prod.minOrderQty || 1,
      imageUrl: prod.imageUrl || prod.image_url || '',
      stock: prod.stock || 100,
      isFeatured: Boolean(prod.isFeatured || prod.is_featured),
    });

    let currentSpecs: SpecItem[] = [];
    if (Array.isArray(prod.specs)) {
      currentSpecs = prod.specs;
    } else if (prod.specsJson || prod.specs_json) {
      try {
        currentSpecs = JSON.parse(prod.specsJson || prod.specs_json || '[]');
      } catch (e) {
        currentSpecs = [];
      }
    }
    setSpecs(currentSpecs.length > 0 ? currentSpecs : [{ label: 'Origine', value: 'Turquie' }]);
    setFormError(null);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: res.imageUrl }));
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l’upload');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { label: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'label' | 'value', val: string) => {
    const next = [...specs];
    next[index][field] = val;
    setSpecs(next);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    const validSpecs = specs.filter((s) => s.label.trim() && s.value.trim());

    const payload = {
      ...formData,
      price: Number(formData.price),
      minOrderQty: Number(formData.minOrderQty),
      stock: Number(formData.stock),
      specsJson: JSON.stringify(validSpecs),
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
      } else {
        await api.createProduct(payload);
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setFormError(err.message || 'Erreur lors de l’enregistrement.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: number, name: string) => {
    if (!window.confirm(`Confirmez-vous la suppression définitive du produit "${name}" ?`)) {
      return;
    }

    try {
      await api.deleteProduct(id);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression.');
    }
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '4px' }}>
            Gestion du Catalogue Produits
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Créez, modifiez et ajustez vos fiches produits et stocks à l&apos;export.
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-gold btn-sm">
          <Plus size={16} /> Ajouter un Produit
        </button>
      </div>

      {/* FILTERS */}
      <div
        style={{
          display: 'flex',
          gap: '14px',
          marginBottom: '20px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flexGrow: 1, maxWidth: '360px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{
              background: '#111a2e',
              borderColor: '#1e293b',
              color: '#fff',
              paddingLeft: '36px',
            }}
            placeholder="Rechercher par référence, nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{
            background: '#111a2e',
            borderColor: '#1e293b',
            color: '#fff',
            width: 'auto',
          }}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">Tous les secteurs</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>

        <span style={{ fontSize: '0.82rem', color: '#94a3b8', marginLeft: 'auto' }}>
          {products.length} articles répertoriés
        </span>
      </div>

      {/* TABLE */}
      <div className="data-table-wrapper">
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--gold-400)' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Aucun produit trouvé.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Secteur</th>
                <th>Prix Usine</th>
                <th>MOQ</th>
                <th>Stock</th>
                <th>Statut</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => {
                const img = prod.imageUrl || prod.image_url || '';
                const finalImg = img.startsWith('/uploads')
                  ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${img}`
                  : img;

                return (
                  <tr key={prod.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={finalImg}
                          alt={prod.name}
                          style={{
                            width: '44px',
                            height: '44px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-sm)',
                            background: '#070d18',
                          }}
                          onError={(e) => {
                            (e.target as HTMLElement).setAttribute(
                              'src',
                              'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200',
                            );
                          }}
                        />
                        <div>
                          <strong style={{ color: '#fff', fontSize: '0.92rem', display: 'block' }}>
                            {prod.name}
                          </strong>
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                            ID #{prod.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                        {prod.category?.name || prod.category_name || prod.categorySlug}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--gold-400)' }}>
                        {prod.price > 0
                          ? `${prod.price.toFixed(2)} ${prod.currency || 'EUR'}`
                          : 'Sur devis'}
                      </strong>
                    </td>
                    <td>{prod.minOrderQty || prod.min_order_qty} pcs</td>
                    <td>{prod.stock} unités</td>
                    <td>
                      {(prod.isFeatured || prod.is_featured) ? (
                        <span
                          style={{
                            background: 'rgba(217, 119, 6, 0.2)',
                            color: 'var(--gold-400)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                          }}
                        >
                          ⭐ VEDETTE
                        </span>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.78rem' }}>Standard</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => openEditModal(prod)}
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: '#334155', color: '#cbd5e1', padding: '5px 8px' }}
                          title="Modifier"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: '#334155', color: '#ef4444', padding: '5px 8px' }}
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="modal-content"
            style={{
              background: '#0d1527',
              color: '#fff',
              border: '1px solid #1e293b',
              maxWidth: '740px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              style={{ background: '#1e293b', color: '#fff' }}
              onClick={() => setModalOpen(false)}
            >
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '16px' }}>
              {editingProduct ? `Modifier le Produit #${editingProduct.id}` : 'Créer une Nouvelle Fiche Produit'}
            </h2>

            {formError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '16px',
                  fontSize: '0.85rem',
                }}
              >
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>
                    Nom du Produit *
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    style={{ background: '#131d33', borderColor: '#1e293b', color: '#fff' }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>
                    Secteur d&apos;activité *
                  </label>
                  <select
                    className="form-select"
                    style={{ background: '#131d33', borderColor: '#1e293b', color: '#fff' }}
                    value={formData.categorySlug}
                    onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#cbd5e1' }}>
                  Description Commerciale & Export
                </label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  style={{ background: '#131d33', borderColor: '#1e293b', color: '#fff' }}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>
                    Prix Unitaire (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    style={{ background: '#131d33', borderColor: '#1e293b', color: '#fff' }}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>
                    MOQ (Min. Qty)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    style={{ background: '#131d33', borderColor: '#1e293b', color: '#fff' }}
                    value={formData.minOrderQty}
                    onChange={(e) => setFormData({ ...formData, minOrderQty: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>
                    Stock Dispo
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    style={{ background: '#131d33', borderColor: '#1e293b', color: '#fff' }}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>
                    Produit Vedette
                  </label>
                  <select
                    className="form-select"
                    style={{ background: '#131d33', borderColor: '#1e293b', color: '#fff' }}
                    value={formData.isFeatured ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.value === 'true' })}
                  >
                    <option value="false">Non</option>
                    <option value="true">⭐ Oui (Accueil)</option>
                  </select>
                </div>
              </div>

              {/* IMAGE UPLOAD & URL */}
              <div className="form-group">
                <label className="form-label" style={{ color: '#cbd5e1' }}>
                  Image du Produit (URL ou Fichier)
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-input"
                    style={{ background: '#131d33', borderColor: '#1e293b', color: '#fff', flexGrow: 1 }}
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                  <label
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: '#334155', color: '#cbd5e1', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    {uploadingImage ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    <span>Uploader</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              {/* SPECS BUILDER */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label className="form-label" style={{ color: '#cbd5e1', margin: 0 }}>
                    Spécifications Techniques (Clé / Valeur)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: '#334155', color: 'var(--gold-400)', padding: '3px 8px', fontSize: '0.75rem' }}
                  >
                    + Ajouter une ligne
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {specs.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="ex: Matière, Tailles, Origine..."
                        className="form-input"
                        style={{ background: '#131d33', borderColor: '#1e293b', color: '#fff', width: '40%' }}
                        value={item.label}
                        onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="ex: 100% Coton peigné, Bursa"
                        className="form-input"
                        style={{ background: '#131d33', borderColor: '#1e293b', color: '#fff', flexGrow: 1 }}
                        value={item.value}
                        onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(idx)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 6px' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-outline"
                  style={{ borderColor: '#334155', color: '#cbd5e1', width: '40%' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="btn btn-gold"
                  style={{ flexGrow: 1 }}
                >
                  {formSubmitting ? 'Enregistrement en cours...' : 'Enregistrer le Produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
