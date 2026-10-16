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
    district: 'Erode',
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
      const res = await getLeads({ limit: 250 });
      const list = res?.items || (Array.isArray(res) ? res : []);
      setContacts(list.map(l => ({
        id: l.id,
        name: `${l.first_name || l.name || ''} ${l.last_name || ''}`.trim() || 'Doctor / Decision Maker',
        email: l.email,
        phone: l.phone,
        company: l.company_name || 'Clinic Account',
        district: l.district || 'Tamil Nadu',
        status: l.status || 'NEW',
        stage: l.pipeline_stage || 'Stage 1',
        bda: l.bda_name || 'Associate',
        last_contacted: l.last_contact_date ? new Date(l.last_contact_date).toLocaleDateString('en-IN') : 'Recent'
      })));
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
      await createLead({
        ...form,
        name: form.first_name,
        source: 'PHONE',
        notes: `Direct Doctor Contact added via Contacts directory in ${form.district}`
      });
      setShowAddModal(false);
      setForm({ first_name: '', last_name: '', email: '', phone: '', company_name: '', district: 'Erode', status: 'QUALIFIED' });
      fetchContacts();
      alert('Healthcare decision maker added successfully!');
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
      alert('Touchpoint logged successfully!');
    } catch (err) {
      alert('Failed to log touchpoint: ' + err.message);
    }
  };

  const filtered = contacts.filter(c => {
    const name = c.name || '';
    const company = c.company || '';
    const phone = c.phone || '';
    const dist = c.district || '';
    const q = search.toLowerCase();
    return !search || name.toLowerCase().includes(q) || company.toLowerCase().includes(q) || phone.toLowerCase().includes(q) || dist.toLowerCase().includes(q);
  });

  return (
    <AdminPage
      title="Healthcare Contacts Directory"
      subtitle="Clinic directors, head dentists, and commercial decision makers across Tamil Nadu territory hubs"
      actions={
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-person-plus-fill"></i>
          <span>Add Doctor Contact</span>
        </button>
      }
    >
      {/* Search Header */}
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-3">
        <div className="row g-2 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted"></i></span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search by doctor name, clinic, phone, district..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6 text-md-end">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
              {filtered.length} Healthcare Decision Makers
            </span>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="sales-table-card">
        <div className="table-responsive">
          <table className="table sales-table align-middle">
            <thead>
              <tr>
                <th>Decision Maker</th>
                <th>Clinic / Business Name</th>
                <th>Direct Outreach</th>
                <th>District / Area</th>
                <th>Assigned BDA</th>
                <th>Relationship Stage</th>
                <th className="text-end">Touchpoint</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                    Loading directory...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No contacts match search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(contact => (
                  <tr key={contact.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="kpi-icon-bubble kpi-bubble-indigo" style={{ width: '38px', height: '38px', fontSize: '1rem' }}>
                          <i className="bi bi-person-fill"></i>
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{contact.name}</div>
                          <small className="text-muted">Doctor / Director</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{contact.company}</div>
                    </td>
                    <td>
                      {contact.phone ? (
                        <div className="d-flex gap-1">
                          <a href={`tel:${contact.phone}`} className="action-pill-btn action-pill-phone">
                            <i className="bi bi-telephone-fill"></i> {contact.phone}
                          </a>
                          <a 
                            href={`https://wa.me/91${contact.phone}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="action-pill-btn action-pill-whatsapp"
                          >
                            <i className="bi bi-whatsapp"></i> WhatsApp
                          </a>
                        </div>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        <i className="bi bi-geo-alt-fill text-primary me-1"></i>
                        {contact.district}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {contact.bda}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        contact.status === 'CONVERTED' ? 'bg-success' :
                        contact.status === 'LOST' ? 'bg-danger' :
                        contact.status === 'DEMO' ? 'bg-info text-dark' : 'bg-primary-subtle text-primary border border-primary-subtle'
                      }`}>
                        {contact.stage || contact.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary"
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
                        <i className="bi bi-calendar-plus me-1"></i> Log Touchpoint
                      </button>
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
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">Add Healthcare Decision Maker</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleCreateContact}>
                <div className="modal-body p-4">
                  <div className="row g-2 mb-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Doctor / Decision Maker Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="Dr. Full Name"
                        value={form.first_name}
                        onChange={e => setForm({ ...form, first_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Clinic / Business Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Apex Dental Care"
                      value={form.company_name}
                      onChange={e => setForm({ ...form, company_name: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Phone (10 digits) *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="9876543210"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">District / Area</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Erode, Rasipuram..."
                        value={form.district}
                        onChange={e => setForm({ ...form, district: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Decision Maker</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Log Activity Modal */}
      {showLogModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-clock-history text-primary me-2"></i>
                  Log SLA Touchpoint: {selectedContact?.name}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowLogModal(false)}></button>
              </div>
              <form onSubmit={handleLogActivity}>
                <div className="modal-body p-4">
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Touchpoint Type</label>
                      <select
                        className="form-select"
                        value={activityForm.activity_type}
                        onChange={e => setActivityForm({ ...activityForm, activity_type: e.target.value })}
                      >
                        <option value="CALL">Outbound Call</option>
                        <option value="MEETING">Clinic Demo / In-Person</option>
                        <option value="NOTE">Clinical Note / WhatsApp Follow-up</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Outcome</label>
                      <select
                        className="form-select"
                        value={activityForm.outcome}
                        onChange={e => setActivityForm({ ...activityForm, outcome: e.target.value })}
                      >
                        <option value="CONNECTED">Connected & Engaged</option>
                        <option value="INTERESTED">Demo Scheduled</option>
                        <option value="FOLLOW_UP">Follow-up Requested</option>
                        <option value="NO_ANSWER">No Answer / Busy</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Discussion Summary</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Doctor's interest, requirements discussed, next follow-up agreement..."
                      value={activityForm.description}
                      onChange={e => setActivityForm({ ...activityForm, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowLogModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Log Touchpoint</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
