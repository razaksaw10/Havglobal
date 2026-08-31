'use client';

import React from 'react';
import { Product } from '../types';
import { Eye, Send, CheckCircle2 } from 'lucide-react';

import { getProductImageUrl } from '../lib/api';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onRequestQuote: (product: Product) => void;
}

export default function ProductCard({
  product,
  onViewDetails,
  onRequestQuote,
}: ProductCardProps) {
  const categoryName =
    product.category?.name || product.category_name || product.categorySlug;
  const categoryIcon = product.category?.icon || product.category_icon || '📦';
  const isFeatured = product.isFeatured || product.is_featured;
  const minOrder = product.minOrderQty || product.min_order_qty || 1;
  const rawImageUrl = product.imageUrl || product.image_url;
  const finalImageUrl = getProductImageUrl(rawImageUrl);

  return (
    <div className="product-card">
      <div className="prod-img-box">
        <img
          src={finalImageUrl}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLElement).setAttribute(
              'src',
              'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
            );
          }}
        />
        <div className="prod-badge">
          <span>{categoryIcon}</span>
          <span>{categoryName}</span>
        </div>
        {isFeatured && (
          <div className="prod-featured-badge">⭐ Vedette</div>
        )}
      </div>

      <div className="prod-body">
        <span className="prod-category">Origine Turquie</span>
        <h3 className="prod-title" title={product.name}>
          {product.name}
        </h3>
        <p className="prod-desc">{product.description}</p>

        <div className="prod-meta">
          <div className="prod-price-box">
            <span className="prod-price-label">Tarification</span>
            <span className="prod-price-val" style={{ color: 'var(--gold-500)', fontSize: '0.95rem', fontWeight: 600 }}>
              Sur Devis B2B
            </span>
          </div>
          <div className="prod-moq">
            MOQ : <strong>{minOrder} pcs</strong>
          </div>
        </div>

        <div className="prod-actions">
          <button
            onClick={() => onViewDetails(product)}
            className="btn btn-outline btn-sm"
          >
            <Eye size={15} /> Fiche
          </button>
          <button
            onClick={() => onRequestQuote(product)}
            className="btn btn-gold btn-sm"
          >
            <Send size={15} /> Devis
          </button>
        </div>
      </div>
    </div>
  );
}
