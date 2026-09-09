import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { generateInvoice, batchGenerateInvoices } from '../services/api/invoiceApi.js';
import { listClients } from '../../../services/api/clientApi.js';
import { listCourses } from '../../../services/api/courseApi.js';
import { listEnrollments } from '../../../services/api/enrollmentApi.js';

export default function InvoiceGenerator() {
  const [clients, setClients] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({ clientId: '', courseId: '', enrollmentId: '', dueDate: '', taxRate: 18 });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [clientsRes, coursesRes, enrollmentsRes] = await Promise.all([
        listClients().catch(() => []),
        listCourses().catch(() => []),
        listEnrollments().catch(() => []),
      ]);
      setClients(Array.isArray(clientsRes) ? clientsRes : []);
      setCourses(Array.isArray(coursesRes) ? coursesRes : []);
      setEnrollments(Array.isArray(enrollmentsRes) ? enrollmentsRes : []);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const invoiceData = {
        client_id: Number(form.clientId),
        course_id: Number(form.courseId),
        enrollment_id: Number(form.enrollmentId),
        due_date: form.dueDate,
        tax_rate: Number(form.taxRate),
        items: [
          {
            description: courses.find((c) => c.id === Number(form.courseId))?.name || 'Course Fee',
            quantity: 1,
            unit_price: 0,
          },
        ],
      };
      await generateInvoice(invoiceData);
      alert('Invoice generated successfully');
      setForm({ clientId: '', courseId: '', enrollmentId: '', dueDate: '', taxRate: 18 });
    } catch (err) {
      alert(err.message || 'Failed to generate invoice');
    } finally {
      setGenerating(false);
    }
  };

  const handleBatchGenerate = async () => {
    setGenerating(true);
    try {
      await batchGenerateInvoices({ due_date: form.dueDate || new Date().toISOString().split('T')[0], tax_rate: Number(form.taxRate) });
      alert('Batch invoice generation started');
    } catch (err) {
      alert(err.message || 'Failed to batch generate invoices');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AdminPage
      title="Invoice Generator"
      subtitle="Generate invoices from contracts and enrollments"
      loading={loading}
      error={error}
      onRetry={loadData}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Generate Single Invoice</h3></div>
          <div className="cardBody">
            <form onSubmit={handleGenerate} className="form">
              <div className="formGroup">
                <label className="label">Client <span className="required">*</span></label>
                <select className="select" value={form.clientId} onChange={handleChange('clientId')} required>
                  <option value="">Select client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name || c.full_name}</option>
                  ))}
                </select>
              </div>
              <div className="formGroup">
                <label className="label">Course</label>
                <select className="select" value={form.courseId} onChange={handleChange('courseId')}>
                  <option value="">Select course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="formGroup">
                <label className="label">Enrollment</label>
                <select className="select" value={form.enrollmentId} onChange={handleChange('enrollmentId')}>
                  <option value="">Select enrollment</option>
                  {enrollments.map((enr) => (
                    <option key={enr.id} value={enr.id}>{enr.id}</option>
                  ))}
                </select>
              </div>
              <div className="formGroup">
                <label className="label">Due Date</label>
                <input className="inputField" type="date" value={form.dueDate} onChange={handleChange('dueDate')} />
              </div>
              <div className="formGroup">
                <label className="label">Tax Rate (%)</label>
                <select className="select" value={form.taxRate} onChange={handleChange('taxRate')}>
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                  <option value="28">28%</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn primary" disabled={generating || !form.clientId}>
                  {generating ? 'Generating...' : 'Generate Invoice'}
                </button>
                <button type="button" className="btn secondary" onClick={handleBatchGenerate} disabled={generating}>
                  Batch Generate
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Line Items Preview</h3></div>
          <div className="cardBody">
            {courses.find((c) => c.id === Number(form.courseId)) ? (
              <div style={{ padding: 16, background: 'var(--admin-bg-card)', borderRadius: 8 }}>
                <h4 style={{ marginBottom: 8 }}>{courses.find((c) => c.id === Number(form.courseId))?.name}</h4>
                <p style={{ color: 'var(--admin-text-secondary)', fontSize: 13 }}>Course fee with {form.taxRate}% GST will be applied.</p>
              </div>
            ) : (
              <p style={{ color: 'var(--admin-text-muted)' }}>Select a course to preview line items.</p>
            )}
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
