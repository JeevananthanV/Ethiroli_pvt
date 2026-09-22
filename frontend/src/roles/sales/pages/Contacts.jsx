import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getLeads, createLead, createActivity } from '../../../services/api/salesApi.js';

export default function SalesContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    status: 'QUALIFIED'
  });

  const [activityForm, setActivityForm] = useState({
    activity_type: 'CALL',
    title: '',
    scheduled_at: new Date().toISOString().slice(0, 16),
    outcome: 'CONNECTED',
    description: ''
  });

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await getLeads();
      const list = res?.items || (Array.isArray(res) ? res : []);
      if (list.length > 0) {
        setContacts(list.map(l => ({
          id: l.id,
          name: `${l.first_name || ''} ${l.last_name || ''}`.trim() || 'Key Contact',
          email: l.email,
          phone: l.phone,
          company: l.company_name || 'Enterprise Account',
          status: l.status || 'QUALIFIED',
          last_contacted: l.created_at ? new Date(l.created_at).toLocaleDateString() : 'Recent'
        })));
      } else {
        setContacts([
          { id: '1', name: 'Vikramaditya Rao', email: 'vikram.rao@enterprise.in', phone: '+91 98450 12345', company: 'Zenith Tech Solutions', status: 'QUALIFIED', last_contacted: '2026-09-08' },
          { id: '2', name: 'Priya Sundaram', email: 'priya@eduglobal.org', phone: '+91 99201 98765', company: 'EduGlobal Institute', status: 'PROPOSAL_SENT', last_contacted: '2026-09-07' },
          { id: '3', name: 'Rohan Mehra', email: 'rohan.m@quantum.co', phone: '+91 97112 34567', company: 'Quantum Labs', status: 'NEGOTIATION', last_contacted: '2026-09-09' },
          { id: '4', name: 'Dr. Anita Joshi', email: 'anita.joshi@symbiosis.edu', phone: '+91 98220 54321', company: 'Symbiosis Group', status: 'CONTACTED', last_contacted: '2026-09-06' }
        ]);
      }
    } catch (err) {
      console.error('Failed to load contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleCreateContact = async (e) => {
    e.preventDefault();
    try {
      await createLead({ ...form, source: 'CRM_MANUAL' });
      setShowAddModal(false);
      setForm({ first_name: '', last_name: '', email: '', phone: '', company_name: '', status: 'QUALIFIED' });
      fetchContacts();
    } catch (err) {
      alert('Failed to add contact: ' + err.message);
    }
  };

  const handleLogActivity = async (e) => {
    e.preventDefault();
    try {
      await createActivity({
        ...activityForm,
        lead_id: selectedContact?.id || null,
        title: `${activityForm.activity_type}: ${selectedContact?.name || 'Contact'} - ${activityForm.title || 'Discussion'}`
      });
      setShowLogModal(false);
      alert('Activity logged successfully!');
    } catch (err) {
      alert('Failed to log activity: ' + err.message);
    }
  };

  const filtered = contacts.filter(c => {
    const name = c.name || '';
    const company = c.company || '';
    const email = c.email || '';
    return !search || name.toLowerCase().includes(search.toLowerCase()) || company.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <AdminPage
      title="CRM Contacts Directory"
      subtitle="Key decision makers, department heads, and technical buyers across corporate accounts"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-person-plus-fill"></i>
          <span>Add Contact</span>
        </button>
      }
    >
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3">
          <div className="input-group" style={{ maxWidth: '360px' }}>
            <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control bg-light border-0"
              placeholder="Search contacts by name, company, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Contact Person</th>
                <th>Company Account</th>
                <th>Phone & Email</th>
                <th>Relationship Stage</th>
                <th>Last Active</th>
                <th className="text-end">Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Loading contacts directory...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-muted">No contacts found matching search criteria.</td></tr>
              ) : (
                filtered.map(contact => (
                  <tr key={contact.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bold d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                          {(contact.name || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-semibold text-dark">{contact.name}</div>
                          <small className="text-muted">Primary Decision Maker</small>
                        </div>
                      </div>
                    </td>
                    <td className="fw-semibold">{contact.company || 'Enterprise Prospect'}</td>
                    <td>
                      <div><i className="bi bi-telephone text-muted me-1 small"></i>{contact.phone || '—'}</div>
                      <small className="text-muted"><i className="bi bi-envelope text-muted me-1 small"></i>{contact.email || '—'}</small>
                    </td>
                    <td>
                      <span className="badge bg-primary bg-opacity-10 text-primary">
                        {contact.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td><small className="text-muted">{contact.last_contacted || 'Recently'}</small></td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          title="Schedule Touchpoint"
                          onClick={() => {
                            setSelectedContact(contact);
                            setActivityForm({
                              activity_type: 'CALL',
                              title: `Catch-up with ${contact.name}`,
                              scheduled_at: new Date().toISOString().slice(0, 16),
                              outcome: 'CONNECTED',
                              description: ''
                            });
                            setShowLogModal(true);
                          }}
                        >
                          <i className="bi bi-calendar-plus me-1"></i>Log Touchpoint
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add Enterprise Contact</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleCreateContact}>
                <div className="modal-body">
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">First Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={form.first_name}
                        onChange={e => setForm({ ...form, first_name: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.last_name}
                        onChange={e => setForm({ ...form, last_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Company / Organization *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={form.company_name}
                      onChange={e => setForm({ ...form, company_name: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Phone *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Contact</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Log Activity Modal */}
      {showLogModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Log Touchpoint for {selectedContact?.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowLogModal(false)}></button>
              </div>
              <form onSubmit={handleLogActivity}>
                <div className="modal-body">
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Activity Type</label>
                      <select
                        className="form-select"
                        value={activityForm.activity_type}
                        onChange={e => setActivityForm({ ...activityForm, activity_type: e.target.value })}
                      >
                        <option value="CALL">Phone Call</option>
                        <option value="MEETING">In-Person Meeting</option>
                        <option value="DEMO">Product Demo</option>
                        <option value="EMAIL">Email Follow-Up</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Scheduled Date & Time *</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        required
                        value={activityForm.scheduled_at}
                        onChange={e => setActivityForm({ ...activityForm, scheduled_at: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Topic / Agenda *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Q4 Platform Renewal discussion"
                      value={activityForm.title}
                      onChange={e => setActivityForm({ ...activityForm, title: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Notes / Outcome</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Summary of conversation, objections, next steps..."
                      value={activityForm.description}
                      onChange={e => setActivityForm({ ...activityForm, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowLogModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Touchpoint</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
