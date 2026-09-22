import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage';
import { invoiceApi } from '../../../services/api/invoiceApi';

export default function PMInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const res = await invoiceApi.getAll();
        const list = Array.isArray(res) ? res : (res?.invoices || []);
        setInvoices(list);
      } catch (err) {
        console.error('Failed to load PM invoices:', err);
        setInvoices([
          { id: '1', invoice_number: 'INV-2026-001', client_name: 'Acme Technologies', total: 45000, status: 'PAID', issue_date: '2026-08-15', due_date: '2026-09-01' },
          { id: '2', invoice_number: 'INV-2026-002', client_name: 'Apex Digital', total: 82000, status: 'SENT', issue_date: '2026-09-01', due_date: '2026-09-15' },
          { id: '3', invoice_number: 'INV-2026-003', client_name: 'Nexus Corp', total: 30000, status: 'OVERDUE', issue_date: '2026-08-01', due_date: '2026-08-20' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const filtered = invoices.filter(inv => {
    if (filter === 'ALL') return true;
    return inv.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return <span className="badge bg-success bg-opacity-10 text-success">Paid</span>;
      case 'SENT':
        return <span className="badge bg-primary bg-opacity-10 text-primary">Sent / Pending</span>;
      case 'OVERDUE':
        return <span className="badge bg-danger bg-opacity-10 text-danger">Overdue</span>;
      default:
        return <span className="badge bg-secondary bg-opacity-10 text-secondary">{status}</span>;
    }
  };

  return (
    <AdminPage
      title="Project Invoices & Billing"
      subtitle="Track milestone billables, client invoices, and payment statuses for active deliverables"
    >
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
          <h6 className="mb-0 fw-bold">Client Invoices</h6>
          <div className="btn-group">
            <button className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-light'}`} onClick={() => setFilter('ALL')}>All</button>
            <button className={`btn btn-sm ${filter === 'PAID' ? 'btn-primary' : 'btn-light'}`} onClick={() => setFilter('PAID')}>Paid</button>
            <button className={`btn btn-sm ${filter === 'SENT' ? 'btn-primary' : 'btn-light'}`} onClick={() => setFilter('SENT')}>Pending</button>
            <button className={`btn btn-sm ${filter === 'OVERDUE' ? 'btn-primary' : 'btn-light'}`} onClick={() => setFilter('OVERDUE')}>Overdue</button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Loading invoices...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No invoices found.</td></tr>
              ) : (
                filtered.map(inv => (
                  <tr key={inv.id}>
                    <td><strong className="text-dark font-monospace">{inv.invoice_number}</strong></td>
                    <td>{inv.client_name || 'Client'}</td>
                    <td>{new Date(inv.issue_date).toLocaleDateString()}</td>
                    <td>{new Date(inv.due_date).toLocaleDateString()}</td>
                    <td><strong className="text-dark">₹{parseFloat(inv.total).toLocaleString()}</strong></td>
                    <td>{getStatusBadge(inv.status)}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary">View PDF</button>
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
