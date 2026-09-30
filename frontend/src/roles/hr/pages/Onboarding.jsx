import React, { useEffect, useState, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listOnboardings, createOnboarding, updateOnboarding } from '../../../../services/api/hrApi.standardized.js';

/**
 * HROnboarding - Dynamic Onboarding Management with Proper Data Flow
 * 
 * Uses useHrData hook for consistent state management,
 * hrApi.standardized.js for consistent API calls,
 * and AdminPage for unified loading/error/empty states.
 * Maintains all unique onboarding functionality.
 */
export default function HROnboarding() {
  // --- Data Hook with Proper Flow ---
  const {
    data: onboarding,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    () => listOnboardings(),
    undefined,
    // createOnboarding is handled via form in modal
    async (id, formData) => {
      // Update onboarding - using standardized API
      await updateOnboarding(id, formData);
      await refresh();
    },
    // No generic delete for onboarding in this version
    undefined,
    // No generic toggle for onboarding
    undefined
  );

  // --- Additional State ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOnboarding, setSelectedOnboarding] = useState(null);
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
      showToast('Onboarding process added successfully!');
      setSubmitting(false);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to create onboarding';
      setError(message);
      showToast(message);
      setSubmitting(false);
    }
  };

  // --- handleEditOpen ---
  const handleEditOpen = (onboarding) => {
    setSelectedOnboarding(onboarding);
  };

  // --- handleUpdate ---
  const handleUpdate = async (e, formData) => {
    e.preventDefault();
    if (!selectedOnboarding) return;
    setSubmitting(true);
    try {
      await handleUpdate(selectedOnboarding.id, formData); // From useHrData
      await refresh();
      setShowEditModal(false);
      showToast(`Onboarding updated successfully.`);
      setSubmitting(false);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update onboarding';
      setError(message);
      showToast(message);
      setSubmitting(false);
    }
  };

  // --- handleDelete ---
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      // Onboarding may not have delete, but hook provides structure
      showToast('Onboarding removal not configured');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to delete onboarding';
      setError(message);
      showToast(message);
    }
  };

  // --- Filtered Onboarding ---
  const filteredOnboarding = useMemo(() => {
    // Onboarding page can have its own filtering logic
    // For now, return all onboarding records
    return onboarding;
  }, [onboarding]);

  return (
    <AdminPage
      title="Onboarding"
      subtitle="Manage new joiner onboarding processes and checklists"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-rocket-takeoff me-1" /> Add Onboarding
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

        {filteredOnboarding.length === 0 ? (
          <div className="emptyState">
            <h3>No onboarding records found</h3>
            <p>Click "Add Onboarding" above to create a new joiner journey.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="cardTitle">Onboarding Processes ({filteredOnboarding.length})</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Start Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOnboarding.map((ob) => (
                    <tr key={ob.id}>
                      <td style={{ fontWeight: 600 }}>{ob.employee_name || ob.name}</td>
                      <td>{ob.department || '—'}</td>
                      <td>{ob.start_date || '—'}</td>
                      <td>
                        <span className={`statusTag ${ob.status === 'completed' ? 'active' : ob.status === 'in_progress' ? 'pending' : 'error'}`}>
                          {ob.status || '—'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleEditOpen(ob)}
                            title="Edit onboarding"
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(ob.id, ob.employee_name || ob.name)}
                            title="Delete onboarding"
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

        {/* Add Onboarding Modal */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Onboarding">
          <form onSubmit={(e) => handleCreate(e, formData)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Employee Name *</label>
                <input
                  type="text"
                  required
                  value={formData.employee_name}
                  onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
                  placeholder="e.g. New Joiner Name"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Department *</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Sales & Growth">Sales & Growth</option>
                  <option value="Finance">Finance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Operations">Operations</option>
                </select>
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Onboarding Track</label>
                <select
                  value={formData.track}
                  onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
                >
                  <option value="technical">Technical Track</option>
                  <option value="non-technical">Non-Technical Track</option>
                  <option value="leadership">Leadership Track</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Adding...' : 'Save Onboarding'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Edit Onboarding Modal */}
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Onboarding">
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Sales & Growth">Sales & Growth</option>
                  <option value="Finance">Finance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Operations">Operations</option>
                </select>
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Onboarding Track</label>
                <select
                  value={formData.track}
                  onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
                >
                  <option value="technical">Technical Track</option>
                  <option value="non-technical">Non-Technical Track</option>
                  <option value="leadership">Leadership Track</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Update Onboarding'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminPage>
  );
}