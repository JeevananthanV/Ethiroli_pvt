import React, { useEffect, useState, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listCommunications } from '../../../../services/api/hrApi.standardized.js';

/**
 * HRCommunications - Dynamic Communications/Announcements with Proper Data Flow
 * 
 * Uses useHrData hook for consistent state management,
 * hrApi.standardized.js for consistent API calls,
 * and AdminPage for unified loading/error/empty states.
 * Maintains all unique communications functionality.
 */
export default function HRCommunications() {
  // --- Data Hook with Proper Flow ---
  const {
    data: communications,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    () => listCommunications(),
    undefined,
    undefined,
    undefined,
    undefined
  );

  // --- Additional State ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedComm, setSelectedComm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // --- Show Toast Helper ---
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // --- Filtered Communications ---
  const filteredCommunications = useMemo(() => {
    // Communications page can have its own filtering logic
    // For now, return all communications
    return communications;
  }, [communications]);

  return (
    <AdminPage
      title="Communications"
      subtitle="Company announcements and HR communications"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-chat me-1" /> Add Announcement
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

        {filteredCommunications.length === 0 ? (
          <div className="emptyState">
            <h3>No communications found</h3>
            <p>Click "Add Announcement" above to create your first communication.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="cardTitle">Communications ({filteredCommunications.length})</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Posted Date</th>
                    <th>Views</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCommunications.map((comm) => (
                    <tr key={comm.id}>
                      <td>{comm.title || '—'}</td>
                      <td>{comm.category || '—'}</td>
                      <td>{comm.posted_at || '—'}</td>
                      <td>{comm.views || '0'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            title="View Details"
                          >
                            <i className="bi bi-eye" /> View
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete Communication"
                          >
                            <i className="bi bi-trash" /> Delete
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

        {/* Add Communication Modal */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Announcement">
          <form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Company-wide meeting reminder"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Category *</label>
                <select
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
                >
                  <option value="general">General</option>
                  <option value="urgent">Urgent</option>
                  <option value="achievement">Achievement</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Content *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter announcement content..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Publish Announcement</button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminPage>
  );
}