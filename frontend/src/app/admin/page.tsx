'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Inbox,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Shield,
  Layers,
  Loader2,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../lib/api';
import { DashboardStats } from '../../types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    api
      .getDashboardStats()
      .then((res) => {
        setStats(res);
      })
      .catch((err) => {
        console.error('Error fetching dashboard stats:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      {/* TOP HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '4px' }}>
            Tableau de Bord
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Aperçu des performances B2B, stocks et demandes de devis reçues.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="btn btn-outline btn-sm"
          style={{ borderColor: '#334155', color: '#cbd5e1' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualiser
        </button>
      </div>

      {loading && !stats ? (
        <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--gold-400)' }}>
          <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
        </div>
      ) : stats ? (
        <>
          {/* KPI CARDS */}
          <div className="kpi-grid">
            <div className="kpi-card" style={{ borderLeftColor: 'var(--gold-500)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gold-400)' }}>
                <Package size={20} />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Catalogue</span>
              </div>
              <div className="kpi-val">{stats.kpis.totalProducts}</div>
              <div className="kpi-title">Références au Catalogue</div>
            </div>

            <div className="kpi-card" style={{ borderLeftColor: '#3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#60a5fa' }}>
                <Inbox size={20} />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Global</span>
              </div>
              <div className="kpi-val">{stats.kpis.totalInquiries}</div>
              <div className="kpi-title">Demandes de Devis Totales</div>
            </div>

            <div className="kpi-card" style={{ borderLeftColor: '#ef4444' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f87171' }}>
                <AlertCircle size={20} />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>À traiter</span>
              </div>
              <div className="kpi-val">{stats.kpis.newInquiries}</div>
              <div className="kpi-title">Nouveaux Devis en Attente</div>
            </div>

            <div className="kpi-card" style={{ borderLeftColor: '#10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                <Layers size={20} />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Actifs</span>
              </div>
              <div className="kpi-val">{stats.kpis.totalCategories}</div>
              <div className="kpi-title">Secteurs Industriels</div>
            </div>
          </div>

          {/* TWO COLUMNS: CATEGORY DISTRIBUTION & RECENT INQUIRIES */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', marginBottom: '28px' }}>
            {/* Category distribution */}
            <div
              style={{
                background: '#111a2e',
                border: '1px solid #1e293b',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
              }}
            >
              <h3 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '18px' }}>
                Répartition des Références par Secteur
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {stats.categoryDistribution.map((cat) => (
                  <div key={cat.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ color: '#cbd5e1' }}>
                        {cat.icon} {cat.name}
                      </span>
                      <strong style={{ color: '#fff' }}>{cat.count} produits</strong>
                    </div>
                    <div style={{ background: '#1e293b', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          background: 'linear-gradient(90deg, var(--gold-500), var(--gold-400))',
                          height: '100%',
                          width: `${Math.min(100, (cat.count / (stats.kpis.totalProducts || 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent inquiries */}
            <div
              style={{
                background: '#111a2e',
                border: '1px solid #1e293b',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>
                  Dernières Demandes de Devis B2B
                </h3>
                <Link
                  href="/admin/inquiries"
                  style={{ color: 'var(--gold-400)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Voir tout <ArrowUpRight size={14} />
                </Link>
              </div>

              {stats.recentInquiries.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '0.88rem' }}>
                  Aucune demande récente.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {stats.recentInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      style={{
                        background: '#0d1527',
                        border: '1px solid #1a243a',
                        borderRadius: 'var(--radius-sm)',
                        padding: '12px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong style={{ color: '#fff', fontSize: '0.92rem', display: 'block' }}>
                          {inq.name} {inq.company ? `(${inq.company})` : ''}
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          {inq.subject}
                        </span>
                      </div>
                      <div>
                        <span className={`badge-status badge-${inq.status}`}>
                          {inq.status === 'new'
                            ? 'Nouveau'
                            : inq.status === 'in_progress'
                            ? 'En cours'
                            : inq.status === 'resolved'
                            ? 'Traité'
                            : 'Archivé'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RECENT ACTIVITY LOGS */}
          <div
            style={{
              background: '#111a2e',
              border: '1px solid #1e293b',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '16px' }}>
              Journal d&apos;Activité & Sécurité
            </h3>
            {stats.recentActivities.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                Aucune activité enregistrée.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {stats.recentActivities.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      borderBottom: '1px solid #1a243a',
                      paddingBottom: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={14} style={{ color: 'var(--gold-400)' }} />
                      <span style={{ color: '#fff', fontWeight: 600 }}>{log.action}</span>
                      <span style={{ color: '#94a3b8' }}>— {log.details}</span>
                    </div>
                    <span style={{ color: '#64748b' }}>
                      {new Date(log.createdAt).toLocaleString('fr-FR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </AdminLayout>
  );
}
