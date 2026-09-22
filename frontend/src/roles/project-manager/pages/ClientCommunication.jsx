import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage';
import { clientApi } from '../../../services/api/clientApi';

export default function PMClientCommunication() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', sender: 'Project Manager', text: 'Milestone 2 frontend components are now live in staging for review.', time: 'Today 10:30 AM', isMe: true },
    { id: '2', sender: 'Acme Corp', text: 'Thank you! We will review the staging deploy and get back by end of day.', time: 'Today 11:15 AM', isMe: false }
  ]);

  useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      try {
        const res = await clientApi.getAll();
        const list = Array.isArray(res) ? res : (res?.clients || []);
        setClients(list);
        if (list.length > 0) setSelectedClient(list[0]);
      } catch (err) {
        console.error('Failed to load clients:', err);
        const fallback = [
          { id: 'c1', name: 'Acme Technologies', company_name: 'Acme Corp', email: 'contact@acme.com' },
          { id: 'c2', name: 'Apex Digital Solutions', company_name: 'Apex Ltd', email: 'support@apexdigital.com' },
          { id: 'c3', name: 'Nexus Global', company_name: 'Nexus Corp', email: 'billing@nexus.com' }
        ];
        setClients(fallback);
        setSelectedClient(fallback[0]);
      } finally {
        setLoading(false);
      }
    };
    loadClients();
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: 'Project Manager',
      text: messageText,
      time: 'Just now',
      isMe: true
    };
    setMessages([...messages, newMsg]);
    setMessageText('');
  };

  return (
    <AdminPage
      title="Client Communication"
      subtitle="Direct messaging, milestone sign-offs, and communication logs with project clients"
    >
      <div className="row g-3">
        {/* Left Column: Client List */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-bold">Active Clients</h6>
            </div>
            <div className="list-group list-group-flush">
              {loading ? (
                <div className="p-3 text-center text-muted">Loading clients...</div>
              ) : clients.length === 0 ? (
                <div className="p-3 text-center text-muted">No clients found</div>
              ) : (
                clients.map(client => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => setSelectedClient(client)}
                    className={`list-group-item list-group-item-action border-0 px-3 py-3 d-flex align-items-center gap-3 ${
                      selectedClient?.id === client.id ? 'bg-primary bg-opacity-10 text-primary fw-semibold' : ''
                    }`}
                  >
                    <div className="rounded-circle bg-secondary bg-opacity-10 text-secondary d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                      {(client.company_name || client.name || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-truncate">{client.company_name || client.name}</div>
                      <small className="text-muted text-truncate d-block">{client.email || 'Client'}</small>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Chat/Thread Window */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-3 d-flex flex-column" style={{ minHeight: '500px' }}>
            <div className="card-header bg-white border-bottom py-3 d-flex align-items-center justify-content-between">
              <div>
                <h6 className="mb-0 fw-bold">{selectedClient?.company_name || selectedClient?.name || 'Select Client'}</h6>
                <small className="text-muted">{selectedClient?.email}</small>
              </div>
              <span className="badge bg-success bg-opacity-10 text-success">Client Portal Active</span>
            </div>

            <div className="card-body p-4 flex-grow-1 overflow-auto" style={{ maxHeight: '420px' }}>
              <div className="d-flex flex-column gap-3">
                {messages.map(m => (
                  <div key={m.id} className={`d-flex ${m.isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div
                      className={`p-3 rounded-3 shadow-sm ${m.isMe ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                      style={{ maxWidth: '75%' }}
                    >
                      <div className="d-flex justify-content-between align-items-center gap-3 mb-1">
                        <small className={`fw-bold ${m.isMe ? 'text-white-50' : 'text-muted'}`}>{m.sender}</small>
                        <small className={`small ${m.isMe ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>{m.time}</small>
                      </div>
                      <p className="mb-0" style={{ fontSize: '0.9rem' }}>{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-footer bg-white border-top p-3">
              <form onSubmit={handleSend} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type an update or reply to client..."
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                />
                <button type="submit" className="btn btn-primary d-flex align-items-center gap-1">
                  <i className="bi bi-send-fill"></i>
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
