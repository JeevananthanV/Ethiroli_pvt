import React, { useEffect, useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { createHoliday } from '../../services/api/holidayApi.js';

export default function HolidayForm({ onClose, editingHoliday }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: 'public',
    description: '',
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    if (editingHoliday) {
      setFormData({
        name: editingHoliday.name || '',
        date: editingHoliday.date || '',
        type: editingHoliday.type || 'public',
        description: editingHoliday.description || '',
        year: editingHoliday.year || new Date().getFullYear(),
      });
    } else {
      setFormData({
        name: '',
        date: '',
        type: 'public',
        description: '',
        year: new Date().getFullYear(),
      });
    }
  }, [editingHoliday]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createHoliday(formData);
      onClose?.(true);
    } catch (err) {
      setError(err.message || 'Failed to save holiday');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPage
      title={editingHoliday ? 'Edit Holiday' : 'Add Holiday'}
      subtitle={editingHoliday ? 'Update holiday details' : 'Create a new holiday entry'}
      loading={saving}
      error={error}
    >
      <div className="card" style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="cardHeader"><h3 className="cardTitle">Holiday Details</h3></div>
        <div className="cardBody">
          <form onSubmit={handleSubmit}>
            <div className="formGroup">
              <label className="label required">Holiday Name</label>
              <input
                className="inputField"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="formGroup">
                <label className="label required">Date</label>
                <input
                  className="inputField"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="formGroup">
                <label className="label required">Type</label>
                <select
                  className="select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="public">Public</option>
                  <option value="company">Company</option>
                  <option value="regional">Regional</option>
                  <option value="optional">Optional</option>
                </select>
              </div>
            </div>
            <div className="formGroup">
              <label className="label">Year</label>
              <input
                className="inputField"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value, 10) || new Date().getFullYear() })}
              />
            </div>
            <div className="formGroup">
              <label className="label">Description</label>
              <textarea
                className="textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button type="button" className="btn secondary" onClick={() => onClose?.(false)}>
                Cancel
              </button>
              <button type="submit" className="btn primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Holiday'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminPage>
  );
}
