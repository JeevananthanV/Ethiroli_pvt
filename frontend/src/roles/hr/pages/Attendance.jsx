import React, { useEffect, useState, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listAttendance, checkIn, updateAttendance, getAttendanceSummary } from '../../../../services/api/hrApi.standardized.js';
import { listEmployees } from '../../../../services/api/hrApi.standardized.js';
import { listInterns } from '../../../../services/api/hrApi.standardized.js';

export default function HRAttendance() {
  // --- Main Data Hook using useHrData ---
  // Fetches attendance records with proper loading/error/empty state management
  const {
    data: records,
    loading,
    error,
    refresh,
    search,
    setSearch
  } = useHrData(
    listAttendance,
    { limit: 200 },
    undefined,
    undefined,
    undefined
  );

  // --- Additional State for Multi-Role Tracking ---
  const [employees, setEmployees] = useState([]);
  const [interns, setInterns] = useState([]);
  const [activeRoleTab, setActiveRoleTab] = useState('ALL');
  const [showLogModal, setShowLogModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // --- Form State ---
  const [formData, setFormData] = useState({
    targetRole: 'EMPLOYEE',
    user_id: '',
    user_name: '',
    date: new Date().toISOString().slice(0, 10),
    clock_in: '09:00 AM',
    clock_out: '06:00 PM',
    status: 'present'
  });

  // --- Toast Helper ---
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // --- Fetch Employees & Interns on Mount ---
  useEffect(() => {
    // Fetch employees and interns in parallel with attendance
    Promise.all([
      listEmployees().catch(() => []),
      listInterns().catch(() => [])
    ]).then(([empData, internData]) => {
      const eList = Array.isArray(empData) ? empData : (empData?.data || []);
      const iList = Array.isArray(internData) ? internData : (internData?.data || []);
      setEmployees(eList);
      setInterns(iList);
    });
  }, []);

  // --- Attendance Summary Stats using useMemo ---
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayRecords = records.filter(r => r.date && String(r.date).startsWith(todayStr));

    const empCount = records.filter(r => {
      const ro = String(r.user_role || r.role || (r.department ? 'EMPLOYEE' : '')).toUpperCase();
      return ro.includes('EMPLOYEE');
    }).length;

    const internCount = records.filter(r => {
      const ro = String(r.user_role || r.role || '').toUpperCase();
      return ro.includes('INTERN');
    }).length;

    const studentRecords = records.filter(r => {
      const ro = String(r.user_role || r.role || '').toUpperCase();
      return ro.includes('STUDENT');
    });

    const studentPresents = studentRecords.filter(r => String(r.status).toUpperCase() === 'PRESENT').length;
    const studentRate = studentRecords.length > 0 ? Math.round((studentPresents / studentRecords.length) * 100) : 100;

    return {
      totalToday: todayRecords.length,
      employeesCount: empCount,
      internsCount: internCount,
      studentRate: `${studentRate}%`
    };
  }, [records]);

  // --- Filtered Records using useMemo ---
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const name = (rec.employee_name || rec.user_name || rec.full_name || '').toLowerCase();
      const matchesSearch = name.includes(search.toLowerCase());
      
      const matchesStatus = activeRoleTab === 'ALL' || 
        String(rec.user_role || rec.role || '').toUpperCase().includes(activeRoleTab.toUpperCase());
      
      return matchesSearch;
    });
  }, [records, search, activeRoleTab]);

  // --- Handle Check-In ---
  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let targetUserId = formData.user_id;
      if (!targetUserId) {
        if (formData.targetRole === 'EMPLOYEE' && employees.length > 0) {
          targetUserId = employees[0].user_id || employees[0].id;
        } else if (formData.targetRole === 'INTERN' && interns.length > 0) {
          targetUserId = interns[0].user_id || interns[0].id;
        }
      }

      await checkIn({
        user_id: targetUserId,
        date: formData.date,
        clock_in: formData.clock_in,
        clock_out: formData.clock_out,
        status: formData.status.toUpperCase() === 'LATE' ? 'PRESENT' : formData.status.toUpperCase()
      });

      await refresh();
      setShowLogModal(false);
      showToast(`Attendance recorded successfully for ${formData.user_name || 'user'}!`);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to log attendance';
      setError(message);
      showToast(message);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Handle Status Update ---
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateAttendance(id, { status: newStatus });
      await refresh();
      showToast(`Status updated to ${newStatus}`);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update attendance status';
      setError(message);
      showToast(message);
    }
  };

  // --- Export CSV ---
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Role', 'Date', 'Clock In', 'Clock Out', 'Status', 'Total Hours'];
    const rows = filteredRecords.map(r => [
      r.id,
      r.employee_name || r.user_name || r.full_name || '—',
      r.user_role || r.role || 'STAFF',
      r.date ? String(r.date).slice(0, 10) : '—',
      r.clock_in || '—',
      r.clock_out || '—',
      r.status || '—',
      r.hours != null ? r.hours : '—'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ethiroli_Attendance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Role Tabs ---
  const roleTabs = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'EMPLOYEE', label: 'Employees' },
    { id: 'INTERN', label: 'Interns' },
    { id: 'STUDENT', label: 'Students (75% Rule)' }
  ];

  return (
    <AdminPage
      title="Multi-Role Attendance & Timesheets"
      subtitle="Unified tracking for Employees, Interns, and Students with 75% compliance tracking"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" onClick={handleExportCSV}>
            <i className="bi bi-download me-1" /> Export CSV
          </Button>
          <Button variant="primary" onClick={() => setShowLogModal(true)}>
            <i className="bi bi-clock-history me-1" /> Log Attendance
          </Button>
        </div>
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

        {/* 4 KPI Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div className="card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #2563eb' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Punched Today</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>{stats.totalToday}</div>
            <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Live synchronized records</span>
          </div>
          <div className="card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #0284c7' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Employee Timesheets</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>{stats.employeesCount}</div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Full-time & Contract Staff</span>
          </div>
          <div className="card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #d97706' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Intern Logged Records</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>{stats.internsCount}</div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Practical Training Hours</span>
          </div>
          <div className="card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #7c3aed' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Student Compliance Standing</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#7c3aed', marginTop: '0.25rem' }}>{stats.studentRate}</div>
            <span style={{ fontSize: '0.75rem', color: '#7c3aed' }}>{'Target >= 75% for Exam Access'}</span>
          </div>
        </div>

        {/* Multi-Role Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid #e2e8f0',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          {roleTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveRoleTab(tab.id)}
              style={{
                padding: '0.65rem 1.25rem',
                border: 'none',
                background: 'none',
                fontSize: '0.9rem',
                fontWeight: activeRoleTab === tab.id ? 700 : 500,
                color: activeRoleTab === tab.id ? '#2563eb' : '#64748b',
                borderBottom: activeRoleTab === tab.id ? '3px solid #2563eb' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '-2px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '1rem'
        }}>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: '220px',
              padding: '0.5rem 0.85rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #cbd5e1)',
              fontSize: '0.875rem'
            }}
          />
          <select
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #cbd5e1)',
              fontSize: '0.875rem',
              background: '#fff'
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="present">Present (On Time)</option>
            <option value="late">Late Arrival</option>
            <option value="half_day">Half Day</option>
            <option value="absent">Absent</option>
          </select>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="emptyState">
            <h3>No attendance records found</h3>
            <p>Click "Log Attendance" above to record daily entries for employees, interns, or students.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="cardTitle">Attendance Register ({filteredRecords.length})</h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Sorted by latest entry</span>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category / Role</th>
                    <th>Date</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Total Hours</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((rec) => {
                    const role = String(rec.user_role || rec.role || (rec.department ? 'EMPLOYEE' : 'STUDENT')).toUpperCase();
                    const isStudent = role.includes('STUDENT');
                    const isIntern = role.includes('INTERN');
                    
                    const roleBadgeBg = isStudent ? '#f3e8ff' : isIntern ? '#fef3c7' : '#dbeafe';
                    const roleBadgeColor = isStudent ? '#6b21a8' : isIntern ? '#92400e' : '#1e40af';

                    return (
                      <tr key={rec.id}>
                        <td style={{ fontWeight: 600 }}>{rec.employee_name || rec.user_name || rec.full_name || '—'}</td>
                        <td>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: roleBadgeBg,
                            color: roleBadgeColor
                          }}>
                            {role}
                          </span>
                        </td>
                        <td>{rec.date ? String(rec.date).slice(0, 10) : 'Today'}</td>
                        <td>{rec.clock_in || rec.checkIn || '—'}</td>
                        <td>{rec.clock_out || rec.checkOut || '—'}</td>
                        <td>
                          {rec.hours != null ? (
                            <span style={{ fontWeight: 600 }}>{rec.hours}h</span>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>—</span>
                          )}
                        </td>
                        <td>
                          <span className={`statusTag ${String(rec.status).toLowerCase() === 'present' ? 'active' : String(rec.status).toLowerCase() === 'absent' ? 'error' : 'pending'}`}>
                            {rec.status || 'UNKNOWN'}
                          </span>
                          {rec.is_late && (
                            <span style={{ marginLeft: '4px', fontSize: '0.7rem', color: '#b45309', fontWeight: 600 }}>
                              (Late)
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleUpdateStatus(rec.id, 'PRESENT')}
                              title="Mark Present"
                            >
                              Present
                            </button>
                            <button
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => handleUpdateStatus(rec.id, 'HALF_DAY')}
                              title="Mark Half Day"
                            >
                              Half Day
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleUpdateStatus(rec.id, 'ABSENT')}
                              title="Mark Absent"
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Log Attendance Modal */}
      <Modal isOpen={showLogModal} onClose={() => setShowLogModal(false)} title="Log Multi-Role Attendance Record">
        <form onSubmit={handleCreate}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Target Role Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Target Category *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['EMPLOYEE', 'INTERN', 'STUDENT'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        targetRole: cat,
                        user_id: '',
                        user_name: ''
                      }));
                    }}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: formData.targetRole === cat ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: formData.targetRole === cat ? '#eff6ff' : '#fff',
                      color: formData.targetRole === cat ? '#1d4ed8' : '#475569',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* User Dropdown / Input based on category */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                {formData.targetRole === 'EMPLOYEE' ? 'Employee Name *' : formData.targetRole === 'INTERN' ? 'Intern Name *' : 'Student Name *'}
              </label>
              {formData.targetRole === 'EMPLOYEE' && employees.length > 0 ? (
                <select
                  required
                  value={formData.user_id}
                  onChange={(e) => {
                    const emp = employees.find(x => (x.user_id || x.id) === e.target.value);
                    setFormData({
                      ...formData,
                      user_id: e.target.value,
                      user_name: emp?.full_name || emp?.name || ''
                    });
                  }}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                >
                  <option value="">-- Select Employee --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.user_id || emp.id}>
                      {emp.full_name || emp.name} ({emp.department || 'Staff'})
                    </option>
                  ))}
                </select>
              ) : formData.targetRole === 'INTERN' && interns.length > 0 ? (
                <select
                  required
                  value={formData.user_id}
                  onChange={(e) => {
                    const it = interns.find(x => (x.user_id || x.id) === e.target.value);
                    setFormData({
                      ...formData,
                      user_id: e.target.value,
                      user_name: it?.full_name || it?.name || ''
                    });
                  }}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                >
                  <option value="">-- Select Intern --</option>
                  {interns.map(it => (
                    <option key={it.id} value={it.user_id || it.id}>
                      {it.full_name || it.name} ({it.domain || 'Intern'})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={formData.user_name}
                  onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                  placeholder={`e.g. ${formData.targetRole === 'STUDENT' ? 'Praveen Kumar' : 'Ramesh Krishnan'}`}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Clock In</label>
                <input
                  type="text"
                  value={formData.clock_in}
                  onChange={(e) => setFormData({ ...formData, clock_in: e.target.value })}
                  placeholder="09:00 AM"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Clock Out</label>
                <input
                  type="text"
                  value={formData.clock_out}
                  onChange={(e) => setFormData({ ...formData, clock_out: e.target.value })}
                  placeholder="06:00 PM"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Attendance Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
              >
                <option value="present">Present (On Time)</option>
                <option value="late">Late Arrival</option>
                <option value="half_day">Half Day</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowLogModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Record Entry'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminPage>
  );
}