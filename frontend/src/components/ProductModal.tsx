'use client';

import React from 'react';
import { Product, SpecItem } from '../types';
import { X, Send, CheckCircle, ShieldCheck, Box, Tag, Globe2 } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onRequestQuote: (product: Product) => void;
}

export default function ProductModal({
  product,
  onClose,
  onRequestQuote,
}: ProductModalProps) {
  if (!product) return null;

  let specs: SpecItem[] = [];
  if (Array.isArray(product.specs)) {
    specs = product.specs;
  } else if (typeof product.specsJson === 'string' || typeof product.specs_json === 'string') {
    try {
      specs = JSON.parse(product.specsJson || product.specs_json || '[]');
    } catch (e) {
      specs = [];
    }
  }

  const categoryName =
    product.category?.name || product.category_name || product.categorySlug;
  const categoryIcon = product.category?.icon || product.category_icon || '📦';
  const minOrder = product.minOrderQty || product.min_order_qty || 1;
  const imageUrl =
    product.imageUrl ||
    product.image_url ||
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800';

  const finalImageUrl = imageUrl.startsWith('/uploads')
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${imageUrl}`
    : imageUrl;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '800px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '28px', marginTop: '10px' }}>
          <div>
            <div
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--slate-200)',
                height: '280px',
                background: 'var(--slate-100)',
              }}
            >
              <img
                src={finalImageUrl}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ marginTop: '16px', background: 'var(--slate-50)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-200)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-600)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                <ShieldCheck size={16} /> Conformité Export Garantie
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--slate-600)' }}>
                Produit vérifié et inspecté par nos auditeurs qualité à l&apos;usine avant expédition.
              </p>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-500)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              <span>{categoryIcon}</span>
              <span>{categoryName}</span>
            </div>

            <h2 style={{ fontSize: '1.45rem', color: 'var(--navy-950)', marginBottom: '12px', lineHeight: '1.3' }}>
              {product.name}
            </h2>

            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.6', marginBottom: '20px' }}>
              {product.description}
            </p>

            <div style={{ display: 'flex', gap: '20px', background: 'var(--slate-50)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', marginBottom: '20px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--slate-400)', textTransform: 'uppercase' }}>
                  Prix Indicatif
                </span>
                <strong style={{ fontSize: '1.3rem', color: 'var(--navy-950)' }}>
                  {product.price > 0
                    ? `${product.price.toFixed(2)} ${product.currency || 'EUR'}`
                    : 'Sur devis'}
                </strong>
              </div>
              <div style={{ borderLeft: '1px solid var(--slate-200)', paddingLeft: '20px' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--slate-400)', textTransform: 'uppercase' }}>
                  Minimum de Commande (MOQ)
                </span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--charcoal)' }}>
                  {minOrder} unités
                </strong>
              </div>
            </div>

            {/* Technical specs table */}
            {specs.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.92rem', color: 'var(--dark)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Spécifications & Fiche Technique
                </h4>
                <div style={{ border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                    <tbody>
                      {specs.map((item, idx) => (
                        <tr
                          key={idx}
                          style={{
                            background: idx % 2 === 0 ? 'var(--white)' : 'var(--slate-50)',
                            borderBottom: idx < specs.length - 1 ? '1px solid var(--slate-200)' : 'none',
                          }}
                        >
                          <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--charcoal)', width: '40%' }}>
                            {item.label}
                          </td>
                          <td style={{ padding: '8px 12px', color: 'var(--slate-600)' }}>
                            {item.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  onClose();
                  onRequestQuote(product);
                }}
                className="btn btn-gold"
                style={{ flexGrow: 1 }}
              >
                <Send size={16} /> Demander une Cotation Personnalisée
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
