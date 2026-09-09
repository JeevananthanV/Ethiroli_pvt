import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getTasks } from '../../../services/api/taskApi.js';

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState([]);
  const [_loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setTasks((await getTasks().catch(() => [])) || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  return (
    <AdminPage title="My Tasks" subtitle="Assigned tasks and status">
      <div className="card">
        <div className="cardBody">
          {tasks.length === 0 ? <p className="textSecondary">No tasks assigned.</p> : (
            <div className="overflowAuto">
              <table className="table">
                <thead><tr><th>Title</th><th>Status</th><th>Due</th></tr></thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t.id}>
                      <td className="textPrimary" style={{ fontWeight: 500 }}>{t.title}</td>
                      <td><span className={'statusTag ' + (t.status === 'done' ? 'active' : 'pending')}>{t.status}</span></td>
                      <td className="textSecondary">{t.due_date || '-'}</td>
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
