import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { forumApi } from '../../../services/api/forumApi.js';
import { courseApi } from '../../../services/api/courseApi.js';

const CATEGORY_OPTIONS = ['general', 'academics', 'projects', 'career', 'off-topic'];

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * ForumThreadList - the discussion board.
 *
 * Lists threads from GET /v1/forum/posts, opens a thread inline (detail +
 * replies + upvotes) and creates threads / replies through the forum API, so
 * every control on the page is wired to the backend.
 */
export default function ForumThreadList({ category }) {
  const [threads, setThreads] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(category || '');

  const [activeThread, setActiveThread] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyBusy, setReplyBusy] = useState(false);

  const [showComposer, setShowComposer] = useState(false);
  const [composer, setComposer] = useState({ course_id: '', title: '', content: '', category: 'general' });
  const [posting, setPosting] = useState(false);
  const [notice, setNotice] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      const selected = category || categoryFilter;
      if (selected) params.category = selected;
      const data = await forumApi.getAllThreads(params);
      setThreads(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load forum threads');
    } finally {
      setLoading(false);
    }
  }, [category, categoryFilter]);

  useEffect(() => {
    load();
  }, [load]);

  // Course selector for the composer (role-scoped server-side).
  useEffect(() => {
    courseApi
      .getAll()
      .then((res) => {
        const list = res?.data ?? res;
        setCourses(Array.isArray(list) ? list : []);
      })
      .catch(() => setCourses([]));
  }, []);

  const openThread = async (thread) => {
    setError(null);
    try {
      const detail = await forumApi.getThread(thread.id);
      setActiveThread(detail || thread);
      setReplyText('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to open the thread');
    }
  };

  const closeThread = () => {
    setActiveThread(null);
    setReplyText('');
  };

  const submitReply = async (e) => {
    e.preventDefault();
    if (!activeThread || !replyText.trim()) return;
    setReplyBusy(true);
    setNotice(null);
    try {
      await forumApi.createReply(activeThread.id, { content: replyText.trim() });
      setReplyText('');
      const detail = await forumApi.getThread(activeThread.id);
      setActiveThread(detail);
      setNotice({ type: 'success', message: 'Reply posted.' });
      await load();
    } catch (err) {
      setNotice({ type: 'danger', message: err.response?.data?.message || err.message || 'Failed to post reply.' });
    } finally {
      setReplyBusy(false);
    }
  };

  const submitThread = async (e) => {
    e.preventDefault();
    setPosting(true);
    setNotice(null);
    try {
      await forumApi.createThread(composer);
      setShowComposer(false);
      setComposer({ course_id: '', title: '', content: '', category: 'general' });
      setNotice({ type: 'success', message: 'Thread published.' });
      await load();
    } catch (err) {
      setNotice({ type: 'danger', message: err.response?.data?.message || err.message || 'Failed to publish the thread.' });
    } finally {
      setPosting(false);
    }
  };

  const toggleVote = async (thread) => {
    try {
      const result = await forumApi.votePost(thread.id, 1);
      const voted = Boolean(result?.voted);
      const upvotes = Number(result?.upvotes ?? thread.upvotes) || 0;
      setThreads((prev) =>
        prev.map((t) => (t.id === thread.id ? { ...t, upvotes, hasVoted: voted } : t))
      );
      setActiveThread((prev) =>
        prev && prev.id === thread.id ? { ...prev, upvotes, hasVoted: voted } : prev
      );
    } catch (err) {
      setNotice({ type: 'danger', message: err.response?.data?.message || 'Could not record your vote.' });
    }
  };

  const categoriesPresent = [...new Set(threads.map((t) => t.category).filter(Boolean))];

  const filtered = threads.filter((t) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    return (
      (t.title || '').toLowerCase().includes(term) ||
      (t.excerpt || '').toLowerCase().includes(term) ||
      String(t.author || '').toLowerCase().includes(term)
    );
  });

  /* --------------------------------------------------------- Thread detail */
  if (activeThread) {
    const replies = Array.isArray(activeThread.replies) ? activeThread.replies : [];
    return (
      <AdminPage
        title={activeThread.title || 'Thread'}
        subtitle={`${activeThread.category || 'general'} • started by ${activeThread.author_name || activeThread.author || 'Unknown'}`}
        error={error}
        onRetry={load}
        actions={
          <button className="btn secondary" onClick={closeThread}>
            ← Back to Discussion Board
          </button>
        }
      >
        {notice && (
          <div className={`alert alert-${notice.type} alert-dismissible fade show`} role="alert">
            <div>{notice.message}</div>
            <button type="button" className="btn-close" onClick={() => setNotice(null)} />
          </div>
        )}

        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>{activeThread.title}</h2>
              <div style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
                {formatDate(activeThread.created_at || activeThread.updatedAt)}
                {activeThread.course_id ? ' • course thread' : ''}
                {activeThread.locked ? ' • locked' : ''}
              </div>
            </div>
            <button
              className="btn secondary"
              onClick={() => toggleVote(activeThread)}
              style={{ whiteSpace: 'nowrap' }}
            >
              {activeThread.hasVoted ? '✓ ' : '▲ '}
              {activeThread.upvotes || 0} Upvotes
            </button>
          </div>

          <p style={{ marginTop: 18, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {activeThread.content || activeThread.excerpt || ''}
          </p>
        </div>

        <div className="card" style={{ padding: 24, marginTop: 20 }}>
          <h4 style={{ margin: '0 0 16px' }}>{replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}</h4>

          {replies.length === 0 ? (
            <p style={{ color: 'var(--admin-text-muted)' }}>No replies yet. Be the first to answer.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {replies.map((reply, idx) => (
                <div
                  key={reply.id || idx}
                  style={{
                    padding: 14,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--admin-border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <strong style={{ fontSize: 13.5 }}>{reply.author_name || reply.author || 'Unknown'}</strong>
                    <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                      {formatDate(reply.created_at)}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{reply.content}</div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={submitReply} style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <input
              className="inputField"
              style={{ flex: 1 }}
              placeholder={activeThread.locked ? 'This thread is locked.' : 'Write a reply…'}
              value={replyText}
              disabled={activeThread.locked || replyBusy}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button
              type="submit"
              className="btn primary"
              disabled={activeThread.locked || replyBusy || !replyText.trim()}
            >
              {replyBusy ? 'Posting…' : 'Reply'}
            </button>
          </form>
        </div>
      </AdminPage>
    );
  }

  /* ---------------------------------------------------------- Thread list */
  return (
    <AdminPage
      title="Discussion Forum"
      subtitle="Ask questions and interact with tutors and students"
      loading={loading}
      error={error}
      onRetry={load}
      actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="Search threads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="inputField"
            style={{ width: 220 }}
          />
          <button className="btn primary" onClick={() => setShowComposer(true)}>
            + New Thread
          </button>
        </div>
      }
    >
      {notice && (
        <div className={`alert alert-${notice.type} alert-dismissible fade show`} role="alert">
          <div>{notice.message}</div>
          <button type="button" className="btn-close" onClick={() => setNotice(null)} />
        </div>
      )}

      {!category && categoriesPresent.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <button
            className={`btn ${categoryFilter ? 'secondary' : 'primary'}`}
            style={{ fontSize: 12, padding: '5px 12px' }}
            onClick={() => setCategoryFilter('')}
          >
            All
          </button>
          {categoriesPresent.map((c) => (
            <button
              key={c}
              className={`btn ${categoryFilter === c ? 'primary' : 'secondary'}`}
              style={{ fontSize: 12, padding: '5px 12px', textTransform: 'capitalize' }}
              onClick={() => setCategoryFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="emptyState">
          <h3>No threads found</h3>
          <p>{searchTerm ? 'Try adjusting your search' : 'Be the first to start a discussion!'}</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Thread</th>
                <th>Author</th>
                <th>Replies</th>
                <th>Upvotes</th>
                <th>Last Active</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((thread) => (
                <tr
                  key={thread.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => openThread(thread)}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {thread.pinned && <span style={{ fontSize: 14 }}>📌</span>}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{thread.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 2 }}>
                          {thread.category} • {(thread.excerpt || '').slice(0, 80)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: 12 }}>
                        {String(thread.author || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: 13.5 }}>{thread.author}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: '#818cf8',
                        padding: '2px 8px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600
                      }}
                    >
                      {thread.replyCount ?? 0}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, color: 'var(--admin-text-secondary)' }}>
                      ▲ {thread.upvotes ?? 0}
                    </span>
                  </td>
                  <td style={{ fontSize: 13.5, color: 'var(--admin-text-secondary)' }}>
                    {formatDate(thread.updatedAt || thread.lastActive)}
                  </td>
                  <td>
                    <span className={`statusTag ${thread.pinned ? 'active' : 'inactive'}`}>
                      {thread.locked ? 'Locked' : thread.pinned ? 'Pinned' : 'Open'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Composer */}
      {showComposer && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Start a New Thread</h5>
                <button type="button" className="btn-close" onClick={() => setShowComposer(false)} />
              </div>
              <form onSubmit={submitThread}>
                <div className="modal-body p-4" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label className="form-label small fw-semibold">Course *</label>
                    <select
                      className="form-select"
                      required
                      value={composer.course_id}
                      onChange={(e) => setComposer({ ...composer, course_id: e.target.value })}
                    >
                      <option value="">-- Select a course --</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code ? `${c.code} — ` : ''}{c.name || c.title}
                        </option>
                      ))}
                    </select>
                    {courses.length === 0 && (
                      <div className="form-text">No enrolled courses available yet.</div>
                    )}
                  </div>
                  <div>
                    <label className="form-label small fw-semibold">Category</label>
                    <select
                      className="form-select"
                      value={composer.category}
                      onChange={(e) => setComposer({ ...composer, category: e.target.value })}
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label small fw-semibold">Title *</label>
                    <input
                      className="form-control"
                      required
                      value={composer.title}
                      onChange={(e) => setComposer({ ...composer, title: e.target.value })}
                      placeholder="What do you need help with?"
                    />
                  </div>
                  <div>
                    <label className="form-label small fw-semibold">Details *</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      required
                      value={composer.content}
                      onChange={(e) => setComposer({ ...composer, content: e.target.value })}
                      placeholder="Describe the question, share context, paste code…"
                    />
                  </div>
                </div>
                <div className="modal-footer border-top bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowComposer(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4" disabled={posting}>
                    {posting ? 'Publishing…' : 'Publish Thread'}
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
