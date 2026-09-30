import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';

const INITIAL_CHECKLISTS = [
  {
    id: 'chk-001',
    person_name: 'Ananya Ramesh',
    role_type: 'EMPLOYEE',
    designation: 'Senior Frontend Developer',
    joining_date: '2026-09-15',
    mentor: 'Karthik S.',
    overall_progress: 75,
    tasks: [
      { id: 't1', title: 'Offer letter signed & accepted', category: 'HR', done: true, verifiedBy: 'HR Lead' },
      { id: 't2', title: 'Aadhaar / PAN & educational certificates verified', category: 'HR', done: true, verifiedBy: 'HR Lead' },
      { id: 't3', title: 'Work email and Slack credentials created', category: 'IT', done: true, verifiedBy: 'Sys Admin' },
      { id: 't4', title: 'GitHub repository access and dev machine provisioned', category: 'IT', done: true, verifiedBy: 'Lead Eng' },
      { id: 't5', title: 'First 1:1 Manager introduction & sprint alignment', category: 'Management', done: false, verifiedBy: 'Pending' },
      { id: 't6', title: 'First 30-Day milestone & feedback check-in', category: 'HR', done: false, verifiedBy: 'Pending' }
    ]
  },
  {
    id: 'chk-002',
    person_name: 'Vikas Sundaram',
    role_type: 'INTERN',
    designation: 'React & Node.js Intern',
    joining_date: '2026-09-22',
    mentor: 'Vignesh P.',
    overall_progress: 50,
    tasks: [
      { id: 'it1', title: 'College NOC & internship agreement verified', category: 'HR', done: true, verifiedBy: 'HR Lead' },
      { id: 'it2', title: 'Internal portal LMS login & curriculum assigned', category: 'Training', done: true, verifiedBy: 'Tutor Lead' },
      { id: 'it3', title: 'Assigned mentor pairing & daily standup introduction', category: 'Tech', done: true, verifiedBy: 'Mentor' },
      { id: 'it4', title: 'Phase 1 - Week 1 daily coding task submission', category: 'Training', done: false, verifiedBy: 'Pending' },
      { id: 'it5', title: 'Mid-term 15-day mentor evaluation', category: 'HR', done: false, verifiedBy: 'Pending' },
      { id: 'it6', title: 'Internship capstone project defense & certificate', category: 'HR', done: false, verifiedBy: 'Pending' }
    ]
  },
  {
    id: 'chk-003',
    person_name: 'Dharani Velu',
    role_type: 'INTERN',
    designation: 'UI/UX Design Intern',
    joining_date: '2026-09-28',
    mentor: 'Pooja K.',
    overall_progress: 25,
    tasks: [
      { id: 'dt1', title: 'Internship agreement & photo ID collected', category: 'HR', done: true, verifiedBy: 'HR Lead' },
      { id: 'dt2', title: 'Figma team license & design system access granted', category: 'IT', done: false, verifiedBy: 'Pending' },
      { id: 'dt3', title: 'Design briefing with Product Manager', category: 'Design', done: false, verifiedBy: 'Pending' },
      { id: 'dt4', title: 'First micro-interaction task handoff', category: 'Design', done: false, verifiedBy: 'Pending' }
    ]
  }
];

export default function HROnboardingChecklists() {
  const [checklists, setChecklists] = useState(INITIAL_CHECKLISTS);
  const [filterRole, setFilterRole] = useState('ALL');
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleToggleTask = (checklistId, taskId) => {
    setChecklists(prev => prev.map(c => {
      if (c.id !== checklistId) return c;
      const updatedTasks = c.tasks.map(t => {
        if (t.id !== taskId) return t;
        const newDone = !t.done;
        return {
          ...t,
          done: newDone,
          verifiedBy: newDone ? 'HR Admin (Verified)' : 'Pending'
        };
      });
      const doneCount = updatedTasks.filter(t => t.done).length;
      const newProgress = Math.round((doneCount / updatedTasks.length) * 100);
      const updatedChecklist = { ...c, tasks: updatedTasks, overall_progress: newProgress };
      if (selectedChecklist && selectedChecklist.id === checklistId) {
        setSelectedChecklist(updatedChecklist);
      }
      return updatedChecklist;
    }));
    showToast('Checklist task updated');
  };

  const filtered = checklists.filter(c => filterRole === 'ALL' || c.role_type === filterRole);

  return (
    <AdminPage
      title="Onboarding Checklists"
      subtitle="Track and verify individual onboarding items for new employees and interns"
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
            fontWeight: 500
          }}>
            <i className="bi bi-check-circle-fill text-success me-2" />
            {toastMsg}
          </div>
        )}

        {/* Role Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
          {['ALL', 'EMPLOYEE', 'INTERN'].map((r) => (
            <button
              key={r}
              className={`btn btn-sm ${filterRole === r ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setFilterRole(r)}
            >
              {r === 'ALL' ? 'All Checklists' : `${r} Checklists`}
            </button>
          ))}
        </div>

        {/* Checklists Table */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Active Joiner Checklists ({filtered.length})</h3>
          </div>
          <div className="cardBody" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Candidate / Joiner</th>
                    <th>Role & Track</th>
                    <th>Joining Date</th>
                    <th>Assigned Mentor</th>
                    <th>Checklist Progress</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.person_name}</div>
                        <span className={`badge ${item.role_type === 'INTERN' ? 'bg-info text-dark' : 'bg-primary'}`}>
                          {item.role_type}
                        </span>
                      </td>
                      <td>{item.designation}</td>
                      <td>{item.joining_date}</td>
                      <td>{item.mentor}</td>
                      <td style={{ minWidth: '150px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                          <span>{item.tasks.filter(t => t.done).length} / {item.tasks.length} Tasks</span>
                          <span style={{ fontWeight: 700 }}>{item.overall_progress}%</span>
                        </div>
                        <div className="progress" style={{ height: '6px' }}>
                          <div
                            className={`progress-bar ${item.overall_progress === 100 ? 'bg-success' : 'bg-primary'}`}
                            style={{ width: `${item.overall_progress}%` }}
                          />
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setSelectedChecklist(item);
                            setShowModal(true);
                          }}
                        >
                          <i className="bi bi-checklist me-1" /> Open Checklist
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Checklist Verification Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={`Onboarding Checklist — ${selectedChecklist?.person_name || 'Joiner'}`}
        >
          {selectedChecklist && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div>
                  <h5 className="mb-0">{selectedChecklist.person_name}</h5>
                  <small className="text-muted">{selectedChecklist.designation} • Mentor: {selectedChecklist.mentor}</small>
                </div>
                <div className="text-end">
                  <div className="badge bg-primary mb-1">{selectedChecklist.overall_progress}% Complete</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedChecklist.tasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      background: task.done ? '#f0fdf4' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => handleToggleTask(selectedChecklist.id, task.id)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ fontWeight: 500, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? '#15803d' : '#0f172a' }}>
                          {task.title}
                        </div>
                        <small style={{ color: '#64748b' }}>Category: {task.category}</small>
                      </div>
                    </div>
                    <div>
                      <span className={`badge ${task.done ? 'bg-success' : 'bg-light text-dark border'}`}>
                        {task.verifiedBy}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-end">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminPage>
  );
}
