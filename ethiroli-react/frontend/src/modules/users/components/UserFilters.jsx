import React from 'react';

export default function UserFilters({ filters, setFilters }) {
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="cardHeader"><h3 className="cardTitle">Filters</h3></div>
      <div className="cardBody">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <div className="formGroup">
            <label className="label">Search</label>
            <input className="inputField" value={filters.search || ''} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Name or email" />
          </div>
          <div className="formGroup">
            <label className="label">Role</label>
            <select className="select" value={filters.role || ''} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
              <option value="">All</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div className="formGroup">
            <label className="label">Status</label>
            <select className="select" value={filters.status || ''} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
