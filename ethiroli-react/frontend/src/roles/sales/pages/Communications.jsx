import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getCommunications } from '../../../services/api/salesApi.js';

export default function Communications() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ recipient: '', channel: 'EMAIL', subject: '', body: '' });

  useEffect(() => {
    async function loadComms() {
      try {
        setLoading(true);
        const res = await getCommunications();
        const items = res?.items || (Array.isArray(res) ? res : []);
        if (items.length > 0) {
          setMessages(items);
        } else {
          setMessages([
            { id: '1', channel: 'EMAIL', recipient: 'ananya@infosystems.com', subject: 'Formal Quotation: Enterprise LMS Campus Tier', body: 'Dear Ananya, Thank you for your time on our demo call yesterday. Attached is the complete commercial proposal...', sent_at: '2026-09-09 16:30:00', status: 'DELIVERED' },
            { id: '2', channel: 'SMS', recipient: '+91 98765 43210', subject: 'Demo Confirmation Reminder', body: 'Hi Rajesh, Reminder for our Platform Architecture demo scheduled tomorrow at 11:00 AM IST.', sent_at: '2026-09-08 18:00:00', status: 'DELIVERED' },
            { id: '3', channel: 'EMAIL', recipient: 'priya@eduglobal.org', subject: 'Follow-up on MOU Legal Clauses', body: 'Dear Priya, Following up regarding the clause 4.2 data residency terms discussed with our CTO...', sent_at: '2026-09-07 14:15:00', status: 'OPENED' }
          ]);
        }
      } catch (err) {
        console.error('Failed to load communications:', err);
      } finally {
        setLoading(false);
      }
    }
    loadComms();
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    const newMsg = {
      id: String(Date.now()),
      channel: form.channel,
      recipient: form.recipient,
      subject: form.subject,
      body: form.body,
      sent_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'SENT'
    };
    setMessages([newMsg, ...messages]);
    setShowModal(false);
    setForm({ recipient: '', channel: 'EMAIL', subject: '', body: '' });
  };

  return (
    <AdminPage
      title="Client Communications & Outbox"
      subtitle="Track outbound emails, transactional SMS alerts, customer messaging history, and open receipts"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-send-fill"></i>
          <span>Compose Message</span>
        </button>
      }
    >
      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold">Outbound Client Correspondence</h6>
          <span className="badge bg-light text-secondary border px-3 py-2">
            {messages.length} Messages Logged
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Channel</th>
                <th>Recipient</th>
                <th>Subject & Snippet</th>
                <th>Sent Timestamp</th>
                <th>Delivery Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-4">Loading messages...</td></tr>
              ) : messages.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-muted">No messages in communication log.</td></tr>
              ) : (
                messages.map(msg => (
                  <tr key={msg.id}>
                    <td>
                      <span className="badge bg-light text-dark border">
                        <i className={`bi bi-${msg.channel === 'EMAIL' ? 'envelope' : 'chat-dots'} me-1`}></i>
                        {msg.channel}
                      </span>
                    </td>
                    <td><div className="fw-semibold text-dark">{msg.recipient}</div></td>
                    <td>
                      <div className="fw-semibold text-dark">{msg.subject}</div>
                      <small className="text-muted text-truncate d-block" style={{ maxWidth: '360px' }}>{msg.body}</small>
                    </td>
                    <td className="text-muted">{msg.sent_at}</td>
                    <td>
                      <span className={`badge ${
                        msg.status === 'OPENED' ? 'bg-success' :
                        msg.status === 'DELIVERED' ? 'bg-primary' : 'bg-secondary'
                      }`}>
                        {msg.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compose Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Compose Client Message</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSend}>
                <div className="modal-body">
                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <label className="form-label small fw-semibold">Channel</label>
                      <select
                        className="form-select"
                        value={form.channel}
                        onChange={e => setForm({ ...form, channel: e.target.value })}
                      >
                        <option value="EMAIL">Email</option>
                        <option value="SMS">SMS</option>
                        <option value="WHATSAPP">WhatsApp</option>
                      </select>
                    </div>
                    <div className="col-8">
                      <label className="form-label small fw-semibold">Recipient Contact *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="email@company.com or +91..."
                        value={form.recipient}
                        onChange={e => setForm({ ...form, recipient: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Subject *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Contract review and implementation timeline"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Message Body *</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      required
                      placeholder="Type your message to the client..."
                      value={form.body}
                      onChange={e => setForm({ ...form, body: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Send Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
