import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage';
import { employeeApi } from '../../../services/api/employeeApi';

export default function PMTeam() {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const res = await employeeApi.getAll();
        const list = Array.isArray(res) ? res : (res?.employees || []);
        setTeamMembers(list);
      } catch (err) {
        console.error('Failed to load team:', err);
        setTeamMembers([
          { id: '1', full_name: 'Ananya Sharma', email: 'ananya@ethiroli.com', department: 'Engineering', role: 'Full Stack Lead', active_tasks: 5 },
          { id: '2', full_name: 'Karthik Raja', email: 'karthik@ethiroli.com', department: 'Frontend', role: 'UI Engineer', active_tasks: 3 },
          { id: '3', full_name: 'Vikram Mehta', email: 'vikram@ethiroli.com', department: 'Backend', role: 'DevOps & Cloud', active_tasks: 4 },
          { id: '4', full_name: 'Pooja Iyer', email: 'pooja@ethiroli.com', department: 'QA', role: 'Quality Assurance', active_tasks: 2 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const filtered = teamMembers.filter(m => {
    const name = m.full_name || m.user_name || m.name || '';
    const matchesSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || m.department === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminPage
      title="Team & Resource Allocation"
      subtitle="Manage team members, roles, workload, and cross-functional project assignments"
    >
      <div className="row g-3 mb-2">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <small className="text-muted text-uppercase fw-semibold">Total Members</small>
            <h3 className="mb-0 fw-bold mt-1 text-primary">{teamMembers.length}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <small className="text-muted text-uppercase fw-semibold">Avg Workload</small>
            <h3 className="mb-0 fw-bold mt-1 text-success">82%</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <small className="text-muted text-uppercase fw-semibold">Active Sprints</small>
            <h3 className="mb-0 fw-bold mt-1 text-info">4</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <small className="text-muted text-uppercase fw-semibold">On Leave</small>
            <h3 className="mb-0 fw-bold mt-1 text-warning">1</h3>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div className="input-group" style={{ maxWidth: '300px' }}>
            <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control bg-light border-0"
              placeholder="Search team member..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="d-flex gap-2">
            <select className="form-select form-select-sm" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="ALL">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="QA">QA</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Member</th>
                <th>Department / Role</th>
                <th>Assigned Tasks</th>
                <th>Workload Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-4">Loading team...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-muted">No team members found.</td></tr>
              ) : (
                filtered.map(member => (
                  <tr key={member.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bold d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                          {(member.full_name || member.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-semibold text-dark">{member.full_name || member.name || 'Employee'}</div>
                          <small className="text-muted">{member.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border me-1">{member.department || 'General'}</span>
                      <small className="text-muted d-block">{member.designation || member.role || 'Contributor'}</small>
                    </td>
                    <td>
                      <span className="badge bg-primary bg-opacity-10 text-primary">
                        {member.active_tasks || 3} Tasks
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2" style={{ maxWidth: '140px' }}>
                        <div className="progress flex-grow-1" style={{ height: '6px' }}>
                          <div className="progress-bar bg-success" style={{ width: '75%' }}></div>
                        </div>
                        <small className="text-muted">75%</small>
                      </div>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate('/app/pm/tasks')}>Assign Task</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}
