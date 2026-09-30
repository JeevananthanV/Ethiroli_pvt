import React, { useEffect, useState, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listCareerApplications } from '../../../../services/api/hrApi.standardized.js';

/**
 * HRCareerApplications - Dynamic Career Applications with Proper Data Flow
 * 
 * Uses useHrData hook for consistent state management,
 * hrApi.standardized.js for consistent API calls,
 * and AdminPage for unified loading/error/empty states.
 * Maintains all unique career applications functionality.
 */
export default function HRCareerApplications() {
  // --- Data Hook with Proper Flow ---
  const {
    data: applications,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    listCareerApplications,
    undefined,
    undefined,
    undefined,
    undefined
  );

  // --- Additional State ---
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // --- Show Toast Helper ---
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // --- Filtered Applications ---
  const filteredApplications = useMemo(() => {
    // Career Applications page can have its own filtering logic
    // For now, return all applications
    return applications;
  }, [applications]);

  return (
    <AdminPage
      title="Career Applications"
      subtitle="Review and manage job applications from career portal"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <Button variant="primary">
          <i className="bi bi-person-lines-fill me-1" /> Manage Applications
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

        {filteredApplications.length === 0 ? (
          <div className="emptyState">
            <h3>No applications found</h3>
            <p>No job applications received through the career portal yet.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Applications ({filteredApplications.length})</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Position Applied</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Applied Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: 600 }}>{app.candidate_name || app.name || '—'}</td>
                      <td>{app.position || '—'}</td>
                      <td>{app.email || '—'}</td>
                      <td>{app.phone || '—'}</td>
                      <td>{app.applied_at || '—'}</td>
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
                            title="Delete Application"
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

        {/* Application Detail Modal */}
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Application Details - ${selectedApplication?.candidate_name || 'Application'}`}>
          {selectedApplication && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <h4>{selectedApplication.candidate_name || selectedApplication.name || 'Candidate'}</h4>
                <p><strong>Position:</strong> {selectedApplication.position || '—'}</p>
                <p><strong>Email:</strong> {selectedApplication.email || '—'}</p>
                <p><strong>Phone:</strong> {selectedApplication.phone || '—'}</p>
                <p><strong>Applied:</strong> {selectedApplication.applied_at || '—'}</p>
              </div>
              <div style={{ whiteSpace: 'pre-wrap', padding: '12px', background: '#f8fafc', borderRadius: '6px', marginTop: '12px', height: '200px' }}>
                {selectedApplication.resume_text || selectedApplication.cover_letter || 'No resume/cover letter content available'}
              </div>
              <div style={{ marginTop: '24px', textAlign: 'right' }}>
                <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminPage>
  );
}