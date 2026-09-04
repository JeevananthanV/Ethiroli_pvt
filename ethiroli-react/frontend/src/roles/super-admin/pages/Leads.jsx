import React, { useEffect, useState, useMemo } from 'react';
import { getLeads, updateLeadStatus } from '../../../services/api/leadApi.js';

const STATUSES = ['new', 'contacted', 'proposal', 'closed'];
const STATUS_LABELS = { new: 'New', contacted: 'Contacted', proposal: 'Proposal', closed: 'Closed' };

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeads();
      setLeads(data?.data || data || []);
    } catch (err) {
      console.error('Failed to fetch leads', err);
      setError('Failed to load leads. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const grouped = useMemo(() => {
    const map = {};
    STATUSES.forEach(s => (map[s] = []));
    (leads || []).forEach(lead => {
      const key = lead.status || lead.stage || 'new';
      if (map[key]) map[key].push(lead);
      else map.new.push(lead);
    });
    return map;
  }, [leads]);

  const openStatusModal = (lead) => {
    setSelectedLead(lead);
    setNewStatus(lead.status || lead.stage || 'new');
    setShowModal(true);
  };

  const handleStatusSave = async () => {
    if (!selectedLead || !newStatus) return;
    setSaving(true);
    try {
      await updateLeadStatus(selectedLead.id, newStatus);
      setLeads(prev => prev.map(l => (l.id === selectedLead.id ? { ...l, status: newStatus } : l)));
      setShowModal(false);
    } catch (err) {
      console.error('Failed to update lead status', err);
      alert('Failed to update lead status.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading leads...</div>;
  if (error) return <div className="emptyState">{error}</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Sales Pipeline Manager (CRM)</h1>
          <p className="pageSubtitle">Monitor incoming customer queries, follow-up calls, and conversion ratios.</p>
        </div>
        <div className="pageActions">
          <button className="btn btnPrimary" onClick={fetchLeads}>Refresh</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {STATUSES.map(status => {
          const items = grouped[status] || [];
          return (
            <div key={status} className="card" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
              <div className="cardHeader" style={{ borderBottom: '1px solid var(--admin-border-subtle)', paddingBottom: '10px', marginBottom: '14px' }}>
                <h3 className="cardTitle" style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>
                  {STATUS_LABELS[status]} ({items.length})
                </h3>
                <span className="statusTag pending">Active</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {items.length === 0 && <div className="emptyState">No leads</div>}
                {items.map(item => (
                  <div key={item.id} className="card" style={{ padding: '12px', background: 'var(--admin-bg-card-hover)', border: '1px solid var(--admin-border-subtle)', borderRadius: '10px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>{item.name || item.full_name || 'Lead'}</h4>
                    <p style={{ fontSize: '12px', margin: '4px 0 8px 0', color: 'var(--admin-text-muted)' }}>{item.course || item.course_name || '-'}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--admin-primary)' }}>{item.budget || item.budget_range || '-'}</span>
                      <button className="btn btnSecondary" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => openStatusModal(item)}>Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modalOverlay" onClick={() => setShowModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Update Lead Status</h3>
            <p>Lead: <strong>{selectedLead?.name || selectedLead?.full_name}</strong></p>
            <div className="formGroup">
              <label className="label">Status</label>
              <select className="select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button className="btn btnSecondary" onClick={() => setShowModal(false)} disabled={saving}>Cancel</button>
              <button className="btn btnPrimary" onClick={handleStatusSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
