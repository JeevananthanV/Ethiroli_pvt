import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getClients } from '../../../services/api/salesApi.js';

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
        if (items.length > 0) {
          setCompanies(items);
        } else {
          setCompanies([
            { id: '1', company_name: 'Tata Consultancy & Services', industry: 'Information Technology', tier: 'ENTERPRISE', arr: 1800000, active_deals: 3, contact_person: 'Mr. N. Chandrasekaran', location: 'Mumbai, India', status: 'ACTIVE' },
            { id: '2', company_name: 'Apex Infotech Solutions', industry: 'Fintech / Edtech', tier: 'MID_MARKET', arr: 650000, active_deals: 2, contact_person: 'Siddharth Roy', location: 'Bangalore, India', status: 'ACTIVE' },
            { id: '3', company_name: 'Nexus Retailers Pvt Ltd', industry: 'Retail & Logistics', tier: 'MID_MARKET', arr: 420000, active_deals: 1, contact_person: 'Kavita Nair', location: 'Chennai, India', status: 'ACTIVE' },
            { id: '4', company_name: 'Symbiosis Academic Network', industry: 'Higher Education', tier: 'ENTERPRISE', arr: 1200000, active_deals: 2, contact_person: 'Dr. Anita Joshi', location: 'Pune, India', status: 'ACTIVE' },
            { id: '5', company_name: 'Zenith Logistics Global', industry: 'Supply Chain', tier: 'GROWTH', arr: 280000, active_deals: 1, contact_person: 'Sunil Rao', location: 'Hyderabad, India', status: 'PROSPECT' }
          ]);
        }
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
    const matchesSearch = name.includes(q) || ind.includes(q);
    const matchesIndustry = !industryFilter || c.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  return (
    <AdminPage
      title="Corporate Accounts & Companies"
      subtitle="Institutional clients, corporate parent accounts, tier classifications, and annual recurring revenue tracking"
    >
      {/* Search & Filter Header */}
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search by company name, industry, location..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={industryFilter}
              onChange={e => setIndustryFilter(e.target.value)}
            >
              <option value="">All Industries</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Fintech / Edtech">Fintech / Edtech</option>
              <option value="Higher Education">Higher Education</option>
              <option value="Supply Chain">Supply Chain</option>
              <option value="Retail & Logistics">Retail & Logistics</option>
            </select>
          </div>
          <div className="col-md-4 text-md-end">
            <span className="badge bg-primary bg-opacity-10 text-primary fs-6 px-3 py-2">
              {filtered.length} Companies Managed
            </span>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="row g-3">
        {loading ? (
          <div className="col-12 text-center py-5">Loading enterprise accounts...</div>
        ) : filtered.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted">No accounts match the selected filters.</div>
        ) : (
          filtered.map(comp => (
            <div className="col-md-6 col-lg-4" key={comp.id}>
              <div className="card border-0 shadow-sm rounded-3 h-100 p-4 bg-white hover-shadow transition">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="rounded-3 bg-light p-2 text-primary fw-bold fs-4 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                    <i className="bi bi-building"></i>
                  </div>
                  <span className={`badge ${
                    comp.tier === 'ENTERPRISE' ? 'bg-primary' :
                    comp.tier === 'MID_MARKET' ? 'bg-info text-dark' : 'bg-secondary'
                  }`}>
                    {comp.tier || 'ACCOUNT'}
                  </span>
                </div>

                <h5 className="fw-bold text-dark mb-1">{comp.company_name}</h5>
                <small className="text-muted d-block mb-3">{comp.industry} &bull; {comp.location || 'India'}</small>

                <div className="p-3 bg-light rounded-3 mb-3">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Active Deals</span>
                    <strong className="text-dark">{comp.active_deals || 1} Pipeline Cycle</strong>
                  </div>
                  <div className="d-flex justify-content-between small text-muted">
                    <span>Estimated ARR</span>
                    <strong className="text-success">₹{(comp.arr || 350000).toLocaleString()}</strong>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                  <small className="text-muted">
                    <i className="bi bi-person me-1"></i>{comp.contact_person || 'Key Buyer'}
                  </small>
                  <a href="#/deals" className="btn btn-sm btn-outline-primary">
                    View Deals <i className="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminPage>
  );
}
