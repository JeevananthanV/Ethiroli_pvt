import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';
import { useAuth } from '../../../common/hooks/useAuth.js';

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChannel, setActiveChannel] = useState('GENERAL');
  const [activeContact, setActiveContact] = useState(null);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);

  // Channels stay as-is; a selected contact switches to a direct thread.
  const isDirect = Boolean(activeContact);
  const threadKey = isDirect ? activeContact.id : activeChannel;

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = isDirect ? { other_user_id: activeContact.id } : { channel_name: activeChannel };
      const res = await employeePortalApi.getMessages(params);
      const list = res?.data || (Array.isArray(res) ? res : []);
      // Oldest first so the thread reads top-to-bottom like a conversation.
      setMessages([...list].reverse());
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [activeChannel, activeContact, isDirect]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Load the people the employee may contact (HR, Finance, project team, ...).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await employeePortalApi.getMessageContacts();
        if (cancelled) return;
        setContacts(res?.data || (Array.isArray(res) ? res : []));
      } catch {
        if (!cancelled) setContacts([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const selectChannel = (key) => {
    setActiveChannel(key);
    setActiveContact(null);
  };

  const selectContact = (c) => {
    setActiveContact(c);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setSending(true);
    try {
      await employeePortalApi.sendMessage({
        // Direct thread is addressed to the chosen person; channels use the name.
        recipient_id: isDirect ? activeContact.id : null,
        channel_name: isDirect ? null : activeChannel,
        message_content: newMsg.trim(),
      });
      setNewMsg('');
      await loadMessages();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const threadTitle = isDirect
    ? (activeContact.full_name || activeContact.email)
    : `#${activeChannel.toLowerCase()}`;
  const threadSubtitle = isDirect
    ? `${activeContact.role}${activeContact.designation ? ' · ' + activeContact.designation : ''}`
    : 'Company channel';

  return (
    <AdminPage
      title="Team Messages & Collaboration"
      subtitle="Communicate with HR, Finance, project teams and colleagues"
      loading={loading}
      error={error}
      onRetry={loadMessages}
    >
      <div className="card shadow-sm border-0 overflow-hidden" style={{ height: '700px' }}>
        <div className="row g-0 h-100">
          {/* Channel / Contact List Column */}
          <div className="col-md-4 border-end bg-light d-flex flex-column h-100">
            <div className="p-3 border-bottom bg-white">
              <h6 className="mb-0 fw-bold">Channels & Contacts</h6>
            </div>

            <div className="px-3 pt-2 pb-1 bg-white border-bottom">
              <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.72rem' }}>
                Channels
              </small>
            </div>
            <div className="list-group list-group-flush">
              {[
                { key: 'GENERAL', label: '# General Team', desc: 'All-employee discussions' },
                { key: 'PROJECTS', label: '# Project Alpha', desc: 'Engineering & delivery' },
                { key: 'HR_QUERIES', label: '# HR Help', desc: 'People team announcements' },
              ].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => selectChannel(c.key)}
                  className={`list-group-item list-group-item-action text-start p-3 ${
                    !isDirect && activeChannel === c.key ? 'active text-white' : ''
                  }`}
                >
                  <div className="fw-semibold">{c.label}</div>
                  <small className={!isDirect && activeChannel === c.key ? 'text-white-50' : 'text-muted'}>
                    {c.desc}
                  </small>
                </button>
              ))}
            </div>

            <div className="px-3 pt-3 pb-1 bg-white border-top border-bottom">
              <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.72rem' }}>
                People (HR · Finance · Teams)
              </small>
            </div>
            <div className="list-group list-group-flush overflow-auto flex-grow-1">
              {contacts.length === 0 ? (
                <div className="p-3 text-muted small">No other active users available.</div>
              ) : (
                contacts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectContact(c)}
                    className={`list-group-item list-group-item-action text-start p-3 ${
                      isDirect && activeContact.id === c.id ? 'active text-white' : ''
                    }`}
                  >
                    <div className="fw-semibold d-flex align-items-center gap-2">
                      <i className={`bi ${isDirect && activeContact.id === c.id ? 'bi-person-fill' : 'bi-person-circle'}`}></i>
                      <span>{c.full_name || c.email}</span>
                    </div>
                    <small className={isDirect && activeContact.id === c.id ? 'text-white-50' : 'text-muted'}>
                      {c.role}{c.designation ? ` · ${c.designation}` : ''}
                    </small>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Conversation Column */}
          <div className="col-md-8 d-flex flex-column h-100 bg-white">
            {/* Header */}
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
              <div className="d-flex align-items-center gap-2">
                <i className={`bi ${isDirect ? 'bi-person' : 'bi-hash'} fs-4 text-primary`}></i>
                <div>
                  <h6 className="mb-0 fw-bold">{threadTitle}</h6>
                  <small className="text-muted">{threadSubtitle}</small>
                </div>
              </div>
              <span className="badge bg-light text-dark border">{messages.length} messages</span>
            </div>

            {/* Message Stream */}
            <div className="p-3 overflow-auto flex-grow-1 d-flex flex-column gap-3 bg-light">
              {messages.length === 0 ? (
                <div className="text-center my-auto py-5 text-muted">
                  <i className="bi bi-chat-dots fs-1 d-block mb-2"></i>
                  <p>No messages yet here. Send the first message!</p>
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = m.sender_id === user?.id;
                  return (
                    <div
                      key={m.id}
                      className={`d-flex flex-column ${isMe ? 'align-items-end' : 'align-items-start'}`}
                    >
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <small className="fw-semibold text-dark">
                          {isMe ? 'You' : (m.sender_name || m.recipient_name || 'Colleague')}
                        </small>
                        <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                          {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </small>
                      </div>
                      <div
                        className={`p-3 rounded-3 shadow-sm ${
                          isMe ? 'bg-primary text-white' : 'bg-white text-dark'
                        }`}
                        style={{ maxWidth: '75%', lineHeight: '1.5' }}
                      >
                        {m.message_content}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Footer */}
            <div className="p-3 border-top bg-white">
              <form onSubmit={handleSend} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Message ${isDirect ? activeContact.full_name || activeContact.email : '#' + activeChannel.toLowerCase()}...`}
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  disabled={sending}
                />
                <button type="submit" className="btn btn-primary px-4 d-flex align-items-center gap-2" disabled={sending || !newMsg.trim()}>
                  <i className="bi bi-send"></i>
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
