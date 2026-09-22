import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';

export default function HROnboarding() {
  const [activeTab, setActiveTab] = useState('active');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [candidates, setCandidates] = useState([
    {
      id: 'onb-1',
      name: 'Rohan Sharma',
      role: 'Full Stack Engineer',
      department: 'Engineering',
      joinDate: '2026-09-15',
      status: 'In Progress',
      progress: 60,
      tasks: { docs: true, it: true, hr: false, bank: true, orientation: false }
    },
    {
      id: 'onb-2',
      name: 'Priya Narayanan',
      role: 'UI/UX Designer',
      department: 'Design',
      joinDate: '2026-09-18',
      status: 'Initiated',
      progress: 25,
      tasks: { docs: true, it: false, hr: false, bank: false, orientation: false }
    },
    {
      id: 'onb-3',
      name: 'Karthik Raja',
      role: 'Marketing Specialist',
      department: 'Marketing',
      joinDate: '2026-09-08',
      status: 'Completed',
      progress: 100,
      tasks: { docs: true, it: true, hr: true, bank: true, orientation: true }
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Frontend Engineer',
    department: 'Engineering',
    joinDate: new Date().toISOString().slice(0, 10)
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

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

  const handleCreate = (e) => {
    e.preventDefault();
    const newCand = {
      id: `onb-${Date.now()}`,
      name: formData.name,
      role: formData.role,
      department: formData.department,
      joinDate: formData.joinDate,
      status: 'Initiated',
      progress: 0,
      tasks: { docs: false, it: false, hr: false, bank: false, orientation: false }
    };
    setCandidates((prev) => [newCand, ...prev]);
    setShowAddModal(false);
    setFormData({
      name: '',
      role: 'Frontend Engineer',
      department: 'Engineering',
      joinDate: new Date().toISOString().slice(0, 10)
    });
    showToast(`Onboarding journey initiated for ${formData.name}`);
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
              All ({candidates.length})
            </button>
          </div>
        </div>

        <div className="row g-3">
          {filtered.map((item) => (
            <div className="col-12 col-lg-6" key={item.id}>
              <div className="card h-100 border-0 shadow-sm" style={{ padding: '1.25rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 className="mb-0 fw-bold">{item.name}</h5>
                    <p className="text-muted mb-0 small">{item.role} &bull; {item.department}</p>
                  </div>
                  <span className={`badge ${item.status === 'Completed' ? 'bg-success' : item.status === 'In Progress' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                    {item.status}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between text-muted small mb-1">
                    <span>Onboarding Progress</span>
                    <span className="fw-semibold">{item.progress}%</span>
                  </div>
                  <div className="progress" style={{ height: 6 }}>
                    <div
                      className={`progress-bar ${item.progress === 100 ? 'bg-success' : 'bg-primary'}`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 bg-light rounded-3 mb-3">
                  <h6 className="fw-bold small text-uppercase mb-2 text-muted">Checklist Milestones</h6>
                  <div className="d-flex flex-column gap-2">
                    {[
                      ['docs', 'Document Submission & Background Verification'],
                      ['it', 'Email, Slack & VPN Account Provisioning'],
                      ['hr', 'HR Induction & Policy Briefing'],
                      ['bank', 'Bank Account & PF Details Submission'],
                      ['orientation', 'Team Orientation & Buddy Allocation']
                    ].map(([key, label]) => (
                      <div className="form-check" key={key}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`${item.id}-${key}`}
                          checked={Boolean(item.tasks[key])}
                          onChange={() => toggleTask(item.id, key)}
                          style={{ cursor: 'pointer' }}
                        />
                        <label className="form-check-label small" htmlFor={`${item.id}-${key}`} style={{ cursor: 'pointer' }}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-muted small">
                  Target Joining Date: <span className="fw-medium text-dark">{item.joinDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Initiate Onboarding Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Initiate New Joiner Onboarding">
        <form onSubmit={handleCreate}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>New Joiner Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Arun Prakash"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Designation / Role *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Frontend Engineer"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Joining Date</label>
              <input
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              Initiate Journey
            </button>
          </div>
        </form>
      </Modal>
    </AdminPage>
  );
}
