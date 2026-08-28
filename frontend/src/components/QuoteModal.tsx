'use client';

import React, { useState } from 'react';
import { Product } from '../types';
import { api } from '../lib/api';
import { X, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface QuoteModalProps {
  product?: Product | null;
  onClose: () => void;
}

export default function QuoteModal({ product, onClose }: QuoteModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    subject: product
      ? `Cotation pour : ${product.name}`
      : 'Demande de cotation B2B générale',
    categorySlug: product?.categorySlug || 'textile',
    message: product
      ? `Bonjour, nous souhaitons recevoir une offre de prix détaillée pour le produit "${product.name}" (quantité estimée : ${product.minOrderQty || 100} unités). Merci d'indiquer les délais de fabrication et conditions d'expédition.`
      : '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.submitInquiry(formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l’envoi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '620px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCircle2
              size={56}
              style={{ color: 'var(--success)', margin: '0 auto 16px' }}
            />
            <h2 style={{ fontSize: '1.6rem', color: 'var(--navy-950)', marginBottom: '10px' }}>
              Demande transmise avec succès !
            </h2>
            <p style={{ color: 'var(--slate-600)', lineHeight: '1.6', marginBottom: '24px' }}>
              Notre équipe commerciale à Istanbul a bien reçu votre demande de cotation. Un responsable export vous contactera avec une offre sous 24 heures ouvrées.
            </p>
            <button onClick={onClose} className="btn btn-gold">
              Fermer la fenêtre
            </button>
          </div>
        ) : (
          <div>
            <span className="section-eyebrow">Demande B2B</span>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--navy-950)', marginBottom: '6px' }}>
              {product ? `Devis : ${product.name}` : 'Demander une Cotation'}
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)', marginBottom: '20px' }}>
              Remplissez ce formulaire et obtenez une cotation usine transparente et rapide.
            </p>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--danger-bg)', color: 'var(--danger)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.86rem' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Nom complet *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="ex: Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email professionnel *</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="jean@societe.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Société / Entreprise</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nom de votre société"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Téléphone / WhatsApp</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="+33 6 12 34 56 78"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Pays de destination</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="ex: France, Sénégal, Algérie..."
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Secteur d&apos;activité</label>
                  <select
                    className="form-select"
                    value={formData.categorySlug}
                    onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                  >
                    <option value="textile">Textile & Confection</option>
                    <option value="mobilier">Mobilier & Équipement</option>
                    <option value="sante">Santé & Cosmétiques</option>
                    <option value="alimentaire">Agroalimentaire & Terroir</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Message & Spécifications souhaitées *</label>
                <textarea
                  required
                  rows={3}
                  className="form-textarea"
                  placeholder="Précisez votre quantité, volumes, packaging ou cahier des charges..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-gold"
                style={{ width: '100%', padding: '12px' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    Envoi de votre demande...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Envoyer ma Demande de Cotation
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
