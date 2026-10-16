import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getLeads, createLead, updateLead, deleteLead, convertLead } from '../../../services/api/salesApi.js';
import { useAuth } from '../../../common/contexts/AuthContext.jsx';

// All 38 Districts of Tamil Nadu
const TN_DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
  'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram',
  'Kanniyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
  'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi',
  'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
  'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur',
  'Vellore', 'Viluppuram', 'Virudhunagar'
];

// Special tracking clusters / taluks
const CUSTOM_LOCATIONS = [
  'Rasipuram', 'Omalur', 'Sankagiri', 'Mettur', 'Bhavani', 'Gobichettipalayam', 'Tiruchengode', 'Attur', 'Edappadi'
];

const COMMERCIAL_PACKAGES = [
  { name: 'Essential Growth (₹25,000/mo)', tier: 'Essential Growth', amount: 25000 },
  { name: 'Scale & Optimize (₹55,000/mo)', tier: 'Scale & Optimize', amount: 55000 },
  { name: 'Enterprise Automation (₹1,20,000/mo)', tier: 'Enterprise Automation', amount: 120000 },
  { name: 'Advanced UI/UX & Web Development (₹75,000 setup)', tier: 'Add-on: Web Portal', amount: 75000 },
  { name: 'Reels & Video Production Pack (₹30,000/bundle)', tier: 'Add-on: Reels Pack', amount: 30000 },
  { name: 'AI Workflow Automation (₹20,000 one-time)', tier: 'Add-on: AI Automation', amount: 20000 }
];

const PIPELINE_STAGES = [
  'Stage 1: Lead Ingestion & Qualification Discovery',
  'Stage 2: Strategic Discovery & Consultation Demo',
  'Stage 3: Solution Scoping & Proposal Architecture',
  'Stage 4: Contract Finalization & Closing Commitment',
  'Closed-Won (Onboarding Realization)',
  'Closed-Lost (60-Day Nurture Loop)'
];

const CLOSED_LOST_REASONS = [
  'Pricing Objection (No Budget/ROI Doubt)',
  'Timing Restraints (Delayed Expansion Plans)',
  'Technical Inertia (Legacy Software Dependency)',
  'No Decision / Dark (Ghosted After Proposal)'
];

export default function Leads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [packageFilter, setPackageFilter] = useState('');
  const [bdaFilter, setBdaFilter] = useState('');
  const [viewScope, setViewScope] = useState('all'); // 'my' | 'all'

  // Detailed Lead Inspection Modal
  const [inspectingLead, setInspectingLead] = useState(null);

  // Add / Edit Modal
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [isCustomDistrict, setIsCustomDistrict] = useState(false);
  const [customDistrictText, setCustomDistrictText] = useState('');

  const [leadForm, setLeadForm] = useState({
    lead_code: '',
    first_name: '',
    last_name: '',
    company_name: '',
    phone: '',
    district: 'Erode',
    service_interested: 'Scale & Optimize (₹55,000/mo)',
    package_tier: 'Scale & Optimize',
    quoted_amount: 55000,
    interest_level: 'WARM',
    pipeline_stage: 'Stage 1: Lead Ingestion & Qualification Discovery',
    status: 'NEW',
    source: 'PHONE',
    follow_up_date: '',
    meeting_date: '',
    next_action: '',
    lost_reason: '',
    notes: ''
  });

  // Convert to Deal modal
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertData, setConvertData] = useState({
    lead_id: '',
    title: '',
    deal_value: 55000,
    contact_name: '',
    expected_close_date: ''
  });

  const loadLeads = async () => {
    try {
      setLoading(true);
      const res = await getLeads({ limit: 200 });
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
  }, []);

  // Dynamically extract distinct BDA names from real loaded data
  const dynamicBdaList = Array.from(new Set(leads.map(l => l.bda_name).filter(Boolean)));

  const handleOpenAdd = () => {
    setEditingLead(null);
    setIsCustomDistrict(false);
    setCustomDistrictText('');
    setLeadForm({
      lead_code: `ETH-2026-${String(leads.length + 1).padStart(3, '0')}`,
      first_name: '',
      last_name: '',
      company_name: '',
      phone: '',
      district: 'Erode',
      service_interested: 'Scale & Optimize (₹55,000/mo)',
      package_tier: 'Scale & Optimize',
      quoted_amount: 55000,
      interest_level: 'WARM',
      pipeline_stage: 'Stage 1: Lead Ingestion & Qualification Discovery',
      status: 'NEW',
      source: 'PHONE',
      follow_up_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      meeting_date: '',
      next_action: 'Initiate 15-minute SLA qualification sequence with Doctor.',
      lost_reason: '',
      notes: ''
    });
    setShowLeadModal(true);
  };

  const handleOpenEdit = (lead) => {
    setEditingLead(lead);
    const isCustom = !TN_DISTRICTS.includes(lead.district) && !CUSTOM_LOCATIONS.includes(lead.district);
    setIsCustomDistrict(isCustom);
    if (isCustom) setCustomDistrictText(lead.district || '');

    setLeadForm({
      lead_code: lead.lead_code || '',
      first_name: lead.first_name || lead.name || '',
      last_name: lead.last_name || '',
      company_name: lead.company_name || '',
      phone: lead.phone || '',
      district: lead.district || 'Erode',
      service_interested: lead.service_interested || 'Scale & Optimize (₹55,000/mo)',
      package_tier: lead.package_tier || 'Scale & Optimize',
      quoted_amount: lead.quoted_amount || 55000,
      interest_level: lead.interest_level || 'WARM',
      pipeline_stage: lead.pipeline_stage || 'Stage 1: Lead Ingestion & Qualification Discovery',
      status: lead.status || 'NEW',
      source: lead.source || 'PHONE',
      follow_up_date: lead.follow_up_date ? String(lead.follow_up_date).slice(0, 10) : '',
      meeting_date: lead.meeting_date ? String(lead.meeting_date).slice(0, 16) : '',
      next_action: lead.next_action || '',
      lost_reason: lead.lost_reason || '',
      notes: lead.notes || ''
    });
    setShowLeadModal(true);
  };

  const handlePackageChange = (e) => {
    const pkgName = e.target.value;
    const found = COMMERCIAL_PACKAGES.find(p => p.name === pkgName);
    setLeadForm({
      ...leadForm,
      service_interested: pkgName,
      package_tier: found ? found.tier : leadForm.package_tier,
      quoted_amount: found ? found.amount : leadForm.quoted_amount
    });
  };

  const handleSaveLead = async (e) => {
    e.preventDefault();
    const finalDistrict = isCustomDistrict ? customDistrictText : leadForm.district;

    const payload = {
      ...leadForm,
      district: finalDistrict,
      name: leadForm.first_name,
      notes: `District / Area: ${finalDistrict} | Package: ${leadForm.service_interested}`
    };

    try {
      if (editingLead) {
        await updateLead(editingLead.id, payload);
      } else {
        await createLead(payload);
      }
      setShowLeadModal(false);
      setEditingLead(null);
      loadLeads();
      alert('Lead saved successfully!');
    } catch (err) {
      alert('Error saving lead: ' + (err.message || 'Validation error'));
    }
  };

  const handleOpenConvert = (lead) => {
    setConvertData({
      lead_id: lead.id,
      title: `${lead.company_name || lead.first_name} - ${lead.package_tier || 'Healthcare'} Agreement`,
      deal_value: lead.quoted_amount || 55000,
      contact_name: `${lead.first_name || lead.name || ''} ${lead.last_name || ''}`.trim(),
      expected_close_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
    });
    setShowConvertModal(true);
  };

  const handleExecuteConvert = async (e) => {
    e.preventDefault();
    try {
      await convertLead({
        leadId: convertData.lead_id,
        dealValue: convertData.deal_value,
        stage: 'CLOSED_WON',
        notes: `Converted to deal from CRM Lead ID: ${convertData.lead_id}`
      });
      loadLeads();
      setShowConvertModal(false);
      alert('Lead successfully converted into an Active Commercial Deal!');
    } catch (err) {
      alert('Error converting lead: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this dental lead?')) return;
    try {
      await deleteLead(id);
      loadLeads();
    } catch (err) {
      alert('Failed to delete lead: ' + err.message);
    }
  };

  // Filter leads based on user search, filters, and dynamic scope
  const filtered = leads.filter(l => {
    const q = searchTerm.toLowerCase();
    const leadCode = (l.lead_code || '').toLowerCase();
    const fullName = `${l.first_name || l.name || ''} ${l.last_name || ''}`.toLowerCase();
    const company = (l.company_name || '').toLowerCase();
    const phone = (l.phone || '').toLowerCase();
    const notes = (l.notes || '').toLowerCase();
    const district = (l.district || '').toLowerCase();
    const bda = (l.bda_name || '').toLowerCase();
    const service = (l.service_interested || '').toLowerCase();

    const matchesSearch = leadCode.includes(q) || fullName.includes(q) || company.includes(q) || phone.includes(q) || notes.includes(q);
    const matchesDistrict = !districtFilter || district.includes(districtFilter.toLowerCase()) || notes.includes(districtFilter.toLowerCase());
    const matchesBda = !bdaFilter || bda.includes(bdaFilter.toLowerCase());
    const matchesStatus = !statusFilter || l.status === statusFilter || (l.pipeline_stage || '').includes(statusFilter);
    const matchesPackage = !packageFilter || service.includes(packageFilter.toLowerCase());
    const matchesScope = viewScope === 'all' || l.assigned_to === user?.id;

    return matchesSearch && matchesDistrict && matchesBda && matchesStatus && matchesPackage && matchesScope;
  });

  return (
    <AdminPage
      title="Clinic & Healthcare Outreach CRM"
      subtitle="Full 17-field B2B pipeline, commercial package alignment, and territorial tracking"
    >
      {/* Top Scope and Action Bar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-3">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="fw-semibold small text-muted text-uppercase me-2">View Scope:</span>
            <button
              type="button"
              className={`btn btn-sm ${viewScope === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => { setViewScope('all'); setBdaFilter(''); }}
            >
              All Territory Leads ({leads.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewScope === 'my' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setViewScope('my')}
            >
              <i className="bi bi-person-check me-1"></i> My Assigned Leads
            </button>
          </div>

          <div>
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <i className="bi bi-plus-lg me-1"></i> Add Dental Lead
            </button>
          </div>
        </div>

        {/* Territory District Chips */}
        <div className="d-flex flex-wrap align-items-center gap-1 pt-2 border-top">
          <span className="small text-muted fw-semibold me-2">Focus Locations:</span>
          <button
            type="button"
            className={`btn btn-xs py-1 px-2 ${districtFilter === '' ? 'btn-dark' : 'btn-light border'}`}
            onClick={() => setDistrictFilter('')}
          >
            All Areas ({leads.length})
          </button>
          <button
            type="button"
            className={`btn btn-xs py-1 px-2 ${districtFilter === 'Rasipuram' ? 'btn-dark' : 'btn-light border'}`}
            onClick={() => setDistrictFilter('Rasipuram')}
          >
            📍 Rasipuram (15)
          </button>
          <button
            type="button"
            className={`btn btn-xs py-1 px-2 ${districtFilter === 'Erode' ? 'btn-dark' : 'btn-light border'}`}
            onClick={() => setDistrictFilter('Erode')}
          >
            📍 Erode (35)
          </button>
          <button
            type="button"
            className={`btn btn-xs py-1 px-2 ${districtFilter === 'Namakkal' ? 'btn-dark' : 'btn-light border'}`}
            onClick={() => setDistrictFilter('Namakkal')}
          >
            📍 Namakkal (26)
          </button>
          <button
            type="button"
            className={`btn btn-xs py-1 px-2 ${districtFilter === 'Omalur' ? 'btn-dark' : 'btn-light border'}`}
            onClick={() => setDistrictFilter('Omalur')}
          >
            📍 Omalur (21)
          </button>
          <button
            type="button"
            className={`btn btn-xs py-1 px-2 ${districtFilter === 'Salem' ? 'btn-dark' : 'btn-light border'}`}
            onClick={() => setDistrictFilter('Salem')}
          >
            📍 Salem (3)
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
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

          <div className="col-lg-3 col-md-3">
            <select
              className="form-select bg-light"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              <optgroup label="Clusters / Taluks">
                {CUSTOM_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </optgroup>
              <optgroup label="Tamil Nadu 38 Districts">
                {TN_DISTRICTS.map((dst) => (
                  <option key={dst} value={dst}>{dst}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="col-lg-3 col-md-3">
            <select
              className="form-select bg-light"
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
            >
              <option value="">All Packages</option>
              {COMMERCIAL_PACKAGES.map((pkg) => (
                <option key={pkg.name} value={pkg.tier}>{pkg.name}</option>
              ))}
            </select>
          </div>

          <div className="col-lg-3 col-md-6">
            {dynamicBdaList.length > 1 ? (
              <select
                className="form-select bg-light"
                value={bdaFilter}
                onChange={(e) => setBdaFilter(e.target.value)}
              >
                <option value="">All Associates ({dynamicBdaList.length})</option>
                {dynamicBdaList.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            ) : (
              <select
                className="form-select bg-light"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Stages</option>
                <option value="Stage 1">Stage 1: Lead Ingestion & Qualification</option>
                <option value="Stage 2">Stage 2: Strategic Discovery & Demo</option>
                <option value="Stage 3">Stage 3: Solution Scoping & Proposal</option>
                <option value="Stage 4">Stage 4: Contract Finalization</option>
                <option value="Closed-Won">Closed-Won (Onboarding Realization)</option>
                <option value="Closed-Lost">Closed-Lost (60-Day Nurture)</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden mb-4">
        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h5 className="fw-bold mb-0 text-dark">
              <i className="bi bi-hospital text-primary me-2"></i>
              Verified Healthcare Leads
            </h5>
            <span className="badge bg-primary rounded-pill px-3 py-1">
              {filtered.length} Leads
            </span>
          </div>

          <div className="text-muted small">
            Tamil Nadu Healthcare Outreach
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="table-light text-uppercase small text-muted">
              <tr>
                <th>Lead Code</th>
                <th>Clinic & Decision Maker</th>
                <th>Phone Number</th>
                <th>District / Area</th>
                <th>Associate</th>
                <th>Package Tier</th>
                <th>Stage & Next Action</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    Loading verified leads from live database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <span className="badge bg-light text-dark border font-monospace">
                        {lead.lead_code || `ETH-2026`}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark d-flex align-items-center">
                        <i className="bi bi-heart-pulse-fill text-danger me-2"></i>
                        <span>{lead.company_name || 'Clinic Name Not Listed'}</span>
                      </div>
                      <div className="small text-muted">
                        <i className="bi bi-person-fill text-secondary me-1"></i>
                        {lead.first_name || lead.name || 'Doctor Not Listed'}
                      </div>
                    </td>
                    <td>
                      {lead.phone ? (
                        <div className="d-flex flex-column gap-1">
                          <a href={`tel:${lead.phone}`} className="badge bg-light text-primary border text-decoration-none px-2 py-1">
                            <i className="bi bi-telephone-fill me-1"></i>
                            {lead.phone}
                          </a>
                          <a 
                            href={`https://wa.me/91${lead.phone}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="badge bg-success-subtle text-success border border-success-subtle text-decoration-none px-2 py-1"
                          >
                            <i className="bi bi-whatsapp me-1"></i> WhatsApp
                          </a>
                        </div>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle px-2 py-1">
                        <i className="bi bi-geo-alt-fill me-1"></i>{lead.district || 'Tamil Nadu'}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border px-2 py-1">
                        <i className="bi bi-person me-1"></i>
                        {lead.bda_name || 'Associate'}
                      </span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark small">
                        {lead.service_interested || 'Scale & Optimize'}
                      </div>
                      <div className="text-success small fw-bold">
                        ₹{lead.quoted_amount ? parseFloat(lead.quoted_amount).toLocaleString('en-IN') : '55,000'}
                      </div>
                    </td>
                    <td style={{ maxWidth: '280px' }}>
                      <div>
                        <span className={`badge ${
                          lead.status === 'CONVERTED' || lead.pipeline_stage?.includes('Closed-Won') ? 'bg-success' :
                          lead.status === 'LOST' || lead.pipeline_stage?.includes('Closed-Lost') ? 'bg-danger' :
                          lead.status === 'DEMO' || lead.pipeline_stage?.includes('Stage 2') ? 'bg-info text-dark' :
                          lead.status === 'COUNSELLING' || lead.pipeline_stage?.includes('Stage 3') ? 'bg-primary' :
                          'bg-warning text-dark'
                        }`}>
                          {lead.pipeline_stage || lead.status || 'Stage 1'}
                        </span>
                      </div>
                      {lead.next_action && (
                        <small className="text-muted d-block text-truncate mt-1" title={lead.next_action}>
                          <i className="bi bi-arrow-right-short text-primary"></i>
                          {lead.next_action}
                        </small>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-info"
                          title="Inspect 17-field details"
                          onClick={() => setInspectingLead(lead)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-outline-success"
                          title="Convert to Deal"
                          onClick={() => handleOpenConvert(lead)}
                        >
                          <i className="bi bi-lightning-charge-fill"></i>
                        </button>
                        <button
                          className="btn btn-outline-secondary"
                          title="Edit Lead"
                          onClick={() => handleOpenEdit(lead)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 17-Field Full Inspection Modal */}
      {inspectingLead && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-dark text-white">
                <div>
                  <h5 className="modal-title fw-bold mb-0">
                    <i className="bi bi-shield-check text-success me-2"></i>
                    {inspectingLead.company_name}
                  </h5>
                  <small className="text-muted font-monospace">{inspectingLead.lead_code || 'ETH-2026'}</small>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setInspectingLead(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3 border">
                      <span className="small text-muted fw-semibold">Doctor / Decision Maker</span>
                      <h6 className="fw-bold text-dark mt-1 mb-0">{inspectingLead.first_name || inspectingLead.name || 'N/A'}</h6>
                      <div className="text-muted small mt-1">Primary MD & Clinic Director</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3 border">
                      <span className="small text-muted fw-semibold">Contact Phone Number</span>
                      <h6 className="fw-bold text-primary mt-1 mb-0">{inspectingLead.phone || 'N/A'}</h6>
                      <div className="text-muted small mt-1">10-Digit Mobile / WhatsApp Verified</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3 border">
                      <span className="small text-muted fw-semibold">District / Area</span>
                      <h6 className="fw-bold text-dark mt-1 mb-0">{inspectingLead.district || 'Tamil Nadu'}</h6>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3 border">
                      <span className="small text-muted fw-semibold">Assigned Associate</span>
                      <h6 className="fw-bold text-dark mt-1 mb-0">{inspectingLead.bda_name || 'Associate'}</h6>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3 border">
                      <span className="small text-muted fw-semibold">Interest Level</span>
                      <h6 className="fw-bold text-dark mt-1 mb-0">
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                          {inspectingLead.interest_level || 'WARM'}
                        </span>
                      </h6>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="p-3 bg-light rounded-3 border">
                      <span className="small text-muted fw-semibold">Service Package Interested In</span>
                      <h6 className="fw-bold text-dark mt-1 mb-0">{inspectingLead.service_interested || 'Scale & Optimize'}</h6>
                      <div className="text-muted small mt-1">Tier: {inspectingLead.package_tier || 'Standard Package'}</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3 border">
                      <span className="small text-muted fw-semibold">Quoted Amount</span>
                      <h6 className="fw-bold text-success mt-1 mb-0 fs-5">
                        ₹{parseFloat(inspectingLead.quoted_amount || 0).toLocaleString('en-IN')}
                      </h6>
                      <div className="text-muted small mt-1">Proposal Locked Gate</div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="p-3 bg-light rounded-3 border border-primary">
                      <span className="small text-primary fw-semibold text-uppercase">Active Pipeline Stage & Mandatory SLA Action Gate</span>
                      <div className="fw-bold text-dark mt-1">{inspectingLead.pipeline_stage || 'Stage 1'}</div>
                      <p className="text-secondary small mt-2 mb-0">
                        <i className="bi bi-arrow-right-circle-fill text-primary me-1"></i>
                        {inspectingLead.next_action || 'Execute outbound qualification sequence.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={() => setInspectingLead(null)}>Close</button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    const l = inspectingLead;
                    setInspectingLead(null);
                    handleOpenEdit(l);
                  }}
                >
                  <i className="bi bi-pencil me-1"></i> Edit Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Lead Modal */}
      {showLeadModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  {editingLead ? 'Edit Healthcare Lead' : 'Create New Healthcare Lead'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowLeadModal(false)}></button>
              </div>
              <form onSubmit={handleSaveLead}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Lead ID</label>
                      <input
                        type="text"
                        className="form-control"
                        value={leadForm.lead_code}
                        onChange={(e) => setLeadForm({ ...leadForm, lead_code: e.target.value })}
                        placeholder="ETH-2026-001"
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Clinic / Business Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={leadForm.company_name}
                        onChange={(e) => setLeadForm({ ...leadForm, company_name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Doctor / Decision Maker *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={leadForm.first_name}
                        onChange={(e) => setLeadForm({ ...leadForm, first_name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Phone Number (10 digits) *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">District / Area (Tamil Nadu) *</label>
                      <select
                        className="form-select"
                        value={isCustomDistrict ? 'custom' : leadForm.district}
                        onChange={(e) => {
                          if (e.target.value === 'custom') {
                            setIsCustomDistrict(true);
                          } else {
                            setIsCustomDistrict(false);
                            setLeadForm({ ...leadForm, district: e.target.value });
                          }
                        }}
                      >
                        <optgroup label="Clusters / Taluks">
                          {CUSTOM_LOCATIONS.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Tamil Nadu 38 Districts">
                          {TN_DISTRICTS.map((dst) => (
                            <option key={dst} value={dst}>{dst}</option>
                          ))}
                        </optgroup>
                        <option value="custom">-- Custom Location / Other City --</option>
                      </select>
                      {isCustomDistrict && (
                        <input
                          type="text"
                          className="form-control mt-2"
                          placeholder="Type custom location..."
                          value={customDistrictText}
                          onChange={(e) => setCustomDistrictText(e.target.value)}
                          required
                        />
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Service Package Interested In *</label>
                      <select
                        className="form-select"
                        value={leadForm.service_interested}
                        onChange={handlePackageChange}
                      >
                        {COMMERCIAL_PACKAGES.map((pkg) => (
                          <option key={pkg.name} value={pkg.name}>{pkg.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Quoted Amount (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={leadForm.quoted_amount}
                        onChange={(e) => setLeadForm({ ...leadForm, quoted_amount: e.target.value })}
                      />
                    </div>

                    <div className="col-md-5">
                      <label className="form-label small fw-semibold">Pipeline Stage</label>
                      <select
                        className="form-select"
                        value={leadForm.pipeline_stage}
                        onChange={(e) => {
                          const stg = e.target.value;
                          let s = 'NEW';
                          if (stg.includes('Stage 2')) s = 'DEMO';
                          else if (stg.includes('Stage 3')) s = 'COUNSELLING';
                          else if (stg.includes('Stage 4')) s = 'PAYMENT';
                          else if (stg.includes('Closed-Won')) s = 'CONVERTED';
                          else if (stg.includes('Closed-Lost')) s = 'LOST';
                          setLeadForm({ ...leadForm, pipeline_stage: stg, status: s });
                        }}
                      >
                        {PIPELINE_STAGES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Interest Level</label>
                      <select
                        className="form-select"
                        value={leadForm.interest_level}
                        onChange={(e) => setLeadForm({ ...leadForm, interest_level: e.target.value })}
                      >
                        <option value="HOT">HOT 🔥</option>
                        <option value="WARM">WARM ☀️</option>
                        <option value="COLD">COLD ❄️</option>
                      </select>
                    </div>

                    {(leadForm.pipeline_stage?.includes('Closed-Lost') || leadForm.status === 'LOST') && (
                      <div className="col-12">
                        <div className="p-3 bg-danger-subtle rounded-3 border border-danger-subtle">
                          <label className="form-label small fw-semibold text-danger">Closed-Lost Reason Taxonomy *</label>
                          <select
                            className="form-select"
                            value={leadForm.lost_reason}
                            onChange={(e) => setLeadForm({ ...leadForm, lost_reason: e.target.value })}
                            required
                          >
                            <option value="">Select Closed-Lost Reason</option>
                            {CLOSED_LOST_REASONS.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Next Action / Stage Notes</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={leadForm.next_action}
                        onChange={(e) => setLeadForm({ ...leadForm, next_action: e.target.value })}
                      ></textarea>
                    </div>
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
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-lightning-charge-fill me-2"></i>Convert Lead to Deal
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowConvertModal(false)}></button>
              </div>
              <form onSubmit={handleExecuteConvert}>
                <div className="modal-body p-4">
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
                      <label className="form-label small fw-semibold">Contract Value (₹) *</label>
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
                    <label className="form-label small fw-semibold">Decision Maker Contact</label>
                    <input
                      type="text"
                      className="form-control"
                      value={convertData.contact_name}
                      onChange={(e) => setConvertData({ ...convertData, contact_name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowConvertModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success">
                    <i className="bi bi-check2-circle me-1"></i> Confirm & Open Deal
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
