import React, { useEffect, useState, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listReports } from '../../../../services/api/hrApi.standardized.js';

/**
 * HRReports - Dynamic People Analytics Reports with Proper Data Flow
 * 
 * Uses useHrData hook for consistent state management,
 * hrApi.standardized.js for consistent API calls,
 * and AdminPage for unified loading/error/empty states.
 * Maintains all unique reporting functionality.
 */
export default function HRReports() {
  // --- Data Hook with Proper Flow ---
  const {
    data: reports,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    () => listReports(),
    undefined,
    undefined,
    undefined,
    undefined
  );

  // --- Additional State ---
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // --- Show Toast Helper ---
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // --- Filtered Reports ---
  const filteredReports = useMemo(() => {
    // Reports page can have its own filtering logic
    // For now, return all reports
    return reports;
  }, [reports]);

  return (
    <AdminPage
      title="People Analytics Reports"
      subtitle="Generate and view people operations reports and analytics"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <Button variant="primary">
          <i className="bi bi-bar-chart me-1" /> Generate Report
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

        {reports.length === 0 ? (
          <div className="emptyState">
            <h3>No reports found</h3>
            <p>Click "Generate Report" above to create a new people analytics report.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Reports ({filteredReports.length})</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Report Type</th>
                    <th>Generated Date</th>
                    <th>Records Count</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.type || 'General Report'}</td>
                      <td>{report.generated_at || '—'}</td>
                      <td>{report.record_count || '—'}</td>
                      <td>
                        <span className={`statusTag ${report.status === 'completed' ? 'active' : 'pending'}`}>
                          {report.status || 'Pending'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          title="View Report Details"
                        >
                          <i className="bi bi-eye" /> View
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          title="Download Report"
                        >
                          <i className="bi bi-download" /> Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Report Detail Modal */}
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Report Details - ${selectedReport?.type || 'Report'}`}>
          {selectedReport && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <h4>{selectedReport.type || 'Report'}</h4>
                <p><strong>Generated:</strong> {selectedReport.generated_at || '—'}</p>
                <p><strong>Records Count:</strong> {selectedReport.record_count || '—'}</p>
                <p><strong>Status:</strong> <span className={`statusTag ${selectedReport.status === 'completed' ? 'active' : 'pending'}`}>{selectedReport.status || 'Pending'}</span></p>
              </div>
              <div style={{ whiteSpace: 'pre-wrap', padding: '12px', background: '#f8fafc', borderRadius: '6px', marginTop: '12px' }}>
                {selectedReport.data || 'No report data available'}
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