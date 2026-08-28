'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Shield, Phone, ArrowRight, MessageSquare, Package, Globe2 } from 'lucide-react';

export default function Navbar({ onOpenQuote }: { onOpenQuote?: () => void }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  // Hide public navbar on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/catalogue', label: 'Catalogue Produits' },
    { href: '/services', label: 'Services & Sourcing' },
    { href: '/engagements', label: 'Nos Engagements' },
    { href: '/contact', label: 'Contact & Devis' },
  ];

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-inner">
            {/* BRAND LOGO */}
            <Link href="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
              <img
                src="/file/HAVA GLOBAL TRADİNG.png"
                alt="HAVA Global Trade"
              />
              <div className="brand-info">
                <span className="brand-name">HAVA Global</span>
                <span className="brand-tag">Istanbul · Export</span>
              </div>
            </Link>

            {/* DESKTOP NAV LINKS */}
            <nav className="nav-menu desktop-only">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${pathname === item.href ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* DESKTOP ACTIONS */}
            <div className="nav-actions desktop-only">
              {onOpenQuote ? (
                <button onClick={onOpenQuote} className="btn btn-gold btn-sm">
                  Demander un Devis
                </button>
              ) : (
                <Link href="/contact" className="btn btn-gold btn-sm">
                  Demander un Devis
                </Link>
              )}
              <Link
                href="/admin/login"
                className="btn btn-outline btn-sm"
                title="Espace Administrateur"
              >
                <Shield size={14} /> Admin
              </Link>
            </div>

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-DOWN DRAWER */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="brand-info">
                <span className="brand-name" style={{ fontSize: '1.15rem' }}>HAVA Global Trade</span>
                <span className="brand-tag">Portail B2B Export</span>
              </div>
              <button
                className="mobile-drawer-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mobile-nav-list">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mobile-nav-link ${pathname === item.href ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  <ArrowRight size={16} className="arrow-icon" />
                </Link>
              ))}
            </nav>

            <div className="mobile-drawer-actions">
              {onOpenQuote ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuote();
                  }}
                  className="btn btn-gold"
                  style={{ width: '100%', padding: '14px', justifyContent: 'center' }}
                >
                  <MessageSquare size={16} /> Demander un Devis Gratuit
                </button>
              ) : (
                <Link
                  href="/contact"
                  className="btn btn-gold"
                  style={{ width: '100%', padding: '14px', justifyContent: 'center' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageSquare size={16} /> Demander un Devis Gratuit
                </Link>
              )}

              <Link
                href="/admin/login"
                className="btn btn-outline"
                style={{ width: '100%', padding: '12px', justifyContent: 'center', borderColor: 'var(--navy-700)', color: 'var(--navy-950)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield size={16} /> Espace Administrateur
              </Link>
            </div>

            <div className="mobile-drawer-footer">
              <div>📍 Istanbul, Turquie · Export Mondial</div>
              <div>📞 Service Commercial : +90 534 839 21 00</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
