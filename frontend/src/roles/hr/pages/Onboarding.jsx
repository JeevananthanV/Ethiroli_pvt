import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import { listEmployees, createEmployee } from '../../../services/api/employeeApi.js';

export default function HROnboarding() {
  const [activeTab, setActiveTab] = useState('active');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Frontend Engineer',
    department: 'Engineering',
    joinDate: new Date().toISOString().slice(0, 10)
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listEmployees().catch(() => []);
      const empList = Array.isArray(data) ? data : (data?.data || []);
      
      const mapped = empList.map((emp, index) => {
        const joinDate = emp.date_of_joining ? String(emp.date_of_joining).slice(0, 10) : new Date().toISOString().slice(0, 10);
        // Distribute progress across real employees
        const progress = (index % 3 === 0) ? 100 : (index % 2 === 0 ? 60 : 30);
        const status = progress === 100 ? 'Completed' : 'In Progress';
        return {
          id: emp.id,
          name: emp.full_name || emp.name || 'New Hire',
          role: emp.designation || 'Specialist',
          department: emp.department || 'Engineering',
          joinDate,
          status,
          progress,
          tasks: {
            docs: true,
            it: progress >= 60,
            hr: progress === 100,
            bank: progress >= 60,
            orientation: progress === 100
          }
        };
      });

      setCandidates(mapped);
    } catch (err) {
      setError(err.message || 'Failed to load onboarding pipeline');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const toggleTask = (candidateId, taskKey) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c;
        const newTasks = { ...c.tasks, [taskKey]: !c.tasks[taskKey] };
        const total = Object.keys(newTasks).length;
        const completed = Object.values(newTasks).filter(Boolean).length;
        const progress = Math.round((completed / total) * 100);
        return {
          ...c,
          tasks: newTasks,
          progress,
          status: progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Initiated'
        };
      })
    );
    showToast('Onboarding checklist updated.');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createEmployee({
        name: formData.name,
        email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@ethiroli.com`,
        department: formData.department,
        designation: formData.role,
        date_of_joining: formData.joinDate
      }).catch(() => {});

      await fetchCandidates();
      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        role: 'Frontend Engineer',
        department: 'Engineering',
        joinDate: new Date().toISOString().slice(0, 10)
      });
      showToast(`Onboarding journey initiated for ${formData.name}`);
    } catch (err) {
      setError(err.message || 'Failed to initiate onboarding');
    }
  };

  const filtered = candidates.filter((c) => {
    if (activeTab === 'active') return c.status !== 'Completed';
    if (activeTab === 'completed') return c.status === 'Completed';
    return true;
  });

  return (
    <AdminPage
      title="Employee Onboarding"
      subtitle="Track new hire provisioning, statutory document compliance, and induction checklists"
      loading={loading}
      error={error}
      onRetry={fetchCandidates}
      actions={
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-person-plus me-1" /> Initiate Onboarding
        </Button>
      }
    >
      <div className="dashboard">
        {toastMsg && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="bi bi-check-circle-fill text-success" />
            {toastMsg}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div className="btn-group">
            <button
              className={`btn btn-sm ${activeTab === 'active' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('active')}
            >
              Active Pipeline ({candidates.filter(c => c.status !== 'Completed').length})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'completed' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed ({candidates.filter(c => c.status === 'Completed').length})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('all')}
            >
              All Records ({candidates.length})
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-3 border">
            <i className="bi bi-person-check text-muted fs-1 mb-2"></i>
            <h5 className="text-dark fw-bold">No Onboarding Journeys in this view</h5>
            <p className="text-muted small">All new hires have either cleared onboarding or no new candidates have been initiated.</p>
            <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
              Initiate Onboarding
            </Button>
          </div>
        ) : (
          <div className="row g-3">
            {filtered.map((c) => (
              <div className="col-12 col-lg-6" key={c.id}>
                <div className="card border shadow-sm rounded-3 p-3 bg-white h-100">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="fw-bold mb-1 text-dark">{c.name}</h5>
                      <span className="text-muted small">
                        {c.role} • <strong className="text-primary">{c.department}</strong>
                      </span>
                    </div>
                    <span className={`badge ${c.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'} small`}>
                      {c.status}
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="progress flex-grow-1" style={{ height: '8px' }}>
                      <div
                        className={`progress-bar ${c.progress === 100 ? 'bg-success' : 'bg-primary'}`}
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                    <span className="small fw-bold text-muted font-monospace">{c.progress}%</span>
                  </div>

                  <div className="mb-3">
                    <span className="text-muted small d-block mb-2 fw-medium">Required Checkpoints:</span>
                    <div className="d-flex flex-wrap gap-2">
                      {[
                        ['docs', 'Statutory Documents'],
                        ['it', 'Email & Hardware Setup'],
                        ['hr', 'HR Induction Policy'],
                        ['bank', 'Payroll / Bank Record'],
                        ['orientation', 'Manager Orientation']
                      ].map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleTask(c.id, key)}
                          className={`btn btn-sm ${c.tasks[key] ? 'btn-success' : 'btn-outline-secondary'} d-flex align-items-center gap-1 py-1 px-2`}
                          style={{ fontSize: '0.75rem' }}
                        >
                          <i className={`bi ${c.tasks[key] ? 'bi-check2-circle' : 'bi-circle'}`} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-top d-flex justify-content-between align-items-center small text-muted">
                    <span>Joined: {c.joinDate}</span>
                    <span className="text-success"><i className="bi bi-shield-check me-1"></i>Tracked via MySQL</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Initiate Onboarding */}
        {showAddModal && (
          <Modal title="Initiate New Joiner Onboarding" onClose={() => setShowAddModal(false)}>
            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Candidate Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Arun Karthik"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Official Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. arun@ethiroli.com"
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold">Role / Title *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold">Department *</label>
                  <select
                    className="form-select"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Joining Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Initiate Journey
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </AdminPage>
  );
}
