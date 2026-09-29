import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function SalesCampaigns() {
  const [campaigns, setCampaigns] = useState([
    { id: '1', name: 'Q3 Enterprise Tech Upskilling Email Blast', channel: 'EMAIL', sent: 1250, opened: '48.2%', clicks: '14.1%', leads: 42, budget: 15000, status: 'COMPLETED' },
    { id: '2', name: 'Campus Placement Officer WhatsApp Outreach', channel: 'WHATSAPP', sent: 350, opened: '92.0%', clicks: '38.4%', leads: 28, budget: 8000, status: 'ACTIVE' },
    { id: '3', name: 'Full-Stack Developer Internship Webinar', channel: 'WEBINAR', sent: 2100, opened: '35.0%', clicks: '8.5%', leads: 74, budget: 25000, status: 'COMPLETED' },
    { id: '4', name: 'LinkedIn Sponsored InMail for CTOs', channel: 'LINKEDIN', sent: 800, opened: '56.4%', clicks: '18.2%', leads: 31, budget: 35000, status: 'ACTIVE' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    channel: 'EMAIL',
    sent: 500,
    budget: 10000,
    status: 'ACTIVE'
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const newCamp = {
      id: String(Date.now()),
      name: form.name,
      channel: form.channel,
      sent: parseInt(form.sent, 10),
      opened: '0%',
      clicks: '0%',
      leads: 0,
      budget: parseFloat(form.budget),
      status: 'ACTIVE'
    };
    setCampaigns([newCamp, ...campaigns]);
    setShowModal(false);
    setForm({ name: '', channel: 'EMAIL', sent: 500, budget: 10000, status: 'ACTIVE' });
  };

  const totalLeads = campaigns.reduce((acc, c) => acc + (c.leads || 0), 0);
  const totalAudience = campaigns.reduce((acc, c) => acc + (c.sent || 0), 0);
  const totalSpend = campaigns.reduce((acc, c) => acc + (c.budget || 0), 0);

  return (
    <AdminPage
      title="Outbound Growth Campaigns & Lead Gen"
      subtitle="Track marketing outreach performance across Email sequences, WhatsApp cadences, LinkedIn InMails, and educational webinars"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-megaphone-fill"></i>
          <span>Launch Campaign</span>
        </button>
      }
    >
      {/* Metric Cards */}
      <div className="row g-3 mb-2">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-primary border-4">
            <small className="text-uppercase fw-semibold text-muted">Audience Reach</small>
            <h3 className="mb-0 fw-bold mt-1 text-primary">{totalAudience.toLocaleString()} Prospects</h3>
            <small className="text-muted">Targeted across {campaigns.length} campaigns</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-success border-4">
            <small className="text-uppercase fw-semibold text-muted">Inbound Leads Generated</small>
            <h3 className="mb-0 fw-bold mt-1 text-success">{totalLeads} Leads</h3>
            <small className="text-success"><i className="bi bi-arrow-up-right me-1"></i>High inbound conversion efficiency</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-info border-4">
            <small className="text-uppercase fw-semibold text-muted">Total Campaign Budget</small>
            <h3 className="mb-0 fw-bold mt-1 text-dark">₹{totalSpend.toLocaleString()}</h3>
            <small className="text-muted">₹{Math.round(totalSpend / (totalLeads || 1))} Cost per Lead</small>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Campaign Name</th>
                <th>Channel</th>
                <th>Audience Reached</th>
                <th>Open Rate</th>
                <th>Click-Through</th>
                <th>Leads Generated</th>
                <th>Budget</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <tr key={c.id}>
                  <td><div className="fw-semibold text-dark">{c.name}</div></td>
                  <td>
                    <span className="badge bg-light text-dark border">
                      <i className={`bi bi-${c.channel === 'EMAIL' ? 'envelope' : c.channel === 'WHATSAPP' ? 'whatsapp text-success' : c.channel === 'LINKEDIN' ? 'linkedin text-primary' : 'broadcast'} me-1`}></i>
                      {c.channel}
                    </span>
                  </td>
                  <td>{c.sent.toLocaleString()}</td>
                  <td><strong className="text-primary">{c.opened}</strong></td>
                  <td>{c.clicks}</td>
                  <td><span className="badge bg-success bg-opacity-10 text-success fw-bold">{c.leads} Leads</span></td>
                  <td>₹{(c.budget || 0).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${c.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Launch Campaign Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Launch Outbound Campaign</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Campaign Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Q4 Cloud Upskilling Campaign"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Marketing Channel</label>
                      <select
                        className="form-select"
                        value={form.channel}
                        onChange={e => setForm({ ...form, channel: e.target.value })}
                      >
                        <option value="EMAIL">Email Blast</option>
                        <option value="WHATSAPP">WhatsApp Outreach</option>
                        <option value="LINKEDIN">LinkedIn InMail</option>
                        <option value="WEBINAR">Live Webinar</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Target Audience Count</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.sent}
                        onChange={e => setForm({ ...form, sent: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Allocated Budget (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.budget}
                      onChange={e => setForm({ ...form, budget: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Launch Campaign</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
