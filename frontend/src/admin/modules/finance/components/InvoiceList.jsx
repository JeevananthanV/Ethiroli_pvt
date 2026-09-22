import React, { useEffect, useState } from 'react';
import { getInvoices } from '../../../../services/api/invoiceApi.js';

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getInvoices().catch(() => []);
        setInvoices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load invoices:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading invoices...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Invoices</h2>
          <p className="pageSubtitle">Manage billing invoices</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {invoices.length === 0 ? (
            <div className="emptyState"><h3>No Invoices</h3><p>Generate your first invoice.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Invoice ID</th><th>Client</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td><code>{inv.invoiceNumber || inv.id}</code></td>
                    <td>{inv.clientName || inv.client?.name || '—'}</td>
                    <td>${(inv.total || inv.amount || 0).toLocaleString()}</td>
                    <td><span className={`statusTag ${inv.status || 'pending'}`}>{inv.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
