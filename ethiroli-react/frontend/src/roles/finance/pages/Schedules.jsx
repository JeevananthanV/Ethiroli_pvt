import React, { useEffect, useState, useCallback } from 'react';
import { listSubscriptions } from '../../../services/api/subscriptionApi.js';
import { listReportDefinitions, executeReport } from '../../../services/api/reportApi.js';

export default function FinanceSchedules() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportDefs, setReportDefs] = useState([]);
  const [reportResult, setReportResult] = useState(null);
  const [runningReport, setRunningReport] = useState(false);

  const fetchSubs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listSubscriptions({ status: 'active' });
      const list = Array.isArray(data) ? data : data.subscriptions || data.data || [];
      setSubscriptions(list);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubs();
    (async () => {
      try {
        const data = await listReportDefinitions();
        setReportDefs(Array.isArray(data) ? data : data.definitions || data.data || []);
      } catch (err) {
        console.error('Failed to load report definitions', err);
      }
    })();
  }, [fetchSubs]);

  const runReport = async (defId) => {
    setRunningReport(true);
    setReportResult(null);
    try {
      const result = await executeReport(defId, {});
      setReportResult(result);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to run report');
    } finally {
      setRunningReport(false);
    }
  };

  const formatCurrency = (val) => {
    if (val === null || val === undefined) return '₹0';
    return '₹' + Number(val).toLocaleString('en-IN');
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Schedules</h1>
          <p className="pageSubtitle">Recurring payouts schedule: subscription renewals, salary cycles, and tax deposits</p>
        </div>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--admin-danger)', fontSize: 13 }}>{error}</span>
            <button className="btn secondary btnSm" onClick={fetchSubs}>Retry</button>
          </div>
        </div>
      )}

      <div className="dashboardGrid" style={{ marginBottom: 24 }}>
        <div className="statCard">
          <p className="statLabel">Active Subscriptions</p>
          <p className="statValue">{subscriptions.length}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Monthly Recurring</p>
          <p className="statValue">{formatCurrency(subscriptions.reduce((s, sub) => s + (Number(sub.amount) || 0), 0))}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Upcoming Renewals</h3>
          </div>
          <div className="cardBody" style={{ padding: 0 }}>
            {loading ? (
              <div className="loading">
                <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }}></div>
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 8 }}></div>
                  <div className="skeleton" style={{ width: '40%', height: 12 }}></div>
                </div>
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="emptyState" style={{ padding: '24px 16px' }}>
                <p style={{ fontSize: 13 }}>No active subscriptions found.</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Renewal Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions
                    .sort((a, b) => new Date(a.renewalDate || a.endDate || '9999') - new Date(b.renewalDate || b.endDate || '9999'))
                    .map((sub) => (
                      <tr key={sub.id || sub._id}>
                        <td style={{ fontWeight: 600 }}>{sub.clientName || sub.client?.name || '—'}</td>
                        <td>{sub.planName || sub.plan || 'Standard'}</td>
                        <td>{formatCurrency(sub.amount)}</td>
                        <td>{formatDate(sub.renewalDate || sub.endDate)}</td>
                        <td>
                          <span className={`statusTag ${sub.status || 'active'}`}>{sub.status || 'active'}</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Report Definitions</h3>
          </div>
          <div className="cardBody">
            {reportDefs.length === 0 ? (
              <p style={{ color: 'var(--admin-text-muted)', fontSize: 13 }}>No report definitions configured.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {reportDefs.map((def) => (
                  <div key={def.id || def._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--admin-bg-input)', borderRadius: 8, border: '1px solid var(--admin-border-subtle)' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: 'var(--admin-text-primary)' }}>{def.name || def.title || 'Report'}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--admin-text-muted)' }}>{def.type || 'General'}</p>
                    </div>
                    <button className="btn primary btnSm" onClick={() => runReport(def.id || def._id)} disabled={runningReport}>
                      {runningReport ? 'Running...' : 'Run'}
                    </button>
                  </div>
                ))}
              </div>
            )}
            {reportResult && (
              <div style={{ marginTop: 16, padding: 12, background: 'var(--admin-bg-input)', borderRadius: 8, border: '1px solid var(--admin-border-subtle)', fontSize: 12, color: 'var(--admin-text-secondary)', whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto' }}>
                {JSON.stringify(reportResult, null, 2)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
