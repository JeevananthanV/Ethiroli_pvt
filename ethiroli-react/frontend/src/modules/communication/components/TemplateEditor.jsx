import React, { useEffect, useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { getTemplates, createTemplate } from '../../services/api/templateApi.js';

export default function TemplateEditor() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    channel: 'email',
    subject: '',
    body: '',
    variables: '',
  });

  const loadTemplates = async () => {
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
    loadTemplates();
  }, []);

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name || '',
      channel: template.channel || 'email',
      subject: template.subject || '',
      body: template.body || '',
      variables: Array.isArray(template.variables) ? template.variables.join(', ') : '',
    });
    setShowCreate(true);
  };

  const handleAddNew = () => {
    setEditingTemplate(null);
    setFormData({ name: '', channel: 'email', subject: '', body: '', variables: '' });
    setShowCreate(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        variables: formData.variables
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),
      };
      await createTemplate(payload);
      setShowCreate(false);
      setFormData({ name: '', channel: 'email', subject: '', body: '', variables: '' });
      setEditingTemplate(null);
      loadTemplates();
    } catch (err) {
      alert(`Failed to save template: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const getChannelTag = (channel) => {
    const map = {
      email: 'info',
      sms: 'active',
      push: 'pending',
      whatsapp: 'success',
    };
    const cls = map[channel?.toLowerCase()] || 'pending';
    return <span className={`statusTag ${cls}`}>{channel || 'N/A'}</span>;
  };

  return (
    <AdminPage
      title="Template Editor"
      subtitle="Create and manage message templates with variable support"
      loading={loading}
      error={error}
      onRetry={loadTemplates}
      actions={
        <button className="btn primary" onClick={handleAddNew}>
          + New Template
        </button>
      }
    >
      <div className="card">
        {templates.length === 0 ? (
          <div className="emptyState">
            <h3>No templates found</h3>
            <p>Create a new template to get started.</p>
          </div>
        ) : (
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Channel</th>
                  <th>Subject</th>
                  <th>Variables</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template) => (
                  <tr key={template.id}>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{template.name}</td>
                    <td>{getChannelTag(template.channel)}</td>
                    <td className="textSecondary">{template.subject || '-'}</td>
                    <td className="textSecondary">
                      {Array.isArray(template.variables) && template.variables.length > 0
                        ? template.variables.map((v) => (
                            <span key={v} className="statusTag info" style={{ marginRight: 4, fontSize: 11 }}>
                              {v}
                            </span>
                          ))
                        : '-'}
                    </td>
                    <td>
                      <button
                        className="btn secondary btnSm"
                        onClick={() => handleEdit(template)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="modalOverlay" onClick={() => setShowCreate(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720 }}>
            <div className="modalHeader">
              <h3 className="modalTitle">{editingTemplate ? 'Edit Template' : 'Create Template'}</h3>
              <button className="closeBtn" onClick={() => setShowCreate(false)}>&times;</button>
            </div>
            <div className="modalBody">
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="formGroup">
                    <label className="label required">Template Name</label>
                    <input
                      className="inputField"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="formGroup">
                    <label className="label required">Channel</label>
                    <select
                      className="select"
                      value={formData.channel}
                      onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                    >
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="push">Push Notification</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                </div>
                <div className="formGroup">
                  <label className="label">Subject (for email)</label>
                  <input
                    className="inputField"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g., Welcome {{name}}"
                  />
                </div>
                <div className="formGroup">
                  <label className="label required">Body</label>
                  <textarea
                    className="textarea"
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    placeholder="Enter template body. Use {{variable_name}} for dynamic values."
                    rows={6}
                    required
                  />
                </div>
                <div className="formGroup">
                  <label className="label">Variables (comma-separated)</label>
                  <input
                    className="inputField"
                    value={formData.variables}
                    onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
                    placeholder="name, email, date"
                  />
                  <p style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 4 }}>
                    Variables are auto-extracted from the body if left blank.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
                  <button type="button" className="btn secondary" onClick={() => setShowCreate(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn primary" disabled={saving}>
                    {saving ? 'Saving...' : editingTemplate ? 'Update Template' : 'Create Template'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
