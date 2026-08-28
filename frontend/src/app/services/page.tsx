'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  CheckCircle,
  Truck,
  Building2,
  FileCheck,
  ShieldCheck,
  Globe2,
  Clock,
  Send,
  HelpCircle,
} from 'lucide-react';
import QuoteModal from '../../components/QuoteModal';

export default function ServicesPage() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const steps = [
    {
      num: '01',
      title: 'Étude du Besoin & Cahier des Charges',
      desc: 'Analyse détaillée de vos exigences techniques, volumes, normes requises et budget cible.',
    },
    {
      num: '02',
      title: 'Sélection Usine & Négociation B2B',
      desc: 'Identification des fabricants les plus qualifiés en Turquie et négociation des meilleurs prix directs usine.',
    },
    {
      num: '03',
      title: 'Échantillonnage & Validation Prototype',
      desc: 'Production et envoi d’échantillons express pour validation physique avant lancement de la série.',
    },
    {
      num: '04',
      title: 'Audit Qualité & Expédition Sécurisée',
      desc: 'Inspection systématique sur site, formalités douanières export et suivi du transport jusqu’à votre entrepôt.',
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
          <span className="section-eyebrow">Solutions B2B Complètes</span>
          <h1 className="section-title" style={{ marginBottom: '14px' }}>
            Services de Sourcing & Accompagnement Export
          </h1>
          <p className="section-subtitle">
            HAVA Global Trade prend en charge l’intégralité de votre chaîne d’approvisionnement depuis la Turquie avec une présence directe sur le terrain.
          </p>
        </div>
      </section>

      {/* 4 CORE SERVICES */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px',
            }}
          >
            {/* Service 1 */}
            <div
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
                  width: '54px',
                  height: '54px',
                  background: 'var(--gold-50)',
                  color: 'var(--gold-500)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  border: '1px solid rgba(217, 119, 6, 0.2)',
                }}
              >
                <Search size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-950)', marginBottom: '12px' }}>
                1. Sourcing Industriel & Négociation
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
                Accédez aux meilleures manufactures turques. Nous prospectons, comparons les capacités de production et négocions des tarifs préférentiels direct usine pour maximiser vos marges.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'var(--charcoal)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} style={{ color: 'var(--success)' }} /> Comparatif de prix et capacités usine
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} style={{ color: 'var(--success)' }} /> Négociation MOQ & conditions de paiement
                </li>
              </ul>
            </div>

            {/* Service 2 */}
            <div
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
                  width: '54px',
                  height: '54px',
                  background: 'var(--gold-50)',
                  color: 'var(--gold-500)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  border: '1px solid rgba(217, 119, 6, 0.2)',
                }}
              >
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-950)', marginBottom: '12px' }}>
                2. Audit d&apos;Usine & Contrôle Qualité
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
                Nos auditeurs inspectent les lignes de production selon les normes AQL 2.5. Chaque commande est vérifiée avant emballage et empotage du conteneur.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'var(--charcoal)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} style={{ color: 'var(--success)' }} /> Rapport d’inspection photo et vidéo HD
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} style={{ color: 'var(--success)' }} /> Vérification conformité CE, ISO, Halal
                </li>
              </ul>
            </div>

            {/* Service 3 */}
            <div
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
                  width: '54px',
                  height: '54px',
                  background: 'var(--gold-50)',
                  color: 'var(--gold-500)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  border: '1px solid rgba(217, 119, 6, 0.2)',
                }}
              >
                <Truck size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-950)', marginBottom: '12px' }}>
                3. Logistique Globale & Incoterms
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
                Acheminement multimodal au départ des ports d’Istanbul, Mersin ou Izmir. Solutions adaptées en conteneur complet (FCL) ou groupage (LCL).
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'var(--charcoal)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} style={{ color: 'var(--success)' }} /> Incoterms maîtrisés : EXW, FOB, CIF, DDP
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} style={{ color: 'var(--success)' }} /> Suivi GPS en temps réel du fret
                </li>
              </ul>
            </div>

            {/* Service 4 */}
            <div
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
                  width: '54px',
                  height: '54px',
                  background: 'var(--gold-50)',
                  color: 'var(--gold-500)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  border: '1px solid rgba(217, 119, 6, 0.2)',
                }}
              >
                <FileCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-950)', marginBottom: '12px' }}>
                4. Dédouanement & Documents Export
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
                Préparation et légalisation de l&apos;ensemble des documents officiels pour garantir un dédouanement fluide et conforme dans votre pays de destination.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'var(--charcoal)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} style={{ color: 'var(--success)' }} /> Certificats d&apos;origine, EUR.1, ATR, Phytosanitaire
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} style={{ color: 'var(--success)' }} /> Connaissements maritimes (Bill of Lading / B/L)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP STEPS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Méthodologie</span>
            <h2 className="section-title">Comment se déroule une opération d&apos;export ?</h2>
            <p className="section-subtitle">
              Un processus transparent et sécurisé de A à Z.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            {steps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '28px 24px',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '2.2rem',
                    fontWeight: 800,
                    color: 'var(--gold-400)',
                    lineHeight: 1,
                    display: 'block',
                    marginBottom: '12px',
                  }}
                >
                  {step.num}
                </span>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--navy-950)', marginBottom: '8px' }}>
                  {step.title}
                </h4>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.86rem', lineHeight: '1.5' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 0', background: 'var(--navy-950)', color: '#fff' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#fff', marginBottom: '14px' }}>
            Un projet d&apos;importation depuis la Turquie ?
          </h2>
          <p style={{ fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 28px', color: 'var(--slate-400)' }}>
            Confiez-nous votre recherche usine ou votre cotation conteneur. Nous étudions votre projet gratuitement sous 24h.
          </p>
          <button onClick={() => setQuoteModalOpen(true)} className="btn btn-gold btn-lg">
            <Send size={18} /> Demander un Audit & Devis Gratuit
          </button>
        </div>
      </section>

      {quoteModalOpen && (
        <QuoteModal onClose={() => setQuoteModalOpen(false)} />
      )}
    </>
  );
}
