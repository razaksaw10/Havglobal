'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  KeyRound,
  User,
  Server,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import AdminLayout from '../../../components/AdminLayout';
import { api } from '../../../lib/api';

export default function AdminSettingsPage() {
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loadingPass, setLoadingPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getMe()
      .then((res) => setAdminProfile(res.admin))
      .catch((err) => console.error('Error fetching me:', err));
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSuccess(null);
    setPassError(null);

    if (newPassword !== confirmPassword) {
      setPassError('Le nouveau mot de passe et sa confirmation ne correspondent pas.');
      return;
    }

    setLoadingPass(true);
    try {
      const res = await api.changePassword(currentPassword, newPassword);
      setPassSuccess(res.message || 'Mot de passe modifié avec succès.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassError(err.message || 'Erreur lors du changement de mot de passe.');
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '4px' }}>
          Paramètres & Sécurité
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          Gérez votre profil administrateur, vos identifiants et consultez la configuration de l&apos;API.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
        {/* Profile and System Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Admin Profile */}
          <div
            style={{
              background: '#111a2e',
              border: '1px solid #1e293b',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(217, 119, 6, 0.2)',
                  color: 'var(--gold-400)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User size={22} />
              </div>
              <div>
                <strong style={{ color: '#fff', fontSize: '1.05rem', display: 'block' }}>
                  {adminProfile?.name || 'Administrateur'}
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--gold-400)', textTransform: 'uppercase' }}>
                  Rôle : {adminProfile?.role || 'super_admin'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1a243a', paddingBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Email Administrateur :</span>
                <strong style={{ color: '#fff' }}>{adminProfile?.email}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1a243a', paddingBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Statut du Compte :</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>Actif & Vérifié ✅</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Authentification :</span>
                <span style={{ color: '#cbd5e1' }}>JWT (JSON Web Token)</span>
              </div>
            </div>
          </div>

          {/* System & Architecture Info */}
          <div
            style={{
              background: '#111a2e',
              border: '1px solid #1e293b',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Server size={20} style={{ color: 'var(--gold-400)' }} />
              <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>
                Architecture Système
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1a243a', paddingBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Backend API :</span>
                <strong style={{ color: '#fff' }}>NestJS v10 (TypeScript)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1a243a', paddingBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Frontend App :</span>
                <strong style={{ color: '#fff' }}>Next.js 14 (App Router)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1a243a', paddingBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Base de Données ORM :</span>
                <strong style={{ color: '#fff' }}>Prisma Client</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                <span style={{ color: '#94a3b8' }}>Documentation API Swagger :</span>
                <a
                  href="http://localhost:3001/api/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--gold-400)', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Ouvrir Swagger ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div
          style={{
            background: '#111a2e',
            border: '1px solid #1e293b',
            borderRadius: 'var(--radius-md)',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <KeyRound size={20} style={{ color: 'var(--gold-400)' }} />
            <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>
              Modifier le Mot de Passe
            </h3>
          </div>

          {passSuccess && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '16px',
                fontSize: '0.85rem',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{passSuccess}</span>
            </div>
          )}

          {passError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '16px',
                fontSize: '0.85rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{passError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>
                Mot de passe actuel
              </label>
              <input
                type="password"
                required
                className="form-input"
                style={{ background: '#131d33', borderColor: '#1e293b', color: '#fff' }}
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>
                Nouveau mot de passe
              </label>
              <input
                type="password"
                required
                minLength={6}
                className="form-input"
                style={{ background: '#131d33', borderColor: '#1e293b', color: '#fff' }}
                placeholder="Au moins 6 caractères"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ color: '#cbd5e1' }}>
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                required
                minLength={6}
                className="form-input"
                style={{ background: '#131d33', borderColor: '#1e293b', color: '#fff' }}
                placeholder="Répétez le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loadingPass}
              className="btn btn-gold"
              style={{ width: '100%', padding: '12px' }}
            >
              {loadingPass ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Mise à jour en cours...
                </>
              ) : (
                'Mettre à jour le mot de passe'
              )}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
