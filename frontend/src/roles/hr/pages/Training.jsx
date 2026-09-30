import React, { useEffect, useState, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listTrainings, createTraining, updateTraining } from '../../../../services/api/hrApi.standardized.js';

/**
 * HRTraining - Dynamic Training Management with Proper Data Flow
 * 
 * Uses useHrData hook for consistent state management,
 * hrApi.standardized.js for consistent API calls,
 * and AdminPage for unified loading/error/empty states.
 * Maintains all unique training functionality.
 */
export default function HRTraining() {
  // --- Data Hook with Proper Flow ---
  const {
    data: trainings,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    () => listTrainings(),
    undefined,
    // createTraining is handled via form in modal
    async (id, formData) => {
      // Update training - using standardized API
      await updateTraining(id, formData);
      await refresh();
    },
    // No generic delete for trainings in this version
    undefined,
    // No generic toggle for trainings
    undefined
  );

  // --- Additional State ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // --- Show Toast Helper ---
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // --- handleCreate ---
  const handleCreate = async (e, formData) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await handleCreate(formData); // From useHrData
      await refresh();
      setShowAddModal(false);
      showToast('Training program added successfully!');
      setSubmitting(false);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to create training';
      setError(message);
      showToast(message);
      setSubmitting(false);
    }
  };

  // --- handleEditOpen ---
  const handleEditOpen = (training) => {
    setSelectedTraining(training);
  };

  // --- handleUpdate ---
  const handleUpdate = async (e, formData) => {
    e.preventDefault();
    if (!selectedTraining) return;
    setSubmitting(true);
    try {
      await handleUpdate(selectedTraining.id, formData); // From useHrData
      await refresh();
      setShowEditModal(false);
      showToast(`Training program updated successfully.`);
      setSubmitting(false);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update training';
      setError(message);
      showToast(message);
      setSubmitting(false);
    }
  };

  // --- handleDelete ---
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      // Trainings may not have delete, but hook provides structure
      showToast('Training removal not configured');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to delete training';
      setError(message);
      showToast(message);
    }
  };

  // --- Filtered Trainings ---
  const filteredTrainings = useMemo(() => {
    // Training page can have its own filtering logic
    // For now, return all trainings
    return trainings;
  }, [trainings]);

  return (
    <AdminPage
      title="Training & Development"
      subtitle="Manage employee training programs and certifications"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-book me-1" /> Add Training
        </Button>
      }
    >
      <div className="dashboard">
        {toastMsg && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="bi bi-check-circle-fill text-success" />
            {toastMsg}
          </div>
        )}

        {filteredTrainings.length === 0 ? (
          <div className="emptyState">
            <h3>No training records found</h3>
            <p>Click "Add Training" above to add your first training program.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="cardTitle">Training Programs ({filteredTrainings.length})</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Training Program</th>
                    <th>Start Date</th>
                    <th>Completion Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrainings.map((tr) => (
                    <tr key={tr.id}>
                      <td style={{ fontWeight: 600 }}>{tr.employee_name || tr.name}</td>
                      <td>{tr.training_program || '—'}</td>
                      <td>{tr.start_date || '—'}</td>
                      <td>{tr.completion_date || '—'}</td>
                      <td>
                        <span className={`statusTag ${tr.status === 'completed' ? 'active' : tr.status === 'in_progress' ? 'pending' : 'error'}`}>
                          {tr.status || '—'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleEditOpen(tr)}
                            title="Edit training"
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(tr.id, tr.employee_name || tr.name)}
                            title="Delete training"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Training Modal */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Training">
          <form onSubmit={(e) => handleCreate(e, formData)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Employee Name *</label>
                <input
                  type="text"
                  required
                  value={formData.employee_name}
                  onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
                  placeholder="e.g. New Employee"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Training Program *</label>
                <input
                  type="text"
                  required
                  value={formData.training_program}
                  onChange={(e) => setFormData({ ...formData, training_program: e.target.value })}
                  placeholder="e.g. Leadership Development"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Completion Date</label>
                <input
                  type="date"
                  value={formData.completion_date}
                  onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
                >
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Adding...' : 'Save Training'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Edit Training Modal */}
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Training">
          <form onSubmit={(e) => handleUpdate(e, formData)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Employee Name</label>
                <input
                  type="text"
                  value={formData.employee_name}
                  onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Training Program</label>
                <input
                  type="text"
                  value={formData.training_program}
                  onChange={(e) => setFormData({ ...formData, training_program: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Completion Date</label>
                <input
                  type="date"
                  value={formData.completion_date}
                  onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
                >
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Update Training'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminPage>
  );
}