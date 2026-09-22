import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getCareerApplications, deleteCareerApplication } from '../../../services/api/careerApi.js';

export default function HRCareerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCareerApplications();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load career applications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the application from ${name}?`)) return;
    try {
      await deleteCareerApplication(id);
      setApplications(prev => prev.filter(app => app.id !== id));
      setActionSuccess(`Application for ${name} removed.`);
      setTimeout(() => setActionSuccess(''), 4000);
      if (selectedApp?.id === id) setSelectedApp(null);
    } catch (err) {
      setError(err.message || 'Failed to delete application.');
    }
  };

  const roles = Array.from(new Set(applications.map(a => a.role).filter(Boolean)));

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      (app.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (app.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (app.phone || '').includes(search) ||
      (app.role || '').toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || app.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminPage
      title="Career Applications"
      subtitle="Review real-time submissions from the marketing career portal"
      loading={loading}
      error={error}
      onRetry={fetchApplications}
    >
      <div className="dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Top Control Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card, #ffffff)',
          padding: '1rem 1.25rem',
          borderRadius: '0.75rem',
          border: '1px solid var(--border-color, #e2e8f0)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
            <input
              type="text"
              placeholder="Search candidate name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color, #cbd5e1)',
                fontSize: '0.875rem'
              }}
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: '0.625rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color, #cbd5e1)',
                fontSize: '0.875rem',
                background: '#fff'
              }}
            >
              <option value="ALL">All Roles ({applications.length})</option>
              {roles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#ecfdf5',
              color: '#065f46',
              padding: '0.375rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
              Live Database Connected ({applications.length} applicants)
            </span>
            <button
              onClick={fetchApplications}
              disabled={loading}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color, #cbd5e1)',
                background: '#fff',
                cursor: 'pointer',
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>

        {actionSuccess && (
          <div style={{
            background: '#f0fdf4',
            color: '#166534',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid #bbf7d0',
            fontSize: '0.875rem'
          }}>
            <i className="bi bi-check-circle" style={{ marginRight: '0.5rem' }} />
            {actionSuccess}
          </div>
        )}

        {/* Candidate List & Detail Split */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedApp ? '1.2fr 1fr' : '1fr', gap: '1.25rem' }}>
          <div className="card" style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '0.75rem',
            border: '1px solid var(--border-color, #e2e8f0)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--border-color, #e2e8f0)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                Applicants ({filteredApplications.length})
              </h3>
            </div>

            {filteredApplications.length === 0 ? (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                <i className="bi bi-inbox" style={{ fontSize: '2.5rem', opacity: 0.5, marginBottom: '0.5rem', display: 'block' }} />
                <p style={{ margin: 0, fontWeight: 500 }}>No career applications match your criteria.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-muted, #f8fafc)', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Applicant</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Role</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Experience</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Applied Date</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => (
                      <tr
                        key={app.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          background: selectedApp?.id === app.id ? '#f0f9ff' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 0.15s'
                        }}
                        onClick={() => setSelectedApp(app)}
                      >
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{app.full_name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.email}</div>
                          {app.phone && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.phone}</div>}
                        </td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <span style={{
                            display: 'inline-block',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}>
                            {app.role || 'General'}
                          </span>
                        </td>
                        <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>
                          {app.experience_level || '—'}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.8125rem' }}>
                          {app.created_at ? new Date(app.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <a
                              href={`mailto:${app.email}?subject=Application for ${encodeURIComponent(app.role || 'Position')} at Ethiroli`}
                              title="Email Candidate"
                              style={{
                                padding: '0.375rem 0.625rem',
                                borderRadius: '0.375rem',
                                background: '#f1f5f9',
                                color: '#334155',
                                textDecoration: 'none',
                                fontSize: '0.75rem'
                              }}
                            >
                              <i className="bi bi-envelope" /> Email
                            </a>
                            <button
                              onClick={() => handleDelete(app.id, app.full_name)}
                              title="Delete Application"
                              style={{
                                padding: '0.375rem 0.625rem',
                                borderRadius: '0.375rem',
                                border: 'none',
                                background: '#fef2f2',
                                color: '#dc2626',
                                cursor: 'pointer',
                                fontSize: '0.75rem'
                              }}
                            >
                              <i className="bi bi-trash" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detailed Application Preview Pane */}
          {selectedApp && (
            <div className="card" style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: '0.75rem',
              border: '1px solid var(--border-color, #e2e8f0)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              height: 'fit-content'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Applicant Details
                  </span>
                  <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.25rem', color: '#0f172a' }}>
                    {selectedApp.full_name}
                  </h3>
                  <div style={{ color: '#2563eb', fontWeight: 500, fontSize: '0.875rem' }}>
                    {selectedApp.role}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1.25rem' }}
                >
                  &times;
                </button>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div>
                  <strong style={{ color: '#475569' }}>Email:</strong>{' '}
                  <a href={`mailto:${selectedApp.email}`} style={{ color: '#2563eb' }}>{selectedApp.email}</a>
                </div>
                {selectedApp.phone && (
                  <div>
                    <strong style={{ color: '#475569' }}>Phone:</strong>{' '}
                    <a href={`tel:${selectedApp.phone}`} style={{ color: '#2563eb' }}>{selectedApp.phone}</a>
                  </div>
                )}
                <div>
                  <strong style={{ color: '#475569' }}>Experience Level:</strong>{' '}
                  <span>{selectedApp.experience_level || 'Not specified'}</span>
                </div>
                {selectedApp.portfolio_url && (
                  <div>
                    <strong style={{ color: '#475569' }}>Portfolio / Resume:</strong>{' '}
                    <a
                      href={selectedApp.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#2563eb', textDecoration: 'underline' }}
                    >
                      {selectedApp.portfolio_url} <i className="bi bi-box-arrow-up-right" style={{ fontSize: '0.75rem' }} />
                    </a>
                  </div>
                )}
                <div>
                  <strong style={{ color: '#475569' }}>Application Date:</strong>{' '}
                  <span>{new Date(selectedApp.created_at).toLocaleString()}</span>
                </div>
              </div>

              {selectedApp.message && (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                  <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontSize: '0.8125rem' }}>
                    Candidate Pitch / Statement:
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {selectedApp.message}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <a
                  href={`mailto:${selectedApp.email}?subject=Interview Invitation: ${encodeURIComponent(selectedApp.role || 'Role')} at Ethiroli`}
                  style={{
                    flex: 1,
                    padding: '0.625rem 1rem',
                    borderRadius: '0.5rem',
                    background: '#2563eb',
                    color: '#fff',
                    textAlign: 'center',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem'
                  }}
                >
                  <i className="bi bi-calendar-event" style={{ marginRight: '0.4rem' }} /> Schedule Interview
                </a>
                <button
                  onClick={() => handleDelete(selectedApp.id, selectedApp.full_name)}
                  style={{
                    padding: '0.625rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #fca5a5',
                    background: '#fff',
                    color: '#dc2626',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <i className="bi bi-trash" /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
