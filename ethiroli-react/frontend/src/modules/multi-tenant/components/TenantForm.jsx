import React, { useState, useEffect, useCallback } from 'react';
import { createTenant, updateTenant, getTenant } from '../../services/api/tenantApi';
import Modal from '../../common/components/Modal/Modal.jsx';
import Input from '../../common/components/Input/Input.jsx';
import Button from '../../common/components/Button/Button.jsx';

const TenantForm = ({ tenantId, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    plan: 'basic',
    status: 'active',
    settings: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const loadTenant = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTenant(tenantId);
      setFormData({
        name: data.name || '',
        domain: data.domain || '',
        plan: data.plan || 'basic',
        status: data.status || 'active',
        settings: data.settings || {},
      });
      setIsEdit(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    if (tenantId) {
      loadTenant();
    }
  }, [tenantId, loadTenant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let result;
      if (isEdit) {
        result = await updateTenant(tenantId, formData);
      } else {
        result = await createTenant(formData);
      }
      if (onSave) onSave(result);
      alert(isEdit ? 'Tenant updated successfully' : 'Tenant created successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={() => {}} title={isEdit ? 'Edit Tenant' : 'Create Tenant'}>
      <form onSubmit={handleSubmit}>
        {error && <div className="emptyState" style={{ padding: '12px', marginBottom: '12px' }}><p className="textDanger">{error}</p></div>}
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
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default TenantForm;
