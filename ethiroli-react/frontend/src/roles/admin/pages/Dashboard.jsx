import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getUsers } from '../../../services/api/userApi.js';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setUsers((await getUsers().catch(() => [])) || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  return (
    <AdminPage title="Admin Dashboard" subtitle="System overview" loading={loading} error={null} onRetry={load}>
      <div className="dashboardGrid" style={{ marginBottom: 24 }}>
        <div className="statCard"><p className="statLabel">Users</p><p className="statValue">{users.length}</p></div>
      </div>
    </AdminPage>
  );
}
