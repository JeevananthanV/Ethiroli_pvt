import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getClients } from '../../../services/api/salesApi.js';
import { Link } from 'react-router-dom';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

  useEffect(() => {
    async function loadCompanies() {
      try {
        setLoading(true);
        const res = await getClients();
        const items = res?.items || (Array.isArray(res) ? res : []);
        setCompanies(items);
      } catch (err) {
        console.error('Failed to load companies:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCompanies();
  }, []);

  const filtered = companies.filter(c => {
    const q = searchTerm.toLowerCase();
    const name = (c.company_name || '').toLowerCase();
    const ind = (c.industry || '').toLowerCase();
    const loc = (c.location || '').toLowerCase();
    const matchesSearch = !searchTerm || name.includes(q) || ind.includes(q) || loc.includes(q);
    const matchesIndustry = !industryFilter || c.industry === industryFilter || c.tier === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  return (
    <AdminPage
      title="Clinic & Corporate Accounts"
      subtitle="Healthcare provider accounts, corporate client entities, commercial tiers, and recurring value"
      actions={
        <div className="d-flex gap-2">
          <Link to="/app/sales/leads" className="btn btn-outline-primary btn-sm">
            <i className="bi bi-hospital me-1"></i> Leads Pipeline
          </Link>
          <Link to="/app/sales/deals" className="btn btn-primary btn-sm shadow-sm">
            <i className="bi bi-kanban me-1"></i> Deals Board
          </Link>
        </div>
      }
    >
      {/* Search & Filter Header */}
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-3">
        <div className="row g-2 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted"></i></span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search by clinic name, area, doctor..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select bg-light"
              value={industryFilter}
              onChange={e => setIndustryFilter(e.target.value)}
            >
              <option value="">All Account Tiers & Sectors</option>
              <option value="Healthcare & Dental">Healthcare & Dental</option>
              <option value="ENTERPRISE">Enterprise Automation</option>
              <option value="MID_MARKET">Scale & Optimize</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>
          <div className="col-md-3 text-md-end">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
              {filtered.length} Accounts Monitored
            </span>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="row g-3">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
            Loading accounts...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted">
            No accounts match the selected filters.
          </div>
        ) : (
          filtered.map(comp => (
            <div className="col-md-6 col-lg-4" key={comp.id}>
              <div className="sales-kpi-card p-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="kpi-icon-bubble kpi-bubble-indigo">
                    <i className="bi bi-building"></i>
                  </div>
                  <span className={`tier-badge ${
                    comp.tier === 'ENTERPRISE' ? 'tier-enterprise' :
                    comp.tier === 'MID_MARKET' ? 'tier-scale' : 'tier-essential'
                  }`}>
                    {comp.tier || 'CLINIC ACCOUNT'}
                  </span>
                </div>

                <h5 className="fw-bold text-dark mb-1">{comp.company_name}</h5>
                <small className="text-muted d-block mb-3">
                  <i className="bi bi-geo-alt me-1 text-primary"></i>
                  {comp.industry || 'Healthcare'} &bull; {comp.location || 'Tamil Nadu'}
                </small>

                <div className="p-3 bg-light rounded-3 mb-3 border">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Active Contracts</span>
                    <strong className="text-dark">{comp.active_deals || 1} Deal In-flight</strong>
                  </div>
                  <div className="d-flex justify-content-between small text-muted">
                    <span>Contracted ARR</span>
                    <strong className="text-success">₹{(comp.arr || 300000).toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                  <small className="text-muted">
                    <i className="bi bi-person me-1"></i>{comp.contact_person || 'Director'}
                  </small>
                  <Link to="/app/sales/deals" className="btn btn-sm btn-outline-primary">
                    View Deals <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminPage>
  );
}
