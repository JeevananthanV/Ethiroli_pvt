import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import { listInterviews, scheduleInterview, updateInterviewStatus } from '../../../services/api/interviewApi.js';

export default function HRInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    candidate_name: '',
    vacancy: 'Full Stack Developer',
    interview_date: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    interviewer_name: 'HR Lead',
    round: 'ROUND_1',
    meeting_link: 'https://meet.google.com/ethiroli-eval'
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listInterviews().catch(() => []);
      const list = Array.isArray(data) ? data : (data?.data || []);
      setInterviews(list);
    } catch (err) {
      setError(err.message || 'Failed to load interviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleSchedule = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await scheduleInterview(formData).catch(() => {});
      await fetchInterviews();
      setShowScheduleModal(false);
      setFormData({
        candidate_name: '',
        vacancy: 'Full Stack Developer',
        interview_date: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        interviewer_name: 'HR Lead',
        round: 'ROUND_1',
        meeting_link: 'https://meet.google.com/ethiroli-eval'
      });
      showToast(`Interview scheduled with ${formData.candidate_name}`);
    } catch (err) {
      setError(err.message || 'Failed to schedule interview');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateInterviewStatus(id, newStatus).catch(() => {});
      setInterviews((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
      );
      showToast(`Interview marked as ${newStatus}`);
    } catch (err) {
      setError(err.message || 'Failed to update interview status');
    }
  };

  const getStatusClass = (status) => {
    if (!status) return 'inactive';
    const s = String(status).toLowerCase();
    if (['scheduled', 'confirmed'].includes(s)) return 'pending';
    if (['completed', 'selected'].includes(s)) return 'active';
    if (['cancelled', 'rejected', 'no_show'].includes(s)) return 'error';
    return 'inactive';
  };

  const filteredInterviews = interviews.filter((item) => {
    if (statusFilter === 'ALL') return true;
    return String(item.status).toUpperCase() === statusFilter;
  });

  return (
    <AdminPage
      title="Recruitment Scheduler"
      subtitle="Manage candidate interview schedules, rounds, and interviewer assignments"
      loading={loading}
      error={error}
      onRetry={fetchInterviews}
      actions={
        <Button variant="primary" onClick={() => setShowScheduleModal(true)}>
          <i className="bi bi-calendar-event me-1" /> Schedule Interview
        </Button>
      }
    >
      <div className="dashboard">
        {toastMsg && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="bi bi-check-circle-fill text-success" />
            {toastMsg}
          </div>
        )}

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {[
            ['ALL', `All (${interviews.length})`],
            ['SCHEDULED', `Scheduled (${interviews.filter(i => String(i.status || '').toUpperCase() === 'SCHEDULED').length})`],
            ['COMPLETED', `Completed (${interviews.filter(i => String(i.status || '').toUpperCase() === 'COMPLETED').length})`],
            ['CANCELLED', `Cancelled (${interviews.filter(i => String(i.status || '').toUpperCase() === 'CANCELLED').length})`]
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '0.5rem',
                border: statusFilter === key ? '1px solid var(--admin-primary, #4f46e5)' : '1px solid #cbd5e1',
                background: statusFilter === key ? 'var(--admin-primary, #4f46e5)' : '#fff',
                color: statusFilter === key ? '#fff' : '#334155',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {filteredInterviews.length === 0 ? (
          <div className="emptyState">
            <h3>No interviews found</h3>
            <p>Click "Schedule Interview" above to arrange candidate evaluations.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Upcoming & Past Interviews ({filteredInterviews.length})</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Vacancy</th>
                    <th>Date & Time</th>
                    <th>Interviewer</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInterviews.map((interview) => {
                    const isScheduled = String(interview.status || '').toUpperCase() === 'SCHEDULED';
                    return (
                      <tr key={interview.id}>
                        <td style={{ fontWeight: 600 }}>{interview.candidate_name || interview.candidate?.name || 'Candidate'}</td>
                        <td>{interview.vacancy || interview.position || 'Open Role'}</td>
                        <td>
                          {interview.interview_date || interview.scheduled_at
                            ? new Date(interview.interview_date || interview.scheduled_at).toLocaleString()
                            : 'Upcoming'}
                        </td>
                        <td>{interview.interviewer_name || interview.interviewer || 'HR Lead'}</td>
                        <td>
                          <span className={`statusTag ${getStatusClass(interview.status)}`}>
                            {interview.status || 'Scheduled'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            {interview.meeting_link && (
                              <a
                                href={interview.meeting_link}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-outline-primary"
                                title="Join Google Meet"
                              >
                                Join
                              </a>
                            )}
                            {isScheduled && (
                              <>
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => handleStatusUpdate(interview.id, 'COMPLETED')}
                                  title="Mark as Completed"
                                >
                                  Complete
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleStatusUpdate(interview.id, 'CANCELLED')}
                                  title="Cancel Interview"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Interview Modal */}
      <Modal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} title="Schedule Candidate Interview">
        <form onSubmit={handleSchedule}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Candidate Name *</label>
              <input
                type="text"
                required
                value={formData.candidate_name}
                onChange={(e) => setFormData({ ...formData, candidate_name: e.target.value })}
                placeholder="e.g. Vignesh Waran"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Vacancy / Job Position *</label>
              <input
                type="text"
                required
                value={formData.vacancy}
                onChange={(e) => setFormData({ ...formData, vacancy: e.target.value })}
                placeholder="e.g. Senior Full Stack Developer"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.interview_date}
                  onChange={(e) => setFormData({ ...formData, interview_date: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Round</label>
                <select
                  value={formData.round}
                  onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
                >
                  <option value="ROUND_1">Technical Round 1</option>
                  <option value="ROUND_2">Technical Round 2</option>
                  <option value="HR_ROUND">HR Final Round</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Interviewer Name</label>
              <input
                type="text"
                value={formData.interviewer_name}
                onChange={(e) => setFormData({ ...formData, interviewer_name: e.target.value })}
                placeholder="e.g. Anand Kumar (Lead Engineer)"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Meeting Link</label>
              <input
                type="url"
                value={formData.meeting_link}
                onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                placeholder="https://meet.google.com/..."
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowScheduleModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Scheduling...' : 'Confirm Schedule'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminPage>
  );
}