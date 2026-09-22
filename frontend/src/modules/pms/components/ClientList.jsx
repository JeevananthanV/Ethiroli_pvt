import React, { useState, useEffect } from 'react';
import { getClients, createClient, updateClient, deleteClient } from '../../services/api/clientApi';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import Modal from '../../common/components/Modal/Modal.jsx';
import Input from '../../common/components/Input/Input.jsx';
import Button from '../../common/components/Button/Button.jsx';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'active',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClients();
      setClients(data.clients || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingClient(null);
    setFormData({ name: '', email: '', phone: '', company: '', status: 'active' });
    setShowModal(true);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      status: client.status || 'active',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    try {
      await deleteClient(id);
      setClients(clients.filter(c => c.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingClient) {
        const updated = await updateClient(editingClient.id, formData);
        setClients(clients.map(c => c.id === editingClient.id ? updated : c));
      } else {
        const created = await createClient(formData);
        setClients([...clients, created]);
      }
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusClass = (status) => {
    if (!status) return 'pending';
    const lower = status.toLowerCase();
    if (lower === 'active') return 'active';
    if (lower === 'inactive') return 'inactive';
    return 'pending';
  };

  if (loading) return <div className="loading">Loading clients...</div>;
  if (error) return <div className="emptyState"><h3>Error</h3><p>{error}</p><button className="btn primary" onClick={loadClients}>Retry</button></div>;

  return (
    <AdminPage
      title="Clients"
      subtitle="Manage client accounts"
      loading={loading}
      error={error}
      onRetry={loadClients}
      actions={<button className="btn primary" onClick={handleAdd}>Add Client</button>}
    >
      <div className="card">
        <div className="cardBody">
          {clients.length === 0 ? (
            <div className="emptyState">
              <h3>No clients found</h3>
              <p>Get started by adding your first client.</p>
            </div>
          ) : (
            <div className="overflowAuto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td className="textPrimary">{client.name}</td>
                      <td className="textSecondary">{client.email}</td>
                      <td className="textSecondary">{client.phone || '-'}</td>
                      <td className="textSecondary">{client.company || '-'}</td>
                      <td>
                        <span className={`statusTag ${getStatusClass(client.status)}`}>
                          {client.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="pageActions">
                          <button className="btn btnSm secondary" onClick={() => handleEdit(client)}>Edit</button>
                          <button className="btn btnSm danger" onClick={() => handleDelete(client.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingClient ? 'Edit Client' : 'Add Client'}>
          <form onSubmit={handleSubmit}>
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{ marginTop: '12px' }}
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{ marginTop: '12px' }}
            />
            <Input
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              style={{ marginTop: '12px' }}
            />
            <div className="formGroup" style={{ marginTop: '12px' }}>
              <label className="label">Status</label>
              <select
                className="select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="pageActions" style={{ marginTop: '16px' }}>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </AdminPage>
  );
};

export default ClientList;
