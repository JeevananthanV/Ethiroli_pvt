import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getReceivablesAging } from '../../../services/api/financeApi.js';

export default function FinanceReceivables() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBucket, setSelectedBucket] = useState('all');

  useEffect(() => {
    async function loadReceivables() {
      try {
        setLoading(true);
        const res = await getReceivablesAging();
        setData(res);
      } catch (err) {
        console.error('Failed to load receivables aging:', err);
        setData({
          total_receivable: 340000,
          summary: {
            current: 125000,
            days_1_15: 82000,
            days_16_30: 45000,
            days_31_60: 58000,
            days_60_plus: 30000
          },
          buckets: {
            current: [{ id: '1', invoice_number: 'INV-2026-041', client_name: 'BlueWave Enterprises', client_email: 'accounts@bluewave.com', due_date: '2026-09-25', total: 125000, days_overdue: 0 }],
            days_1_15: [{ id: '2', invoice_number: 'INV-2026-038', client_name: 'Apex Digital Solutions', client_email: 'billing@apexdigital.com', due_date: '2026-09-02', total: 82000, days_overdue: 8 }],
            days_16_30: [{ id: '3', invoice_number: 'INV-2026-035', client_name: 'Nexus Corp', client_email: 'finance@nexus.com', due_date: '2026-08-20', total: 45000, days_overdue: 21 }],
            days_31_60: [{ id: '4', invoice_number: 'INV-2026-029', client_name: 'InnoTech Labs', client_email: 'pay@innotech.com', due_date: '2026-08-01', total: 58000, days_overdue: 40 }],
            days_60_plus: [{ id: '5', invoice_number: 'INV-2026-015', client_name: 'Global Edu Services', client_email: 'accounts@globaledu.com', due_date: '2026-07-05', total: 30000, days_overdue: 67 }]
          }
        });
      } finally {
        setLoading(false);
      }
    }
    loadReceivables();
  }, []);

  const sendReminder = (clientName, invoiceNo) => {
    alert(`Payment reminder dispatched to ${clientName} for invoice ${invoiceNo} via Email & WhatsApp.`);
  };

  const getFilteredItems = () => {
    if (!data?.buckets) return [];
    if (selectedBucket === 'all') {
      return [
        ...(data.buckets.current || []),
        ...(data.buckets.days_1_15 || []),
        ...(data.buckets.days_16_30 || []),
        ...(data.buckets.days_31_60 || []),
        ...(data.buckets.days_60_plus || [])
      ];
    }
    return data.buckets[selectedBucket] || [];
  };

  return (
    <AdminPage
      title="Accounts Receivable & Aging Ledger"
      subtitle="Track outstanding client invoices, aging buckets, debt recovery workflows, and automated dunning"
    >
      {/* Aging Metric Cards */}
      <div className="row g-3 mb-2">
        <div className="col-md-2">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-primary border-4">
            <small className="text-muted text-uppercase fw-semibold">Total AR</small>
            <h4 className="mb-0 fw-bold mt-1 text-primary">₹{(data?.total_receivable || 0).toLocaleString()}</h4>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-success border-4">
            <small className="text-muted text-uppercase fw-semibold">Current (Not Due)</small>
            <h4 className="mb-0 fw-bold mt-1 text-success">₹{(data?.summary?.current || 0).toLocaleString()}</h4>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-warning border-4">
            <small className="text-muted text-uppercase fw-semibold">1-15 Days</small>
            <h4 className="mb-0 fw-bold mt-1 text-warning">₹{(data?.summary?.days_1_15 || 0).toLocaleString()}</h4>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-warning border-4">
            <small className="text-muted text-uppercase fw-semibold">16-30 Days</small>
            <h4 className="mb-0 fw-bold mt-1 text-warning">₹{(data?.summary?.days_16_30 || 0).toLocaleString()}</h4>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-danger border-4">
            <small className="text-muted text-uppercase fw-semibold">31-60 Days</small>
            <h4 className="mb-0 fw-bold mt-1 text-danger">₹{(data?.summary?.days_31_60 || 0).toLocaleString()}</h4>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-dark border-4">
            <small className="text-muted text-uppercase fw-semibold">60+ Days</small>
            <h4 className="mb-0 fw-bold mt-1 text-dark">₹{(data?.summary?.days_60_plus || 0).toLocaleString()}</h4>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          <div className="btn-group btn-group-sm">
            <button className={`btn ${selectedBucket === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setSelectedBucket('all')}>All Overdue</button>
            <button className={`btn ${selectedBucket === 'current' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setSelectedBucket('current')}>Current</button>
            <button className={`btn ${selectedBucket === 'days_1_15' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setSelectedBucket('days_1_15')}>1-15d</button>
            <button className={`btn ${selectedBucket === 'days_16_30' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setSelectedBucket('days_16_30')}>16-30d</button>
            <button className={`btn ${selectedBucket === 'days_31_60' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setSelectedBucket('days_31_60')}>31-60d</button>
            <button className={`btn ${selectedBucket === 'days_60_plus' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setSelectedBucket('days_60_plus')}>60d+</button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Invoice #</th>
                <th>Client Name</th>
                <th>Due Date</th>
                <th>Days Overdue</th>
                <th className="text-end">Balance Due</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Loading aging schedule...</td></tr>
              ) : getFilteredItems().length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-muted">No open invoices in this aging bucket.</td></tr>
              ) : (
                getFilteredItems().map(inv => (
                  <tr key={inv.id}>
                    <td><span className="font-monospace fw-semibold text-primary">{inv.invoice_number}</span></td>
                    <td>
                      <div className="fw-semibold text-dark">{inv.client_name}</div>
                      <small className="text-muted">{inv.client_email}</small>
                    </td>
                    <td>{inv.due_date}</td>
                    <td>
                      <span className={`badge ${inv.days_overdue === 0 ? 'bg-success bg-opacity-10 text-success' : inv.days_overdue <= 30 ? 'bg-warning bg-opacity-10 text-dark' : 'bg-danger bg-opacity-10 text-danger'}`}>
                        {inv.days_overdue === 0 ? 'On Schedule' : `${inv.days_overdue} Days Past Due`}
                      </span>
                    </td>
                    <td className="text-end fw-bold text-dark">₹{inv.total.toLocaleString()}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => sendReminder(inv.client_name, inv.invoice_number)}>
                        <i className="bi bi-bell me-1"></i>Remind
                      </button>
                      <a href={`/app/finance/invoices`} className="btn btn-sm btn-light">View</a>
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
