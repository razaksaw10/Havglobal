'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  MapPin,
  Camera,
  Briefcase,
  ShoppingBag,
  Sparkles,
  Calendar,
  CheckCircle2,
  Users,
  Car,
  Hotel,
  ShieldCheck,
  Send,
  Loader2,
  AlertCircle,
  PhoneCall,
  MessageCircle,
  ArrowRight,
  Globe2,
  Star,
} from 'lucide-react';
import { api } from '../../lib/api';

export default function TourismePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: 'Burkina Faso',
    subject: 'Demande de Visite Guidée & Séjour en Turquie',
    categorySlug: 'mobilier',
    packageType: 'istanbul_imperial',
    travelersCount: '2',
    travelDates: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const packs = [
    {
      id: 'istanbul_imperial',
      badge: 'Incontournable · Culture & Histoire',
      title: 'Pack Istanbul Impérial & Bosphore',
      icon: '🏛️',
      image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80',
      desc: 'Immersion au cœur de l’histoire byzantine et ottomane avec guide francophone privé et croisière exclusive sur le détroit du Bosphore.',
      highlights: [
        'Sainte-Sophie & Mosquée Bleue (Sultanahmet)',
        'Palais de Topkapi & Citerne Basilique',
        'Croisière privée sur le Bosphore au coucher du soleil',
        'Grand Bazar historique & Bazar Égyptien aux épices',
        'Quartiers branchés de Galata, Karaköy & Taksim',
      ],
      idealFor: 'Familles, couples & voyageurs passionnés d’histoire',
    },
    {
      id: 'business_salons',
      badge: 'Professionnel · B2B & Usines',
      title: 'Pack Business & Salons Professionnels',
      icon: '💼',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
      desc: 'Optimisez votre voyage d’affaires en Turquie : accompagnement sur les foires internationales, visites d’usines partenaires et négociation avec interprète bilingue turc-français.',
      highlights: [
        'Accompagnement sur les salons (CNR Expo, Tüyap, IFCO, etc.)',
        'Visites privées d’usines et ateliers de confection à Bursa/Istanbul',
        'Interprétariat assermenté lors de vos négociations commerciales',
        'Organisation d’agendas de rendez-vous B2B qualifiés',
        'Transfert en van VIP avec chauffeur dédié toute la journée',
      ],
      idealFor: 'Chefs d’entreprises, importateurs, commerçants & investisseurs',
    },
    {
      id: 'shopping_grossistes',
      badge: 'Mode & Confection · Shopping VIP',
      title: 'Pack Shopping & Sourcing Grossistes',
      icon: '🛍️',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      desc: 'Circuit sur-mesure dans les hauts lieux de la confection et du commerce de gros d’Istanbul pour faire le plein de stock au meilleur tarif d’usine.',
      highlights: [
        'Circuits guidés dans les zones grossistes (Merter, Laleli, Osmanbey)',
        'Accès aux meilleurs fabricants de prêt-à-porter, jeans, linge de maison',
        'Assistance pour négociation des prix de gros et minimums de commande',
        'Coordination de l’emballage et de l’expédition fret direct avec notre pôle export',
        'Visite des centres commerciaux de luxe (Zorlu Center, Istinye Park)',
      ],
      idealFor: 'Boutiques de mode, grossistes, e-commerçants & revendeurs',
    },
    {
      id: 'cappadoce_regions',
      badge: 'Émerveillement · Nature & Découverte',
      title: 'Pack Cappadoce Féerique & Régions',
      icon: '🎈',
      image: 'https://images.unsplash.com/photo-1609825488888-3a766db05542?w=800&q=80',
      desc: 'Vivez l’expérience magique des cheminées de fées, vol en montgolfière au lever du soleil et découverte des merveilles de l’Anatolie (Bursa, Pamukkale, Antalya).',
      highlights: [
        'Vol en montgolfière inoubliable au-dessus des vallées de Cappadoce',
        'Nuitée dans un hôtel troglodytique authentique sculpté dans la roche',
        'Visite des cités souterraines de Derinkuyu et de la vallée de Göreme',
        'Excursion à Bursa : première capitale ottomane et téléphérique du mont Uludağ',
        'Transferts intérieurs et logistique haut de gamme entièrement gérés',
      ],
      idealFor: 'Séjours de rêve, vacances VIP, groupes & voyages de noces',
    },
  ];

  const vipServices = [
    {
      icon: <Car size={24} style={{ color: 'var(--gold-400)' }} />,
      title: 'Chauffeur Privé & Van Mercedes VIP',
      desc: 'Déplacez-vous dans un confort absolu avec nos vans Mercedes Classe V / Sprinter climatisés avec Wi-Fi et boissons à bord.',
    },
    {
      icon: <Users size={24} style={{ color: 'var(--gold-400)' }} />,
      title: 'Guides Francophones Passionnés',
      desc: 'Des guides professionnels certifiés maîtrisant parfaitement la langue française et la culture turque pour des visites captivantes.',
    },
    {
      icon: <Hotel size={24} style={{ color: 'var(--gold-400)' }} />,
      title: 'Réservation Hôtels Partenaires 4* & 5*',
      desc: 'Bénéficiez de tarifs préférentiels négociés dans les meilleurs hôtels d’Istanbul (Bosphore, Sultanahmet, Taksim) et de Cappadoce.',
    },
    {
      icon: <ShieldCheck size={24} style={{ color: 'var(--gold-400)' }} />,
      title: 'Assistance 24/7 sur Place à Istanbul',
      desc: 'Une équipe locale disponible à tout moment via WhatsApp et appel direct pour répondre à vos demandes spécifiques pendant votre séjour.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company || 'Touriste / Particulier',
      country: formData.country,
      subject: `[TOURISME & VISITES] ${formData.packageType.toUpperCase()} - ${formData.travelersCount} voyageur(s)`,
      categorySlug: 'mobilier',
      message: `Formule choisie : ${formData.packageType}\nNombre de voyageurs : ${formData.travelersCount}\nDates prévues du séjour : ${formData.travelDates || 'Non spécifié'}\n\nDétails et préférences :\n${formData.message}`,
    };

    try {
      await api.submitInquiry(payload);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l’envoi de votre demande.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#0a0f1d', color: '#f8fafc', minHeight: '100vh', paddingTop: '80px' }}>
      {/* HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '80px 0 100px',
          background:
            "linear-gradient(180deg, rgba(10, 15, 29, 0.78) 0%, rgba(10, 15, 29, 0.94) 100%), url('https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1920&q=85&fit=crop') center 35% / cover no-repeat",
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(217, 119, 6, 0.12)',
                border: '1px solid rgba(217, 119, 6, 0.35)',
                color: 'var(--gold-400)',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '20px',
              }}
            >
              <Compass size={16} /> HAVA Travel & Tourisme · Visites Guidées en Turquie
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.1rem, 4.5vw, 3.4rem)',
                fontFamily: 'var(--font-serif)',
                color: '#ffffff',
                lineHeight: '1.2',
                marginBottom: '22px',
              }}
            >
              Vivez la Turquie Autrement :{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, var(--gold-400) 0%, #fbbf24 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Visites Guidées, Salons B2B & Séjours VIP
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                color: '#94a3b8',
                lineHeight: '1.7',
                marginBottom: '36px',
              }}
            >
              Que vous veniez à Istanbul pour développer vos affaires, visiter les usines partenaires, explorer les quartiers grossistes ou passer des vacances inoubliables en famille, notre agence s’occupe de toute votre logistique avec un guide francophone dédié.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <a href="#reserver-visite" className="btn btn-gold" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                <Calendar size={18} /> Réserver une Visite / Séjour
              </a>
              <a
                href="https://wa.me/905431736173?text=Bonjour,%20je%20souhaite%20des%20informations%20sur%20les%20visites%20guidées%20et%20séjours%20en%20Turquie"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{
                  padding: '14px 24px',
                  fontSize: '1rem',
                  borderColor: '#22c55e',
                  color: '#4ade80',
                  background: 'rgba(34, 197, 94, 0.08)',
                }}
              >
                <MessageCircle size={18} /> WhatsApp Tourisme (+90 543 173 61 73)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGES SECTION */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 50px' }}>
            <span
              style={{
                color: 'var(--gold-400)',
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                display: 'block',
                marginBottom: '10px',
              }}
            >
              Formules & Circuits Sur-Mesure
            </span>
            <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: '#fff', marginBottom: '14px' }}>
              Nos Packs de Visites & Accompagnement
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Tous nos circuits sont 100% personnalisables selon vos dates, le nombre de personnes et vos objectifs (tourisme, shopping ou business).
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {packs.map((pack) => (
              <div
                key={pack.id}
                style={{
                  background: '#111a2e',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gold-400)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={pack.image}
                    alt={pack.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(10, 15, 29, 0.85)',
                      backdropFilter: 'blur(6px)',
                      color: 'var(--gold-400)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(217, 119, 6, 0.3)',
                    }}
                  >
                    {pack.badge}
                  </div>
                </div>

                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '1.6rem' }}>{pack.icon}</span>
                      <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>{pack.title}</h3>
                    </div>

                    <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '18px' }}>
                      {pack.desc}
                    </p>

                    <div style={{ marginBottom: '20px' }}>
                      <strong style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '8px' }}>
                        ✨ Au programme :
                      </strong>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {pack.highlights.map((h, idx) => (
                          <li key={idx} style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
                            <span style={{ color: 'var(--gold-400)' }}>✔</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '12px' }}>
                      🎯 Recommandé pour : <strong style={{ color: '#cbd5e1' }}>{pack.idealFor}</strong>
                    </div>
                    <a
                      href="#reserver-visite"
                      onClick={() => setFormData((prev) => ({ ...prev, packageType: pack.id }))}
                      className="btn btn-gold btn-sm"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Demander un Devis pour ce Pack
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIP SERVICES GRID */}
      <section style={{ padding: '80px 0', background: '#0d1527', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 50px' }}>
            <span
              style={{
                color: 'var(--gold-400)',
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                display: 'block',
                marginBottom: '10px',
              }}
            >
              Services Inclus & Logistique VIP
            </span>
            <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: '#fff' }}>
              Un Séjour Sérénité de Bout en Bout
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {vipServices.map((srv, index) => (
              <div
                key={index}
                style={{
                  background: '#111a2e',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '14px',
                  padding: '26px 22px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(217, 119, 6, 0.12)',
                    display: 'inline-flex',
                    padding: '12px',
                    borderRadius: '10px',
                    marginBottom: '16px',
                  }}
                >
                  {srv.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '8px' }}>{srv.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6' }}>{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING FORM SECTION */}
      <section id="reserver-visite" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <div
              style={{
                background: 'linear-gradient(145deg, #111a2e, #0c1424)',
                border: '1px solid rgba(217, 119, 6, 0.3)',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              }}
            >
              {success ? (
                <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                  <CheckCircle2 size={64} style={{ color: '#22c55e', margin: '0 auto 16px' }} />
                  <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '12px' }}>
                    Demande de Visite Transmise avec Succès !
                  </h2>
                  <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '28px' }}>
                    Notre responsable tourisme & séjours d’affaires à Istanbul a bien reçu vos souhaits. Nous vous ferons parvenir une proposition personnalisée avec planning et devis sous <strong>24 heures ouvrées</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        country: 'Burkina Faso',
                        subject: 'Demande de Visite Guidée & Séjour en Turquie',
                        categorySlug: 'mobilier',
                        packageType: 'istanbul_imperial',
                        travelersCount: '2',
                        travelDates: '',
                        message: '',
                      });
                    }}
                    className="btn btn-gold"
                  >
                    Faire une autre demande
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <span
                      style={{
                        color: 'var(--gold-400)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                      }}
                    >
                      Planification de Séjour
                    </span>
                    <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: '#fff', marginTop: '6px' }}>
                      Réservez votre Visite Guidée / Séjour
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                      Indiquez vos dates et préférences pour recevoir une proposition sur-mesure.
                    </p>
                  </div>

                  {error && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        padding: '14px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                      }}
                    >
                      <AlertCircle size={18} />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Nom complet *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="ex: Ibrahim Traoré"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          required
                          className="form-input"
                          placeholder="contact@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Téléphone / WhatsApp *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="+226 70 00 00 00"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Pays de départ</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Burkina Faso, Côte d’Ivoire, France..."
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Formule / Type de Visite souhaité *</label>
                        <select
                          className="form-select"
                          value={formData.packageType}
                          onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                        >
                          <option value="istanbul_imperial">🏛️ Pack Istanbul Impérial & Bosphore (Histoire & Culture)</option>
                          <option value="business_salons">💼 Pack Business & Salons Professionnels (B2B & Usines)</option>
                          <option value="shopping_grossistes">🛍️ Pack Shopping & Sourcing Grossistes (Merter/Laleli)</option>
                          <option value="cappadoce_regions">🎈 Pack Cappadoce Féerique & Régions (Montgolfières)</option>
                          <option value="sur_mesure">✨ Programme 100% sur-mesure / VIP Combiné</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Nombre de personnes</label>
                        <select
                          className="form-select"
                          value={formData.travelersCount}
                          onChange={(e) => setFormData({ ...formData, travelersCount: e.target.value })}
                        >
                          <option value="1">1 personne (Solo)</option>
                          <option value="2">2 personnes (Couple / Duo)</option>
                          <option value="3-5">3 à 5 personnes (Petite délégation / Famille)</option>
                          <option value="6+">Plus de 6 personnes (Groupe / Entreprise)</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label">Dates ou période approximative du voyage</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="ex: Du 15 au 22 Octobre 2026"
                        value={formData.travelDates}
                        onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                      <label className="form-label">Détails de vos souhaits & Besoins spécifiques</label>
                      <textarea
                        rows={3}
                        className="form-textarea"
                        placeholder="Ex: besoin d'un hôtel 5 étoiles sur le Bosphore, visites d'usines textiles particulières, interprète turc-français, etc."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-gold"
                      style={{ width: '100%', padding: '14px', fontSize: '1.05rem', justifyContent: 'center' }}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                          Envoi de votre demande de séjour...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Demander un Devis Gratuit pour mon Séjour
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
