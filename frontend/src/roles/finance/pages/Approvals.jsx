import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function FinanceApprovals() {
  const [approvals, setApprovals] = useState([
    { id: 'app-1', type: 'EXPENSE_REIMBURSEMENT', title: 'Senior Cloud Architect Travel & AWS Summit', initiator: 'DevOps Lead', amount: 32000, date: '2026-09-08', status: 'PENDING_FINANCE', urgency: 'MEDIUM' },
    { id: 'app-2', type: 'CUSTOMER_REFUND', title: 'Refund Request for Batch Transfer Cancellation', initiator: 'Support Desk', amount: 8000, date: '2026-09-09', status: 'PENDING_FINANCE', urgency: 'HIGH' },
    { id: 'app-3', type: 'CONTRACTOR_INVOICE', title: 'Mobile UI Deliverable Milestone Sign-off', initiator: 'Project Manager', amount: 45000, date: '2026-09-07', status: 'PENDING_FINANCE', urgency: 'HIGH' },
    { id: 'app-3', type: 'PAYROLL_OVERRIDE', title: 'Prorated Mid-Month Joining Salary Adjustment', initiator: 'HR Manager', amount: 18500, date: '2026-09-05', status: 'APPROVED', urgency: 'LOW' }
  ]);

  const handleAction = (id, action) => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: action === 'approve' ? 'APPROVED' : 'REJECTED' } : a));
    alert(`Financial approval item marked as ${action.toUpperCase()}.`);
  };

  return (
    <AdminPage
      title="Financial Approvals & Governance"
      subtitle="Dual-control authorization queue for operational expenses (> ₹25,000), client refunds, and payroll variances"
    >
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold">Pending Governance Queue</h6>
          <span className="badge bg-warning bg-opacity-10 text-dark">
            {approvals.filter(a => a.status.startsWith('PENDING')).length} Approvals Awaiting Review
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Request Details</th>
                <th>Request Type</th>
                <th>Initiated By</th>
                <th>Date</th>
                <th>Urgency</th>
                <th className="text-end">Amount</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map(a => (
                <tr key={a.id}>
                  <td>
                    <div className="fw-semibold text-dark">{a.title}</div>
                    <small className="font-monospace text-muted">{a.id}</small>
                  </td>
                  <td><span className="badge bg-light text-dark border">{a.type}</span></td>
                  <td>{a.initiator}</td>
                  <td>{a.date}</td>
                  <td>
                    <span className={`badge ${a.urgency === 'HIGH' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-info bg-opacity-10 text-info'}`}>
                      {a.urgency}
                    </span>
                  </td>
                  <td className="text-end fw-bold text-dark">₹{a.amount.toLocaleString()}</td>
                  <td className="text-end">
                    {a.status.startsWith('PENDING') ? (
                      <div className="d-flex gap-1 justify-content-end">
                        <button className="btn btn-sm btn-success" onClick={() => handleAction(a.id, 'approve')}>
                          <i className="bi bi-check-lg"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleAction(a.id, 'reject')}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    ) : (
                      <span className={`badge ${a.status === 'APPROVED' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                        {a.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}
