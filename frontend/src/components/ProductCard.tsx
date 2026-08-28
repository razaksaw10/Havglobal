'use client';

import React from 'react';
import { Product } from '../types';
import { Eye, Send, CheckCircle2 } from 'lucide-react';

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
  const imageUrl =
    product.imageUrl ||
    product.image_url ||
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800';

  // Parse image url if it starts with /uploads, point to API backend if needed
  const finalImageUrl = imageUrl.startsWith('/uploads')
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${imageUrl}`
    : imageUrl;

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
            <span className="prod-price-label">Prix indicatif usine</span>
            <span className="prod-price-val">
              {product.price > 0
                ? `${product.price.toFixed(2)} ${product.currency || 'EUR'}`
                : 'Sur devis'}
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
