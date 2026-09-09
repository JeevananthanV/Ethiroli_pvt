import React, { useEffect, useState, useCallback, useRef } from 'react';
import { listClients, createClient, updateClient, deleteClient } from '../../../services/api/clientApi.js';

const emptyForm = { name: '', email: '', phone: '', company: '', status: 'active', gstNumber: '' };

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const searchTimerRef = useRef(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listClients({ search: search.trim() || undefined });
      setClients(Array.isArray(data) ? data : data.clients || data.data || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load clients';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      fetchClients();
    }, 400);
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [fetchClients]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateClient(editingId, form);
      } else {
        await createClient(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchClients();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (client) => {
    setForm({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      status: client.status || 'active',
      gstNumber: client.gstNumber || '',
    });
    setEditingId(client.id || client._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) return;
    try {
      await deleteClient(id);
      setClients((prev) => prev.filter((c) => (c.id || c._id) !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete client');
    }
  };

  const startNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleRetry = () => {
    
    fetchClients();
  };

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Clients</h1>
          <p className="pageSubtitle">Manage your client records and subscription accounts</p>
        </div>
        <div className="pageActions">
          <input
            type="text"
            className="inputField"
            placeholder="Search by name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
          />
          <button className="btn primary" onClick={startNew}>+ Add Client</button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="cardHeader">
            <h3 className="cardTitle">{editingId ? 'Edit Client' : 'New Client'}</h3>
            <button type="button" className="btn secondary btnSm" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
          <form onSubmit={handleSubmit} className="form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="formGroup">
                <label className="label">Client Name <span className="required">*</span></label>
                <input
                  className="inputField"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter client name"
                  required
                />
              </div>
              <div className="formGroup">
                <label className="label">Company</label>
                <input
                  className="inputField"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Company name"
                />
              </div>
              <div className="formGroup">
                <label className="label">Email <span className="required">*</span></label>
                <input
                  className="inputField"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="client@example.com"
                  required
                />
              </div>
              <div className="formGroup">
                <label className="label">Phone</label>
                <input
                  className="inputField"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="formGroup">
                <label className="label">GST Number</label>
                <input
                  className="inputField"
                  value={form.gstNumber}
                  onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
              <div className="formGroup">
                <label className="label">Status</label>
                <select
                  className="select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button type="submit" className="btn primary" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update Client' : 'Create Client'}
              </button>
              <button type="button" className="btn secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {error && (
          <div style={{ marginBottom: 16, padding: 12, borderRadius: 10, background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--admin-danger)', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{error}</span>
            <button className="btn secondary btnSm" onClick={handleRetry}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }}></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 8 }}></div>
              <div className="skeleton" style={{ width: '40%', height: 12 }}></div>
            </div>
          </div>
        ) : clients.length === 0 ? (
          <div className="emptyState">
            <h3>No Clients Found</h3>
            <p>{search ? 'No clients match your search. Try different keywords.' : 'Add your first client to get started with subscriptions and invoicing.'}</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>GST No.</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id || client._id}>
                  <td style={{ fontWeight: 600 }}>{client.name}</td>
                  <td>{client.company || '—'}</td>
                  <td>{client.email}</td>
                  <td>{client.phone || '—'}</td>
                  <td>{client.gstNumber || '—'}</td>
                  <td>
                    <span className={`statusTag ${client.status || 'active'}`}>
                      {client.status || 'active'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn secondary btnSm" onClick={() => handleEdit(client)}>Edit</button>
                      <button className="btn danger btnSm" onClick={() => handleDelete(client.id || client._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
