import React, { useEffect, useState, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listInterviews, createInterview, updateInterview } from '../../../../services/api/hrApi.standardized.js';

/**
 * HRInterviews - Dynamic Interviews Management with Proper Data Flow
 * 
 * Uses useHrData hook for consistent state management,
 * hrApi.standardized.js for consistent API calls,
 * and AdminPage for unified loading/error/empty states.
 * Maintains all unique interview functionality.
 */
export default function HRInterviews() {
  // --- Data Hook with Proper Flow ---
  const {
    data: interviews,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    () => listInterviews(),
    undefined,
    // createInterview is handled via form in modal
    async (id, formData) => {
      // Update interview - using standardized API
      await updateInterview(id, formData);
      await refresh();
    },
    // No generic delete for interviews in this version
    undefined,
    // No generic toggle for interviews
    undefined
  );

  // --- Additional State ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
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
      showToast('Interview scheduled successfully!');
      setSubmitting(false);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to schedule interview';
      setError(message);
      showToast(message);
      setSubmitting(false);
    }
  };

  // --- handleEditOpen ---
  const handleEditOpen = (interview) => {
    setSelectedInterview(interview);
  };

  // --- handleUpdate ---
  const handleUpdate = async (e, formData) => {
    e.preventDefault();
    if (!selectedInterview) return;
    setSubmitting(true);
    try {
      await handleUpdate(selectedInterview.id, formData); // From useHrData
      await refresh();
      setShowEditModal(false);
      showToast(`Interview updated successfully.`);
      setSubmitting(false);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update interview';
      setError(message);
      showToast(message);
      setSubmitting(false);
    }
  };

  // --- handleDelete ---
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      // Interviews may not have delete, but hook provides structure
      showToast('Interview removal not configured');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to delete interview';
      setError(message);
      showToast(message);
    }
  };

  // --- Filtered Interviews ---
  const filteredInterviews = useMemo(() => {
    // Interviews page can have its own filtering logic
    // For now, return all interviews
    return interviews;
  }, [interviews]);

  return (
    <AdminPage
      title="Interviews"
      subtitle="Manage interview schedules and candidate assessments"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-person-video3 me-1" /> Schedule Interview
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

        {filteredInterviews.length === 0 ? (
          <div className="emptyState">
            <h3>No interviews found</h3>
            <p>Click "Schedule Interview" above to schedule your first interview.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="cardTitle">Interviews ({filteredInterviews.length})</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Position</th>
                    <th>Interview Date</th>
                    <th>Interviewer</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInterviews.map((int) => (
                    <tr key={int.id}>
                      <td style={{ fontWeight: 600 }}>{int.candidate_name || int.name}</td>
                      <td>{int.position || '—'}</td>
                      <td>{int.interview_date || '—'}</td>
                      <td>{int.interviewer_name || 'HR'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleEditOpen(int)}
                            title="Edit interview"
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(int.id, int.candidate_name || int.name)}
                            title="Delete interview"
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

        {/* Add Interview Modal */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Schedule New Interview">
          <form onSubmit={(e) => handleCreate(e, formData)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Candidate Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Kumar"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Position *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Interview Date *</label>
                <input
                  type="date"
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Interviewer *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HR Manager"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Status *</label>
                <select
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Scheduling...' : 'Schedule Interview'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Edit Interview Modal */}
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Interview">
          <form onSubmit={(e) => handleUpdate(e, formData)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Candidate Name</label>
                <input
                  type="text"
                  placeholder="e.g. Anand Kumar"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Position</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Interview Date</label>
                <input
                  type="date"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Interviewer</label>
                <input
                  type="text"
                  placeholder="e.g. HR Manager"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Status</label>
                <select
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Update Interview'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminPage>
  );
}