import React, { useEffect, useState } from 'react';
import { getPayments } from '../../../../services/api/paymentApi.js';

export default function PaymentTracker() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getPayments().catch(() => []);
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load payments:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading payments...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Payment Tracker</h2>
          <p className="pageSubtitle">Track payment transactions</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {payments.length === 0 ? (
            <div className="emptyState"><h3>No Payments</h3><p>Record payments to start tracking.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Date</th><th>Invoice</th><th>Amount</th><th>Method</th></tr></thead>
              <tbody>
                {payments.map((pay) => (
                  <tr key={pay.id}>
                    <td>{pay.date ? new Date(pay.date).toLocaleDateString() : '—'}</td>
                    <td><code>{pay.invoiceNumber || pay.id}</code></td>
                    <td>${(pay.amount || 0).toLocaleString()}</td>
                    <td>{pay.method || '—'}</td>
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
