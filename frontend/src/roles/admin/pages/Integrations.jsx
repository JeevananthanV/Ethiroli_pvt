import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage';
import { integrationApi } from '../../../services/api/integrationApi';
import { usePushNotification } from '../../../hooks/usePushNotification';
import Button from '../../../common/components/Button';

export default function AdminIntegrations() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Brevo state
  const [brevoQuota, setBrevoQuota] = useState(null);
  const [testEmail, setTestEmail] = useState('');
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState(null);

  // n8n state
  const [testingN8n, setTestingN8n] = useState(false);
  const [n8nStatus, setN8nStatus] = useState(null);

  // FCM Push Hook
  const { isEnabled: isPushActive, loading: pushLoading, requestPermission, sendTest: sendTestPush } = usePushNotification();
  const [pushStatusMessage, setPushStatusMessage] = useState(null);

  const fetchIntegrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const [intData, quotaData] = await Promise.all([
        integrationApi.getIntegrations().catch(() => []),
        integrationApi.getBrevoQuota().catch(() => null)
      ]);
      setIntegrations(Array.isArray(intData) ? intData : intData?.data || []);
      setBrevoQuota(quotaData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleTestEmail = async (e) => {
    e.preventDefault();
    if (!testEmail) return;
    setSendingTestEmail(true);
    setEmailStatusMessage(null);
    try {
      const res = await integrationApi.sendBrevoTest(testEmail);
      setEmailStatusMessage({ type: 'success', text: `Test email dispatched to ${testEmail}!` });
      // refresh quota
      const updatedQuota = await integrationApi.getBrevoQuota();
      setBrevoQuota(updatedQuota);
    } catch (err) {
      setEmailStatusMessage({ type: 'error', text: err.message || 'Failed to send test email' });
    } finally {
      setSendingTestEmail(false);
    }
  };

  const handleTestN8n = async () => {
    setTestingN8n(true);
    setN8nStatus(null);
    try {
      const res = await integrationApi.testN8n('http://localhost:5678/webhook/ethiroli', 'ethiroli_n8n_secret_key_2026');
      setN8nStatus({ type: res.success ? 'success' : 'info', text: res.message });
    } catch (err) {
      setN8nStatus({ type: 'error', text: err.message });
    } finally {
      setTestingN8n(false);
    }
  };

  const handleTestPush = async () => {
    setPushStatusMessage(null);
    try {
      const res = await sendTestPush();
      setPushStatusMessage({ type: 'success', text: 'Test push notification dispatched to your browser!' });
    } catch (err) {
      setPushStatusMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <AdminPage
      title="Third-Party Integrations"
      subtitle="₹0-First Cloud & Self-Hosted Integration Hub"
      loading={loading}
      error={error}
      onRetry={fetchIntegrations}
      actions={
        <Button variant="secondary" onClick={fetchIntegrations}>
          Refresh Status
        </Button>
      }
    >
      {/* 4 Core ₹0-First Integration Cards Grid */}
      <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#1e293b' }}>
        Core ₹0-First Architecture Stack
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {/* Card 1: Brevo Email (300/day Free Tier) */}
        <div className="card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                ✉️ Brevo (300/day Free Tier)
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                SMTP Relay (smtp-relay.brevo.com:587) + REST API
              </p>
            </div>
            <span className="statusTag active">Active</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              <span>Daily Quota Usage</span>
              <span>{brevoQuota?.sent ?? 0} / {brevoQuota?.limit ?? 300} used ({brevoQuota?.remaining ?? 300} left)</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${brevoQuota?.percentage ?? 0}%`,
                  height: '100%',
                  background: (brevoQuota?.percentage ?? 0) > 85 ? '#ef4444' : '#10b981',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          <form onSubmit={handleTestEmail} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="email"
              placeholder="recipient@example.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              style={{
                flex: 1,
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '12px'
              }}
            />
            <button
              type="submit"
              className="btn primary small"
              disabled={sendingTestEmail || !testEmail}
            >
              {sendingTestEmail ? 'Sending...' : 'Test Send'}
            </button>
          </form>
          {emailStatusMessage && (
            <p style={{ margin: '8px 0 0', fontSize: '12px', color: emailStatusMessage.type === 'success' ? '#10b981' : '#ef4444' }}>
              {emailStatusMessage.text}
            </p>
          )}
        </div>

        {/* Card 2: Self-Hosted n8n Workflows */}
        <div className="card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                ⚡ Self-Hosted n8n Workflows
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                Event Dispatcher & Inbound Automation Actions
              </p>
            </div>
            <span className="statusTag active">Active</span>
          </div>

          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px' }}>
            Automate candidate onboarding, CRM lead scoring, and notifications via Docker or npx on port 5678.
          </p>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className="btn secondary small"
              onClick={handleTestN8n}
              disabled={testingN8n}
            >
              {testingN8n ? 'Testing...' : 'Ping n8n Webhook'}
            </button>
            <a
              href="/app/interviews/indeed"
              className="btn secondary small"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
              Manage Webhooks
            </a>
          </div>

          {n8nStatus && (
            <p style={{ margin: '8px 0 0', fontSize: '12px', color: n8nStatus.type === 'error' ? '#ef4444' : '#0284c7' }}>
              {n8nStatus.text}
            </p>
          )}
        </div>

        {/* Card 3: Firebase FCM (Push Notifications) */}
        <div className="card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                🔔 Firebase FCM (Push Notifications)
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                Unlimited Desktop & Mobile Web Push (₹0 Tier)
              </p>
            </div>
            <span className={`statusTag ${isPushActive ? 'active' : 'pending'}`}>
              {isPushActive ? 'Subscribed' : 'Permission Needed'}
            </span>
          </div>

          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px' }}>
            Receives real-time application alerts, new leads, and system messages across all role portals.
          </p>

          <div style={{ display: 'flex', gap: '8px' }}>
            {!isPushActive ? (
              <button
                className="btn primary small"
                onClick={requestPermission}
                disabled={pushLoading}
              >
                {pushLoading ? 'Enabling...' : 'Enable Browser Push'}
              </button>
            ) : (
              <button
                className="btn secondary small"
                onClick={handleTestPush}
              >
                Dispatch Test Push
              </button>
            )}
          </div>

          {pushStatusMessage && (
            <p style={{ margin: '8px 0 0', fontSize: '12px', color: pushStatusMessage.type === 'success' ? '#10b981' : '#ef4444' }}>
              {pushStatusMessage.text}
            </p>
          )}
        </div>

        {/* Card 4: Indeed Candidate Ingestion & Organic XML */}
        <div className="card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                💼 Indeed Job Syndication & Apply
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                Free Organic XML Crawler & Apply Ingestion
              </p>
            </div>
            <span className="statusTag active">Active</span>
          </div>

          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px' }}>
            Distributes job postings organically to Indeed and ingests candidate applications directly into HR portal.
          </p>

          <div style={{ display: 'flex', gap: '8px' }}>
            <a
              href="/api/v1/jobs-board/indeed/feed.xml"
              target="_blank"
              rel="noreferrer"
              className="btn secondary small"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
              View XML Feed
            </a>
            <a
              href="/app/interviews/indeed"
              className="btn primary small"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
              Test Ingestion
            </a>
          </div>
        </div>
      </div>

      {/* All Integrations Table */}
      <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#1e293b' }}>
        Registered System Integrations
      </h2>

      <div className="card">
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Last Synced</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {integrations.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>
                    <span className="textMuted">No integrations registered</span>
                  </td>
                </tr>
              ) : (
                integrations.map((i) => (
                  <tr key={i.id}>
                    <td style={{ fontWeight: 600 }}>{i.service_name || i.name}</td>
                    <td><span className="badge">{i.category || 'GENERAL'}</span></td>
                    <td>
                      <span className={`statusTag ${i.connection_status === 'CONNECTED' ? 'active' : 'pending'}`}>
                        {i.connection_status || 'CONNECTED'}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: '#64748b' }}>
                      {i.last_synced_at ? new Date(i.last_synced_at).toLocaleString() : 'Recent'}
                    </td>
                    <td>
                      <button
                        className="btn secondary small"
                        onClick={async () => {
                          const res = await integrationApi.testConnection(i.id);
                          alert(res.message || 'Connection test completed');
                          fetchIntegrations();
                        }}
                      >
                        Test Connection
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
