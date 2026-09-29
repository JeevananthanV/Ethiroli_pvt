import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage';
import pmApi from '../../../services/api/pmApi';

export default function PMProjectExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ total_expenses: 0, billable_expenses: 0, pending_expenses: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    project_id: '',
    category: 'CLOUD_INFRA',
    description: '',
    amount: '',
    expense_date: '',
    is_billable: true
  });

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const res = await pmApi.getExpenses();
      if (res?.success) {
        setExpenses(res.expenses || []);
        if (res.summary) setSummary(res.summary);
      }
    } catch (err) {
      console.error('Failed to load project expenses:', err);
      setExpenses([
        { id: '1', description: 'AWS Staging Cluster & RDS Aurora', category: 'CLOUD_INFRA', amount: 24500, expense_date: '2026-09-02', is_billable: true, status: 'APPROVED', logger_name: 'Vikram Mehta', project_name: 'ERP Modernization' },
        { id: '2', description: 'Sentry Performance Monitoring Yearly', category: 'SOFTWARE_LICENSE', amount: 14000, expense_date: '2026-09-05', is_billable: false, status: 'APPROVED', logger_name: 'Ananya Sharma', project_name: 'ERP Modernization' },
        { id: '3', description: 'Specialized UI Icon Design Consultant', category: 'CONTRACTOR_FEE', amount: 18000, expense_date: '2026-09-09', is_billable: true, status: 'PENDING', logger_name: 'Karthik Raja', project_name: 'ERP Modernization' },
      ]);
      setSummary({ total_expenses: 56500, billable_expenses: 42500, pending_expenses: 18000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await pmApi.createExpense({
        ...formData,
        project_id: formData.project_id || 'default-proj-id'
      });
      setShowModal(false);
      setFormData({ project_id: '', category: 'CLOUD_INFRA', description: '', amount: '', expense_date: '', is_billable: true });
      loadExpenses();
    } catch (err) {
      alert('Failed to log expense: ' + err.message);
    }
  };

  const handleApprove = async (id) => {
    try {
      await pmApi.approveExpense(id);
      loadExpenses();
    } catch (err) {
      alert('Approval failed: ' + err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await pmApi.rejectExpense(id);
      loadExpenses();
    } catch (err) {
      alert('Rejection failed: ' + err.message);
    }
  };

  return (
    <AdminPage
      title="Project Expenses & Cost Tracking"
      subtitle="Track operational costs, cloud computing burn rates, software licenses, and client-billable outlays"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle-fill"></i>
          <span>Log Expense</span>
        </button>
      }
    >
      <div className="row g-3 mb-2">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-primary bg-opacity-10 text-primary">
            <small className="text-uppercase fw-semibold">Total Incurred</small>
            <h3 className="mb-0 fw-bold mt-1">₹{summary.total_expenses.toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-success bg-opacity-10 text-success">
            <small className="text-uppercase fw-semibold">Client Billable</small>
            <h3 className="mb-0 fw-bold mt-1">₹{summary.billable_expenses.toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-warning bg-opacity-10 text-warning">
            <small className="text-uppercase fw-semibold">Pending Approval</small>
            <h3 className="mb-0 fw-bold mt-1">₹{summary.pending_expenses.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3">
          <h6 className="mb-0 fw-bold">Expense Ledger</h6>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Description</th>
                <th>Project</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Billable</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-4">Loading expenses...</td></tr>
              ) : expenses.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-4 text-muted">No expenses recorded.</td></tr>
              ) : (
                expenses.map(exp => (
                  <tr key={exp.id}>
                    <td>
                      <div className="fw-semibold text-dark">{exp.description}</div>
                      <small className="text-muted">Logged by {exp.logger_name || 'Member'}</small>
                    </td>
                    <td><span className="badge bg-light text-dark border">{exp.project_name || 'ERP'}</span></td>
                    <td><span className="badge bg-secondary bg-opacity-10 text-secondary">{exp.category}</span></td>
                    <td><strong className="text-dark">₹{parseFloat(exp.amount || 0).toLocaleString()}</strong></td>
                    <td><small>{new Date(exp.expense_date).toLocaleDateString()}</small></td>
                    <td>
                      <span className={`badge ${exp.is_billable ? 'bg-info bg-opacity-10 text-info' : 'bg-light text-muted border'}`}>
                        {exp.is_billable ? 'Billable' : 'Internal'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${exp.status === 'APPROVED' ? 'bg-success bg-opacity-10 text-success' : exp.status === 'REJECTED' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-warning bg-opacity-10 text-warning'}`}>
                        {exp.status}
                      </span>
                    </td>
                    <td className="text-end">
                      {exp.status === 'PENDING' ? (
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-success" onClick={() => handleApprove(exp.id)} title="Approve">
                            <i className="bi bi-check-lg"></i>
                          </button>
                          <button className="btn btn-outline-danger" onClick={() => handleReject(exp.id)} title="Reject">
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted small">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Log Project Expense</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Expense Description *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Cloud Hosting Cluster Setup"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="CLOUD_INFRA">Cloud Infrastructure</option>
                        <option value="SOFTWARE_LICENSE">Software License</option>
                        <option value="HARDWARE">Hardware</option>
                        <option value="CONTRACTOR_FEE">Contractor Fee</option>
                        <option value="TRAVEL">Travel / Logistics</option>
                        <option value="MISC">Miscellaneous</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Amount (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Expense Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={formData.expense_date}
                      onChange={e => setFormData({ ...formData, expense_date: e.target.value })}
                    />
                  </div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="billableCheck"
                      checked={formData.is_billable}
                      onChange={e => setFormData({ ...formData, is_billable: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="billableCheck">
                      Billable to Client Invoice
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Log Expense</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
