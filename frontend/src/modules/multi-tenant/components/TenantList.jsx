import React, { useState, useEffect } from 'react';
import { getTenants, createTenant, updateTenant, deleteTenant } from '../../services/api/tenantApi';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import Modal from '../../common/components/Modal/Modal.jsx';
import Input from '../../common/components/Input/Input.jsx';
import Button from '../../common/components/Button/Button.jsx';

const TenantList = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    plan: 'basic',
    status: 'active',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTenants();
      setTenants(data.tenants || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingTenant(null);
    setFormData({ name: '', domain: '', plan: 'basic', status: 'active' });
    setShowModal(true);
  };

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    setFormData({
      name: tenant.name || '',
      domain: tenant.domain || '',
      plan: tenant.plan || 'basic',
      status: tenant.status || 'active',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tenant?')) return;
    try {
      await deleteTenant(id);
      setTenants(tenants.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingTenant) {
        const updated = await updateTenant(editingTenant.id, formData);
        setTenants(tenants.map(t => t.id === editingTenant.id ? updated : t));
      } else {
        const created = await createTenant(formData);
        setTenants([...tenants, created]);
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

  if (loading) return <div className="loading">Loading tenants...</div>;
  if (error) return <div className="emptyState"><h3>Error</h3><p>{error}</p><button className="btn primary" onClick={loadTenants}>Retry</button></div>;

  return (
    <AdminPage
      title="Tenants"
      subtitle="Manage tenant accounts and settings"
      loading={loading}
      error={error}
      onRetry={loadTenants}
      actions={<button className="btn primary" onClick={handleAdd}>Add Tenant</button>}
    >
      <div className="card">
        <div className="cardBody">
          {tenants.length === 0 ? (
            <div className="emptyState">
              <h3>No tenants found</h3>
              <p>Get started by adding your first tenant.</p>
            </div>
          ) : (
            <div className="overflowAuto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Domain</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => (
                    <tr key={tenant.id}>
                      <td className="textPrimary">{tenant.name}</td>
                      <td className="textSecondary">{tenant.domain}</td>
                      <td className="textSecondary">{tenant.plan || 'Basic'}</td>
                      <td>
                        <span className={`statusTag ${getStatusClass(tenant.status)}`}>
                          {tenant.status || 'Pending'}
                        </span>
                      </td>
                      <td className="textSecondary">{tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : '-'}</td>
                      <td>
                        <div className="pageActions">
                          <button className="btn btnSm secondary" onClick={() => handleEdit(tenant)}>Edit</button>
                          <button className="btn btnSm danger" onClick={() => handleDelete(tenant.id)}>Delete</button>
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
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingTenant ? 'Edit Tenant' : 'Add Tenant'}>
          <form onSubmit={handleSubmit}>
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Domain"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              required
              style={{ marginTop: '12px' }}
            />
            <div className="formGroup" style={{ marginTop: '12px' }}>
              <label className="label">Plan</label>
              <select
                className="select"
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              >
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
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

export default TenantList;
