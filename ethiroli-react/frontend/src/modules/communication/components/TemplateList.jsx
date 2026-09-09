import React, { useEffect, useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { getTemplates, createTemplate } from '../../services/api/templateApi.js';
import axiosInstance from '../../services/api/axiosInstance.js';

export default function TemplateList() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: 'email',
    subject: '',
    body: '',
    variables: [],
  });

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTemplates();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Template name is required');
      return;
    }
    setSaving(true);
    try {
      await createTemplate({
        name: form.name,
        type: form.type,
        subject: form.subject,
        body: form.body,
        variables: form.variables,
      });
      setShowForm(false);
      setForm({ name: '', type: 'email', subject: '', body: '', variables: [] });
      fetchTemplates();
    } catch (err) {
      alert(`Failed to create template: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      await axiosInstance.delete(`/v1/communication/templates/${id}`);
      fetchTemplates();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <AdminPage
      title="Templates"
      subtitle="Manage communication message templates"
      loading={loading}
      error={error}
      onRetry={fetchTemplates}
      actions={
        <button className="btn primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : 'New Template'}
        </button>
      }
    >
      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Create Template</h3>
          </div>
          <div className="cardBody">
            <form onSubmit={handleSubmit} className="form">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div className="formGroup">
                  <label className="label required">Name</label>
                  <input className="inputField" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="formGroup">
                  <label className="label">Type</label>
                  <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="push">Push</option>
                  </select>
                </div>
                <div className="formGroup">
                  <label className="label">Subject</label>
                  <input className="inputField" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                </div>
              </div>
              <div className="formGroup">
                <label className="label">Body</label>
                <textarea
                  className="textarea"
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Use {{variable}} for placeholders..."
                  rows={4}
                />
              </div>
              <div className="formGroup">
                <label className="label">Variables (comma-separated)</label>
                <input
                  className="inputField"
                  value={form.variables.join(', ')}
                  onChange={(e) => setForm({ ...form, variables: e.target.value.split(',').map((v) => v.trim()).filter(Boolean) })}
                  placeholder="e.g. name, order_id, amount"
                />
              </div>
              <button type="submit" className="btn primary" disabled={saving}>
                {saving ? 'Creating...' : 'Create Template'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Template Registry</h3>
        </div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          {templates.length === 0 ? (
            <div className="emptyState">No templates found.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Subject</th>
                  <th>Variables</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template) => (
                  <tr key={template.id}>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{template.name}</td>
                    <td className="textSecondary">{template.type || 'generic'}</td>
                    <td className="textSecondary">{template.subject || '-'}</td>
                    <td className="textSecondary">
                      {template.variables?.length ? template.variables.join(', ') : '-'}
                    </td>
                    <td>
                      <button className="btn danger" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => handleDelete(template.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
