import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function ReceptionPayments() {
  const [payments, setPayments] = useState([
    { id: '1', receipt_no: 'REC-20260910-0501', student_name: 'Aravind Swamy', purpose: 'Full Stack Admission Fee', amount: 15000, method: 'UPI (GPay)', date: 'Today 11:30 AM', status: 'SUCCESS' },
    { id: '2', receipt_no: 'REC-20260910-0502', student_name: 'Divya Bharathi', purpose: 'Data Science Installment 1', amount: 10000, method: 'Card (POS)', date: 'Today 10:15 AM', status: 'SUCCESS' },
    { id: '3', receipt_no: 'REC-20260910-0503', student_name: 'Vikram Sundar', purpose: 'Identity Card & Exam Fee', amount: 1500, method: 'Cash Counter', date: 'Yesterday', status: 'SUCCESS' },
    { id: '4', receipt_no: 'REC-20260909-0498', student_name: 'Kishore Kumar', purpose: 'Cloud DevOps Registration Deposit', amount: 5000, method: 'UPI (PhonePe)', date: 'Yesterday 03:45 PM', status: 'SUCCESS' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('');

  const [newPayment, setNewPayment] = useState({
    student_name: '',
    purpose: 'Tuition Fee Installment',
    amount: '',
    method: 'UPI (GPay / PhonePe)',
    transaction_ref: ''
  });

  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const digitalTotal = payments.filter(p => !p.method.includes('Cash')).reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const cashTotal = payments.filter(p => p.method.includes('Cash')).reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const handleCollect = (e) => {
    e.preventDefault();
    const receiptNo = `REC-20260910-${500 + payments.length + 1}`;
    setPayments([
      {
        id: String(Date.now()),
        receipt_no: receiptNo,
        student_name: newPayment.student_name,
        purpose: newPayment.purpose,
        amount: Number(newPayment.amount),
        method: newPayment.method,
        date: 'Just now',
        status: 'SUCCESS'
      },
      ...payments
    ]);
    setShowModal(false);
    setNewPayment({ student_name: '', purpose: 'Tuition Fee Installment', amount: '', method: 'UPI (GPay / PhonePe)', transaction_ref: '' });
  };

  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.student_name.toLowerCase().includes(q) || p.receipt_no.toLowerCase().includes(q) || p.purpose.toLowerCase().includes(q);
    const matchMode = modeFilter ? p.method.includes(modeFilter) : true;
    return matchSearch && matchMode;
  });

  return (
    <AdminPage
      title="Front Desk Payments & Fee Counter"
      subtitle="Accept admissions fees, register installment payments, issue instant digital receipts, and balance cash drawers"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => setShowModal(true)}>
          <i className="bi bi-credit-card-2-front-fill"></i>
          <span>Collect Fee Payment</span>
        </button>
      }
    >
      {/* Financial Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Total Counter Collection</span>
            <h3 className="mb-0 fw-bold mt-1 text-primary">₹{totalCollected.toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Digital (UPI / POS Card)</span>
            <h3 className="mb-0 fw-bold mt-1 text-success">₹{digitalTotal.toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Physical Cash Drawer</span>
            <h3 className="mb-0 fw-bold mt-1 text-warning">₹{cashTotal.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 mb-4 bg-white">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-8">
            <div className="input-group">
              <span className="input-group-text bg-light border-0"><i className="bi bi-search text-muted"></i></span>
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Search by student name, receipt number, or purpose..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <select
              className="form-select bg-light border-0"
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
            >
              <option value="">All Payment Modes</option>
              <option value="UPI">UPI (GPay / PhonePe)</option>
              <option value="Card">Card (POS Terminal)</option>
              <option value="Cash">Cash Counter</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">Receipt #</th>
                <th>Student / Trainee</th>
                <th>Fee Particulars</th>
                <th>Amount</th>
                <th>Payment Mode</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td className="ps-3">
                    <span className="font-monospace text-primary fw-bold">{p.receipt_no}</span>
                  </td>
                  <td>
                    <div className="fw-semibold text-dark">{p.student_name}</div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border px-2 py-1">{p.purpose}</span>
                  </td>
                  <td>
                    <span className="fw-bold text-dark">₹{p.amount.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="badge bg-secondary bg-opacity-10 text-dark">
                      <i className="bi bi-wallet2 me-1"></i>{p.method}
                    </span>
                  </td>
                  <td>
                    <small className="text-muted">{p.date}</small>
                  </td>
                  <td>
                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                      <i className="bi bi-check-circle-fill me-1"></i>Paid
                    </span>
                  </td>
                  <td className="text-end pe-3">
                    <a href="/app/reception/receipts" className="btn btn-sm btn-outline-primary" title="View Official Receipt">
                      <i className="bi bi-receipt me-1"></i>Receipt
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Record Counter Fee Payment</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCollect}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Student / Candidate Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={newPayment.student_name}
                        onChange={(e) => setNewPayment({ ...newPayment, student_name: e.target.value })}
                        placeholder="e.g. Aravind Swamy"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Amount (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        min="1"
                        value={newPayment.amount}
                        onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                        placeholder="e.g. 15000"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Payment Mode</label>
                      <select
                        className="form-select"
                        value={newPayment.method}
                        onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                      >
                        <option value="UPI (GPay / PhonePe)">UPI (GPay / PhonePe / Paytm)</option>
                        <option value="Card (POS Terminal)">Card (POS Swiping Terminal)</option>
                        <option value="Cash Counter">Cash Drawer Counter</option>
                        <option value="Bank Transfer (NEFT/IMPS)">Bank Transfer (NEFT/IMPS)</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Fee Particulars / Description</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newPayment.purpose}
                        onChange={(e) => setNewPayment({ ...newPayment, purpose: e.target.value })}
                        placeholder="e.g. Full Stack Course Installment 1 / ID Card Fee"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Generate Receipt & Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
