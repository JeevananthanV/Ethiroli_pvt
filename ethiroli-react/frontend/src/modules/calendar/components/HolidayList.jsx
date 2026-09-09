import React, { useEffect, useState, useMemo } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { getHolidays } from '../../services/api/calendarApi.js';
import { createHoliday } from '../../services/api/holidayApi.js';

export default function HolidayList() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const loadHolidays = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHolidays();
      setHolidays(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch holidays');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHolidays();
  }, []);

  const handleEdit = (holiday) => {
    setEditingHoliday(holiday);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingHoliday(null);
    setShowForm(true);
  };

  const handleFormClose = (refreshed) => {
    setShowForm(false);
    setEditingHoliday(null);
    if (refreshed) {
      loadHolidays();
    }
  };

  const filteredHolidays = holidays.filter((h) => {
    if (filterYear && h.year && h.year !== filterYear) return false;
    return true;
  });

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getTypeTag = (type) => {
    const map = {
      public: 'active',
      company: 'info',
      regional: 'pending',
      optional: 'pending',
    };
    const cls = map[type?.toLowerCase()] || 'pending';
    return <span className={`statusTag ${cls}`}>{type || 'N/A'}</span>;
  };

  const years = useMemo(() => {
    const uniqueYears = [...new Set(holidays.map((h) => h.year).filter(Boolean))];
    return uniqueYears.length > 0 ? uniqueYears : [new Date().getFullYear()];
  }, [holidays]);

  return (
    <AdminPage
      title="Holidays"
      subtitle="Manage official holidays and company holidays"
      loading={loading}
      error={error}
      onRetry={loadHolidays}
      actions={
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            className="select"
            value={filterYear}
            onChange={(e) => setFilterYear(parseInt(e.target.value, 10))}
            style={{ minWidth: 120 }}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button className="btn primary" onClick={handleAddNew}>
            + Add Holiday
          </button>
        </div>
      }
    >
      <div className="card">
        {filteredHolidays.length === 0 ? (
          <div className="emptyState">
            <h3>No holidays found</h3>
            <p>Add holidays to manage company time off.</p>
          </div>
        ) : (
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Year</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHolidays.map((holiday) => (
                  <tr key={holiday.id}>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{holiday.name}</td>
                    <td className="textSecondary">{formatDate(holiday.date)}</td>
                    <td>{getTypeTag(holiday.type)}</td>
                    <td className="textSecondary">{holiday.year || '-'}</td>
                    <td className="textSecondary">{holiday.description || '-'}</td>
                    <td>
                      <button
                        className="btn secondary btnSm"
                        onClick={() => handleEdit(holiday)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="modalOverlay" onClick={() => handleFormClose(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3 className="modalTitle">{editingHoliday ? 'Edit Holiday' : 'Add Holiday'}</h3>
              <button className="closeBtn" onClick={() => handleFormClose(false)}>&times;</button>
            </div>
            <div className="modalBody">
              <HolidayFormWrapper
                editingHoliday={editingHoliday}
                onClose={handleFormClose}
              />
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}

function HolidayFormWrapper({ editingHoliday, onClose }) {
  const [saving, setSaving] = useState(false);
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
      setFormData({ name: '', date: '', type: 'public', description: '', year: new Date().getFullYear() });
    }
  }, [editingHoliday]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createHoliday(formData);
      onClose?.(true);
    } catch (err) {
      alert(`Failed to save holiday: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
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
  );
}
