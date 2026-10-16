import React, { useEffect, useState } from 'react';
import { getCommissions, approveCommission, payCommission, rejectCommission } from '../../../services/api/salesApi.js';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { useAuth } from '../../../common/contexts/AuthContext.jsx';

const PACKAGES = [
  { id: 'all', label: 'All Packages & Add-ons' },
  { id: 'Essential Growth', label: 'Essential Growth (₹25,000/mo)', rate: '10%', amount: '₹2,500' },
  { id: 'Scale & Optimize', label: 'Scale & Optimize (₹55,000/mo)', rate: '10%', amount: '₹5,500' },
  { id: 'Enterprise Automation', label: 'Enterprise Automation (₹1,20,000/mo)', rate: '10%', amount: '₹12,000' },
  { id: 'Advanced UI/UX', label: 'Advanced UI/UX & Web Dev (₹75,000 setup)', rate: '10%', amount: '₹7,500' },
  { id: 'Reels', label: 'Reels & Video Production Pack (₹30,000)', rate: '10%', amount: '₹3,000' },
  { id: 'AI Workflow', label: 'AI Workflow Automation (₹20,000)', rate: '10%', amount: '₹2,000' },
];

export default function CommissionsDashboard() {
  const { user } = useAuth();
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBda, setFilterBda] = useState('');

  const isManagement = ['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(user?.role);

  const loadCommissions = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (filterStatus) filters.status = filterStatus;
      if (filterCategory && filterCategory !== 'all') filters.category = filterCategory;
      if (filterBda) filters.bda_id = filterBda;

      const result = await getCommissions(filters);
      setCommissions(result?.items || []);
    } catch (err) {
      console.error('Failed to load commissions:', err);
      setCommissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommissions();
  }, [filterStatus, filterCategory, filterBda]);

  // Extract distinct BDA names dynamically from loaded data (for management view)
  const availableBdas = Array.from(
    new Map(
      commissions
        .filter(c => c.bda_user_id && c.bda_name)
        .map(c => [c.bda_user_id, { id: c.bda_user_id, name: c.bda_name }])
    ).values()
  );

  // Actions
  const handleApprove = async (id) => {
    if (!window.confirm('Approve this commission for payment clearance?')) return;
    try {
      await approveCommission(id, 'Approved by sales management');
      loadCommissions();
    } catch (err) {
      alert('Approval failed: ' + (err.message || 'Error'));
    }
  };

  const handlePay = async (id) => {
    const ref = window.prompt('Enter transaction reference / payment note (optional):');
    try {
      await payCommission(id, ref || undefined);
      loadCommissions();
    } catch (err) {
      alert('Payment update failed: ' + (err.message || 'Error'));
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter reason for commission rejection:');
    if (!reason) return;
    try {
      await rejectCommission(id, reason);
      loadCommissions();
    } catch (err) {
      alert('Rejection failed: ' + (err.message || 'Error'));
    }
  };

  // Metrics computation from real records
  const totalAmount = commissions.reduce((acc, c) => acc + (parseFloat(c.commission_amount) || 0), 0);
  const paidAmount = commissions.filter(c => c.status === 'Paid').reduce((acc, c) => acc + (parseFloat(c.commission_amount) || 0), 0);
  const payableAmount = commissions.filter(c => c.status === 'Approved' || c.status === 'Payable').reduce((acc, c) => acc + (parseFloat(c.commission_amount) || 0), 0);
  const pendingAmount = commissions.filter(c => c.status === 'Pending Approval').reduce((acc, c) => acc + (parseFloat(c.commission_amount) || 0), 0);

  const getStatusBadge = (s) => {
    switch (s) {
      case 'Paid': return 'badge bg-success text-white px-2 py-1';
      case 'Approved': return 'badge bg-primary text-white px-2 py-1';
      case 'Payable': return 'badge bg-info text-dark px-2 py-1';
      case 'Pending Approval': return 'badge bg-warning text-dark px-2 py-1';
      case 'Rejected': return 'badge bg-danger text-white px-2 py-1';
      default: return 'badge bg-secondary text-white px-2 py-1';
    }
  };

  return (
    <AdminPage
      title="Commission Ledger & Performance Payouts"
      subtitle="Track verified BDA commission earnings, commercial tier disbursements, and live approval status"
    >
      {/* Top Controls Bar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-light text-dark border px-3 py-2 fs-6">
              <i className="bi bi-person-circle text-primary me-2"></i>
              Representative: {user?.name || user?.full_name || 'Active Associate'}
            </span>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
              Role: {user?.role || 'SALES'}
            </span>
          </div>

          {isManagement && availableBdas.length > 0 && (
            <div className="d-flex align-items-center gap-2">
              <label className="small text-muted fw-semibold mb-0">Filter Associate:</label>
              <select
                className="form-select form-select-sm"
                style={{ minWidth: '180px' }}
                value={filterBda}
                onChange={(e) => setFilterBda(e.target.value)}
              >
                <option value="">All Associates</option>
                {availableBdas.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-sm-6">
          <div className="sales-kpi-card kpi-indigo">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <span className="text-muted small text-uppercase fw-bold letter-spacing">Total Earned</span>
                <div className="kpi-metric-val mt-1">₹{totalAmount.toLocaleString('en-IN')}</div>
              </div>
              <div className="kpi-icon-bubble kpi-bubble-indigo">
                <i className="bi bi-wallet2"></i>
              </div>
            </div>
            <div className="pt-2 border-top border-light-subtle small text-muted">
              {commissions.length} Verified Commercial Deals
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="sales-kpi-card kpi-emerald">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <span className="text-muted small text-uppercase fw-bold letter-spacing">Disbursed / Paid</span>
                <div className="kpi-metric-val mt-1 text-success">₹{paidAmount.toLocaleString('en-IN')}</div>
              </div>
              <div className="kpi-icon-bubble kpi-bubble-emerald">
                <i className="bi bi-check2-all"></i>
              </div>
            </div>
            <div className="pt-2 border-top border-light-subtle small text-muted">
              Official Reference ETH-PAY Disbursed
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="sales-kpi-card kpi-sky">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <span className="text-muted small text-uppercase fw-bold letter-spacing">Approved / Payable</span>
                <div className="kpi-metric-val mt-1 text-primary">₹{payableAmount.toLocaleString('en-IN')}</div>
              </div>
              <div className="kpi-icon-bubble kpi-bubble-sky">
                <i className="bi bi-shield-check"></i>
              </div>
            </div>
            <div className="pt-2 border-top border-light-subtle small text-muted">
              Cleared for Bank Transfer
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="sales-kpi-card kpi-amber">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <span className="text-muted small text-uppercase fw-bold letter-spacing">Pending Approval</span>
                <div className="kpi-metric-val mt-1 text-warning">₹{pendingAmount.toLocaleString('en-IN')}</div>
              </div>
              <div className="kpi-icon-bubble kpi-bubble-amber">
                <i className="bi bi-hourglass-split"></i>
              </div>
            </div>
            <div className="pt-2 border-top border-light-subtle small text-muted">
              Under Leadership Review
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-lg-5 col-md-6">
            <label className="form-label small text-muted fw-semibold mb-1">Package Category</label>
            <select
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {PACKAGES.map((pkg) => (
                <option key={pkg.id} value={pkg.id === 'all' ? '' : pkg.id}>
                  {pkg.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-lg-4 col-md-6">
            <label className="form-label small text-muted fw-semibold mb-1">Status</label>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Payable">Payable</option>
              <option value="Paid">Paid</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="col-lg-3 col-md-12 text-lg-end mt-lg-4">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={loadCommissions}
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Commission Ledger Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden mb-4">
        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0 text-dark">
            <i className="bi bi-wallet2 text-primary me-2"></i>
            Live Commission Ledger ({commissions.length})
          </h5>
          <span className="badge bg-light text-muted border">Standard Commission: 10% on Closed Deals</span>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted small">Loading records from live database...</p>
          </div>
        ) : commissions.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
            <h6 className="fw-bold text-dark">No commission records found</h6>
            <p className="text-muted small">Commission entries are generated automatically as closed deals are verified.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-uppercase small text-muted">
                <tr>
                  <th>Deal & Clinic</th>
                  <th>Associate</th>
                  <th className="text-end">Deal Amount (₹)</th>
                  <th className="text-center">Rate</th>
                  <th className="text-end">Commission (₹)</th>
                  <th className="text-center">Status</th>
                  <th>Payment Ref</th>
                  {isManagement && <th className="text-end">Management Actions</th>}
                </tr>
              </thead>
              <tbody>
                {commissions.map((comm) => (
                  <tr key={comm.id}>
                    <td>
                      <div className="fw-bold text-dark">{comm.deal_title || 'Healthcare Agreement'}</div>
                      <small className="text-muted">{comm.client_name || 'Direct Business'}</small>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        <i className="bi bi-person me-1"></i>
                        {comm.bda_name || 'Associate'}
                      </span>
                    </td>
                    <td className="text-end fw-semibold text-secondary">
                      ₹{parseFloat(comm.eligible_amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="text-center">
                      <span className="badge bg-light text-muted border">10%</span>
                    </td>
                    <td className="text-end">
                      <strong className="text-success fs-6">
                        ₹{parseFloat(comm.commission_amount || 0).toLocaleString('en-IN')}
                      </strong>
                    </td>
                    <td className="text-center">
                      <span className={getStatusBadge(comm.status)}>{comm.status}</span>
                    </td>
                    <td>
                      {comm.payment_reference ? (
                        <code className="small text-muted">{comm.payment_reference}</code>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                    {isManagement && (
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          {comm.status === 'Pending Approval' && (
                            <>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handleApprove(comm.id)}
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleReject(comm.id)}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {(comm.status === 'Approved' || comm.status === 'Payable') && (
                            <button
                              type="button"
                              className="btn btn-sm btn-success text-white"
                              onClick={() => handlePay(comm.id)}
                            >
                              <i className="bi bi-check2-circle me-1"></i> Pay
                            </button>
                          )}
                          {comm.status === 'Paid' && (
                            <span className="badge bg-success-subtle text-success">
                              <i className="bi bi-check-all me-1"></i> Settled
                            </span>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Commercial Reference Matrix */}
      <div className="card border-0 shadow-sm rounded-3 p-4 bg-light">
        <h6 className="fw-bold text-dark mb-3">
          <i className="bi bi-info-circle text-primary me-2"></i>
          Ethiroli Commercial Packages Reference Matrix
        </h6>
        <div className="row g-3">
          {PACKAGES.filter(p => p.id !== 'all').map((pkg) => (
            <div key={pkg.id} className="col-md-4 col-sm-6">
              <div className="p-3 bg-white rounded-3 border shadow-xs h-100">
                <div className="fw-semibold text-dark small">{pkg.label}</div>
                <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                  <span className="text-muted small">Standard Rate: {pkg.rate}</span>
                  <strong className="text-success">{pkg.amount}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}