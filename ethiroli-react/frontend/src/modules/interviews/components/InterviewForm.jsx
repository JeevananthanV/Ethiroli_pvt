import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { scheduleInterview, listInterviews } from '../../services/api/interviewApi.js';

export default function InterviewForm() {
  const [candidates, setCandidates] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    candidate_id: '',
    interviewer_id: '',
    date: '',
    time: '',
    duration_minutes: 60,
    type: 'video',
    location: '',
    notes: '',
  });

  const fetchOptions = async () => {
    try {
      const [cRes, iRes] = await Promise.all([
        fetch('/v1/candidates').then((r) => r.json()).catch(() => []),
        fetch('/v1/employees').then((r) => r.json()).catch(() => []),
      ]);
      setCandidates(Array.isArray(cRes) ? cRes : []);
      setInterviewers(Array.isArray(iRes) ? iRes : []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (showForm) {
      fetchOptions();
    }
  }, [showForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.candidate_id || !form.interviewer_id || !form.date || !form.time) {
      alert('Candidate, interviewer, date, and time are required');
      return;
    }
    setSaving(true);
    try {
      await scheduleInterview({
        ...form,
        scheduled_at: `${form.date}T${form.time}`,
      });
      setShowForm(false);
      setForm({
        candidate_id: '',
        interviewer_id: '',
        date: '',
        time: '',
        duration_minutes: 60,
        type: 'video',
        location: '',
        notes: '',
      });
      alert('Interview scheduled successfully');
    } catch (err) {
      alert(`Failed to schedule interview: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPage
      title="Schedule Interview"
      subtitle="Book interviews and send calendar invites"
      actions={
        <button className="btn primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : 'Schedule Interview'}
        </button>
      }
    >
      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Interview Details</h3>
          </div>
          <div className="cardBody">
            <form onSubmit={handleSubmit} className="form">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div className="formGroup">
                  <label className="label required">Candidate</label>
                  <select className="select" required value={form.candidate_id} onChange={handleChange} name="candidate_id">
                    <option value="">Select candidate...</option>
                    {candidates.map((c) => (
                      <option key={c.id} value={c.id}>{c.name || c.id}</option>
                    ))}
                  </select>
                </div>
                <div className="formGroup">
                  <label className="label required">Interviewer</label>
                  <select className="select" required value={form.interviewer_id} onChange={handleChange} name="interviewer_id">
                    <option value="">Select interviewer...</option>
                    {interviewers.map((i) => (
                      <option key={i.id} value={i.id}>{i.name || i.id}</option>
                    ))}
                  </select>
                </div>
                <div className="formGroup">
                  <label className="label required">Date</label>
                  <input className="inputField" type="date" required value={form.date} onChange={handleChange} name="date" />
                </div>
                <div className="formGroup">
                  <label className="label required">Time</label>
                  <input className="inputField" type="time" required value={form.time} onChange={handleChange} name="time" />
                </div>
                <div className="formGroup">
                  <label className="label">Duration (minutes)</label>
                  <input className="inputField" type="number" value={form.duration_minutes} onChange={handleChange} name="duration_minutes" />
                </div>
                <div className="formGroup">
                  <label className="label">Type</label>
                  <select className="select" value={form.type} onChange={handleChange} name="type">
                    <option value="video">Video</option>
                    <option value="phone">Phone</option>
                    <option value="onsite">On-site</option>
                  </select>
                </div>
                <div className="formGroup">
                  <label className="label">Location / Link</label>
                  <input className="inputField" value={form.location} onChange={handleChange} name="location" />
                </div>
              </div>
              <div className="formGroup">
                <label className="label">Notes</label>
                <textarea className="textarea" value={form.notes} onChange={handleChange} name="notes" rows={2} />
              </div>
              <button type="submit" className="btn primary" disabled={saving}>
                {saving ? 'Scheduling...' : 'Schedule Interview'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="cardHeader"><h3 className="cardTitle">Scheduled Interviews</h3></div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          <InterviewTable onRefresh={() => {}} />
        </div>
      </div>
    </AdminPage>
  );
}

function InterviewTable({ onRefresh }) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listInterviews();
        setInterviews(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [onRefresh]);

  const getStatusClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'scheduled':
        return 'pending';
      case 'completed':
        return 'active';
      case 'cancelled':
      case 'canceled':
        return 'error';
      default:
        return 'pending';
    }
  };

  if (loading) return <div className="loading"><div className="skeleton" style={{ width: '100%', height: 120 }}></div></div>;
  if (error) return <div className="card" style={{ borderColor: 'rgba(244, 63, 94, 0.3)' }}><div className="textDanger">{error}</div></div>;

  return (
    <>
      {interviews.length === 0 ? (
        <div className="emptyState">No interviews scheduled.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Candidate ID</th>
              <th>Interviewer ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((interview) => (
              <tr key={interview.id}>
                <td className="textSecondary"><code>{interview.candidate_id}</code></td>
                <td className="textSecondary"><code>{interview.interviewer_id}</code></td>
                <td className="textSecondary">{interview.date || '-'}</td>
                <td className="textSecondary">{interview.time || '-'}</td>
                <td className="textSecondary">{interview.type || '-'}</td>
                <td>
                  <span className={`statusTag ${getStatusClass(interview.status)}`}>
                    {interview.status || 'scheduled'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
