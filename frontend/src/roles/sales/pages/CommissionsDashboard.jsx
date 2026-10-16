import React, { useEffect, useState } from 'react';
import { getCommissions, approveCommission, payCommission, rejectCommission, calculateCommission } from '../../../services/api/salesApi.js';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { useAuth } from '../../../common/contexts/AuthContext.jsx';

const MATHISHREE_ID = 'eadd2eb6-b0af-4e3f-aa82-a08e29d891ee';
const NANDHINI_ID = '66da1638-9a06-4741-9ed2-8054b0417313';

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
  
  // Determine default BDA filter based on logged-in user
  const isMathiUser = user?.email?.includes('mathishree') || user?.id === MATHISHREE_ID;
  const isNandhiniUser = user?.email?.includes('nandhini') || user?.id === NANDHINI_ID;
  const isManagement = ['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(user?.role);

  const [filterBda, setFilterBda] = useState(() => {
    if (isMathiUser) return MATHISHREE_ID;
    if (isNandhiniUser) return NANDHINI_ID;
    return '';
  });

  const loadCommissions = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (filterStatus) filters.status = filterStatus;
      if (filterBda) filters.bda_id = filterBda;
      if (filterCategory && filterCategory !== 'all') filters.category = filterCategory;

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
  }, [filterStatus, filterBda, filterCategory]);

  // Actions
  const handleApprove = async (id) => {
    if (!window.confirm('Approve this commission for payment processing?')) return;
    try {
      await approveCommission(id, 'Approved by sales management');
      loadCommissions();
      alert('Commission successfully approved!');
    } catch (err) {
      alert('Approval failed: ' + (err.message || 'Error'));
    }
  };

  const handlePay = async (id) => {
    const ref = window.prompt('Enter transaction reference / bank UTR (leave blank to auto-generate):');
    try {
      await payCommission(id, ref || undefined);
      loadCommissions();
      alert('Commission marked as Paid!');
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
      alert('Commission rejected.');
    } catch (err) {
      alert('Rejection failed: ' + (err.message || 'Error'));
    }
  };

  // Metrics computation
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
      title="BDA Commission Management & Ledger"
      subtitle="Live commercial tier payout tracking, commission approvals, and BDA earnings"
    >
      {/* Top BDA View Switcher Pills */}
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="fw-semibold text-muted small text-uppercase me-2">BDA View:</span>
            <button
              type="button"
              className={`btn btn-sm ${filterBda === '' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setFilterBda('')}
            >
              All BDAs Overview
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterBda === MATHISHREE_ID ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setFilterBda(MATHISHREE_ID)}
            >
              <i className="bi bi-person-fill me-1"></i> Mathishree S (₹30,500)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterBda === NANDHINI_ID ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setFilterBda(NANDHINI_ID)}
            >
              <i className="bi bi-person-fill me-1"></i> Nandhini K (₹30,500)
            </button>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-light text-dark border px-3 py-2">
              <i className="bi bi-shield-check text-success me-1"></i>
              Active BDA: {filterBda === MATHISHREE_ID ? 'Mathishree S' : filterBda === NANDHINI_ID ? 'Nandhini K' : 'All BDAs'}
            </span>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-4 border-primary h-100">
            <span className="text-muted small text-uppercase fw-semibold">Total Commissions</span>
            <h3 className="fw-bold text-dark mb-1 mt-2">₹{totalAmount.toLocaleString('en-IN')}</h3>
            <span className="small text-muted">{commissions.length} Qualified Deals Won</span>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-4 border-success h-100">
            <span className="text-muted small text-uppercase fw-semibold">Paid Out</span>
            <h3 className="fw-bold text-success mb-1 mt-2">₹{paidAmount.toLocaleString('en-IN')}</h3>
            <span className="small text-muted">Transferred to Bank Account</span>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-4 border-info h-100">
            <span className="text-muted small text-uppercase fw-semibold">Approved / Payable</span>
            <h3 className="fw-bold text-primary mb-1 mt-2">₹{payableAmount.toLocaleString('en-IN')}</h3>
            <span className="small text-muted">Ready for finance clearance</span>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-4 border-warning h-100">
            <span className="text-muted small text-uppercase fw-semibold">Pending Approval</span>
            <h3 className="fw-bold text-warning mb-1 mt-2">₹{pendingAmount.toLocaleString('en-IN')}</h3>
            <span className="small text-muted">Awaiting management signoff</span>
          </div>
        </div>
      </div>

      {/* Filters Bar: Category, Status, Search */}
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-lg-4 col-md-6">
            <label className="form-label small text-muted fw-semibold mb-1">Package / Tier Category</label>
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

          <div className="col-lg-3 col-md-6">
            <label className="form-label small text-muted fw-semibold mb-1">Commission Status</label>
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

          <div className="col-lg-5 col-md-12 text-lg-end mt-lg-4">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm me-2"
              onClick={loadCommissions}
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh Ledger
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
          <span className="badge bg-light text-muted border">Standard SDR/BDA Rate: 10% on Closed Deals</span>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted small">Loading commission records from live database...</p>
          </div>
        ) : commissions.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-file-earmark-spreadsheet display-4 text-muted mb-3 d-block"></i>
            <h6 className="fw-bold text-dark">No commission records found</h6>
            <p className="text-muted small">Try adjusting your BDA, Package Category, or Status filters.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-uppercase small text-muted">
                <tr>
                  <th>Deal & Clinic</th>
                  <th>Assigned BDA</th>
                  <th>Package Category</th>
                  <th className="text-end">Closed Value (₹)</th>
                  <th className="text-center">Rate</th>
                  <th className="text-end">Commission (₹)</th>
                  <th className="text-center">Status</th>
                  <th>Payment Ref</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((comm) => (
                  <tr key={comm.id}>
                    <td>
                      <div className="fw-bold text-dark">{comm.deal_title || 'Healthcare Deal'}</div>
                      <small className="text-muted">{comm.client_name || 'Direct Clinic'}</small>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                        <i className="bi bi-person me-1"></i>
                        {comm.bda_name || 'BDA'}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {comm.deal_title?.includes('Enterprise') ? 'Enterprise Automation' :
                         comm.deal_title?.includes('Scale') ? 'Scale & Optimize' :
                         comm.deal_title?.includes('Essential') ? 'Essential Growth' :
                         comm.deal_title?.includes('UI/UX') ? 'Advanced Web & UI/UX' :
                         comm.deal_title?.includes('Reels') ? 'Reels Video Pack' : 'Dental Solutions'}
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
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        {comm.status === 'Pending Approval' && (
                          <>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success"
                              title="Approve Commission"
                              onClick={() => handleApprove(comm.id)}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              title="Reject Commission"
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
                            title="Mark as Paid"
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Package Rate Reference Matrix */}
      <div className="card border-0 shadow-sm rounded-3 p-4 bg-light">
        <h6 className="fw-bold text-dark mb-3">
          <i className="bi bi-info-circle text-primary me-2"></i>
          Ethiroli Commercial Packages & Commission Reference Matrix
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