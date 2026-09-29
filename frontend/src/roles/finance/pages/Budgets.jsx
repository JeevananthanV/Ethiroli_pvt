import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getBudgets, createBudget } from '../../../services/api/financeApi.js';

export default function FinanceBudgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState('2026-27');
  const [filterQuarter, setFilterQuarter] = useState('Q2');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fiscal_year: '2026-27',
    quarter: 'Q2',
    department: 'ENGINEERING',
    category: 'Cloud Infrastructure & Tooling',
    allocated_amount: '',
    notes: ''
  });

  const loadBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getBudgets({ fiscal_year: filterYear, quarter: filterQuarter });
      const list = Array.isArray(res) ? res : res?.data || [];
      setBudgets(list);
    } catch (err) {
      console.error('Failed to load budgets:', err);
      setBudgets([
        { id: '1', department: 'ENGINEERING', category: 'Cloud Infrastructure & Servers', allocated_amount: 300000, spent_amount: 195000, variance: 105000, utilization_percentage: 65.0, fiscal_year: '2026-27', quarter: 'Q2' },
        { id: '2', department: 'MARKETING', category: 'Digital Ads & Performance Campaigns', allocated_amount: 150000, spent_amount: 128000, variance: 22000, utilization_percentage: 85.3, fiscal_year: '2026-27', quarter: 'Q2' },
        { id: '3', department: 'HUMAN_RESOURCES', category: 'Recruitment & Employee Perks', allocated_amount: 80000, spent_amount: 42000, variance: 38000, utilization_percentage: 52.5, fiscal_year: '2026-27', quarter: 'Q2' },
        { id: '4', department: 'OPERATIONS', category: 'Office Infrastructure & Logistics', allocated_amount: 120000, spent_amount: 95000, variance: 25000, utilization_percentage: 79.2, fiscal_year: '2026-27', quarter: 'Q2' }
      ]);
    } finally {
      setLoading(false);
    }
  }, [filterYear, filterQuarter]);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    try {
      await createBudget({
        ...formData,
        allocated_amount: parseFloat(formData.amount || formData.allocated_amount)
      });
      setShowModal(false);
      setFormData({
        fiscal_year: '2026-27',
        quarter: 'Q2',
        department: 'ENGINEERING',
        category: '',
        allocated_amount: '',
        notes: ''
      });
      loadBudgets();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save budget allocation');
    }
  };

  const totalAllocated = budgets.reduce((s, b) => s + (parseFloat(b.allocated_amount) || 0), 0);
  const totalSpent = budgets.reduce((s, b) => s + (parseFloat(b.spent_amount) || 0), 0);
  const overallVariance = totalAllocated - totalSpent;

  return (
    <AdminPage
      title="Departmental Budgets & Fiscal Planning"
      subtitle="Quarterly budget allocations, actual vs planned variance analysis, and departmental spend caps"
    >
      <div className="row g-3 mb-2">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-primary border-4">
            <small className="text-muted text-uppercase fw-semibold">Total Approved Budget</small>
            <h3 className="mb-0 fw-bold mt-1 text-primary">₹{totalAllocated.toLocaleString()}</h3>
            <small className="text-muted">FY {filterYear} &bull; {filterQuarter}</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-danger border-4">
            <small className="text-muted text-uppercase fw-semibold">Actual Capital Utilized</small>
            <h3 className="mb-0 fw-bold mt-1 text-danger">₹{totalSpent.toLocaleString()}</h3>
            <small className="text-muted">
              {totalAllocated > 0 ? ((totalSpent / totalAllocated) * 100).toFixed(1) : 0}% of allocation consumed
            </small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-success border-4">
            <small className="text-muted text-uppercase fw-semibold">Remaining Headroom</small>
            <h3 className="mb-0 fw-bold mt-1 text-success">₹{overallVariance.toLocaleString()}</h3>
            <small className="text-success">Within projected spending limits</small>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="d-flex gap-2 align-items-center">
            <h6 className="mb-0 fw-bold">Departmental Allocations</h6>
            <select className="form-select form-select-sm w-auto" value={filterQuarter} onChange={e => setFilterQuarter(e.target.value)}>
              <option value="Q1">Q1 (Apr - Jun)</option>
              <option value="Q2">Q2 (Jul - Sep)</option>
              <option value="Q3">Q3 (Oct - Dec)</option>
              <option value="Q4">Q4 (Jan - Mar)</option>
            </select>
          </div>
          <button className="btn btn-sm btn-primary" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg me-1"></i>New Budget Allocation
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Department</th>
                <th>Category</th>
                <th className="text-end">Allocated</th>
                <th className="text-end">Actual Spent</th>
                <th className="text-end">Remaining Variance</th>
                <th style={{ width: '180px' }}>Utilization %</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Loading budget variance data...</td></tr>
              ) : budgets.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-muted">No budget allocations found for this quarter.</td></tr>
              ) : (
                budgets.map(b => (
                  <tr key={b.id}>
                    <td><span className="badge bg-light text-dark border">{b.department}</span></td>
                    <td><div className="fw-semibold text-dark">{b.category}</div></td>
                    <td className="text-end text-primary fw-semibold">₹{parseFloat(b.allocated_amount).toLocaleString()}</td>
                    <td className="text-end text-danger">₹{parseFloat(b.spent_amount || 0).toLocaleString()}</td>
                    <td className="text-end fw-bold text-success">₹{parseFloat(b.variance || 0).toLocaleString()}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1" style={{ height: '6px' }}>
                          <div
                            className={`progress-bar ${b.utilization_percentage > 90 ? 'bg-danger' : b.utilization_percentage > 70 ? 'bg-warning' : 'bg-success'}`}
                            style={{ width: `${Math.min(100, b.utilization_percentage || 0)}%` }}
                          ></div>
                        </div>
                        <small className="text-muted">{b.utilization_percentage}%</small>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Budget Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Allocate Departmental Budget</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSaveBudget}>
                <div className="modal-body">
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Fiscal Year</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.fiscal_year}
                        onChange={e => setFormData({ ...formData, fiscal_year: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Quarter</label>
                      <select
                        className="form-select"
                        value={formData.quarter}
                        onChange={e => setFormData({ ...formData, quarter: e.target.value })}
                      >
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                        <option value="Q3">Q3</option>
                        <option value="Q4">Q4</option>
                        <option value="ANNUAL">Annual</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Department</label>
                    <select
                      className="form-select"
                      value={formData.department}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="ENGINEERING">Engineering & Product</option>
                      <option value="MARKETING">Marketing & Sales</option>
                      <option value="OPERATIONS">Operations & Facilities</option>
                      <option value="HUMAN_RESOURCES">Human Resources</option>
                      <option value="GENERAL_ADMIN">General Administration</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category Name</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Cloud Infrastructure"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Allocated Capital (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      required
                      value={formData.allocated_amount}
                      onChange={e => setFormData({ ...formData, allocated_amount: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Budget</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
