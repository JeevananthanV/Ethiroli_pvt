import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getLeads, createLead, updateLead, deleteLead, convertLead } from '../../../services/api/salesApi.js';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [bdaFilter, setBdaFilter] = useState('');

  // Modals
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [leadForm, setLeadForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    status: 'NEW',
    source: 'PHONE',
    notes: ''
  });

  // Convert to Deal modal
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertData, setConvertData] = useState({
    lead_id: '',
    title: '',
    deal_value: '',
    contact_name: '',
    contact_email: '',
    expected_close_date: ''
  });

  const loadLeads = async () => {
    try {
      setLoading(true);
      const res = await getLeads({ status: statusFilter || undefined, limit: 200 });
      const items = res?.items || (Array.isArray(res) ? res : []);
      setLeads(items);
    } catch (err) {
      console.error('Failed to load leads:', err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [statusFilter]);

  const handleSaveLead = async (e) => {
    e.preventDefault();
    try {
      if (editingLead) {
        await updateLead(editingLead.id, leadForm);
      } else {
        await createLead(leadForm);
      }
      setShowLeadModal(false);
      setEditingLead(null);
      setLeadForm({ first_name: '', last_name: '', email: '', phone: '', company_name: '', status: 'NEW', source: 'PHONE', notes: '' });
      loadLeads();
    } catch (err) {
      alert('Error saving lead: ' + (err.message || 'Validation error'));
    }
  };

  const handleOpenConvert = (lead) => {
    setConvertData({
      lead_id: lead.id,
      title: `${lead.company_name || lead.first_name} - Dental Platform Contract`,
      deal_value: lead.estimated_value || 50000,
      contact_name: `${lead.first_name || lead.name || ''} ${lead.last_name || ''}`.trim(),
      contact_email: lead.email || '',
      expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    });
    setShowConvertModal(true);
  };

  const handleExecuteConvert = async (e) => {
    e.preventDefault();
    try {
      const { dealValue } = convertData;
      await convertLead({
        leadId: convertData.lead_id,
        dealValue,
        stage: convertData.stage || 'QUALIFICATION',
        notes: convertData.notes || ''
      });
      loadLeads();
      setShowConvertModal(false);
      alert('Lead successfully converted to an active Sales Deal!');
    } catch (err) {
      alert('Error converting lead to deal: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await deleteLead(id);
      loadLeads();
    } catch (err) {
      alert('Failed to delete lead: ' + err.message);
    }
  };

  // Helper to extract area and BDA from notes
  const getArea = (notes) => {
    if (!notes) return null;
    const match = notes.match(/District \/ Area:\s*([^|]+)/i) || notes.match(/District:\s*([^|]+)/i);
    return match ? match[1].trim() : null;
  };

  const getBda = (notes) => {
    if (!notes) return null;
    const match = notes.match(/BDA:\s*([^|]+)/i);
    return match ? match[1].trim() : null;
  };

  const filtered = leads.filter(l => {
    const q = searchTerm.toLowerCase();
    const fullName = `${l.first_name || l.name || ''} ${l.last_name || ''}`.toLowerCase();
    const company = (l.company_name || '').toLowerCase();
    const email = (l.email || '').toLowerCase();
    const phone = (l.phone || '').toLowerCase();
    const notes = (l.notes || '').toLowerCase();

    const matchesSearch = fullName.includes(q) || company.includes(q) || email.includes(q) || phone.includes(q) || notes.includes(q);
    const matchesDistrict = !districtFilter || notes.includes(districtFilter.toLowerCase());
    const matchesBda = !bdaFilter || notes.includes(bdaFilter.toLowerCase());

    return matchesSearch && matchesDistrict && matchesBda;
  });

  return (
    <AdminPage
      title="CRM Lead Management"
      subtitle="Track BDA dental outreach prospects, qualify clinics, and convert leads into active contracts"
    >
      {/* Header Actions & Quick Filters */}
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-3">
        <div className="row g-2 align-items-center">
          <div className="col-lg-3 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted"></i></span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search clinic, doctor, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-2 col-md-3">
            <select
              className="form-select bg-light"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
            >
              <option value="">All Districts / Areas</option>
              <option value="Rasipuram">Rasipuram (15)</option>
              <option value="Erode">Erode (35)</option>
              <option value="Namakkal">Namakkal (26)</option>
              <option value="Omalur">Omalur (21)</option>
              <option value="Salem">Salem (3)</option>
            </select>
          </div>
          <div className="col-lg-2 col-md-3">
            <select
              className="form-select bg-light"
              value={bdaFilter}
              onChange={(e) => setBdaFilter(e.target.value)}
            >
              <option value="">All BDAs</option>
              <option value="Mathishree S">Mathishree S (50)</option>
              <option value="Nandhini K">Nandhini K (50)</option>
            </select>
          </div>
          <div className="col-lg-2 col-md-3">
            <select
              className="form-select bg-light"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="NEW">New Lead</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="CONVERTED">Converted</option>
              <option value="LOST">Lost</option>
            </select>
          </div>
          <div className="col-lg-3 col-md-9 text-lg-end">
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingLead(null);
                setLeadForm({ first_name: '', last_name: '', email: '', phone: '', company_name: '', status: 'NEW', source: 'PHONE', notes: '' });
                setShowLeadModal(true);
              }}
            >
              <i className="bi bi-plus-lg me-1"></i> Add Lead
            </button>
            <span className="badge bg-secondary-subtle text-secondary border ms-2 px-2 py-2">
              {filtered.length} Leads
            </span>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ minWidth: '220px' }}>Clinic / Business Name</th>
                <th style={{ minWidth: '200px' }}>Doctor / Contact Person</th>
                <th style={{ minWidth: '150px' }}>Phone Number</th>
                <th style={{ minWidth: '180px' }}>District / Area & BDA</th>
                <th>Status</th>
                <th className="text-end" style={{ minWidth: '140px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    Loading dental leads from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => {
                  const area = getArea(lead.notes);
                  const bda = getBda(lead.notes);

                  return (
                    <tr key={lead.id}>
                      <td>
                        <div className="fw-bold text-dark d-flex align-items-center">
                          <i className="bi bi-hospital text-primary me-2"></i>
                          <span>{lead.company_name || 'Clinic Name Not Listed'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">
                          <i className="bi bi-person-badge text-secondary me-1"></i>
                          {lead.first_name || lead.name || 'Doctor Not Listed'} {lead.last_name || ''}
                        </div>
                        {lead.email && <small className="text-muted d-block">{lead.email}</small>}
                      </td>
                      <td>
                        {lead.phone ? (
                          <a href={`tel:${lead.phone}`} className="badge bg-light text-primary border text-decoration-none px-2 py-1">
                            <i className="bi bi-telephone-fill me-1"></i>
                            {lead.phone}
                          </a>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {area && (
                            <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle">
                              <i className="bi bi-geo-alt-fill me-1"></i>{area}
                            </span>
                          )}
                          {bda && (
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                              <i className="bi bi-person-check-fill me-1"></i>{bda}
                            </span>
                          )}
                          {!area && !bda && lead.notes && (
                            <span className="text-muted small">{lead.notes}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          lead.status === 'QUALIFIED' ? 'bg-primary' :
                          lead.status === 'CONVERTED' ? 'bg-success' :
                          lead.status === 'CONTACTED' ? 'bg-info text-dark' :
                          lead.status === 'LOST' ? 'bg-danger' : 'bg-warning text-dark'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          {lead.status !== 'CONVERTED' && (
                            <button
                              className="btn btn-outline-success"
                              title="Convert to Deal"
                              onClick={() => handleOpenConvert(lead)}
                            >
                              <i className="bi bi-lightning-charge-fill me-1"></i>Convert
                            </button>
                          )}
                          <button
                            className="btn btn-outline-secondary"
                            title="Edit Lead"
                            onClick={() => {
                              setEditingLead(lead);
                              setLeadForm({
                                first_name: lead.first_name || '',
                                last_name: lead.last_name || '',
                                email: lead.email || '',
                                phone: lead.phone || '',
                                company_name: lead.company_name || '',
                                status: lead.status || 'NEW',
                                source: lead.source || 'PHONE',
                                notes: lead.notes || ''
                              });
                              setShowLeadModal(true);
                            }}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            title="Delete Lead"
                            onClick={() => handleDelete(lead.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Lead Modal */}
      {showLeadModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editingLead ? 'Edit Lead' : 'Create New Lead'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowLeadModal(false)}></button>
              </div>
              <form onSubmit={handleSaveLead}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Clinic / Business Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={leadForm.company_name}
                      onChange={(e) => setLeadForm({ ...leadForm, company_name: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Doctor / Contact Person *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={leadForm.first_name}
                        onChange={(e) => setLeadForm({ ...leadForm, first_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Lead Source</label>
                      <select
                        className="form-select"
                        value={leadForm.source}
                        onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}
                      >
                        <option value="PHONE">Phone</option>
                        <option value="WALK_IN">Walk In</option>
                        <option value="WEBSITE">Website</option>
                        <option value="REFERRAL">Referral</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Status</label>
                      <select
                        className="form-select"
                        value={leadForm.status}
                        onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="QUALIFIED">QUALIFIED</option>
                        <option value="LOST">LOST</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">District / Notes / BDA Info</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={leadForm.notes}
                      onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                      placeholder="e.g. District / Area: Rasipuram | BDA: Mathishree S"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowLeadModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingLead ? 'Update Lead' : 'Save Lead'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Convert to Deal Modal */}
      {showConvertModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold"><i className="bi bi-lightning-charge-fill me-2"></i>Convert Lead to Deal</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowConvertModal(false)}></button>
              </div>
              <form onSubmit={handleExecuteConvert}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Deal Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={convertData.title}
                      onChange={(e) => setConvertData({ ...convertData, title: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Deal Value (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={convertData.deal_value}
                        onChange={(e) => setConvertData({ ...convertData, deal_value: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Expected Close Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={convertData.expected_close_date}
                        onChange={(e) => setConvertData({ ...convertData, expected_close_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Primary Contact Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={convertData.contact_name}
                      onChange={(e) => setConvertData({ ...convertData, contact_name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowConvertModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success">Convert to Active Deal</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
