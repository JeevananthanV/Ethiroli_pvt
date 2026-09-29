import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listInquiries } from '../../../../services/api/hrApi.standardized.js';

/**
 * HRInquiries - Dynamic Inquiries/Contact Messages with Proper Data Flow
 * 
 * Uses useHrData hook for consistent state management,
 * hrApi.standardized.js for consistent API calls,
 * and AdminPage for unified loading/error/empty states.
 * Maintains all unique inquiries functionality.
 */
export default function HRInquiries() {
  // --- Data Hook with Proper Flow ---
  const {
    data: inquiries,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    () => listInquiries(),
    undefined,
    undefined,
    undefined,
    undefined
  );

  // --- Additional State ---
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // --- Show Toast Helper ---
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // --- Filtered Inquiries ---
  const filteredInquiries = useMemo(() => {
    // Inquiries page can have its own filtering logic
    // For now, return all inquiries
    return inquiries;
  }, [inquiries]);

  return (
    <AdminPage
      title="Contact Inquiries"
      subtitle="Manage website contact form submissions and customer inquiries"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <Button variant="primary">
          <i className="bi bi-envelope me-1" /> Manage Inquiries
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

        {filteredInquiries.length === 0 ? (
          <div className="emptyState">
            <h3>No inquiries found</h3>
            <p>No website contact form submissions at this time.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Inquiries ({filteredInquiries.length})</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Sender Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Category</th>
                    <th>Submitted Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((inq) => (
                    <tr key={inq.id}>
                      <td>{inq.sender_name || inq.name || '—'}</td>
                      <td>{inq.email || '—'}</td>
                      <td>{inq.subject || '—'}</td>
                      <td>{inq.category || 'General'}</td>
                      <td>{inq.submitted_at || '—'}</td>
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
                            title="Delete Inquiry"
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

        {/* Inquiry Detail Modal */}
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Inquiry Details - ${selectedInquiry?.subject || 'Inquiry'}`}>
          {selectedInquiry && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <h4>{selectedInquiry.subject || 'No Subject'}</h4>
                <p><strong>Sender:</strong> {selectedInquiry.sender_name || selectedInquiry.name || '—'}</p>
                <p><strong>Email:</strong> {selectedInquiry.email || '—'}</p>
                <p><strong>Category:</strong> {selectedInquiry.category || 'General'}</p>
                <p><strong>Submitted:</strong> {selectedInquiry.submitted_at || '—'}</p>
              </div>
              <div style={{ whiteSpace: 'pre-wrap', padding: '12px', background: '#f8fafc', borderRadius: '6px', marginTop: '12px', height: '200px' }}>
                {selectedInquiry.message || 'No message content available'}
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