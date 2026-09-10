import React, { useEffect, useState } from 'react';
import { getSubscriptions } from '../../../../services/api/subscriptionApi.js';

export default function RecurringScheduleForm() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getSubscriptions().catch(() => []);
        setSubscriptions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load subscriptions:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading subscriptions...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Recurring Schedules</h2>
          <p className="pageSubtitle">Subscription renewals and recurring payments</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {subscriptions.length === 0 ? (
            <div className="emptyState"><h3>No Subscriptions</h3><p>No active subscriptions found.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Client</th><th>Plan</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.clientName || sub.client?.name || '—'}</td>
                    <td>{sub.planName || sub.plan || 'Standard'}</td>
                    <td>${(sub.amount || 0).toLocaleString()}</td>
                    <td><span className={`statusTag ${sub.status || 'active'}`}>{sub.status}</span></td>
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
