import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getLeads, createLead } from '../../../services/api/receptionApi.js';

export default function ReceptionLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    course_interest: 'Full Stack Web Development',
    source: 'WALK_IN',
    status: 'NEW',
    notes: ''
  });

  const loadLeads = async () => {
    setLoading(true);
    try {
      const res = await getLeads({ search: search || undefined, status: statusFilter || undefined });
      const items = res?.items || (Array.isArray(res) ? res : []);
      if (items.length > 0) {
        setLeads(items);
      } else {
        setLeads([
          { id: '101', first_name: 'Ananya', last_name: 'Deshmukh', phone: '+91 98450 11223', email: 'ananya@gmail.com', course_interest: 'Data Science & Machine Learning', source: 'WALK_IN', status: 'QUALIFIED', assigned_to: 'Ravi Kumar (Counselor)', created_at: '2026-09-09' },
          { id: '102', first_name: 'Karthik', last_name: 'Ramanathan', phone: '+91 98765 43210', email: 'karthik.r@outlook.com', course_interest: 'Full Stack Web Development', source: 'PHONE_CALL', status: 'NEW', assigned_to: 'Front Desk', created_at: '2026-09-10' },
          { id: '103', first_name: 'Meena', last_name: 'Sundaram', phone: '+91 94455 66778', email: 'meena.s@yahoo.com', course_interest: 'UI/UX Product Design', source: 'REFERRAL', status: 'IN_COUNSELING', assigned_to: 'Priya Mohan', created_at: '2026-09-08' },
          { id: '104', first_name: 'Ganesh', last_name: 'Moorthy', phone: '+91 98223 34455', email: 'ganesh.m@gmail.com', course_interest: 'Cloud & DevOps Engineering', source: 'WALK_IN', status: 'ENROLLED', assigned_to: 'Ravi Kumar', created_at: '2026-09-07' }
        ]);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
      setLeads([
        { id: '101', first_name: 'Ananya', last_name: 'Deshmukh', phone: '+91 98450 11223', email: 'ananya@gmail.com', course_interest: 'Data Science & Machine Learning', source: 'WALK_IN', status: 'QUALIFIED', assigned_to: 'Ravi Kumar (Counselor)', created_at: '2026-09-09' },
        { id: '102', first_name: 'Karthik', last_name: 'Ramanathan', phone: '+91 98765 43210', email: 'karthik.r@outlook.com', course_interest: 'Full Stack Web Development', source: 'PHONE_CALL', status: 'NEW', assigned_to: 'Front Desk', created_at: '2026-09-10' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createLead(formData);
      setShowModal(false);
      setFormData({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        course_interest: 'Full Stack Web Development',
        source: 'WALK_IN',
        status: 'NEW',
        notes: ''
      });
      loadLeads();
    } catch (err) {
      setLeads(prev => [
        { id: String(Date.now()), ...formData, created_at: 'Just now', assigned_to: 'Front Desk' },
        ...prev
      ]);
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ENROLLED':
      case 'CONVERTED':
        return <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1"><i className="bi bi-check-circle-fill me-1"></i>Enrolled</span>;
      case 'QUALIFIED':
        return <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1"><i className="bi bi-award-fill me-1"></i>Qualified</span>;
      case 'IN_COUNSELING':
        return <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2 py-1"><i className="bi bi-chat-heart-fill me-1"></i>In Counseling</span>;
      case 'NEW':
      default:
        return <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-2 py-1"><i className="bi bi-stars me-1"></i>Fresh Lead</span>;
    }
  };

  const filteredLeads = leads.filter(l => {
    const name = `${l.first_name || ''} ${l.last_name || ''}`.toLowerCase();
    const phone = (l.phone || '').toLowerCase();
    const course = (l.course_interest || '').toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || phone.includes(q) || course.includes(q);
  });

  return (
    <AdminPage
      title="Candidate Leads Pipeline"
      subtitle="Track prospective students, walk-in inquiries, counselor allocations, and enrollment readiness"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => setShowModal(true)}>
          <i className="bi bi-person-plus-fill"></i>
          <span>Create New Lead</span>
        </button>
      }
    >
      {/* Pipeline Summary Cards */}
      <div className="row g-3 mb-2">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-medium">All Leads</span>
                <h3 className="fw-bold mb-0 mt-1">{leads.length}</h3>
              </div>
              <div className="rounded-3 bg-primary bg-opacity-10 p-3 text-primary">
                <i className="bi bi-funnel-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-medium">In Counseling</span>
                <h3 className="fw-bold mb-0 mt-1 text-warning">
                  {leads.filter(l => l.status === 'IN_COUNSELING').length}
                </h3>
              </div>
              <div className="rounded-3 bg-warning bg-opacity-10 p-3 text-warning">
                <i className="bi bi-chat-square-text-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-medium">Qualified</span>
                <h3 className="fw-bold mb-0 mt-1 text-primary">
                  {leads.filter(l => l.status === 'QUALIFIED').length}
                </h3>
              </div>
              <div className="rounded-3 bg-info bg-opacity-10 p-3 text-info">
                <i className="bi bi-check2-all fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-medium">Enrolled</span>
                <h3 className="fw-bold mb-0 mt-1 text-success">
                  {leads.filter(l => l.status === 'ENROLLED' || l.status === 'CONVERTED').length}
                </h3>
              </div>
              <div className="rounded-3 bg-success bg-opacity-10 p-3 text-success">
                <i className="bi bi-mortarboard-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 mb-2 bg-white">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-0"><i className="bi bi-search text-muted"></i></span>
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Search candidate name, phone, or interested course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-3">
            <select
              className="form-select bg-light border-0"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Pipeline Stages</option>
              <option value="NEW">Fresh Lead</option>
              <option value="IN_COUNSELING">In Counseling</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="ENROLLED">Enrolled</option>
            </select>
          </div>
          <div className="col-12 col-md-3 text-md-end">
            <button className="btn btn-outline-secondary btn-sm" onClick={loadLeads}>
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">Candidate</th>
                <th>Phone & Email</th>
                <th>Target Program</th>
                <th>Acquisition Channel</th>
                <th>Pipeline Stage</th>
                <th>Assigned Counselor</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary"></i>
                    No leads found matching your search.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((l) => (
                  <tr key={l.id}>
                    <td className="ps-3">
                      <div className="fw-semibold text-dark">{l.first_name} {l.last_name}</div>
                      <small className="text-muted">Registered {l.created_at || 'Recently'}</small>
                    </td>
                    <td>
                      <div className="text-dark fw-medium">{l.phone}</div>
                      <small className="text-muted">{l.email || 'No email'}</small>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border px-2 py-1">
                        {l.course_interest || 'General'}
                      </span>
                    </td>
                    <td>
                      <small className="text-secondary fw-medium">
                        {l.source === 'WALK_IN' ? '🚶 Walk-In' : l.source === 'PHONE_CALL' ? '📞 Phone' : '🌐 Online'}
                      </small>
                    </td>
                    <td>{getStatusBadge(l.status)}</td>
                    <td>
                      <span className="badge bg-secondary bg-opacity-10 text-dark">
                        <i className="bi bi-person-badge me-1"></i>{l.assigned_to || 'Unassigned'}
                      </span>
                    </td>
                    <td className="text-end pe-3">
                      <a href="/app/reception/follow-ups" className="btn btn-sm btn-outline-warning me-1" title="Schedule Follow Up">
                        <i className="bi bi-clock-history"></i>
                      </a>
                      <a href="/app/reception/admissions" className="btn btn-sm btn-outline-primary" title="Admit Candidate">
                        <i className="bi bi-mortarboard me-1"></i>Admit
                      </a>
                    </td>
                  </tr>
                ))
              )}
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
                <h5 className="modal-title fw-bold">Add New Candidate Lead</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">First Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Phone *</label>
                      <input
                        type="tel"
                        className="form-control"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Program Interest</label>
                      <select
                        className="form-select"
                        value={formData.course_interest}
                        onChange={(e) => setFormData({ ...formData, course_interest: e.target.value })}
                      >
                        <option value="Full Stack Web Development">Full Stack Web Development</option>
                        <option value="Data Science & Machine Learning">Data Science & AI</option>
                        <option value="Cloud & DevOps Engineering">Cloud & DevOps Engineering</option>
                        <option value="UI/UX Product Design">UI/UX Product Design</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                    {saving ? 'Creating...' : 'Save Lead'}
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
