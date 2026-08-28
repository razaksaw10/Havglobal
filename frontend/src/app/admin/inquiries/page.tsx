'use client';

import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Download,
  Eye,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  Archive,
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  Building,
  Globe,
  Save,
} from 'lucide-react';
import AdminLayout from '../../../components/AdminLayout';
import { api } from '../../../lib/api';
import { Inquiry } from '../../../types';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Detail Modal
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [editStatus, setEditStatus] = useState('new');
  const [editNotes, setEditNotes] = useState('');

  const fetchInquiries = () => {
    setLoading(true);
    api
      .getInquiries({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchTerm.trim() || undefined,
        limit: 100,
      })
      .then((res) => {
        setInquiries(res.inquiries || []);
      })
      .catch((err) => console.error('Error fetching inquiries:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, searchTerm]);

  const handleOpenDetail = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setEditStatus(inq.status);
    setEditNotes(inq.notes || '');
  };

  const handleUpdateStatusAndNotes = async () => {
    if (!selectedInquiry) return;
    setUpdatingStatus(true);

    try {
      const updated = await api.updateInquiryStatus(
        selectedInquiry.id,
        editStatus,
        editNotes,
      );
      setSelectedInquiry(updated);
      fetchInquiries();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la mise à jour.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteInquiry = async (id: number, name: string) => {
    if (!window.confirm(`Confirmez-vous la suppression du devis de ${name} (ID #${id}) ?`)) {
      return;
    }

    try {
      await api.deleteInquiry(id);
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
      fetchInquiries();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression.');
    }
  };

  const handleExportCsv = async () => {
    try {
      const blob = await api.exportInquiriesCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `havaglobal-devis-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l’export CSV.');
    }
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '4px' }}>
            Devis & Messages Clients B2B
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Suivez, traitez et archivez les demandes d&apos;approvisionnement reçues.
          </p>
        </div>
        <button onClick={handleExportCsv} className="btn btn-gold btn-sm">
          <Download size={15} /> Exporter en CSV (Excel)
        </button>
      </div>

      {/* TABS & SEARCH */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Status buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'all', label: 'Tous' },
            { id: 'new', label: 'Nouveaux' },
            { id: 'in_progress', label: 'En cours' },
            { id: 'resolved', label: 'Traités' },
            { id: 'archived', label: 'Archivés' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`btn btn-sm ${statusFilter === tab.id ? 'btn-gold' : 'btn-outline'}`}
              style={{
                borderColor: '#1e293b',
                color: statusFilter === tab.id ? '#fff' : '#94a3b8',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{
              background: '#111a2e',
              borderColor: '#1e293b',
              color: '#fff',
              paddingLeft: '36px',
            }}
            placeholder="Filtrer par société, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="data-table-wrapper">
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--gold-400)' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          </div>
        ) : inquiries.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Aucune demande trouvée pour ce filtre.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Demandeur / Société</th>
                <th>Objet & Secteur</th>
                <th>Pays</th>
                <th>Statut</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq.id}>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', color: '#94a3b8' }}>
                    {new Date(inq.createdAt || inq.created_at || '').toLocaleDateString('fr-FR')}
                  </td>
                  <td>
                    <div>
                      <strong style={{ color: '#fff', fontSize: '0.92rem', display: 'block' }}>
                        {inq.name}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        {inq.company || inq.email}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span style={{ color: '#cbd5e1', fontSize: '0.88rem', display: 'block' }}>
                        {inq.subject}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gold-400)' }}>
                        {inq.category?.name || inq.categorySlug || 'Général'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                      {inq.country || 'Non spécifié'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-status badge-${inq.status}`}>
                      {inq.status === 'new'
                        ? 'Nouveau'
                        : inq.status === 'in_progress'
                        ? 'En cours'
                        : inq.status === 'resolved'
                        ? 'Traité'
                        : 'Archivé'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenDetail(inq)}
                        className="btn btn-outline btn-sm"
                        style={{ borderColor: '#334155', color: 'var(--gold-400)', padding: '5px 8px' }}
                        title="Consulter et traiter"
                      >
                        <Eye size={14} /> Voir
                      </button>
                      <button
                        onClick={() => handleDeleteInquiry(inq.id, inq.name)}
                        className="btn btn-outline btn-sm"
                        style={{ borderColor: '#334155', color: '#ef4444', padding: '5px 8px' }}
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* DETAIL & STATUS MODAL */}
      {selectedInquiry && (
        <div className="modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div
            className="modal-content"
            style={{
              background: '#0d1527',
              color: '#fff',
              border: '1px solid #1e293b',
              maxWidth: '720px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              style={{ background: '#1e293b', color: '#fff' }}
              onClick={() => setSelectedInquiry(null)}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span className={`badge-status badge-${selectedInquiry.status}`}>
                {selectedInquiry.status === 'new'
                  ? 'Nouveau Devis'
                  : selectedInquiry.status === 'in_progress'
                  ? 'En cours de traitement'
                  : selectedInquiry.status === 'resolved'
                  ? 'Devis Validé & Traité'
                  : 'Archivé'}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Reçu le {new Date(selectedInquiry.createdAt || selectedInquiry.created_at || '').toLocaleString('fr-FR')}
              </span>
            </div>

            <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '16px' }}>
              {selectedInquiry.subject}
            </h2>

            {/* INFO GRID */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                background: '#111a2e',
                padding: '16px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '20px',
                fontSize: '0.86rem',
              }}
            >
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Nom du Client
                </span>
                <strong style={{ color: '#fff' }}>{selectedInquiry.name}</strong>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Société & Raison Sociale
                </span>
                <strong style={{ color: '#fff' }}>{selectedInquiry.company || 'Non renseigné'}</strong>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Email
                </span>
                <a href={`mailto:${selectedInquiry.email}`} style={{ color: 'var(--gold-400)' }}>
                  {selectedInquiry.email}
                </a>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Téléphone / WhatsApp
                </span>
                <strong style={{ color: '#fff' }}>{selectedInquiry.phone || 'Non renseigné'}</strong>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Pays de Destination
                </span>
                <strong style={{ color: '#fff' }}>{selectedInquiry.country || 'Non renseigné'}</strong>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Secteur Industriel
                </span>
                <strong style={{ color: '#fff' }}>
                  {selectedInquiry.category?.name || selectedInquiry.categorySlug || 'Général'}
                </strong>
              </div>
            </div>

            {/* MESSAGE */}
            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ color: '#cbd5e1' }}>
                Message & Demande du Client :
              </label>
              <div
                style={{
                  background: '#131d33',
                  border: '1px solid #1e293b',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  color: '#cbd5e1',
                  fontSize: '0.92rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedInquiry.message}
              </div>
            </div>

            {/* STATUS & NOTES FORM */}
            <div style={{ background: '#111a2e', padding: '18px', borderRadius: 'var(--radius-sm)', border: '1px solid #1e293b' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '12px' }}>
                Gestion Interne du Dossier
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="form-label" style={{ color: '#cbd5e1' }}>
                    Changer le statut
                  </label>
                  <select
                    className="form-select"
                    style={{ background: '#131d33', borderColor: '#1e293b', color: '#fff' }}
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="new">Nouveau</option>
                    <option value="in_progress">En cours de traitement</option>
                    <option value="resolved">Traité / Devis envoyé</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ color: '#cbd5e1' }}>
                    Notes internes (visible uniquement par l&apos;équipe)
                  </label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    style={{ background: '#131d33', borderColor: '#1e293b', color: '#fff' }}
                    placeholder="ex: Proforma envoyée le 14/03, négociation fret maritime en cours..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleUpdateStatusAndNotes}
                  disabled={updatingStatus}
                  className="btn btn-gold btn-sm"
                >
                  {updatingStatus ? 'Enregistrement...' : <><Save size={14} /> Mettre à jour le dossier</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
