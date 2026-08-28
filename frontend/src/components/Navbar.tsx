'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Shield, ChevronDown, Phone, ArrowRight } from 'lucide-react';

export default function Navbar({ onOpenQuote }: { onOpenQuote?: () => void }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide public navbar on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-inner">
          <Link href="/" className="brand-logo">
            <img
              src="/file/HAVA GLOBAL TRADİNG.png"
              alt="HAVA Global Trade"
            />
            <div className="brand-info">
              <span className="brand-name">HAVA Global</span>
              <span className="brand-tag">Istanbul · Export</span>
            </div>
          </Link>

          <nav className="nav-menu">
            <Link
              href="/"
              className={`nav-link ${pathname === '/' ? 'active' : ''}`}
            >
              Accueil
            </Link>
            <Link
              href="/catalogue"
              className={`nav-link ${pathname === '/catalogue' ? 'active' : ''}`}
            >
              Catalogue Produits
            </Link>
            <Link
              href="/services"
              className={`nav-link ${pathname === '/services' ? 'active' : ''}`}
            >
              Services & Sourcing
            </Link>
            <Link
              href="/engagements"
              className={`nav-link ${pathname === '/engagements' ? 'active' : ''}`}
            >
              Nos Engagements
            </Link>
            <Link
              href="/contact"
              className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}
            >
              Contact & Devis
            </Link>
          </nav>

          <div className="nav-actions">
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
            <button
              className="btn btn-outline btn-sm"
              style={{ display: 'none' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu Mobile"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
