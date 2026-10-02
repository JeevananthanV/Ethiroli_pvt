import React, { useState, useRef, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import InlineNotice from '../components/InlineNotice.jsx';
import { formatTime12 } from '../../../common/utils/timeFormat.js';

const STORAGE_KEY = 'ethiroli.intern.messages.v1';
const RESET_KEY = 'ethiroli.intern.messages.lastReset';

/** Threads are cleared on this cadence so a shared demo machine never shows a
 *  stale conversation from a previous session. */
const RESET_INTERVAL_MS = 6 * 60 * 60 * 1000;

/** Seed conversations. Message ids are namespaced per conversation so ids stay
 *  unique once the intern starts replying. */
const SEED_CONVERSATIONS = [
  {
    id: 'mentor',
    name: 'Arun Kumar',
    role: 'Senior Full Stack Mentor',
    avatar: 'AK',
    online: true,
    lastMessage: 'Please submit before 5 PM.',
    time: '11:42 AM',
    unreadCount: 1,
    messages: [
      { id: 'mentor-1', sender: 'mentor', text: 'Hi Jeeva, have you completed the API integration for the login module?', time: '11:30 AM' },
      { id: 'mentor-2', sender: 'me', text: 'Yes Arun sir, almost done! Just finishing the token refresh handler.', time: '11:35 AM' },
      { id: 'mentor-3', sender: 'mentor', text: "Great. Please submit your pull request before 5 PM so we can review it together in today's 4:00 PM session.", time: '11:42 AM' },
    ],
  },
  {
    id: 'hr',
    name: 'Priya Sharma',
    role: 'HR Talent Operations',
    avatar: 'PS',
    online: false,
    lastMessage: 'Your stipend invoice has been processed.',
    time: 'Yesterday',
    unreadCount: 0,
    messages: [
      { id: 'hr-1', sender: 'hr', text: 'Hello Jeeva, please upload your signed bank details document.', time: 'Yesterday 10:15 AM' },
      { id: 'hr-2', sender: 'me', text: 'Uploaded yesterday in the Documents section!', time: 'Yesterday 11:00 AM' },
      { id: 'hr-3', sender: 'hr', text: 'Verified! Your stipend invoice has been processed.', time: 'Yesterday 02:30 PM' },
    ],
  },
  {
    id: 'pm',
    name: 'Karthik Raja',
    role: 'Project Manager (E-Commerce)',
    avatar: 'KR',
    online: true,
    lastMessage: 'Sprint 2 demo is scheduled for Friday.',
    time: 'Sep 20',
    unreadCount: 0,
    messages: [
      { id: 'pm-1', sender: 'pm', text: 'Sprint 2 demo is scheduled for Friday at 3:00 PM. Be ready with your checkout component demo.', time: 'Sep 20' },
    ],
  },
  {
    id: 'training',
    name: 'Ethiroli LMS Team',
    role: 'Learning & Curriculum Support',
    avatar: 'LT',
    online: true,
    lastMessage: 'New quiz on Redux Toolkit is live.',
    time: 'Sep 19',
    unreadCount: 0,
    messages: [
      { id: 'training-1', sender: 'training', text: 'New quiz on Redux Toolkit is live. Please attempt before Sunday.', time: 'Sep 19' },
    ],
  },
];

const freshSeed = () => SEED_CONVERSATIONS.map((c) => ({ ...c, messages: [...c.messages] }));

/** Reads persisted threads, rolling them over to the seed once the six-hour
 *  window has elapsed. */
function loadInitialState() {
  if (typeof window === 'undefined') return { conversations: freshSeed(), rolledOver: false };
  try {
    const lastReset = Number(window.localStorage.getItem(RESET_KEY) || 0);
    const elapsed = Date.now() - lastReset;

    if (!lastReset || elapsed >= RESET_INTERVAL_MS) {
      window.localStorage.setItem(RESET_KEY, String(Date.now()));
      window.localStorage.removeItem(STORAGE_KEY);
      return { conversations: freshSeed(), rolledOver: true };
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) {
        return { conversations: parsed, rolledOver: false };
      }
    }
  } catch {
    /* corrupt or unavailable storage - fall back to the seed */
  }
  return { conversations: freshSeed(), rolledOver: false };
}

export default function InternMessages() {
  const [conversations, setConversations] = useState(() => loadInitialState().conversations);
  const [activeId, setActiveId] = useState('mentor');
  const [inputText, setInputText] = useState('');
  const [notice, setNotice] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const threadRef = useRef(null);

  const activeChat = conversations.find((c) => c.id === activeId) || conversations[0];
  const unreadTotal = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const nextResetAt = useCallback(() => {
    const last = Number(
      (typeof window !== 'undefined' && window.localStorage.getItem(RESET_KEY)) || Date.now()
    );
    return new Date(last + RESET_INTERVAL_MS);
  }, []);

  const [resetAt, setResetAt] = useState(nextResetAt);

  /* Persist and announce the automatic six-hour rollover. */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {
      /* storage full or blocked - chat still works for this session */
    }
  }, [conversations]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const tick = () => {
      const last = Number(window.localStorage.getItem(RESET_KEY) || Date.now());
      if (Date.now() - last >= RESET_INTERVAL_MS) {
        window.localStorage.setItem(RESET_KEY, String(Date.now()));
        setConversations(freshSeed());
        setEditingId(null);
        setNotice('Chats were reset automatically — conversations refresh every 6 hours.');
        setResetAt(nextResetAt());
      }
    };

    // Check every minute so a long-lived tab honours the window too.
    const id = window.setInterval(tick, 60 * 1000);
    return () => window.clearInterval(id);
  }, [nextResetAt]);

  /** Opening a thread clears its unread badge - previously it never reset. */
  const openConversation = (id) => {
    setActiveId(id);
    setEditingId(null);
    setConversations((prev) =>
      prev.map((c) => (c.id === id && c.unreadCount ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Keep the newest message in view when switching thread, sending or editing.
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [activeId, activeChat?.messages?.length, editingId]);

  const updateActiveChat = (updater) => {
    setConversations((prev) => prev.map((c) => (c.id === activeId ? updater(c) : c)));
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    const newMessage = {
      id: `${activeId}-${Date.now()}`,
      sender: 'me',
      text,
      time: formatTime12(new Date()),
    };

    updateActiveChat((c) => ({
      ...c,
      messages: [...c.messages, newMessage],
      lastMessage: text,
      time: 'Just now',
      unreadCount: 0,
    }));

    setInputText('');
    setNotice('');
  };

  /* ---- Edit ------------------------------------------------------------- */

  const startEditing = (m) => {
    setEditingId(m.id);
    setEditText(m.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = () => {
    const text = editText.trim();
    if (!text || !editingId) return cancelEditing();

    updateActiveChat((c) => {
      const messages = c.messages.map((m) =>
        m.id === editingId
          ? { ...m, text, edited: true, time: `${m.time} · edited` }
          : m
      );
      const last = messages[messages.length - 1];
      return { ...c, messages, lastMessage: last.text };
    });

    setEditingId(null);
    setEditText('');
    setNotice('Message updated.');
  };

  /* ---- Delete ----------------------------------------------------------- */

  const deleteMessage = (id) => {
    updateActiveChat((c) => {
      const messages = c.messages.filter((m) => m.id !== id);
      const last = messages[messages.length - 1];
      return {
        ...c,
        messages,
        lastMessage: last ? last.text : 'No messages yet',
        time: last ? last.time : '',
      };
    });
    if (editingId === id) cancelEditing();
    setNotice('Message deleted.');
  };

  const deleteConversation = (id) => {
    const name = conversations.find((c) => c.id === id)?.name || 'Conversation';
    const remaining = conversations.filter((c) => c.id !== id);
    setConversations(remaining);
    if (activeId === id) setActiveId(remaining[0]?.id || null);
    setEditingId(null);
    setNotice(`Deleted the conversation with ${name}.`);
  };

  const clearAllChats = () => {
    setConversations(freshSeed());
    setActiveId('mentor');
    setEditingId(null);
    setInputText('');
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(RESET_KEY, String(Date.now()));
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
    setConfirmClear(false);
    setResetAt(nextResetAt());
    setNotice('All chats were cleared and the six-hour timer restarted.');
  };

  // Enter sends; a single-line input cannot express Shift+Enter as a newline.
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <AdminPage
      title="Messages & Communication"
      subtitle="Direct chat with your assigned mentor, project manager, HR, and training coordinators"
      actions={
        confirmClear ? (
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted">Delete every thread?</span>
            <button type="button" className="btn btn-sm btn-danger" onClick={clearAllChats}>
              Yes, clear all
            </button>
            <button type="button" className="btn btn-sm btn-light" onClick={() => setConfirmClear(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
            onClick={() => setConfirmClear(true)}
            title="Delete every conversation and restart the six-hour timer"
          >
            <i className="bi bi-trash"></i> Clear all chats
          </button>
        )
      }
    >
      {notice && (
        <div className="mb-3">
          <InlineNotice message={notice} onDismiss={() => setNotice('')} />
        </div>
      )}

      {conversations.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-3 bg-white">
          <div className="card-body text-center py-5">
            <i className="bi bi-chat-square-dots display-6 text-muted"></i>
            <p className="text-muted mt-3 mb-0">
              All conversations were deleted. Use <strong>Clear all chats</strong> to restore the demo threads.
            </p>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white" style={{ minHeight: '620px' }}>
          <div className="row g-0 h-100">
            {/* Conversation List */}
            <div className="col-12 col-md-4 border-end ims-conv-list">
              <div className="p-3 border-bottom bg-light d-flex align-items-center justify-content-between">
                <h6 className="mb-0 fw-bold text-dark">Conversations</h6>
                {unreadTotal > 0 && <span className="badge bg-primary rounded-pill">{unreadTotal} new</span>}
              </div>

              <div className="list-group list-group-flush">
                {conversations.map((c) => {
                  const isActive = c.id === activeId;
                  return (
                    <div
                      key={c.id}
                      className={`list-group-item list-group-item-action border-0 border-bottom d-flex align-items-center gap-2 p-2 ps-3 pe-2 ${
                        isActive ? 'bg-primary bg-opacity-10 border-start border-3 border-primary' : ''
                      }`}
                    >
                      <button
                        type="button"
                        aria-current={isActive ? 'true' : undefined}
                        className="btn btn-link text-decoration-none flex-grow-1 min-w-0 d-flex align-items-center gap-3 p-0 text-start"
                        onClick={() => openConversation(c.id)}
                      >
                        <span className="position-relative flex-shrink-0">
                          <span
                            className={`d-flex align-items-center justify-content-center rounded-circle fw-bold ${
                              isActive ? 'bg-primary text-white' : 'bg-secondary bg-opacity-25 text-dark'
                            }`}
                            style={{ width: 42, height: 42, fontSize: '0.85rem' }}
                          >
                            {c.avatar}
                          </span>
                          {c.online && (
                            <span
                              className="position-absolute bottom-0 end-0 p-1 bg-success border border-white rounded-circle"
                              title="Online"
                            />
                          )}
                        </span>

                        <span className="flex-grow-1 min-w-0">
                          <span className="d-flex justify-content-between align-items-baseline mb-1">
                            <span
                              className={`text-truncate ${c.unreadCount ? 'fw-bold text-dark' : 'fw-semibold text-dark'}`}
                              style={{ fontSize: '0.9rem' }}
                            >
                              {c.name}
                            </span>
                            <small className="text-muted flex-shrink-0 ms-2" style={{ fontSize: '0.72rem' }}>
                              {c.time}
                            </small>
                          </span>
                          <span className="d-flex justify-content-between align-items-center gap-2">
                            <span className="text-muted small text-truncate">{c.lastMessage}</span>
                            {c.unreadCount > 0 && (
                              <span className="badge bg-primary rounded-pill flex-shrink-0">{c.unreadCount}</span>
                            )}
                          </span>
                        </span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-link text-danger flex-shrink-0 px-1"
                        title={`Delete conversation with ${c.name}`}
                        aria-label={`Delete conversation with ${c.name}`}
                        onClick={() => deleteConversation(c.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="p-2 border-top bg-light text-muted" style={{ fontSize: '0.72rem' }}>
                <i className="bi bi-arrow-repeat me-1"></i>
                Chats reset automatically at {resetAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
              </div>
            </div>

            {/* Active Thread */}
            <div className="col-12 col-md-8 d-flex flex-column ims-thread-pane">
              <div className="p-3 border-bottom bg-light">
                <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                  <div className="d-flex align-items-center gap-2 min-w-0">
                    <div
                      className="avatar-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                      style={{ width: 38, height: 38 }}
                    >
                      {activeChat.avatar}
                    </div>
                    <div className="min-w-0">
                      <h6 className="mb-0 fw-bold text-dark text-truncate">{activeChat.name}</h6>
                      <small className="text-muted d-block text-truncate">
                        {activeChat.role} •{' '}
                        {activeChat.online ? <span className="text-success">● Online</span> : 'Offline'}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      title={`Start a video session with ${activeChat.name}`}
                      onClick={() => setNotice(`Opening a video session with ${activeChat.name}…`)}
                    >
                      <i className="bi bi-camera-video-fill me-1"></i> Meet
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      title={`Delete this conversation with ${activeChat.name}`}
                      onClick={() => deleteConversation(activeChat.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div
                ref={threadRef}
                className="flex-grow-1 p-3 overflow-auto d-flex flex-column gap-2 ims-thread-scroll"
              >
                <div className="text-center my-2">
                  <span className="badge bg-light text-muted border fw-normal">
                    {activeChat.name} · {activeChat.role}
                  </span>
                </div>

                {activeChat.messages.length === 0 ? (
                  <div className="text-center text-muted small my-auto">
                    <i className="bi bi-chat-dots d-block fs-3 mb-2 opacity-50" />
                    No messages yet. Say hello to {activeChat.name.split(' ')[0]}.
                  </div>
                ) : (
                  activeChat.messages.map((m) => {
                    const isMe = m.sender === 'me';
                    const isEditing = editingId === m.id;
                    return (
                      <div key={m.id} className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div
                          className={`p-2 px-3 rounded-4 shadow-sm ims-bubble ${
                            isMe ? 'bg-primary text-white' : 'bg-white text-dark border'
                          }`}
                        >
                          {isEditing ? (
                            <div className="d-flex flex-column gap-2" style={{ minWidth: '240px' }}>
                              <textarea
                                className="form-control form-control-sm"
                                rows={2}
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                aria-label="Edit message"
                                autoFocus
                              />
                              <div className="d-flex gap-2 justify-content-end">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-light"
                                  onClick={cancelEditing}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary"
                                  onClick={saveEdit}
                                  disabled={!editText.trim()}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="ims-bubble-text">{m.text}</div>
                              <div
                                className={`text-end mt-1 d-flex align-items-center justify-content-end gap-2 ${
                                  isMe ? 'text-white-50' : 'text-muted'
                                }`}
                                style={{ fontSize: '0.68rem' }}
                              >
                                <span>{m.time}</span>
                                {m.edited && <span className="fst-italic">edited</span>}
                                {isMe && (
                                  <span className="ims-bubble-actions">
                                    <button
                                      type="button"
                                      className="ims-bubble-btn"
                                      title="Edit message"
                                      aria-label="Edit message"
                                      onClick={() => startEditing(m)}
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="ims-bubble-btn"
                                      title="Delete message"
                                      aria-label="Delete message"
                                      onClick={() => deleteMessage(m.id)}
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 border-top bg-white">
                <div className="d-flex gap-2 align-items-center">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Message ${activeChat.name}…`}
                    aria-label={`Message ${activeChat.name}`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary d-flex align-items-center gap-1 px-3 flex-shrink-0"
                    disabled={!inputText.trim()}
                  >
                    <i className="bi bi-send-fill" />
                    Send
                  </button>
                </div>
                <div className="form-text mt-1" style={{ fontSize: '0.72rem' }}>
                  Press Enter to send. Your own messages can be edited or deleted.
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
