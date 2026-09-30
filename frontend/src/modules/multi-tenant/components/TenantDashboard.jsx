import React, { useState, useEffect } from 'react';
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { tenantApi } from '../../services/api/tenantApi'

export default function TenantDashboard() {
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState(null)
  const [form, setForm] = useState({
    name: '',
    domain: '',
    plan: 'basic',
    status: 'active',
  })

  useEffect(() => {
    loadTenants()
  }, [])

  const loadTenants = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await tenantApi.getAll()
      setTenants(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingTenant(null)
    setForm({ name: '', domain: '', plan: 'basic', status: 'active' })
    setModalOpen(true)
  }

  const handleEdit = (tenant) => {
    setEditingTenant(tenant)
    setForm({
      name: tenant.name || '',
      domain: tenant.domain || '',
      plan: tenant.plan || 'basic',
      status: tenant.status || 'active',
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      if (editingTenant) {
        await tenantApi.update(editingTenant.id, form)
        setTenants(tenants.map((t) => (t.id === editingTenant.id ? { ...t, ...form } : t)))
      } else {
        const data = await tenantApi.create(form)
        setTenants([...tenants, data])
      }
      setModalOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AdminPage
      title="Tenant Dashboard"
      subtitle="Manage tenants and view usage statistics"
      loading={loading}
      error={error}
      onRetry={loadTenants}
      actions={
        <Button variant="primary" onClick={handleCreate}>
          Add Tenant
        </Button>
      }
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Total Tenants</div>
          <div className="statValue">{tenants.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Active</div>
          <div className="statValue textSuccess">{tenants.filter((t) => t.status === 'active').length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Inactive</div>
          <div className="statValue textWarning">{tenants.filter((t) => t.status !== 'active').length}</div>
        </div>
      </div>

      <div className="card">
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Domain</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No tenants found</span>
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant.id}>
                    <td>{tenant.name}</td>
                    <td>{tenant.domain}</td>
                    <td>{tenant.plan}</td>
                    <td>
                      <span className={`statusTag ${tenant.status === 'active' ? 'active' : 'pending'}`}>
                        {tenant.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button size="small" variant="secondary" onClick={() => handleEdit(tenant)}>
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingTenant ? 'Edit Tenant' : 'Add Tenant'}>
        <div className="form">
          <div className="formGroup">
            <label className="label required">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tenant name" />
          </div>
          <div className="formGroup">
            <label className="label required">Domain</label>
            <Input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="example.com" />
          </div>
          <div className="formGroup">
            <label className="label">Plan</label>
            <select className="select" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          <div className="formGroup">
            <label className="label">Status</label>
            <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingTenant ? 'Update' : 'Add'}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminPage>
  )
}
