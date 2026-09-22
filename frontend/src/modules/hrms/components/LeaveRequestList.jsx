import React, { useEffect, useState } from 'react';
import { getLeaves, updateLeaveStatus } from '../../../../services/api/leaveApi.js';

export default function LeaveRequestList() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getLeaves().catch(() => []);
        setLeaves(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load leaves:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateLeaveStatus(id, { status });
      setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    } catch (err) {
      console.error('Failed to update leave status:', err);
    }
  };

  if (loading) return <div className="loading">Loading leaves...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Leave Requests</h2>
          <p className="pageSubtitle">Manage employee leave applications</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {leaves.length === 0 ? (
            <div className="emptyState"><h3>No Leaves</h3><p>No leave applications found.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.employee_name || leave.employee_id}</td>
                    <td>{leave.leave_type || 'Leave'}</td>
                    <td>{leave.start_date} to {leave.end_date}</td>
                    <td><span className={`statusTag ${leave.status === 'approved' ? 'active' : leave.status === 'rejected' ? 'inactive' : 'pending'}`}>{leave.status}</span></td>
                    <td>
                      {leave.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => handleStatus(leave.id, 'approved')} className="btn btnPrimary" style={{ padding: '4px 10px', fontSize: '12px' }}>Approve</button>
                          <button onClick={() => handleStatus(leave.id, 'rejected')} className="btn" style={{ padding: '4px 10px', fontSize: '12px' }}>Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
