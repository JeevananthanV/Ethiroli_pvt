import React, { useEffect, useState } from 'react';
import { listSchedules } from '../../../../services/api/scheduledReportApi.js';

export default function ScheduledReportList() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await listSchedules().catch(() => []);
        setSchedules(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load schedules:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading scheduled reports...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Scheduled Reports</h2>
          <p className="pageSubtitle">Automated report schedules</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {schedules.length === 0 ? (
            <div className="emptyState"><h3>No Schedules</h3><p>No scheduled reports found.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Name</th><th>Frequency</th><th>Next Run</th></tr></thead>
              <tbody>
                {schedules.map((sched) => (
                  <tr key={sched.id}>
                    <td>{sched.name || sched.report_name}</td>
                    <td>{sched.frequency || 'Daily'}</td>
                    <td>{sched.next_run ? new Date(sched.next_run).toLocaleDateString() : '—'}</td>
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
