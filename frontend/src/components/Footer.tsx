'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, Globe, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1 */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src="/file/HAVA GLOBAL TRADİNG.png"
                alt="HAVA Global Trade"
                style={{ height: '42px', filter: 'brightness(1.2)' }}
              />
              <div>
                <strong style={{ display: 'block', color: '#fff', fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>
                  HAVA Global
                </strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--gold-400)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Trade & Sourcing
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '20px' }}>
              Partenaire stratégique d&apos;import-export basé à Istanbul. Nous connectons les importateurs et distributeurs internationaux aux meilleurs fabricants industriels de Turquie.
            </p>
            <div style={{ display: 'flex', gap: '10px', fontSize: '0.82rem', color: 'var(--gold-400)' }}>
              <span>⭐ Contrôle Qualité 100%</span> · <span>🌍 45+ Pays Livrés</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="footer-col">
            <h4>Secteurs d&apos;Export</h4>
            <ul className="footer-links">
              <li><Link href="/catalogue?category=textile">Textile & Confection</Link></li>
              <li><Link href="/catalogue?category=mobilier">Mobilier & Agencement</Link></li>
              <li><Link href="/catalogue?category=sante">Santé & Cosmétiques</Link></li>
              <li><Link href="/catalogue?category=alimentaire">Agroalimentaire & Terroir</Link></li>
              <li><Link href="/catalogue">Catalogue Général</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="footer-col">
            <h4>Services B2B</h4>
            <ul className="footer-links">
              <li><Link href="/services">Sourcing Industriel</Link></li>
              <li><Link href="/services">Audit d&apos;Usine & Contrôle</Link></li>
              <li><Link href="/services">Fret Maritime & Aérien</Link></li>
              <li><Link href="/services">Incoterms (FOB, CIF, DDP)</Link></li>
              <li><Link href="/engagements">Nos Engagements & RSE</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="footer-col">
            <h4>Bureau d&apos;Istanbul</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ color: 'var(--gold-400)', flexShrink: 0, marginTop: '2px' }} />
                <span>Istanbul, Turquie (Export Hub Mondial)</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={18} style={{ color: 'var(--gold-400)', flexShrink: 0 }} />
                <span>+90 543 173 61 73</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={18} style={{ color: 'var(--gold-400)', flexShrink: 0 }} />
                <span>havaglobaltrade@gmail.com</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Globe size={18} style={{ color: 'var(--gold-400)', flexShrink: 0 }} />
                <span>www.havaglobal.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} HAVA Global Trade. Tous droits réservés.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/admin/login" style={{ color: 'var(--slate-400)' }}>
              Accès Collaborateur / Admin 🔒
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
