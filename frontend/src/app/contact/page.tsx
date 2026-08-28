'use client';

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { api } from '../../lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    subject: '',
    categorySlug: 'textile',
    message: '',
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
    <>
      {/* HERO */}
      <section
        style={{
          padding: '130px 0 50px',
          background:
            'linear-gradient(180deg, var(--slate-100) 0%, var(--white) 100%)',
          borderBottom: '1px solid var(--slate-200)',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '780px' }}>
          <span className="section-eyebrow">Service Commercial & Export</span>
          <h1 className="section-title" style={{ marginBottom: '14px' }}>
            Demandez votre Cotation Personnalisée
          </h1>
          <p className="section-subtitle">
            Notre équipe d&apos;experts à Istanbul étudie votre projet d&apos;approvisionnement et vous répond avec une offre tarifaire détaillée sous 24 heures ouvrées.
          </p>
        </div>
      </section>

      {/* CONTACT GRID */}
      <section className="section" style={{ paddingTop: '50px' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.3fr',
              gap: '50px',
            }}
          >
            {/* Info Side */}
            <div>
              <div
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '36px',
                  boxShadow: 'var(--shadow-sm)',
                  marginBottom: '30px',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.8rem',
                    color: 'var(--navy-950)',
                    marginBottom: '24px',
                  }}
                >
                  Nos Coordonnées
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        background: 'var(--gold-50)',
                        color: 'var(--gold-500)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Phone size={20} />
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--navy-950)', fontSize: '1.05rem' }}>
                        +90 543 173 61 73
                      </strong>
                      <span style={{ color: 'var(--slate-400)', fontSize: '0.85rem' }}>
                        Service Téléphonique / WhatsApp direct
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        background: 'var(--gold-50)',
                        color: 'var(--gold-500)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Mail size={20} />
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--navy-950)', fontSize: '1.05rem' }}>
                        havaglobaltrade@gmail.com
                      </strong>
                      <span style={{ color: 'var(--slate-400)', fontSize: '0.85rem' }}>
                        Email commercial pour cahiers des charges
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        background: 'var(--gold-50)',
                        color: 'var(--gold-500)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Globe size={20} />
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--navy-950)', fontSize: '1.05rem' }}>
                        www.havaglobal.com
                      </strong>
                      <span style={{ color: 'var(--slate-400)', fontSize: '0.85rem' }}>
                        Portail officiel B2B International
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        background: 'var(--gold-50)',
                        color: 'var(--gold-500)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <MapPin size={20} />
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--navy-950)', fontSize: '1.05rem' }}>
                        Istanbul, Turquie
                      </strong>
                      <span style={{ color: 'var(--slate-400)', fontSize: '0.85rem' }}>
                        Siège d&apos;opérations export & Réseau Afrique/Europe
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '30px', paddingTop: '24px', borderTop: '1px solid var(--slate-100)' }}>
                  <a
                    href="https://wa.me/905431736173?text=Bonjour%20HAVA%20Global%20Trade"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                    style={{ width: '100%' }}
                  >
                    <MessageSquare size={18} />
                    Ouvrir WhatsApp (+90 543 173 61 73)
                  </a>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div>
              <div
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '40px',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.8rem',
                    color: 'var(--navy-950)',
                    marginBottom: '8px',
                  }}
                >
                  Formulaire de Cotation Usine
                </h3>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Précisez vos volumes et besoins. Nous vous répondrons avec les spécifications et conditions FOB/CIF.
                </p>

                {success ? (
                  <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                    <CheckCircle2
                      size={54}
                      style={{ color: 'var(--success)', margin: '0 auto 16px' }}
                    />
                    <h4 style={{ fontSize: '1.4rem', color: 'var(--navy-950)', marginBottom: '10px' }}>
                      Merci ! Votre demande a été reçue.
                    </h4>
                    <p style={{ color: 'var(--slate-600)', lineHeight: '1.6', marginBottom: '20px' }}>
                      Un responsable commercial dédié étudie actuellement votre dossier. Vous recevrez une estimation sous 24 heures ouvrées.
                    </p>
                    <button
                      onClick={() => {
                        setSuccess(false);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          company: '',
                          country: '',
                          subject: '',
                          categorySlug: 'textile',
                          message: '',
                        });
                      }}
                      className="btn btn-outline"
                    >
                      Envoyer une autre demande
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {error && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'var(--danger-bg)',
                          color: 'var(--danger)',
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-sm)',
                          marginBottom: '20px',
                          fontSize: '0.86rem',
                        }}
                      >
                        <AlertCircle size={16} />
                        <span>{error}</span>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Nom complet *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="Moussa Diallo"
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
                          placeholder="m.diallo@entreprise.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Téléphone / WhatsApp</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="+221 77 123 45 67"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Société / Entreprise</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Afrique Trade SAS"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Pays de destination</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Sénégal, Côte d'Ivoire, France..."
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Secteur concerné</label>
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
                      <label className="form-label">Objet de la demande</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="ex: Conteneur 40ft Huile d'olive & Figues"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Message & Spécifications techniques *</label>
                      <textarea
                        required
                        rows={4}
                        className="form-textarea"
                        placeholder="Décrivez votre besoin : quantités estimées, conditionnement, Incoterm souhaité (FOB/CIF), port de livraison..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-gold btn-lg"
                      style={{ width: '100%' }}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                          Transmission en cours...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Envoyer ma Demande de Devis
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
