import React, { useState } from 'react';

export default function RolesPermissions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('SUPER_ADMIN');

  const [roles, setRoles] = useState([
    { id: 'SUPER_ADMIN', name: 'Super Admin', scope: 'Global Platform', usersCount: 3, description: 'Unrestricted control across all tenants, infrastructure, and billing.' },
    { id: 'ADMIN', name: 'Organization Admin', scope: 'Single Tenant', usersCount: 48, description: 'Complete administrative control within assigned organization.' },
    { id: 'HR', name: 'HR Manager', scope: 'Module Level', usersCount: 92, description: 'Manage employee lifecycle, interns, leaves, and attendance.' },
    { id: 'TUTOR', name: 'Faculty / Tutor', scope: 'Module Level', usersCount: 140, description: 'Course management, curriculum, live batches, and grading.' },
    { id: 'PROJECT_MANAGER', name: 'Project Manager', scope: 'Module Level', usersCount: 65, description: 'Sprint delivery, milestones, team assignments, and timesheets.' },
    { id: 'FINANCE', name: 'Finance Controller', scope: 'Module Level', usersCount: 24, description: 'Income, invoicing, receipts, payments, and payroll audits.' },
    { id: 'SALES', name: 'Sales Executive', scope: 'Module Level', usersCount: 88, description: 'Leads, deals pipeline, opportunities, and proposals.' },
    { id: 'RECEPTION', name: 'Receptionist', scope: 'Module Level', usersCount: 34, description: 'Visitor gate logs, appointments, admissions, and receipts.' },
  ]);

  const [permissions, setPermissions] = useState({
    SUPER_ADMIN: { 'platform:tenants:write': true, 'platform:billing:manage': true, 'system:monitoring:full': true, 'users:global:write': true, 'security:audit:export': true },
    ADMIN: { 'org:users:write': true, 'org:departments:manage': true, 'org:reports:view': true, 'org:settings:update': true },
    HR: { 'hr:employees:manage': true, 'hr:leaves:approve': true, 'hr:payroll:audit': true },
    TUTOR: { 'lms:courses:publish': true, 'lms:batches:grade': true, 'lms:attendance:mark': true },
    PROJECT_MANAGER: { 'pm:projects:create': true, 'pm:milestones:approve': true, 'pm:tasks:assign': true },
    FINANCE: { 'finance:invoices:create': true, 'finance:refunds:process': true, 'finance:tax:file': true },
    SALES: { 'crm:leads:create': true, 'crm:deals:close': true, 'crm:proposals:send': true },
    RECEPTION: { 'reception:visitors:log': true, 'reception:appointments:book': true, 'reception:receipts:issue': true },
  });

  const togglePermission = (roleId, permKey) => {
    setPermissions(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permKey]: !prev[roleId]?.[permKey],
      }
    }));
  };

  const filteredRoles = roles.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.scope.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-shield-lock text-primary" aria-hidden="true"></i>
            Global Roles & Permissions Matrix
          </h2>
          <p className="text-secondary small mb-0">
            Multi-tenant role-based access control (RBAC), permission inheritance, and platform scope gates.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <i className="bi bi-arrow-repeat" aria-hidden="true"></i> Refresh RBAC
          </button>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-1">
            <i className="bi bi-plus-lg" aria-hidden="true"></i> Create Custom Role
          </button>
        </div>
      </div>

      {/* Scope Highlights */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-primary border-4">
            <small className="text-secondary fw-semibold text-uppercase">Platform Roles</small>
            <h4 className="fw-bold my-1 text-primary">1 Tier</h4>
            <small className="text-muted">Global root supervision</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-success border-4">
            <small className="text-secondary fw-semibold text-uppercase">Organization Roles</small>
            <h4 className="fw-bold my-1 text-success">1 Tier</h4>
            <small className="text-muted">Single-tenant control</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-warning border-4">
            <small className="text-secondary fw-semibold text-uppercase">Functional Modules</small>
            <h4 className="fw-bold my-1 text-warning">6 Modules</h4>
            <small className="text-muted">HR, LMS, PM, Finance, Sales, Reception</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-info border-4">
            <small className="text-secondary fw-semibold text-uppercase">Total Active Users</small>
            <h4 className="fw-bold my-1 text-info">502 Users</h4>
            <small className="text-muted">Assigned across roles</small>
          </div>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="row g-4">
        {/* Role List */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 bg-white">
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <span className="fw-bold">Platform Roles</span>
              <input 
                type="text" 
                className="form-control form-control-sm w-50" 
                placeholder="Search roles..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="list-group list-group-flush">
              {filteredRoles.map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`list-group-item list-group-item-action p-3 d-flex justify-content-between align-items-start border-0 border-bottom ${
                    selectedRole === r.id ? 'bg-primary bg-opacity-10' : ''
                  }`}
                >
                  <div>
                    <div className="fw-semibold text-dark">{r.name}</div>
                    <small className="text-secondary d-block">{r.description}</small>
                    <span className="badge bg-secondary bg-opacity-25 text-dark mt-1 font-monospace" style={{ fontSize: '0.7rem' }}>
                      {r.scope}
                    </span>
                  </div>
                  <span className="badge bg-primary rounded-pill">{r.usersCount}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Role Permissions */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-0">Permissions for: <span className="text-primary">{roles.find(r => r.id === selectedRole)?.name}</span></h5>
                <small className="text-muted">Scope Level: {roles.find(r => r.id === selectedRole)?.scope}</small>
              </div>
              <button className="btn btn-outline-success btn-sm d-flex align-items-center gap-1">
                <i className="bi bi-check-all" aria-hidden="true"></i> Save Permissions
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Capability / Permission Key</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(permissions[selectedRole] || {}).map(([permKey, isGranted]) => (
                    <tr key={permKey}>
                      <td>
                        <code className="text-dark fw-medium">{permKey}</code>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border">
                          {permKey.split(':')[0]?.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isGranted ? 'bg-success' : 'bg-danger'}`}>
                          {isGranted ? 'Granted' : 'Revoked'}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="form-check form-switch d-inline-block">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            role="switch"
                            checked={Boolean(isGranted)}
                            onChange={() => togglePermission(selectedRole, permKey)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
