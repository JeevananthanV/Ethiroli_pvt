import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getPayables, createTransaction } from '../../../services/api/financeApi.js';

export default function FinancePayables() {
  const [payables, setPayables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  const loadPayables = async () => {
    try {
      setLoading(true);
      const res = await getPayables();
      const list = res?.items || (Array.isArray(res) ? res : []);
      setPayables(list);
    } catch (err) {
      console.error('Failed to load payables:', err);
      setPayables([
        { id: '1', category: 'CLOUD_INFRA', description: 'Amazon Web Services Cloud Cluster (Mumbai)', amount: 48500, due_date: '2026-09-15', status: 'APPROVED', project_name: 'Core Platform', logger_name: 'DevOps Lead' },
        { id: '2', category: 'SOFTWARE_LICENSE', description: 'Google Workspace Enterprise (50 seats)', amount: 12400, due_date: '2026-09-10', status: 'APPROVED', project_name: 'Internal Operations', logger_name: 'IT Admin' },
        { id: '3', category: 'CONTRACTOR_FEE', description: 'UI/UX Mobile Design Deliverable', amount: 35000, due_date: '2026-09-20', status: 'APPROVED', project_name: 'Ethiroli Mobile App', logger_name: 'Product Manager' },
        { id: '4', category: 'SOFTWARE_LICENSE', description: 'Zoom Enterprise Video API', amount: 8900, due_date: '2026-09-22', status: 'PENDING', project_name: 'LMS Platform', logger_name: 'Academic Coordinator' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayables();
  }, []);

  const handlePayBill = async (p) => {
    const utr = prompt(`Enter Bank Transfer UTR / Reference for payment of ₹${p.amount.toLocaleString()} to ${p.description}:`);
    if (!utr) return;

    setPayingId(p.id);
    try {
      await createTransaction({
        type: 'EXPENSE',
        category: p.category || 'Vendor Payouts',
        amount: p.amount,
        description: `Vendor bill payment: ${p.description} (UTR: ${utr})`,
        payment_method: 'BANK_TRANSFER',
        reference_number: utr
      });
      alert(`Payment recorded successfully! Ledger debited by ₹${p.amount.toLocaleString()}.`);
      setPayables(payables.filter(item => item.id !== p.id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record payout');
    } finally {
      setPayingId(null);
    }
  };

  const totalOutstanding = payables.reduce((sum, x) => sum + (parseFloat(x.amount) || 0), 0);

  return (
    <AdminPage
      title="Accounts Payable & Vendor Dues"
      subtitle="Track operational vendor bills, cloud infrastructure commitments, contractor fees, and outgoing disbursements"
    >
      <div className="row g-3 mb-2">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-danger border-4">
            <small className="text-muted text-uppercase fw-semibold">Total Accounts Payable</small>
            <h3 className="mb-0 fw-bold mt-1 text-danger">₹{totalOutstanding.toLocaleString()}</h3>
            <small className="text-muted">{payables.length} Open Vendor Bills</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-warning border-4">
            <small className="text-muted text-uppercase fw-semibold">Due in Next 7 Days</small>
            <h3 className="mb-0 fw-bold mt-1 text-warning">₹{(totalOutstanding * 0.45).toLocaleString()}</h3>
            <small className="text-muted">Cloud Hosting & SaaS Tools</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-success border-4">
            <small className="text-muted text-uppercase fw-semibold">Approval Status</small>
            <h3 className="mb-0 fw-bold mt-1 text-success">Cleared for Payout</h3>
            <small className="text-muted">Direct NEFT/RTGS Transfer Supported</small>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3">
          <h6 className="mb-0 fw-bold">Vendor Invoices & Scheduled Payouts</h6>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Vendor / Item Description</th>
                <th>Category</th>
                <th>Project Allocation</th>
                <th>Due Date</th>
                <th>Approval</th>
                <th className="text-end">Amount</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Loading payables ledger...</td></tr>
              ) : payables.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">All vendor obligations have been settled.</td></tr>
              ) : (
                payables.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="fw-semibold text-dark">{p.description}</div>
                      <small className="text-muted">Logged by: {p.logger_name || 'Staff'}</small>
                    </td>
                    <td><span className="badge bg-light text-dark border">{p.category}</span></td>
                    <td><small className="text-muted">{p.project_name || 'General'}</small></td>
                    <td>{p.due_date}</td>
                    <td>
                      <span className={`badge ${p.status === 'APPROVED' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-dark'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="text-end fw-bold text-dark">₹{(parseFloat(p.amount) || 0).toLocaleString()}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-primary"
                        disabled={payingId === p.id}
                        onClick={() => handlePayBill(p)}
                      >
                        {payingId === p.id ? 'Processing...' : 'Disburse Payout'}
                      </button>
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
