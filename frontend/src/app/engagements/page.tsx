'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  Leaf,
  Scale,
  Users,
  Send,
} from 'lucide-react';
import QuoteModal from '../../components/QuoteModal';

export default function EngagementsPage() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const pillars = [
    {
      icon: <Award size={32} />,
      title: 'Conformité & Certifications Internationales',
      desc: 'Toutes les manufactures sélectionnées disposent des certifications requises par les marchés cibles : normes européennes CE, ISO 9001 / ISO 22000, OEKO-TEX Standard 100 pour le textile, et certifications Halal officielles.',
    },
    {
      icon: <Scale size={32} />,
      title: 'Transparence & Prix Direct Usine',
      desc: 'Nous appliquons une politique de tarification claire et sans marge cachée. Vous bénéficiez des véritables coûts de production industriels turcs et de devis décomposés (production, emballage, fret, assurance).',
    },
    {
      icon: <ShieldCheck size={32} />,
      title: 'Sécurité Contractuelle & Garantie Qualité',
      desc: 'Chaque commande fait l’objet d’un contrat commercial international rigoureux garantissant les délais de livraison, les spécifications techniques et les recours en cas de non-conformité.',
    },
    {
      icon: <Leaf size={32} />,
      title: 'Responsabilité Environnementale & Éthique',
      desc: 'Nous valorisons les partenaires industriels respectueux du droit du travail, favorisant les procédés écoresponsables (délavage à l’ozone, coton biologique, bois FSC certifié, recyclage des chutes).',
    },
  ];

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
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px' }}>
          <span className="section-eyebrow">Notre Charte de Valeurs</span>
          <h1 className="section-title" style={{ marginBottom: '14px' }}>
            Nos Engagements & Standards d&apos;Excellence
          </h1>
          <p className="section-subtitle">
            HAVA Global Trade s&apos;engage pour un commerce international transparent, durable et hautement sécurisé pour nos partenaires du monde entier.
          </p>
        </div>
      </section>

      {/* 4 PILLARS */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px',
            }}
          >
            {pillars.map((p, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '36px 28px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    color: 'var(--gold-500)',
                    marginBottom: '18px',
                  }}
                >
                  {p.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-950)', marginBottom: '12px' }}>
                  {p.title}
                </h3>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS HIGHLIGHT */}
      <section className="section section-dark">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-eyebrow" style={{ color: 'var(--gold-400)' }}>
            Chiffres Clés
          </span>
          <h2 className="section-title" style={{ marginBottom: '40px' }}>
            La Confiance B2B en Chiffres
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '30px',
            }}
          >
            <div style={{ padding: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--gold-400)', marginBottom: '4px' }}>
                100%
              </div>
              <div style={{ color: 'var(--slate-400)', fontSize: '0.85rem' }}>
                Inspection avant expédition
              </div>
            </div>

            <div style={{ padding: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--gold-400)', marginBottom: '4px' }}>
                45+
              </div>
              <div style={{ color: 'var(--slate-400)', fontSize: '0.85rem' }}>
                Pays partenaires livrés
              </div>
            </div>

            <div style={{ padding: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--gold-400)', marginBottom: '4px' }}>
                24h
              </div>
              <div style={{ color: 'var(--slate-400)', fontSize: '0.85rem' }}>
                Délai moyen de réponse cotation
              </div>
            </div>

            <div style={{ padding: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--gold-400)', marginBottom: '4px' }}>
                0 litige
              </div>
              <div style={{ color: 'var(--slate-400)', fontSize: '0.85rem' }}>
                Résolu grâce à nos audits sur place
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 0', background: 'linear-gradient(135deg, var(--gold-600) 0%, var(--gold-500) 100%)', color: '#fff' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#fff', marginBottom: '14px' }}>
            Collaborons ensemble sur votre prochain projet
          </h2>
          <p style={{ fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 28px', opacity: 0.95 }}>
            Bénéficiez de la puissance du réseau industriel turc avec un interlocuteur unique et dédié.
          </p>
          <button onClick={() => setQuoteModalOpen(true)} className="btn btn-dark btn-lg">
            <Send size={18} /> Demander une Cotation
          </button>
        </div>
      </section>

      {quoteModalOpen && (
        <QuoteModal onClose={() => setQuoteModalOpen(false)} />
      )}
    </>
  );
}
