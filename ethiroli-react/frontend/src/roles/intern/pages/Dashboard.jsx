import React from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';

export default function InternDashboard() {
  const goals = [
    { id: 1, text: 'Complete Git checkout verification tests', done: true },
    { id: 2, text: 'Populate routes layout interfaces', done: false },
    { id: 3, text: 'Request mentor feedback review', done: false },
    { id: 4, text: 'Submit weekly progress report', done: false },
  ];

  const stats = [
    { label: 'Tasks Completed', value: '12' },
    { label: 'Hours Logged', value: '38' },
    { label: 'Mentor Sessions', value: '4' },
    { label: 'Current Streak', value: '5 days' },
  ];

  return (
    <AdminPage
      title="Intern Dashboard"
      subtitle="Track your learning goals, tasks, and mentor progress"
    >
      <div className="dashboard">
        <div className="dashboardGrid">
          {stats.map(stat => (
            <div key={stat.label} className="statCard">
              <p className="statLabel">{stat.label}</p>
              <p className="statValue">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Weekly Goals</h3>
          </div>
          <div className="cardBody">
            {goals.length === 0 ? (
              <div className="emptyState">
                <h3>No goals set</h3>
                <p>Your mentor will assign weekly goals here.</p>
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {goals.map(goal => (
                  <li key={goal.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--admin-border-subtle)' }}>
                    <span style={{ fontSize: 18 }}>{goal.done ? '✅' : '🔵'}</span>
                    <span style={{ color: goal.done ? 'var(--admin-text-muted)' : 'var(--admin-text-primary)', textDecoration: goal.done ? 'line-through' : 'none' }}>
                      {goal.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
