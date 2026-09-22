import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function ReceptionCommunications() {
  const [messages, setMessages] = useState([
    { id: '1', recipient: 'Manoj Prabhakar (+91 98412 98765)', channel: 'WhatsApp', template: 'Course Syllabus & Weekend Batch Schedule', timestamp: 'Today 11:45 AM', status: 'DELIVERED' },
    { id: '2', recipient: 'Deepika Krishnan (+91 97890 12345)', channel: 'SMS', template: 'Ethiroli Academy Location Map & Counselor Timing', timestamp: 'Today 10:20 AM', status: 'DELIVERED' },
    { id: '3', recipient: 'All Enrolled Batches (FSWD, DSAI, CDEV)', channel: 'Broadcast Alert', template: 'Campus Closed on Monday for Regional Holiday', timestamp: 'Yesterday 05:00 PM', status: 'BROADCAST_SENT' },
    { id: '4', recipient: 'Kishore Kumar (+91 99402 34567)', channel: 'WhatsApp', template: 'ID Card Photo Submission Reminder', timestamp: 'Yesterday 02:30 PM', status: 'READ' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    channel: 'WhatsApp',
    template: 'Custom Front Desk Message',
    content: ''
  });

  const templates = [
    { title: 'Syllabus & Course Brochure', text: 'Hi! Thank you for visiting Ethiroli Academy today. Here is the complete curriculum brochure and weekend batch timings: https://ethiroli.edu/syllabus' },
    { title: 'Admissions Fee Due Reminder', text: 'Dear Student, Kindly clear your installment before Friday to receive your biometric ID badge and course kit at the reception.' },
    { title: 'Campus Direction & Gate Pass', text: 'Welcome to Ethiroli Academy! Present this QR code or badge pass at the security desk upon arrival.' }
  ];

  const handleSend = (e) => {
    e.preventDefault();
    setMessages([
      {
        id: String(Date.now()),
        recipient: newMessage.recipient,
        channel: newMessage.channel,
        template: newMessage.template,
        timestamp: 'Just now',
        status: 'DELIVERED'
      },
      ...messages
    ]);
    setShowModal(false);
    setNewMessage({ recipient: '', channel: 'WhatsApp', template: 'Custom Front Desk Message', content: '' });
  };

  return (
    <AdminPage
      title="Front Desk Communication Center"
      subtitle="Dispatch instant SMS & WhatsApp candidate notifications, broadcast campus alerts, and track message deliverability"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => setShowModal(true)}>
          <i className="bi bi-chat-left-dots-fill"></i>
          <span>Send Message / Alert</span>
        </button>
      }
    >
      {/* Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Messages Sent Today</span>
            <h3 className="fw-bold mb-0 mt-1">{messages.length}</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">WhatsApp Dispatches</span>
            <h3 className="fw-bold mb-0 mt-1 text-success">
              {messages.filter(m => m.channel === 'WhatsApp').length}
            </h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">SMS Alerts</span>
            <h3 className="fw-bold mb-0 mt-1 text-primary">
              {messages.filter(m => m.channel === 'SMS').length}
            </h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Campus Broadcasts</span>
            <h3 className="fw-bold mb-0 mt-1 text-warning">
              {messages.filter(m => m.channel.includes('Broadcast')).length}
            </h3>
          </div>
        </div>
      </div>

      {/* Dispatches Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">Recipient</th>
                <th>Channel</th>
                <th>Message Subject / Template</th>
                <th>Dispatched At</th>
                <th>Delivery Status</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(m => (
                <tr key={m.id}>
                  <td className="ps-3">
                    <div className="fw-semibold text-dark">{m.recipient}</div>
                  </td>
                  <td>
                    <span className={`badge ${m.channel === 'WhatsApp' ? 'bg-success bg-opacity-10 text-success' : m.channel === 'SMS' ? 'bg-info bg-opacity-10 text-info' : 'bg-warning bg-opacity-10 text-warning'}`}>
                      {m.channel === 'WhatsApp' && <i className="bi bi-whatsapp me-1"></i>}
                      {m.channel === 'SMS' && <i className="bi bi-chat-text-fill me-1"></i>}
                      {m.channel.includes('Broadcast') && <i className="bi bi-megaphone-fill me-1"></i>}
                      {m.channel}
                    </span>
                  </td>
                  <td>
                    <div className="text-dark small fw-medium">{m.template}</div>
                  </td>
                  <td>
                    <small className="text-muted">{m.timestamp}</small>
                  </td>
                  <td>
                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                      <i className="bi bi-check2-all me-1"></i>{m.status}
                    </span>
                  </td>
                  <td className="text-end pe-3">
                    <button className="btn btn-sm btn-light border" onClick={() => alert(`Resending message to ${m.recipient}`)}>
                      <i className="bi bi-arrow-repeat me-1"></i>Resend
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Dispatch Message / Front Desk Alert</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSend}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Recipient (Phone / Group) *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="+91 98401 23456 or 'All Students'"
                        value={newMessage.recipient}
                        onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Delivery Channel</label>
                      <select
                        className="form-select"
                        value={newMessage.channel}
                        onChange={(e) => setNewMessage({ ...newMessage, channel: e.target.value })}
                      >
                        <option value="WhatsApp">WhatsApp Message</option>
                        <option value="SMS">Direct SMS</option>
                        <option value="Broadcast Alert">Campus Broadcast Notification</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Quick Template</label>
                      <select
                        className="form-select"
                        onChange={(e) => {
                          const idx = Number(e.target.value);
                          if (templates[idx]) {
                            setNewMessage({ ...newMessage, template: templates[idx].title, content: templates[idx].text });
                          }
                        }}
                      >
                        <option value="">Choose Template...</option>
                        {templates.map((t, idx) => (
                          <option key={idx} value={idx}>{t.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Message Text *</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        required
                        placeholder="Write your custom message..."
                        value={newMessage.content}
                        onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Dispatch Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
