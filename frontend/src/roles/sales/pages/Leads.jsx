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

  // Detailed Lead Inspection Modal / Drawer
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
      const res = await getLeads({ limit: 250 });
      const items = res?.items || (Array.isArray(res) ? res : []);
      setLeads(items);
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const dynamicBdaList = Array.from(
    new Set(leads.map(l => l.bda_name).filter(Boolean))
  );

  const filtered = leads.filter(lead => {
    const q = searchTerm.toLowerCase();
    const clinic = (lead.company_name || '').toLowerCase();
    const doc = (lead.first_name || lead.name || '').toLowerCase();
    const phone = (lead.phone || '').toLowerCase();
    const code = (lead.lead_code || '').toLowerCase();
    const dist = (lead.district || '').toLowerCase();

    const matchesSearch = !searchTerm || clinic.includes(q) || doc.includes(q) || phone.includes(q) || code.includes(q) || dist.includes(q);
    const matchesDistrict = !districtFilter || lead.district === districtFilter;
    const matchesPackage = !packageFilter || (lead.service_interested && lead.service_interested.includes(packageFilter)) || (lead.package_tier && lead.package_tier.includes(packageFilter));
    const matchesStatus = !statusFilter || (lead.pipeline_stage && lead.pipeline_stage.includes(statusFilter)) || (lead.status && lead.status === statusFilter);
    const matchesBda = !bdaFilter || lead.bda_name === bdaFilter;

    let matchesScope = true;
    if (viewScope === 'my' && user) {
      const uName = (user.name || user.full_name || '').toLowerCase();
      const bda = (lead.bda_name || '').toLowerCase();
      matchesScope = (lead.assigned_to && String(lead.assigned_to) === String(user.id)) || (uName && bda && (uName.includes(bda) || bda.includes(uName)));
    }

    return matchesSearch && matchesDistrict && matchesPackage && matchesStatus && matchesBda && matchesScope;
  });

  const handleOpenAdd = () => {
    setEditingLead(null);
    setIsCustomDistrict(false);
    setCustomDistrictText('');
    setLeadForm({
      lead_code: `ETH-${new Date().getFullYear()}-${String(leads.length + 1).padStart(3, '0')}`,
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
      follow_up_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      meeting_date: '',
      next_action: 'Perform outbound discovery call and audit website/socials.',
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
      title: `${lead.company_name || lead.first_name} - Healthcare Contract Closure`,
      deal_value: lead.quoted_amount || 55000,
      contact_name: `${lead.first_name || lead.name || ''} ${lead.last_name || ''}`.trim(),
      expected_close_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
    });
    setShowConvertModal(true);
  };

  const handleExecuteConvert = async (e) => {
    e.preventDefault();
    try {
      await convertLead(convertData.lead_id, {
        dealValue: convertData.deal_value,
        stage: 'CLOSED_WON',
        title: convertData.title,
        contact_name: convertData.contact_name,
        expectedCloseDate: convertData.expected_close_date,
        notes: `Converted to active contract from Lead ID: ${convertData.lead_id}`
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

  return (
    <AdminPage
      title="Healthcare Commercial Leads"
      subtitle="Structured 17-field B2B SaaS tracking blueprint, Tamil Nadu clinic outreach, and territory conversion"
      actions={
        <div className="d-flex align-items-center gap-2">
          <div className="btn-group btn-group-sm">
            <button
              type="button"
              className={`btn ${viewScope === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setViewScope('all')}
            >
              All Territory ({leads.length})
            </button>
            <button
              type="button"
              className={`btn ${viewScope === 'my' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setViewScope('my')}
            >
              My Territory Leads
            </button>
          </div>

          <button
            className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm"
            onClick={handleOpenAdd}
          >
            <i className="bi bi-plus-lg"></i>
            <span>Add Healthcare Lead</span>
          </button>
        </div>
      }
    >
      {/* 1-Click Territory Quick Filter Bar */}
      <div className="sales-filter-bar mb-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted fw-bold text-uppercase">Territory:</span>
            <div className="territory-pills">
              <button
                type="button"
                className={`territory-pill-btn ${districtFilter === '' ? 'active' : ''}`}
                onClick={() => setDistrictFilter('')}
              >
                All Hubs ({leads.length})
              </button>
              <button
                type="button"
                className={`territory-pill-btn ${districtFilter === 'Rasipuram' ? 'active' : ''}`}
                onClick={() => setDistrictFilter('Rasipuram')}
              >
                Rasipuram (15)
              </button>
              <button
                type="button"
                className={`territory-pill-btn ${districtFilter === 'Erode' ? 'active' : ''}`}
                onClick={() => setDistrictFilter('Erode')}
              >
                Erode (35)
              </button>
              <button
                type="button"
                className={`territory-pill-btn ${districtFilter === 'Namakkal' ? 'active' : ''}`}
                onClick={() => setDistrictFilter('Namakkal')}
              >
                Namakkal (26)
              </button>
              <button
                type="button"
                className={`territory-pill-btn ${districtFilter === 'Omalur' ? 'active' : ''}`}
                onClick={() => setDistrictFilter('Omalur')}
              >
                Omalur (21)
              </button>
              <button
                type="button"
                className={`territory-pill-btn ${districtFilter === 'Salem' ? 'active' : ''}`}
                onClick={() => setDistrictFilter('Salem')}
              >
                Salem (3)
              </button>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1">
              {filtered.length} Leads Displayed
            </span>
          </div>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-3">
        <div className="row g-2 align-items-center">
          <div className="col-lg-4 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted"></i></span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search clinic, doctor name, phone, lead code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-lg-3 col-md-3">
            <select
              className="form-select bg-light"
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
            >
              <option value="">All Package Tiers</option>
              {COMMERCIAL_PACKAGES.map((pkg) => (
                <option key={pkg.name} value={pkg.tier}>{pkg.name}</option>
              ))}
            </select>
          </div>

          <div className="col-lg-3 col-md-3">
            {dynamicBdaList.length > 1 ? (
              <select
                className="form-select bg-light"
                value={bdaFilter}
                onChange={(e) => setBdaFilter(e.target.value)}
              >
                <option value="">All Assigned Associates ({dynamicBdaList.length})</option>
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
                <option value="">All Pipeline Stages</option>
                <option value="Stage 1">Stage 1: Lead Ingestion & Qualification</option>
                <option value="Stage 2">Stage 2: Strategic Discovery & Demo</option>
                <option value="Stage 3">Stage 3: Solution Scoping & Proposal</option>
                <option value="Stage 4">Stage 4: Contract Finalization</option>
                <option value="Closed-Won">Closed-Won (Onboarding Realization)</option>
                <option value="Closed-Lost">Closed-Lost (60-Day Nurture)</option>
              </select>
            )}
          </div>

          <div className="col-lg-2 col-md-12 text-end">
            <button
              className="btn btn-outline-secondary btn-sm w-100"
              onClick={() => {
                setSearchTerm('');
                setDistrictFilter('');
                setPackageFilter('');
                setStatusFilter('');
                setBdaFilter('');
              }}
            >
              <i className="bi bi-x-circle me-1"></i> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="sales-table-card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h6 className="fw-bold mb-0 text-dark">
              <i className="bi bi-hospital text-primary me-2"></i>
              Verified Healthcare Leads Directory
            </h6>
            <span className="badge bg-primary rounded-pill px-2 py-1 small">
              {filtered.length} Leads
            </span>
          </div>
          <div className="text-muted small">
            Tamil Nadu Healthcare Outreach &bull; 17-Field Commercial Pipeline
          </div>
        </div>

        <div className="table-responsive">
          <table className="table sales-table align-middle">
            <thead>
              <tr>
                <th>Lead ID</th>
                <th>Clinic & Decision Maker</th>
                <th>Direct Contact</th>
                <th>District / Area</th>
                <th>Assigned BDA</th>
                <th>Interested Package</th>
                <th>Pipeline Stage & Action Gate</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                    Loading healthcare leads...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    No leads found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <span className="font-monospace fw-semibold text-primary small">
                        {lead.lead_code || `ETH-${lead.id}`}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{lead.company_name}</div>
                      <div className="small text-muted">
                        <i className="bi bi-person me-1"></i>
                        {lead.first_name || lead.name || 'Doctor In-charge'}
                      </div>
                    </td>
                    <td>
                      {lead.phone ? (
                        <div className="d-flex flex-column gap-1">
                          <a href={`tel:${lead.phone}`} className="action-pill-btn action-pill-phone">
                            <i className="bi bi-telephone-fill"></i>
                            {lead.phone}
                          </a>
                          <a 
                            href={`https://wa.me/91${lead.phone}`} 
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
                      <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle px-2 py-1">
                        <i className="bi bi-geo-alt-fill me-1"></i>{lead.district || 'Tamil Nadu'}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border px-2 py-1">
                        <i className="bi bi-person-badge me-1"></i>
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

      {/* Slide-out Inspection Drawer (17-Field Full Blueprint) */}
      {inspectingLead && (
        <>
          <div className="sp-drawer-backdrop" onClick={() => setInspectingLead(null)}></div>
          <div className="sp-drawer-panel">
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-dark text-white">
              <div>
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-shield-check text-success me-2"></i>
                  {inspectingLead.company_name}
                </h5>
                <small className="text-muted font-monospace">{inspectingLead.lead_code || 'ETH-2026'}</small>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setInspectingLead(null)}
              ></button>
            </div>

            <div className="p-4 overflow-auto flex-grow-1">
              <div className="row g-3">
                <div className="col-12">
                  <div className="sp-detail-card">
                    <span className="small text-muted fw-bold text-uppercase">Doctor / Decision Maker</span>
                    <h5 className="fw-bold text-dark mt-1 mb-0">{inspectingLead.first_name || inspectingLead.name || 'N/A'}</h5>
                    <div className="text-muted small mt-1">Clinic Director & Key Commercial Decision Maker</div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="sp-detail-card">
                    <span className="small text-muted fw-bold text-uppercase">Direct Phone</span>
                    <h6 className="fw-bold text-primary mt-1 mb-2">{inspectingLead.phone || 'N/A'}</h6>
                    <div className="d-flex gap-2">
                      <a href={`tel:${inspectingLead.phone}`} className="action-pill-btn action-pill-phone">
                        <i className="bi bi-telephone-fill"></i> Call Now
                      </a>
                      <a 
                        href={`https://wa.me/91${inspectingLead.phone}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="action-pill-btn action-pill-whatsapp"
                      >
                        <i className="bi bi-whatsapp"></i> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="sp-detail-card">
                    <span className="small text-muted fw-bold text-uppercase">District / Area</span>
                    <h6 className="fw-bold text-dark mt-1 mb-0">{inspectingLead.district || 'Tamil Nadu'}</h6>
                    <div className="text-muted small mt-1">Territory Hub</div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="sp-detail-card">
                    <span className="small text-muted fw-bold text-uppercase">Assigned Associate</span>
                    <h6 className="fw-bold text-dark mt-1 mb-0">{inspectingLead.bda_name || 'Active Rep'}</h6>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="sp-detail-card">
                    <span className="small text-muted fw-bold text-uppercase">Interest Level</span>
                    <h6 className="fw-bold text-dark mt-1 mb-0">
                      <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                        {inspectingLead.interest_level || 'WARM'}
                      </span>
                    </h6>
                  </div>
                </div>

                <div className="col-12">
                  <div className="sp-detail-card">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="small text-muted fw-bold text-uppercase">Package Interested In</span>
                        <h6 className="fw-bold text-dark mt-1 mb-0">{inspectingLead.service_interested || 'Scale & Optimize'}</h6>
                        <div className="text-muted small mt-1">Tier: {inspectingLead.package_tier || 'Healthcare Growth'}</div>
                      </div>
                      <div className="text-end">
                        <span className="small text-muted fw-bold text-uppercase">Quoted Amount</span>
                        <div className="fw-bold text-success fs-5">
                          ₹{parseFloat(inspectingLead.quoted_amount || 0).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="sp-detail-card active-stage">
                    <span className="small text-primary fw-bold text-uppercase">Active Pipeline Stage & Mandatory SLA Action</span>
                    <div className="fw-bold text-dark mt-1 fs-6">{inspectingLead.pipeline_stage || 'Stage 1'}</div>
                    <p className="text-secondary small mt-2 mb-0">
                      <i className="bi bi-arrow-right-circle-fill text-primary me-1"></i>
                      {inspectingLead.next_action || 'Execute outbound qualification sequence.'}
                    </p>
                  </div>
                </div>

                {inspectingLead.meeting_date && (
                  <div className="col-12">
                    <div className="sp-detail-card">
                      <span className="small text-muted fw-bold text-uppercase">Scheduled Consultation / Demo</span>
                      <div className="fw-bold text-dark mt-1">
                        <i className="bi bi-calendar-event text-primary me-2"></i>
                        {new Date(inspectingLead.meeting_date).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 border-top bg-light d-flex justify-content-between">
              <button type="button" className="btn btn-light" onClick={() => setInspectingLead(null)}>
                Close
              </button>
              <div className="d-flex gap-2">
                <button 
                  type="button" 
                  className="btn btn-outline-primary"
                  onClick={() => {
                    const l = inspectingLead;
                    setInspectingLead(null);
                    handleOpenEdit(l);
                  }}
                >
                  <i className="bi bi-pencil me-1"></i> Edit Lead
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    const l = inspectingLead;
                    setInspectingLead(null);
                    handleOpenConvert(l);
                  }}
                >
                  <i className="bi bi-lightning-charge-fill me-1"></i> Convert to Deal
                </button>
              </div>
            </div>
          </div>
        </>
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
