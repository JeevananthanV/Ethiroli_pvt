import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getContactMessages, deleteContactMessage } from '../../../services/api/contactApi.js';

export default function HRInquiries() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [feedback, setFeedback] = useState('');

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getContactMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load inquiries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete inquiry from ${name}?`)) return;
    try {
      await deleteContactMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      setFeedback(`Inquiry from ${name} removed.`);
      setTimeout(() => setFeedback(''), 4000);
      if (selectedMsg?.id === id) setSelectedMsg(null);
    } catch (err) {
      setError(err.message || 'Failed to delete inquiry.');
    }
  };

  const filteredMessages = messages.filter(msg => {
    const term = search.toLowerCase();
    return (
      (msg.name || '').toLowerCase().includes(term) ||
      (msg.email || '').toLowerCase().includes(term) ||
      (msg.subject || '').toLowerCase().includes(term) ||
      (msg.phone || '').includes(term) ||
      (msg.message || '').toLowerCase().includes(term)
    );
  });

  return (
    <AdminPage
      title="Marketing Inquiries"
      subtitle="Review incoming messages from the public Contact Us form and consultation inquiries"
      loading={loading}
      error={error}
      onRetry={fetchMessages}
    >
      <div className="dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Search & Status Header */}
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
          <div style={{ flex: 1, minWidth: '280px' }}>
            <input
              type="text"
              placeholder="Search sender, email, subject, or message keyword..."
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
              Live Database Connected ({messages.length} messages)
            </span>
            <button
              onClick={fetchMessages}
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

        {feedback && (
          <div style={{
            background: '#f0fdf4',
            color: '#166534',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid #bbf7d0',
            fontSize: '0.875rem'
          }}>
            <i className="bi bi-check-circle" style={{ marginRight: '0.5rem' }} />
            {feedback}
          </div>
        )}

        {/* Message Split View */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedMsg ? '1.2fr 1fr' : '1fr', gap: '1.25rem' }}>
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
                Inbox ({filteredMessages.length})
              </h3>
            </div>

            {filteredMessages.length === 0 ? (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                <i className="bi bi-envelope-open" style={{ fontSize: '2.5rem', opacity: 0.5, marginBottom: '0.5rem', display: 'block' }} />
                <p style={{ margin: 0, fontWeight: 500 }}>No contact messages found.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-muted, #f8fafc)', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Sender</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Subject & Snippet</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Received</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages.map((msg) => (
                      <tr
                        key={msg.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          background: selectedMsg?.id === msg.id ? '#f0f9ff' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 0.15s'
                        }}
                        onClick={() => setSelectedMsg(msg)}
                      >
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{msg.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{msg.email}</div>
                          {msg.phone && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{msg.phone}</div>}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', maxWidth: '300px' }}>
                          <div style={{ fontWeight: 500, color: '#1e293b' }}>{msg.subject || 'Website Inquiry'}</div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {msg.message || '—'}
                          </div>
                        </td>
                        <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                          {msg.created_at ? new Date(msg.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <a
                              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Your Inquiry to Ethiroli')}`}
                              title="Reply via Email"
                              style={{
                                padding: '0.375rem 0.625rem',
                                borderRadius: '0.375rem',
                                background: '#f1f5f9',
                                color: '#334155',
                                textDecoration: 'none',
                                fontSize: '0.75rem'
                              }}
                            >
                              <i className="bi bi-reply" /> Reply
                            </a>
                            <button
                              onClick={() => handleDelete(msg.id, msg.name)}
                              title="Delete Message"
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

          {/* Detailed Message View Pane */}
          {selectedMsg && (
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
                    Inquiry Details
                  </span>
                  <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.25rem', color: '#0f172a' }}>
                    {selectedMsg.subject || 'Website Inquiry'}
                  </h3>
                  <div style={{ color: '#059669', fontWeight: 500, fontSize: '0.875rem' }}>
                    From {selectedMsg.name}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMsg(null)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1.25rem' }}
                >
                  &times;
                </button>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div>
                  <strong style={{ color: '#475569' }}>Sender Email:</strong>{' '}
                  <a href={`mailto:${selectedMsg.email}`} style={{ color: '#2563eb' }}>{selectedMsg.email}</a>
                </div>
                {selectedMsg.phone && (
                  <div>
                    <strong style={{ color: '#475569' }}>Phone:</strong>{' '}
                    <a href={`tel:${selectedMsg.phone}`} style={{ color: '#2563eb' }}>{selectedMsg.phone}</a>
                  </div>
                )}
                <div>
                  <strong style={{ color: '#475569' }}>Received:</strong>{' '}
                  <span>{new Date(selectedMsg.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontSize: '0.8125rem' }}>
                  Full Message:
                </strong>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {selectedMsg.message || '(Empty message)'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject || 'Your Inquiry to Ethiroli')}`}
                  style={{
                    flex: 1,
                    padding: '0.625rem 1rem',
                    borderRadius: '0.5rem',
                    background: '#059669',
                    color: '#fff',
                    textAlign: 'center',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem'
                  }}
                >
                  <i className="bi bi-reply-fill" style={{ marginRight: '0.4rem' }} /> Reply via Email
                </a>
                <button
                  onClick={() => handleDelete(selectedMsg.id, selectedMsg.name)}
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
