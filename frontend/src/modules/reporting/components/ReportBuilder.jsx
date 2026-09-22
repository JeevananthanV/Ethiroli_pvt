import React, { useState, useEffect } from 'react';
import { getReports, createReport, updateReport, deleteReport, generateReport, previewReport, getReportFields } from '../../services/api/reportApi';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import Modal from '../../common/components/Modal/Modal.jsx';
import Input from '../../common/components/Input/Input.jsx';
import Button from '../../common/components/Button/Button.jsx';

const ReportBuilder = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'summary',
    filters: {},
    fields: [],
  });
  const [reportTypes, setReportTypes] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    loadReports();
    loadReportTypes();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReports();
      setReports(data.reports || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadReportTypes = async () => {
    try {
      const types = await getReportFields('all');
      setReportTypes(types.types || types || []);
      setAvailableFields(types.fields || []);
    } catch (err) {
      console.error('Failed to load report types:', err);
    }
  };

  const handleAdd = () => {
    setEditingReport(null);
    setFormData({ name: '', type: 'summary', filters: {}, fields: [] });
    setShowModal(true);
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData({
      name: report.name || '',
      type: report.type || 'summary',
      filters: report.filters || {},
      fields: report.fields || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await deleteReport(id);
      setReports(reports.filter(r => r.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGenerate = async (id) => {
    try {
      await generateReport(id);
      alert('Report generated successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePreview = async () => {
    setPreviewLoading(true);
    try {
      const result = await previewReport(formData);
      setPreview(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingReport) {
        const updated = await updateReport(editingReport.id, formData);
        setReports(reports.map(r => r.id === editingReport.id ? updated : r));
      } else {
        const created = await createReport(formData);
        setReports([...reports, created]);
      }
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleField = (field) => {
    setFormData({
      ...formData,
      fields: formData.fields.includes(field)
        ? formData.fields.filter(f => f !== field)
        : [...formData.fields, field]
    });
  };

  if (loading) return <div className="loading">Loading reports...</div>;
  if (error) return <div className="emptyState"><h3>Error</h3><p>{error}</p><button className="btn primary" onClick={loadReports}>Retry</button></div>;

  return (
    <AdminPage
      title="Report Builder"
      subtitle="Create and manage custom reports"
      loading={loading}
      error={error}
      onRetry={loadReports}
      actions={<button className="btn primary" onClick={handleAdd}>Create Report</button>}
    >
      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Reports</h3>
        </div>
        <div className="cardBody">
          {reports.length === 0 ? (
            <div className="emptyState">
              <h3>No reports found</h3>
              <p>Get started by creating your first report.</p>
            </div>
          ) : (
            <div className="overflowAuto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Fields</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td className="textPrimary">{report.name}</td>
                      <td className="textSecondary">{report.type || 'Summary'}</td>
                      <td className="textSecondary">{report.fields?.length || 0} fields</td>
                      <td className="textSecondary">{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '-'}</td>
                      <td>
                        <div className="pageActions">
                          <button className="btn btnSm secondary" onClick={() => handleEdit(report)}>Edit</button>
                          <button className="btn btnSm primary" onClick={() => handleGenerate(report.id)}>Generate</button>
                          <button className="btn btnSm danger" onClick={() => handleDelete(report.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingReport ? 'Edit Report' : 'Create Report'}>
          <form onSubmit={handleSubmit}>
            <Input
              label="Report Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <div className="formGroup" style={{ marginTop: '12px' }}>
              <label className="label">Report Type</label>
              <select
                className="select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {reportTypes.length > 0 ? (
                  reportTypes.map((t) => (
                    <option key={t.id || t.value || t} value={t.value || t}>
                      {t.name || t.label || t}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="summary">Summary</option>
                    <option value="detailed">Detailed</option>
                    <option value="analytical">Analytical</option>
                    <option value="financial">Financial</option>
                  </>
                )}
              </select>
            </div>
            <div className="formGroup" style={{ marginTop: '12px' }}>
              <label className="label">Fields</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {availableFields.map((field) => (
                  <button
                    key={field}
                    type="button"
                    className={`btn btnSm ${formData.fields.includes(field) ? 'primary' : 'secondary'}`}
                    onClick={() => toggleField(field)}
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>
            <div className="pageActions" style={{ marginTop: '16px' }}>
              <Button type="button" variant="secondary" onClick={handlePreview} disabled={previewLoading}>
                {previewLoading ? 'Loading...' : 'Preview'}
              </Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {preview && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Preview</h3>
          </div>
          <div className="cardBody">
            <pre className="textSecondary" style={{ background: 'var(--admin-bg-input)', padding: '16px', borderRadius: '8px', overflow: 'auto' }}>
              {JSON.stringify(preview, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </AdminPage>
  );
};

export default ReportBuilder;
