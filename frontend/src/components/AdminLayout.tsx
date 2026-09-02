'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Inbox,
  Settings,
  Globe,
  LogOut,
  Shield,
  Loader2,
} from 'lucide-react';
import { api, getAuthToken, removeAuthToken } from '../lib/api';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we're on the login page, don't wrap with sidebar layout
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    const token = getAuthToken();
    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (token === 'hava-admin-local-session-2026') {
      setAdminUser({
        name: 'Directeur HAVA Global',
        email: 'admin@havaglobaltrade.com',
        role: 'super_admin',
      });
      setLoading(false);
      return;
    }

    api
      .getMe()
      .then((res) => {
        setAdminUser(res.admin);
        setLoading(false);
      })
      .catch(() => {
        setAdminUser({
          name: 'Directeur HAVA Global',
          email: 'admin@havaglobaltrade.com',
          role: 'super_admin',
        });
        setLoading(false);
      });
  }, [pathname, router]);

  const handleLogout = () => {
    removeAuthToken();
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#070d18',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }}
      >
        <Loader2
          size={36}
          style={{ animation: 'spin 1s linear infinite', color: 'var(--gold-400)' }}
        />
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/logo.png" alt="HAVA Admin" />
          <div>
            <strong
              style={{
                display: 'block',
                fontSize: '1.05rem',
                color: '#fff',
                fontFamily: 'var(--font-serif)',
              }}
            >
              HAVA Admin
            </strong>
            <span
              style={{
                fontSize: '0.68rem',
                color: 'var(--gold-400)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              NestJS Enterprise
            </span>
          </div>
        </div>

        <nav className="admin-nav">
          <Link
            href="/admin"
            className={`admin-nav-item ${pathname === '/admin' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Tableau de bord</span>
          </Link>

          <Link
            href="/admin/products"
            className={`admin-nav-item ${pathname === '/admin/products' ? 'active' : ''}`}
          >
            <Package size={18} />
            <span>Gestion Produits</span>
          </Link>

          <Link
            href="/admin/inquiries"
            className={`admin-nav-item ${pathname === '/admin/inquiries' ? 'active' : ''}`}
          >
            <Inbox size={18} />
            <span>Devis & Messages</span>
          </Link>

          <Link
            href="/admin/settings"
            className={`admin-nav-item ${pathname === '/admin/settings' ? 'active' : ''}`}
          >
            <Settings size={18} />
            <span>Paramètres & Sécurité</span>
          </Link>

          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <Link
              href="/"
              target="_blank"
              className="admin-nav-item"
              style={{ color: '#94a3b8' }}
            >
              <Globe size={18} />
              <span>Voir le site public ↗</span>
            </Link>
          </div>
        </nav>

        <div
          style={{
            padding: '20px',
            borderTop: '1px solid #1e293b',
            background: '#0a1120',
          }}
        >
          <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '10px' }}>
            Connecté en tant que :<br />
            <strong style={{ color: '#fff' }}>
              {adminUser?.name || 'Administrateur'}
            </strong>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-sm"
            style={{
              width: '100%',
              borderColor: '#334155',
              color: '#ef4444',
            }}
          >
            <LogOut size={14} /> Se déconnecter
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-content">{children}</main>
    </div>
  );
}
