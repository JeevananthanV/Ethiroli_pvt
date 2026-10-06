import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';

export default function Approvals() {
  const [data, setData] = useState({ myRequests: [], pendingForMe: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('MY_REQUESTS');

  const loadApprovals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getMyApprovals();
      const payload = res?.data || res;
      setData({
        myRequests: payload?.myRequests || [],
        pendingForMe: payload?.pendingForMe || []
      });
    } catch (err) {
      setError(err.message || 'Failed to load approvals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApprovals();
  }, [loadApprovals]);

  const getStatusBadge = (status) => {
    switch (String(status).toUpperCase()) {
      case 'APPROVED':
        return <span className="badge bg-success">Approved</span>;
      case 'REJECTED':
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return <span className="badge bg-warning text-dark">Pending</span>;
    }
  };

  const currentList = activeTab === 'MY_REQUESTS' ? data.myRequests : data.pendingForMe;

  return (
    <AdminPage
      title="Governance & Approval Chains"
      subtitle="Track your authorization requests, multi-tier approvals, and team sign-offs"
      loading={loading}
      error={error}
      onRetry={loadApprovals}
    >
      <div className="d-flex gap-2 mb-2 border-bottom pb-2">
        <button
          className={`btn btn-sm ${activeTab === 'MY_REQUESTS' ? 'btn-primary' : 'btn-light'}`}
          onClick={() => setActiveTab('MY_REQUESTS')}
        >
          My Submitted Requests ({data.myRequests.length})
        </button>
        {/* Only offered when there is genuinely something to act on.
            The backend returns `pendingForMe: []` for an EMPLOYEE (approval
            decisions belong to HR / ADMIN / SUPER_ADMIN), so this tab used to
            promise "Approvals Awaiting My Action" over an always-empty list with
            no approve or reject control anywhere on the page. Employees do not
            approve requests, so the tab is hidden rather than shown inert. */}
        {data.pendingForMe.length > 0 && (
          <button
            className={`btn btn-sm ${activeTab === 'PENDING_FOR_ME' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setActiveTab('PENDING_FOR_ME')}
          >
            Approvals Awaiting My Action ({data.pendingForMe.length})
          </button>
        )}
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th>Request Type / Entity</th>
                <th>Workflow Chain</th>
                <th>Current Step</th>
                <th>Status</th>
                <th>Requested Date</th>
              </tr>
            </thead>
            <tbody>
              {currentList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <i className="bi bi-patch-check fs-2 d-block mb-2"></i>
                    No requests found in this queue.
                  </td>
                </tr>
              ) : (
                currentList.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {/*
                        `approval_instances` has no `entity_type` column, so a type
                        badge cannot be rendered from real data. Rather than print a
                        hardcoded "REQUEST" - which reads as a real classification
                        but is only a constant - the row shows the reference itself,
                        or says plainly that none was recorded.
                      */}
                      {item.entity_id ? (
                        <>
                          <span className="badge bg-light text-dark border me-2">REQUEST</span>
                          <code className="small text-muted text-break">{item.entity_id}</code>
                        </>
                      ) : (
                        <span className="text-muted small">
                          No entity reference was recorded for this request.
                        </span>
                      )}
                    </td>
                    <td className="fw-medium text-dark">{item.chain_name || 'Unnamed workflow'}</td>
                    <td>
                      <span className="badge bg-info text-dark">Step {item.current_step || 1}</span>
                    </td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td className="text-muted small">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : <span className="text-muted">&mdash;</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}
