import React, { useEffect, useState } from 'react';
import { getTasks } from '../../services/api/taskApi.js';
import { getClients } from '../../services/api/clientApi.js';
import { getSubscriptions } from '../../services/api/subscriptionApi.js';

export default function PMS() {
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [taskRes, clientRes, subRes] = await Promise.all([
        getTasks().catch(() => []),
        getClients().catch(() => []),
        getSubscriptions().catch(() => []),
      ]);
      setTasks(Array.isArray(taskRes) ? taskRes : []);
      setClients(Array.isArray(clientRes) ? clientRes : []);
      setSubscriptions(Array.isArray(subRes) ? subRes : []);
    } catch (err) {
      console.error('Failed to load PMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div className="loading">Loading PMS data...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Project Management</h2>
          <p className="pageSubtitle">Clients, subscriptions, and tasks</p>
        </div>
        <div className="pageActions">
          <button onClick={loadData} className="btn">Refresh</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px', marginBottom: '24px' }}>
        <div className="statCard">
          <p className="statLabel">Active Clients</p>
          <p className="statValue">{clients.length}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Subscriptions</p>
          <p className="statValue">{subscriptions.length}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Open Tasks</p>
          <p className="statValue">{tasks.filter((t) => t.status !== 'completed').length}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gap: '20px' }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Clients ({clients.length})</h3></div>
          <div className="cardBody">
            {clients.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No clients found.</p>
            ) : (
              <table className="table">
                <thead><tr><th>Name</th><th>Email</th><th>Status</th></tr></thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.name}</td>
                      <td>{client.email}</td>
                      <td><span className={`statusTag ${client.is_active ? 'active' : 'inactive'}`}>{client.is_active ? 'Active' : 'Inactive'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Recent Tasks ({tasks.length})</h3></div>
          <div className="cardBody">
            {tasks.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No tasks found.</p>
            ) : (
              <table className="table">
                <thead><tr><th>Title</th><th>Status</th><th>Priority</th></tr></thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td><span className={`statusTag ${task.status === 'completed' ? 'active' : 'pending'}`}>{task.status}</span></td>
                      <td>{task.priority || 'Medium'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
