'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HeartPulse,
  Plane,
  ShieldCheck,
  Stethoscope,
  Building2,
  FileCheck2,
  UserCheck,
  PhoneCall,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Loader2,
  Languages,
  Sparkles,
  MapPin,
  ArrowRight,
  Hospital,
  Activity,
  Award,
  Users,
  MessageCircle,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppButton from '../../components/WhatsAppButton';
import { api } from '../../lib/api';

export default function MediTourPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: 'Burkina Faso',
    subject: 'Demande d’évaluation médicale & Évacuation Sanitaire (Medi-Tour)',
    categorySlug: 'sante',
    specialty: 'oncologie',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const specialties = [
    {
      id: 'oncologie',
      title: 'Oncologie & Cancérologie',
      icon: '🎗️',
      desc: 'Traitements de pointe, chimiothérapie ciblée, radiothérapie TrueBeam et chirurgie tumorale complexe.',
    },
    {
      id: 'cardiologie',
      title: 'Cardiologie & Chirurgie Cardiovasculaire',
      icon: '❤️',
      desc: 'Pontages, remplacement valvulaire, cardiologie interventionnelle et pédiatrique.',
    },
    {
      id: 'orthopedie',
      title: 'Orthopédie & Traumatologie',
      icon: '🦴',
      desc: 'Prothèses de hanche et genou assistées par robot, chirurgie du rachis et de la colonne vertébrale.',
    },
    {
      id: 'pma',
      title: 'PMA & Fertilité (FIV / ICSI)',
      icon: '👶',
      desc: 'Fécondation in vitro haute performance, diagnostic pré-implantatoire et don de gamètes encadré.',
    },
    {
      id: 'neurochirurgie',
      title: 'Neurochirurgie & Cerveau',
      icon: '🧠',
      desc: 'Chirurgie mini-invasive du cerveau, Gamma Knife, traitement des anévrismes et malformations.',
    },
    {
      id: 'greffe',
      title: 'Greffes d’Organes & Moelle',
      icon: '🫁',
      desc: 'Transplantations hépatiques, rénales et greffe de moelle osseuse avec protocoles accrédités JCI.',
    },
    {
      id: 'ophtalmologie',
      title: 'Ophtalmologie Avancée',
      icon: '👁️',
      desc: 'Chirurgie réfractive laser, greffe de cornée, traitement de la rétine et du glaucome.',
    },
    {
      id: 'checkup',
      title: 'Bilan de Santé & Check-Up VIP',
      icon: '🩺',
      desc: 'Bilan de santé exhaustif en 24-48h avec imagerie haute résolution (IRM 3T, PET-Scan).',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Transmission du Dossier Médical',
      desc: 'Vous nous transmettez les rapports médicaux, analyses et imageries récents du patient en toute confidentialité.',
    },
    {
      num: '02',
      title: 'Avis des Médecins Spécialistes',
      desc: 'Notre réseau de professeurs et chirurgiens en Turquie étudie le cas et émet une proposition de protocole avec devis détaillé.',
    },
    {
      num: '03',
      title: 'Visa Médical & Logistique de Voyage',
      desc: 'Facilitation de l’obtention du visa médical express, réservation des billets d’avion et coordination d’ambulance si nécessaire.',
    },
    {
      num: '04',
      title: 'Accueil VIP & Hospitalisation',
      desc: 'Accueil personnalisé à l’aéroport d’Istanbul, transfert médicalisé, traductrice dédiée francophone et admission immédiate.',
    },
    {
      num: '05',
      title: 'Suivi Post-Opératoire & Retour',
      desc: 'Accompagnement durant la convalescence, remise du rapport médical complet et coordination avec les médecins traitants en Afrique.',
    },
  ];

  const team = [
    {
      name: 'Nematou KAGAMBEGA',
      role: 'Fondatrice & Directrice Générale',
      badge: 'Management des Structures de Santé (Master 2)',
      desc: 'Spécialiste de la gouvernance hospitalière et de la médiation médicale transculturelle. Elle coordonne les partenariats stratégiques entre les cliniques d’Afrique de l’Ouest et les hôpitaux turcs.',
      phone: '+90 541 882 95 49',
      whatsapp: '905418829549',
      location: 'Istanbul, Turquie',
    },
    {
      name: 'Zoenabou SIMPORE',
      role: 'Coordinatrice Soins & Clinique',
      badge: 'Infirmière Spécialisée · 4 ans Expérience Santé Turquie',
      desc: 'Forte d’un réseau direct avec les médecins, pharmaciens et chefs de clinique en Turquie, elle supervise rigoureusement la prise en charge clinique et le confort du patient.',
      phone: '+90 541 886 24 45',
      whatsapp: '905418862445',
      location: 'Istanbul, Turquie',
    },
    {
      name: 'Awa KOALA',
      role: 'Coordinatrice Relations Internationales',
      badge: 'Diplômée en Relations Internationales & Coopération',
      desc: 'Experte des flux internationaux de patients et de la diplomatie sanitaire, elle gère les démarches institutionnelles, les visas médicaux et l’accueil des délégations.',
      phone: '+90 535 773 42 87',
      whatsapp: '905357734287',
      location: 'Bolu / Istanbul, Turquie',
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
      company: formData.company || 'Particulier / Patient',
      country: formData.country,
      subject: `[MEDI-TOUR] ${formData.specialty.toUpperCase()} - ${formData.subject}`,
      categorySlug: 'sante',
      message: `Spécialité concernée : ${formData.specialty}\n\nDétails du cas médical :\n${formData.message}`,
    };

    try {
      await api.submitInquiry(payload);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l’envoi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main style={{ background: '#0a0f1d', color: '#f8fafc', minHeight: '100vh', paddingTop: '100px' }}>
        {/* HERO SECTION */}
        <section
          style={{
            position: 'relative',
            padding: '70px 0 90px',
            background: 'radial-gradient(circle at 50% 10%, rgba(14, 165, 233, 0.15), transparent 70%), #0a0f1d',
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
                  background: 'rgba(14, 165, 233, 0.12)',
                  border: '1px solid rgba(14, 165, 233, 0.35)',
                  color: '#38bdf8',
                  padding: '6px 16px',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '20px',
                }}
              >
                <HeartPulse size={16} /> MEDI-TOUR ASSISTANCE · Santé & Évacuation Sanitaire
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
                Le Pont Médical d’Excellence entre{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  l’Afrique de l’Ouest et la Turquie
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
                Organisation d’évacuations sanitaires d’urgence, bilans spécialisés et hospitalisation dans les meilleurs centres médicaux accrédités JCI en Turquie. Une prise en charge humaine, continue et hautement sécurisée.
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
                <a href="#demande-devis" className="btn btn-gold" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                  <Stethoscope size={18} /> Demander un Devis Médical
                </a>
                <a
                  href="https://wa.me/905418829549?text=Bonjour,%20je%20souhaite%20des%20informations%20sur%20Medi-Tour%20Assistance"
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
                  <MessageCircle size={18} /> WhatsApp Urgence Santé (+90 541 882 95 49)
                </a>
              </div>

              {/* QUICK KEY STATS */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                  marginTop: '60px',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '18px 20px',
                  }}
                >
                  <div style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>
                    100%
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Accompagnement francophone dédié</div>
                </div>

                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '18px 20px',
                  }}
                >
                  <div style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>
                    24-48h
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Délai moyen d’avis médical certifié</div>
                </div>

                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '18px 20px',
                  }}
                >
                  <div style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>
                    JCI
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Réseau d’hôpitaux accrédités mondiaux</div>
                </div>

                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '18px 20px',
                  }}
                >
                  <div style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>
                    2 Pôles
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Burkina Faso & Turquie (Istanbul/Bolu)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: WHY TURKEY & MEDI-TOUR */}
        <section style={{ padding: '80px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center' }}>
              <div>
                <span
                  style={{
                    color: '#38bdf8',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  Pourquoi choisir MEDI-TOUR ASSISTANCE ?
                </span>
                <h2
                  style={{
                    fontSize: '2.2rem',
                    fontFamily: 'var(--font-serif)',
                    color: '#fff',
                    lineHeight: '1.3',
                    marginBottom: '20px',
                  }}
                >
                  Sécuriser chaque étape du parcours médical du patient
                </h2>
                <p style={{ color: '#94a3b8', lineHeight: '1.7', marginBottom: '22px' }}>
                  Face à la complexité des évacuations sanitaires et aux difficultés administratives, MEDI-TOUR ASSISTANCE sert d’interface professionnelle entre les patients africains, leurs familles et les plus grands hôpitaux turcs.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        background: 'rgba(14, 165, 233, 0.15)',
                        color: '#38bdf8',
                        padding: '8px',
                        borderRadius: '8px',
                        flexShrink: 0,
                      }}
                    >
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <strong style={{ color: '#fff', display: 'block', fontSize: '1rem', marginBottom: '4px' }}>
                        Sécurité & Éthique Médicale
                      </strong>
                      <span style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        Respect absolu du secret médical, neutralité et défense des intérêts du patient à chaque étape.
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        background: 'rgba(14, 165, 233, 0.15)',
                        color: '#38bdf8',
                        padding: '8px',
                        borderRadius: '8px',
                        flexShrink: 0,
                      }}
                    >
                      <Languages size={20} />
                    </div>
                    <div>
                      <strong style={{ color: '#fff', display: 'block', fontSize: '1rem', marginBottom: '4px' }}>
                        Interprétariat & Présence Continue
                      </strong>
                      <span style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        Plus aucune barrière de la langue : nos traductrices et soignantes francophones vous accompagnent dans toutes les consultations.
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        background: 'rgba(14, 165, 233, 0.15)',
                        color: '#38bdf8',
                        padding: '8px',
                        borderRadius: '8px',
                        flexShrink: 0,
                      }}
                    >
                      <Plane size={20} />
                    </div>
                    <div>
                      <strong style={{ color: '#fff', display: 'block', fontSize: '1rem', marginBottom: '4px' }}>
                        Coordination Logistique Complète
                      </strong>
                      <span style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        Accueil aéroport VIP, transport médicalisé/ambulance, réservation d’hôtels pour accompagnateurs et visa médical accéléré.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD PREVIEW */}
              <div
                style={{
                  background: 'linear-gradient(145deg, #111a2e, #0b1222)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '20px',
                  padding: '36px',
                  position: 'relative',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    paddingBottom: '20px',
                    marginBottom: '24px',
                  }}
                >
                  <div
                    style={{
                      background: '#0284c7',
                      color: '#fff',
                      padding: '12px',
                      borderRadius: '12px',
                    }}
                  >
                    <Hospital size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>Réseau Hospitalier Turc de Pointe</h3>
                    <span style={{ color: '#38bdf8', fontSize: '0.85rem' }}>Istanbul · Ankara · Izmir · Antalya</span>
                  </div>
                </div>

                <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '20px' }}>
                  La Turquie est aujourd’hui l’une des 5 premières destinations mondiales de tourisme médical, alliant des équipements robotiques de dernière génération à des coûts 40% à 60% plus avantageux qu’en Europe occidentale.
                </p>

                <div
                  style={{
                    background: 'rgba(14, 165, 233, 0.08)',
                    border: '1px solid rgba(14, 165, 233, 0.2)',
                    borderRadius: '12px',
                    padding: '18px',
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#38bdf8', marginBottom: '8px', fontSize: '0.95rem' }}>
                    📍 Deux bureaux permanents à votre service :
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                    • <strong>Burkina Faso (Ouagadougou) :</strong> Réception des dossiers, coordination locale et assistance visa.<br />
                    • <strong>Turquie (Istanbul & Bolu) :</strong> Accueil sur place, transfert, suivi hospitalier et accompagnement des familles.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: PATIENT JOURNEY / 5 STEPS */}
        <section style={{ padding: '80px 0', background: '#0d1527', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px' }}>
              <span
                style={{
                  color: '#38bdf8',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  display: 'block',
                  marginBottom: '10px',
                }}
              >
                Protocole d’Accompagnement
              </span>
              <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: '#fff' }}>
                Le Parcours du Patient en 5 Étapes
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px' }}>
              {steps.map((st) => (
                <div
                  key={st.num}
                  style={{
                    background: '#111a2e',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '14px',
                    padding: '26px 20px',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: 800,
                      color: 'rgba(56, 189, 248, 0.35)',
                      fontFamily: 'var(--font-serif)',
                      marginBottom: '12px',
                    }}
                  >
                    {st.num}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '10px', lineHeight: '1.3' }}>
                    {st.title}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6' }}>{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: MEDICAL SPECIALTIES */}
        <section style={{ padding: '80px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px' }}>
              <span
                style={{
                  color: '#38bdf8',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  display: 'block',
                  marginBottom: '10px',
                }}
              >
                Pôles d’Expertise Médicale
              </span>
              <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: '#fff' }}>
                Spécialités Couvertes en Turquie
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {specialties.map((sp) => (
                <div
                  key={sp.id}
                  style={{
                    background: '#111a2e',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '14px',
                    padding: '24px',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '14px' }}>{sp.icon}</div>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '8px' }}>{sp.title}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.86rem', lineHeight: '1.6' }}>{sp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: THE TEAM (FROM DOCUMENT) */}
        <section style={{ padding: '80px 0', background: '#0d1527', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 50px' }}>
              <span
                style={{
                  color: '#38bdf8',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  display: 'block',
                  marginBottom: '10px',
                }}
              >
                Une Équipe Dédiée & Qualifiée
              </span>
              <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: '#fff', marginBottom: '14px' }}>
                La Coordination MEDI-TOUR ASSISTANCE
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                Des professionnelles de la santé et des relations internationales engagées pour la qualité et la continuité des soins.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '26px' }}>
              {team.map((member) => (
                <div
                  key={member.name}
                  style={{
                    background: '#111a2e',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div
                        style={{
                          background: 'rgba(56, 189, 248, 0.15)',
                          color: '#38bdf8',
                          padding: '10px',
                          borderRadius: '10px',
                        }}
                      >
                        <UserCheck size={24} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>{member.name}</h3>
                        <span style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 600 }}>{member.role}</span>
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        color: '#cbd5e1',
                        marginBottom: '16px',
                        display: 'inline-block',
                      }}
                    >
                      🎓 {member.badge}
                    </div>

                    <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '20px' }}>
                      {member.desc}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>
                      📍 Résidence & Opérations : <strong style={{ color: '#cbd5e1' }}>{member.location}</strong>
                    </div>
                    <a
                      href={`https://wa.me/${member.whatsapp}?text=Bonjour%20${member.name},%20je%20vous%20contacte%20concernant%20un%20dossier%20médical%20Medi-Tour`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        borderColor: '#22c55e',
                        color: '#4ade80',
                        background: 'rgba(34, 197, 94, 0.06)',
                      }}
                    >
                      <MessageCircle size={15} /> Contacter {member.name.split(' ')[0]} ({member.phone})
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: MEDICAL INQUIRY FORM */}
        <section id="demande-devis" style={{ padding: '90px 0' }}>
          <div className="container">
            <div style={{ maxWidth: '780px', margin: '0 auto' }}>
              <div
                style={{
                  background: 'linear-gradient(145deg, #111a2e, #0c1424)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '20px',
                  padding: '40px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                }}
              >
                {success ? (
                  <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                    <CheckCircle2 size={64} style={{ color: '#22c55e', margin: '0 auto 16px' }} />
                    <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '12px' }}>
                      Dossier Médical Reçu avec Succès !
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '28px' }}>
                      La coordination <strong>MEDI-TOUR ASSISTANCE</strong> a bien enregistré votre demande. Notre équipe médicale et nos médecins correspondants en Turquie étudient les éléments et vous recontacteront sous <strong>24 à 48 heures</strong>.
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
                          subject: 'Demande d’évaluation médicale & Évacuation Sanitaire (Medi-Tour)',
                          categorySlug: 'sante',
                          specialty: 'oncologie',
                          message: '',
                        });
                      }}
                      className="btn btn-gold"
                    >
                      Soumettre une autre demande
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                      <span
                        style={{
                          color: '#38bdf8',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '1.5px',
                        }}
                      >
                        Formulaire d’évaluation
                      </span>
                      <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: '#fff', marginTop: '6px' }}>
                        Demander un Devis & Avis Médical
                      </h2>
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        Confidentialité médicale garantie à 100%. Réponse rapide de nos spécialistes.
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
                          <label className="form-label">Nom & Prénom du Patient / Demandeur *</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            placeholder="ex: Jean Ouédraogo"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Email de contact *</label>
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
                          <label className="form-label">Téléphone / WhatsApp (Important pour urgences) *</label>
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
                          <label className="form-label">Pays de résidence du Patient *</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            placeholder="Burkina Faso, Côte d’Ivoire, Sénégal..."
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label className="form-label">Spécialité Médicale Concernée *</label>
                        <select
                          className="form-select"
                          value={formData.specialty}
                          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        >
                          <option value="oncologie">Oncologie & Cancérologie (Tumeurs, Chimiothérapie)</option>
                          <option value="cardiologie">Cardiologie & Chirurgie Cardiovasculaire</option>
                          <option value="orthopedie">Orthopédie & Chirurgie du Rachis / Prothèses</option>
                          <option value="pma">PMA & Traitement de la Fertilité (FIV)</option>
                          <option value="neurochirurgie">Neurochirurgie & Cerveau</option>
                          <option value="greffe">Greffe d’Organe (Foie, Rein, Moelle)</option>
                          <option value="ophtalmologie">Ophtalmologie & Chirurgie des Yeux</option>
                          <option value="checkup">Bilan Général & Check-Up Santé VIP</option>
                          <option value="autre">Autre spécialité médicale</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label className="form-label">
                          Description de l’état de santé, diagnostic actuel et besoins *
                        </label>
                        <textarea
                          required
                          rows={4}
                          className="form-textarea"
                          placeholder="Décrivez les symptômes, le diagnostic posé par le médecin local, les traitements antérieurs et si une évacuation d’urgence ou assistance ambulance est requise..."
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
                            Transmission sécurisée du dossier...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Transmettre ma Demande Médicale Confidentielle
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
      </main>

      <WhatsAppButton />
      <Footer />
    </>
  );
}
