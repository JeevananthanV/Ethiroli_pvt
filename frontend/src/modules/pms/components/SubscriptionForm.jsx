import React, { useState, useEffect, useCallback } from 'react';
import { createSubscription, updateSubscription, getSubscription, getSubscriptionPlans, getClients } from '../../services/api/subscriptionApi';
import Modal from '../../common/components/Modal/Modal.jsx';
import Input from '../../common/components/Input/Input.jsx';
import Button from '../../common/components/Button/Button.jsx';

const SubscriptionForm = ({ subscriptionId, onSave }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    planId: '',
    status: 'active',
    startDate: '',
    endDate: '',
  });
  const [clients, setClients] = useState([]);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const loadClientsAndPlans = useCallback(async () => {
    try {
      const [clientsData, plansData] = await Promise.all([
        getClients(),
        getSubscriptionPlans()
      ]);
      setClients(clientsData.clients || clientsData || []);
      setPlans(plansData.plans || plansData || []);
    } catch (err) {
      console.error('Failed to load clients and plans:', err);
    }
  }, []);

  const loadSubscription = useCallback(async () => {
    setError(null);
    try {
      const data = await getSubscription(subscriptionId);
      setFormData({
        clientId: data.clientId || '',
        planId: data.planId || '',
        status: data.status || 'active',
        startDate: data.startDate ? data.startDate.split('T')[0] : '',
        endDate: data.endDate ? data.endDate.split('T')[0] : '',
      });
      setIsEdit(true);
    } catch (err) {
      setError(err.message);
    }
  }, [subscriptionId]);

  useEffect(() => {
    loadClientsAndPlans();
    if (subscriptionId) {
      loadSubscription();
    }
  }, [subscriptionId, loadClientsAndPlans, loadSubscription]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let result;
      if (isEdit) {
        result = await updateSubscription(subscriptionId, formData);
      } else {
        result = await createSubscription(formData);
      }
      if (onSave) onSave(result);
      alert(isEdit ? 'Subscription updated successfully' : 'Subscription created successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={() => {}} title={isEdit ? 'Edit Subscription' : 'Create Subscription'}>
      <form onSubmit={handleSubmit}>
        {error && <div className="emptyState" style={{ padding: '12px', marginBottom: '12px' }}><p className="textDanger">{error}</p></div>}
        <div className="formGroup">
          <label className="label">Client</label>
          <select
            className="select"
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            required
          >
            <option value="">Select a client</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="formGroup" style={{ marginTop: '12px' }}>
          <label className="label">Plan</label>
          <select
            className="select"
            value={formData.planId}
            onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
            required
          >
            <option value="">Select a plan</option>
            {plans.map(p => (
              <option key={p.id} value={p.id}>{p.name} - ${p.price}/mo</option>
            ))}
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
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <Input
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          required
          style={{ marginTop: '12px' }}
        />
        <Input
          label="End Date"
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          style={{ marginTop: '12px' }}
        />
        <div className="pageActions" style={{ marginTop: '16px' }}>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default SubscriptionForm;
