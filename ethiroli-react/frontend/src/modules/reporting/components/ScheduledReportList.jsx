import React, { useEffect, useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';

export default function ScheduledReportList() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setSchedules((await Promise.resolve([]).catch(() => [])) || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  return (
    <AdminPage title="Scheduled Reports" subtitle="Automated report schedules" loading={loading} error={null} onRetry={load}>
      <div className="card">
        <div className="cardBody">
          {schedules.length === 0 ? <p className="textSecondary">No scheduled reports.</p> : (
            <div className="overflowAuto">
              <table className="table">
                <thead><tr><th>Report</th><th>Frequency</th><th>Format</th><th>Next Run</th></tr></thead>
                <tbody>
                  {schedules.map((s) => (
                    <tr key={s.id}>
                      <td className="textPrimary" style={{ fontWeight: 500 }}>{s.report}</td>
                      <td className="textSecondary">{s.frequency}</td>
                      <td className="textSecondary">{s.format}</td>
                      <td className="textSecondary">{s.next_run || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
