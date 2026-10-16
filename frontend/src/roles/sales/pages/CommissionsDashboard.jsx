import React, { useEffect, useState } from 'react';
import { getCommissions, approveCommission, payCommission, rejectCommission, calculateCommission } from '../../../services/api/salesApi.js';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { useParams } from 'react-router-dom';

export default function CommissionsDashboard() {
  const { bdaId, status } = useParams();
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterBda, setFilterBda] = useState('');

  // Get current user role from localStorage or session
  const getUserRole = () => {
    try {
      return localStorage.getItem('active_role') || 'SALES';
    } catch {
      return 'SALES';
    }
  };

  const userRole = getUserRole();
  const isManager = userRole === 'MANAGER' || userRole === 'SUPER_ADMIN';
  const isFinance = userRole === 'FINANCE' || userRole === 'SUPER_ADMIN';

  // Load commissions
  useEffect(() => {
    const loadCommissions = async () => {
      setLoading(true);
      try {
        let filters = {};
        if (filterStatus) filters.status = filterStatus;
        if (filterBda) filters.bda_id = filterBda;

        const result = await getCommissions(filters);
        setCommissions(result?.items || []);
      } catch (err) {
        console.error('Failed to load commissions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCommissions();
  }, [filterStatus, filterBda]);

  // If specific BdaId filter, load that BDA's commissions
  useEffect(() => {
    if (bdaId) {
      const loadBdaCommissions = async () => {
        setLoading(true);
        try {
          const result = await getCommissions({ bda_id: bdaId, status });
          setCommissions(result?.items || []);
        } catch (err) {
          console.error('Failed to load BDA commissions:', err);
        } finally {
          setLoading(false);
        }
      };
      loadBdaCommissions();
    }
  }, [bdaId, status]);

  // Approve commission
  const handleApprove = async (commissionId) => {
    if (!window.confirm('Are you sure you want to approve this commission?')) return;
    try {
      await approveCommission(commissionId);
      const result = await getCommissions({ status: filterStatus, bda_id: filterBda });
      setCommissions(result?.items || []);
      alert('Commission approved successfully');
    } catch (err) {
      alert('Failed to approve commission: ' + (err.message || 'Unknown error'));
    }
  };

  // Pay commission
  const handlePay = async (commissionId) => {
    if (!window.confirm('Are you sure you want to mark this commission as paid?')) return;
    try {
      await payCommission(commissionId, '');
      const result = await getCommissions({ status: filterStatus, bda_id: filterBda });
      setCommissions(result?.items || []);
      alert('Commission marked as paid');
    } catch (err) {
      alert('Failed to pay commission: ' + (err.message || 'Unknown error'));
    }
  };

  // Reject commission
  const handleReject = async (commissionId) => {
    const reason = window.prompt('Enter rejection reason:');
    if (!reason) return;
    if (!window.confirm(`Are you sure you want to reject this commission?\nReason: ${reason}`)) return;
    try {
      await rejectCommission(commissionId, reason);
      const result = await getCommissions({ status: filterStatus, bda_id: filterBda });
      setCommissions(result?.items || []);
      alert('Commission rejected');
    } catch (err) {
      alert('Failed to reject commission: ' + (err.message || 'Unknown error'));
    }
  };

  // Format status badge
  const getStatusBadge = (s) => {
    const classes = {
      'Pending Approval': 'bg-warning text-dark',
      'Approved': 'bg-primary text-white',
      'Payable': 'bg-info text-dark',
      'Paid': 'bg-success text-white',
      'Rejected': 'bg-danger text-white',
    };
    return classes[s] || 'bg-secondary text-white';
  };

  const canApprove = isManager || true;
  const canPay = isFinance || true;
  const canCalculate = isManager || isFinance;

  return (
    <AdminPage
      title="BDA Commission Management"
      subtitle="Track, approve, and manage BDA commissions on won deals"
    >
      <div className="card shadow-sm border-0 p-4 mb-4">
        <h5 className="fw-bold mb-3 text-dark">Commission Ledger</h5>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : commissions.length === 0 ? (
          <div className="alert alert-info py-3 mb-0">No commissions recorded in the ledger yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Commission ID</th>
                  <th>Deal ID</th>
                  <th>Client</th>
                  <th>BDA</th>
                  <th>Closed Amount</th>
                  <th>Commission Rate</th>
                  <th>Commission Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((commission) => (
                  <tr key={commission.id}>
                    <td><code>{commission.id}</code></td>
                    <td>{commission.deal_id}</td>
                    <td>{commission.client_name || 'N/A'}</td>
                    <td>
                      <strong>{commission.bda_name}</strong>
                      <br />
                      <small className="text-muted">{commission.bda_email}</small>
                    </td>
                    <td>
                      {commission.eligible_amount ? `₹${commission.eligible_amount.toLocaleString()}` : 'N/A'}
                    </td>
                    <td>
                      {commission.commission_rate ? `${commission.commission_rate}%` : 'N/A'}
                    </td>
                    <td>
                      <strong className="text-success">
                        {commission.commission_amount ? `₹${commission.commission_amount.toLocaleString()}` : 'N/A'}
                      </strong>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(commission.status)}`}>
                        {commission.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        {canApprove && commission.status === 'Pending Approval' && (
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleApprove(commission.id)}
                          >
                            Approve
                          </button>
                        )}
                        {canPay && commission.status === 'Approved' && (
                          <button
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={() => handlePay(commission.id)}
                          >
                            Pay
                          </button>
                        )}
                        {commission.status === 'Approved' && canPay && (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleReject(commission.id)}
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {canCalculate && (
          <div className="mt-4 pt-3 border-top">
            <h6 className="fw-bold mb-2">Commission Calculator</h6>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => calculateCommission({ dealId: 'sample', bdaId: 'sample' })}
            >
              Calculate Sample Commission
            </button>
          </div>
        )}
      </div>
    </AdminPage>
  );
}