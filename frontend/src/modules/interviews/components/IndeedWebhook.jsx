import React, { useState, useEffect } from 'react';
import AdminPage from '../../common/components/AdminPage';
import Button from '../../common/components/Button';
import Modal from '../../common/components/Modal';
import Input from '../../common/components/Input';
import { webhookApi } from '../../services/api/webhookApi';
import { integrationApi } from '../../services/api/integrationApi';

export default function IndeedWebhook() {
  const [webhooks, setWebhooks] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [copiedFeed, setCopiedFeed] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const [form, setForm] = useState({ name: '', url: '', method: 'POST', events: '' });

  const feedUrl = `${window.location.protocol}//${window.location.hostname}:5000/api/v1/jobs-board/indeed/feed.xml`;
  const inboundWebhookUrl = `${window.location.protocol}//${window.location.hostname}:5000/api/v1/webhooks/indeed/apply`;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [webhooksData, integrationsData] = await Promise.all([
        webhookApi.getAll().catch(() => []),
        integrationApi.getIntegrations().catch(() => [])
      ]);
      setWebhooks(Array.isArray(webhooksData) ? webhooksData : webhooksData?.items || []);
      setIntegrations(Array.isArray(integrationsData) ? integrationsData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedWebhook(null);
    setForm({ name: '', url: '', method: 'POST', events: '' });
    setModalOpen(true);
  };

  const handleEdit = (webhook) => {
    setSelectedWebhook(webhook);
    setForm({
      name: webhook.name || '',
      url: webhook.url || '',
      method: webhook.method || 'POST',
      events: Array.isArray(webhook.events) ? webhook.events.join(', ') : webhook.events || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        events: form.events.split(',').map((e) => e.trim()).filter(Boolean)
      };
      if (selectedWebhook) {
        await webhookApi.update(selectedWebhook.id, payload);
        setWebhooks(webhooks.map((w) => (w.id === selectedWebhook.id ? { ...w, ...payload } : w)));
      } else {
        const data = await webhookApi.create(payload);
        setWebhooks([...webhooks, data]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTest = async (webhook) => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await webhookApi.test(webhook.id);
      setTestResult(result);
    } catch (err) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setTesting(false);
    }
  };

  const handleSimulateIndeed = async () => {
    setSimulating(true);
    setSimulationResult(null);
    try {
      const result = await webhookApi.simulateIndeedApplication({
        applicant: {
          fullName: 'Priya Sharma (Indeed Applicant)',
          email: `priya.sharma.${Date.now().toString().slice(-4)}@example.com`,
          phoneNumber: '+91 98401 23456',
          resumeUrl: 'https://ethiroli.com/resumes/priya_sharma_lead_dev.pdf',
          applicantId: `ind_app_${Date.now()}`
        }
      });
      setSimulationResult(result);
    } catch (err) {
      setSimulationResult({ success: false, error: err.message });
    } finally {
      setSimulating(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'feed') {
      setCopiedFeed(true);
      setTimeout(() => setCopiedFeed(false), 2000);
    } else {
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    }
  };

  return (
    <AdminPage
      title="Indeed Integration & Webhooks"
      subtitle="Configure free organic job syndication feed & candidate application ingestion"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" onClick={handleSimulateIndeed} disabled={simulating}>
            {simulating ? 'Ingesting...' : '⚡ Test Indeed Ingestion'}
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            Add Webhook
          </Button>
        </div>
      }
    >
      {/* Simulation Result Alert */}
      {simulationResult && (
        <div
          style={{
            background: simulationResult.success ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${simulationResult.success ? '#10b981' : '#ef4444'}`,
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}
        >
          <h4 style={{ color: simulationResult.success ? '#065f46' : '#991b1b', margin: '0 0 8px 0' }}>
            {simulationResult.success ? '✅ Indeed Candidate Successfully Ingested!' : '❌ Ingestion Error'}
          </h4>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#334155' }}>
            {simulationResult.success
              ? `Candidate "${simulationResult.applicantName}" was ingested into candidates & career_applications. HR portal received real-time Socket.IO and Push Notification alert.`
              : simulationResult.error}
          </p>
          <Button size="small" variant="secondary" onClick={() => setSimulationResult(null)}>
            Dismiss
          </Button>
        </div>
      )}

      {/* Indeed Quick Setup Card */}
      <div className="card mb4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
        <div className="cardHeader" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
          <h3 className="cardTitle" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <span style={{ color: '#2557a7', fontWeight: 'bold' }}>indeed</span> Free Organic Job Syndication & Apply Hub
          </h3>
          <span className="statusTag active" style={{ marginLeft: 'auto' }}>
            ₹0-First Active
          </span>
        </div>
        <div className="cardBody" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              1. Indeed XML Job Feed URL (Organic Crawler)
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                readOnly
                value={feedUrl}
                style={{
                  flex: 1,
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  fontFamily: 'monospace'
                }}
              />
              <button
                className="btn secondary small"
                onClick={() => copyToClipboard(feedUrl, 'feed')}
                style={{ minWidth: '90px' }}
              >
                {copiedFeed ? 'Copied!' : 'Copy Feed'}
              </button>
              <a
                href={feedUrl}
                target="_blank"
                rel="noreferrer"
                className="btn secondary small"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
              >
                View XML
              </a>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Submit this URL in your Indeed Employer dashboard under XML Feeds. Indeed crawls this hourly at ₹0 cost.
            </p>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              2. Indeed Apply Inbound Webhook Endpoint
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                readOnly
                value={inboundWebhookUrl}
                style={{
                  flex: 1,
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  fontFamily: 'monospace'
                }}
              />
              <button
                className="btn secondary small"
                onClick={() => copyToClipboard(inboundWebhookUrl, 'webhook')}
                style={{ minWidth: '90px' }}
              >
                {copiedWebhook ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Point Indeed Apply candidate webhooks here. Candidate profiles, resumes, and contact info are encrypted and mapped directly to HR Portal.
            </p>
          </div>
        </div>
      </div>

      {/* Webhooks Subscription Table */}
      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Outbound Webhook Subscriptions</h3>
        </div>
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Target URL</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {webhooks.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No external webhook subscriptions registered</span>
                  </td>
                </tr>
              ) : (
                webhooks.map((webhook) => (
                  <tr key={webhook.id}>
                    <td style={{ fontWeight: 600 }}>{webhook.name}</td>
                    <td className="truncate" style={{ maxWidth: '250px' }}>
                      {webhook.url}
                    </td>
                    <td><span className="badge">{webhook.method || 'POST'}</span></td>
                    <td>
                      <span className={`statusTag ${webhook.is_active || webhook.status === 'active' ? 'active' : 'pending'}`}>
                        {webhook.is_active || webhook.status === 'active' ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button size="small" variant="secondary" onClick={() => handleEdit(webhook)}>
                          Edit
                        </Button>
                        <Button size="small" variant="primary" onClick={() => handleTest(webhook)} disabled={testing}>
                          Test Ping
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {testResult && (
        <div className="card mt4">
          <div className="cardHeader">
            <h3 className="cardTitle">Webhook Test Result</h3>
          </div>
          <div className="cardBody">
            <pre
              style={{
                background: '#0f172a',
                color: '#38bdf8',
                padding: '16px',
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '13px',
                fontFamily: 'monospace'
              }}
            >
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedWebhook ? 'Edit Webhook' : 'Add Webhook'}>
        <div className="form">
          <div className="formGroup">
            <label className="label required">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. n8n Candidate Pipeline" />
          </div>
          <div className="formGroup">
            <label className="label required">URL</label>
            <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="http://localhost:5678/webhook/ethiroli" />
          </div>
          <div className="formGroup">
            <label className="label">Method</label>
            <select className="select" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
              <option value="POST">POST</option>
              <option value="GET">GET</option>
            </select>
          </div>
          <div className="formGroup">
            <label className="label">Events (comma-separated)</label>
            <Input value={form.events} onChange={(e) => setForm({ ...form, events: e.target.value })} placeholder="candidate.created, lead.created, contact.submitted" />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {selectedWebhook ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminPage>
  );
}
