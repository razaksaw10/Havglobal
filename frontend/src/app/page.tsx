'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Globe2,
  TrendingUp,
  Package,
  FileCheck2,
  Ship,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
  Factory,
} from 'lucide-react';
import { api } from '../lib/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import QuoteModal from '../components/QuoteModal';

import { FALLBACK_PRODUCTS } from '../lib/fallbackData';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Counter stats animation
  const [statsCount, setStatsCount] = useState({
    sectors: 0,
    countries: 0,
    quality: 0,
    factories: 0,
  });

  useEffect(() => {
    // Fetch featured products
    api
      .getProducts({ featured: true, limit: 4 })
      .then((res) => {
        setFeaturedProducts(res.products || []);
      })
      .catch((err) => {
        console.warn('Erreur chargement produits vedettes :', err.message);
        setFeaturedProducts([]);
      })
      .finally(() => {
        setLoadingProducts(false);
      });

    // Animate stats
    const timer = setTimeout(() => {
      setStatsCount({
        sectors: 4,
        countries: 45,
        quality: 100,
        factories: 250,
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenQuote = (prod?: Product) => {
    if (prod) {
      setSelectedProduct(prod);
    }
    setQuoteModalOpen(true);
  };

  const faqs = [
    {
      q: 'Quels sont les délais moyens de production et d’expédition depuis la Turquie ?',
      a: 'Selon les secteurs (textile, mobilier, cosmétique ou alimentaire), les délais de fabrication varient de 2 à 4 semaines. L’acheminement maritime vers les pays africains prend généralement 15 à 25 jours.',
    },
    {
      q: 'Comment s’effectue le contrôle de conformité et de qualité des marchandises ?',
      a: 'Nos inspecteurs qualité basés à Istanbul et dans les principaux bassins industriels (Bursa, Denizli, Gaziantep, Izmir) effectuent un double audit : contrôle sur ligne de production et inspection AQL avant scellement du conteneur.',
    },
    {
      q: 'Quels sont les Incoterms et modes de paiement acceptés ?',
      a: 'Nous opérons principalement sous les Incoterms FOB Istanbul/Mersin, CIF port de destination ou DDP. Pour le règlement, nous acceptons les virements SWIFT, les Lettres de Crédit irrévocables et confirmées (L/C) ainsi que les solutions Escrow.',
    },
    {
      q: 'Est-il possible de fabriquer sous marque blanche (Private Label / OEM) ?',
      a: 'Absolument. La majorité de nos usines partenaires proposent la personnalisation intégrale : broderie, sérigraphie, formulation cosmétique spécifique, packaging certifié et étiquetage multilingue conforme aux réglementations de votre pays.',
    },
  ];

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-text">
              <div className="hero-badge">
                <span className="dot"></span>
                <span>Commerce International · Origine Turquie</span>
              </div>
              <h1 className="hero-title">
                Relier les marchés mondiaux au savoir-faire <em>turc</em>
              </h1>
              <p className="hero-lead">
                HAVA Global Trade est votre partenaire stratégique d&apos;import-export basé à Istanbul. Nous sécurisons vos approvisionnements en Textile, Mobilier, Santé et Agroalimentaire avec un contrôle qualité irréprochable et une logistique sans frontières.
              </p>
              <div className="hero-buttons">
                <Link href="/catalogue" className="btn btn-dark btn-lg">
                  Explorer le Catalogue <ArrowRight size={18} />
                </Link>
                <button
                  onClick={() => handleOpenQuote()}
                  className="btn btn-gold btn-lg"
                >
                  Demander une Cotation
                </button>
                <a
                  href="https://wa.me/905431736173?text=Bonjour%20HAVA%20Global%20Trade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-lg"
                >
                  WhatsApp 💬
                </a>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-num">{statsCount.sectors}</span>
                  <span className="stat-label">Secteurs Majeurs</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num">{statsCount.countries}+</span>
                  <span className="stat-label">Pays Livrés</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num">{statsCount.quality}%</span>
                  <span className="stat-label">Contrôle Qualité AQL</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num">{statsCount.factories}+</span>
                  <span className="stat-label">Usines Partenaires</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-img-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200&q=85&fit=crop"
                  alt="Port cargo international et logistique Turquie"
                />
              </div>
              <div className="hero-floating-card">
                <div className="floating-icon">🌍</div>
                <div className="floating-text">
                  <h4>Hub Multiservices</h4>
                  <p>Commerce · Santé · Tourisme</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 CORE PILLARS ECOSYSTEM SECTION */}
      <section className="section" style={{ background: '#080d1a', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 48px' }}>
            <span className="section-eyebrow" style={{ color: 'var(--gold-400)' }}>Écosystème Global</span>
            <h2 className="section-title" style={{ color: '#fff', fontSize: '2.4rem' }}>
              Nos 3 Grands Pôles d&apos;Activités & de Services
            </h2>
            <p className="section-subtitle" style={{ color: '#94a3b8' }}>
              HAVA Global rassemble l&apos;excellence industrielle, médicale et touristique de Turquie pour accompagner les entreprises, les patients et les voyageurs d&apos;Afrique de l&apos;Ouest et du monde entier.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {/* PÔLE 1 : B2B */}
            <div
              style={{
                background: 'linear-gradient(145deg, #111a2e, #0d1527)',
                border: '1px solid rgba(217, 119, 6, 0.25)',
                borderRadius: '18px',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                  <span style={{ fontSize: '2.4rem' }}>📦</span>
                  <span style={{ background: 'rgba(217, 119, 6, 0.15)', color: 'var(--gold-400)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                    PÔLE EXPORT
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '10px' }}>
                  Sourcing & Commerce B2B Turquie
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                  Fourniture directe d&apos;usines turques en Textile, Mobilier, Équipements, Cosmétiques et Agroalimentaire avec audit qualité AQL et fret sécurisé.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <li style={{ display: 'flex', gap: '8px' }}>✔ Prix d&apos;usines direct sans intermédiaires</li>
                  <li style={{ display: 'flex', gap: '8px' }}>✔ Personnalisation & Private Label (OEM)</li>
                  <li style={{ display: 'flex', gap: '8px' }}>✔ Expédition maritime conteneur & aérien</li>
                </ul>
              </div>
              <Link href="/catalogue" className="btn btn-gold btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                Explorer le Catalogue B2B <ArrowRight size={16} />
              </Link>
            </div>

            {/* PÔLE 2 : MEDI-TOUR ASSISTANCE */}
            <div
              style={{
                background: 'linear-gradient(145deg, #111a2e, #0c1a2e)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '18px',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div style={{ background: '#fff', padding: '6px 12px', borderRadius: '10px' }}>
                    <img
                      src="/meditour-logo.png"
                      alt="MEDI-TOUR ASSISTANCE"
                      style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
                    />
                  </div>
                  <span style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                    SANTÉ & ÉVACUATION
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '10px' }}>
                  MEDI-TOUR ASSISTANCE
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                  Organisation d&apos;évacuations sanitaires et tourisme médical entre le Burkina Faso / Afrique et les hôpitaux de référence JCI en Turquie.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <li style={{ display: 'flex', gap: '8px' }}>✔ Analyse de dossier par médecins spécialistes</li>
                  <li style={{ display: 'flex', gap: '8px' }}>✔ Visa médical express & accueil aéroport VIP</li>
                  <li style={{ display: 'flex', gap: '8px' }}>✔ Équipe soignante francophone dédiée</li>
                </ul>
              </div>
              <Link href="/meditour" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center', borderColor: '#38bdf8', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)' }}>
                Découvrir MEDI-TOUR Santé <ArrowRight size={16} />
              </Link>
            </div>

            {/* PÔLE 3 : TOURISME & VISITES GUIDÉES */}
            <div
              style={{
                background: 'linear-gradient(145deg, #111a2e, #131d33)',
                border: '1px solid rgba(251, 191, 36, 0.25)',
                borderRadius: '18px',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                  <span style={{ fontSize: '2.4rem' }}>🏛️</span>
                  <span style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                    TOURISME & AFFAIRES
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '10px' }}>
                  Visites Guidées & Séjours en Turquie
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                  Circuits culturels à Istanbul et Cappadoce, accompagnement de délégations d&apos;affaires sur salons B2B et circuits shopping grossistes.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <li style={{ display: 'flex', gap: '8px' }}>✔ Guides touristiques francophones certifiés</li>
                  <li style={{ display: 'flex', gap: '8px' }}>✔ Salons professionnels & visites d&apos;usines</li>
                  <li style={{ display: 'flex', gap: '8px' }}>✔ Van Mercedes VIP & réservation hôtels 4*/5*</li>
                </ul>
              </div>
              <Link href="/tourisme" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center', borderColor: '#fbbf24', color: '#fbbf24', background: 'rgba(251, 191, 36, 0.08)' }}>
                Voir les Formules de Visites <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTORS GRID */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Pôle Industriel</span>
            <h2 className="section-title">Nos 4 Secteurs Export B2B Majeurs</h2>
            <p className="section-subtitle">
              La Turquie combine proximité géographique, compétitivité tarifaire et standards de production européens de premier plan.
            </p>
          </div>

          <div className="categories-grid">
            <div className="category-card">
              <div className="cat-icon">👔</div>
              <h3 className="cat-title">Textile & Confection</h3>
              <p className="cat-desc">
                Costumes sur-mesure, prêt-à-porter, linge d’hôtel et vêtements professionnels confectionnés avec des cotons égéens réputés.
              </p>
              <Link href="/catalogue?category=textile" className="cat-link">
                Voir les références <ChevronRight size={16} />
              </Link>
            </div>

            <div className="category-card">
              <div className="cat-icon">🏠</div>
              <h3 className="cat-title">Mobilier & Équipement</h3>
              <p className="cat-desc">
                Mobilier d&apos;intérieur contemporain, agencement d&apos;hôtels et résidences, sièges ergonomiques de direction (Hub d&apos;İnegöl).
              </p>
              <Link href="/catalogue?category=mobilier" className="cat-link">
                Voir les références <ChevronRight size={16} />
              </Link>
            </div>

            <div className="category-card">
              <div className="cat-icon">💊</div>
              <h3 className="cat-title">Santé & Cosmétiques</h3>
              <p className="cat-desc">
                Soins dermo-cosmétiques certifiés GMP, sérums d&apos;exception, savons artisanaux d&apos;Alep et compléments alimentaires naturels.
              </p>
              <Link href="/catalogue?category=sante" className="cat-link">
                Voir les références <ChevronRight size={16} />
              </Link>
            </div>

            <div className="category-card">
              <div className="cat-icon">🍯</div>
              <h3 className="cat-title">Agroalimentaire & Terroir</h3>
              <p className="cat-desc">
                Huiles d&apos;olive extra-vierges première pression, figues séchées d&apos;Izmir, noisettes de la Mer Noire et loukoums traditionnels.
              </p>
              <Link href="/catalogue?category=alimentaire" className="cat-link">
                Voir les références <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SHOWCASE */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="section-eyebrow">Sélection Usine</span>
              <h2 className="section-title" style={{ marginBottom: '8px' }}>
                Produits Vedettes à l&apos;Export
              </h2>
              <p className="section-subtitle">
                Échantillons de nos commandes les plus demandées par nos clients grossistes et importateurs.
              </p>
            </div>
            <Link href="/catalogue" className="btn btn-outline">
              Voir tout le catalogue ({featuredProducts.length > 0 ? '16+' : '...'} articles) <ArrowRight size={16} />
            </Link>
          </div>

          <div className="products-grid">
            {featuredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onViewDetails={(p) => setSelectedProduct(p)}
                onRequestQuote={(p) => handleOpenQuote(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow" style={{ color: 'var(--gold-400)' }}>
              Accompagnement 360°
            </span>
            <h2 className="section-title">
              Pourquoi choisir HAVA Global Trade ?
            </h2>
            <p className="section-subtitle">
              Une infrastructure complète sur place à Istanbul pour sécuriser chaque centime de votre investissement.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '30px' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(217, 119, 6, 0.15)', color: 'var(--gold-400)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Factory size={24} />
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '10px' }}>
                Sourcing Direct Usine
              </h3>
              <p style={{ color: 'var(--slate-400)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Accès direct aux fabricants industriels certifiés sans intermédiaires inutiles. Négociation des meilleurs tarifs B2B.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '30px' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(217, 119, 6, 0.15)', color: 'var(--gold-400)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <FileCheck2 size={24} />
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '10px' }}>
                Audit & Contrôle Qualité
              </h3>
              <p style={{ color: 'var(--slate-400)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Inspection systématique avant expédition avec rapport photo/vidéo détaillé et validation laboratoire si nécessaire.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '30px' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(217, 119, 6, 0.15)', color: 'var(--gold-400)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Ship size={24} />
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '10px' }}>
                Logistique & Incoterms
              </h3>
              <p style={{ color: 'var(--slate-400)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Gestion complète du fret maritime (FCL/LCL), aérien et routier. Formalités douanières export et documents EUR.1 / COO.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '30px' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(217, 119, 6, 0.15)', color: 'var(--gold-400)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '10px' }}>
                Sécurité Financière
              </h3>
              <p style={{ color: 'var(--slate-400)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Paiements sécurisés, conformité bancaire internationale et émission de factures proforma certifiées.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Questions Fréquentes</span>
            <h2 className="section-title">Tout savoir sur l&apos;importation</h2>
            <p className="section-subtitle">
              Les réponses aux interrogations les plus courantes de nos clients partenaires internationaux.
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: 'var(--white)',
                }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.02rem',
                    fontWeight: 600,
                    color: 'var(--navy-950)',
                    cursor: 'pointer',
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--gold-500)', transform: activeFaq === idx ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s ease' }}>
                    +
                  </span>
                </button>
                {activeFaq === idx && (
                  <div style={{ padding: '0 24px 20px', color: 'var(--slate-600)', fontSize: '0.92rem', lineHeight: '1.6', borderTop: '1px solid var(--slate-100)', paddingTop: '14px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: '60px 0', background: 'linear-gradient(135deg, var(--gold-600) 0%, var(--gold-500) 100%)', color: '#fff' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: '#fff', marginBottom: '14px' }}>
            Prêt à lancer votre commande ou demande de cotation ?
          </h2>
          <p style={{ fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 28px', opacity: 0.95 }}>
            Nos experts commerciaux à Istanbul étudient votre cahier des charges et vous répondent sous 24h avec une offre chiffrée.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-dark btn-lg">
              Remplir le Formulaire de Devis
            </Link>
            <a
              href="https://wa.me/905431736173?text=Bonjour%20HAVA%20Global%20Trade"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
            >
              Contacter sur WhatsApp (+90 543 173 61 73)
            </a>
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
