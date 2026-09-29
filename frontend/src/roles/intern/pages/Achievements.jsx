import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Achievements() {
  const [showLeaderboard, setShowLeaderboard] = useState(true);

  const stats = [
    { label: 'Total Points', value: '1,240 pts', icon: 'bi-gem', color: 'primary', subtext: 'Rank #3 of 15' },
    { label: 'Tasks Completed', value: '28', icon: 'bi-check-circle', color: 'success', subtext: '+700 pts earned' },
    { label: 'Current Streak', value: '14 Days', icon: 'bi-fire', color: 'warning', subtext: 'Streak Master Active' },
    { label: 'Quiz Average', value: '94.2%', icon: 'bi-award', color: 'info', subtext: 'Top 5% in cohort' },
  ];

  const badges = [
    {
      id: 'b1',
      name: 'First Code Push',
      icon: '🏆',
      tier: 'Gold',
      status: 'EARNED',
      earnedDate: 'May 18, 2026',
      description: 'Completed and merged your first official task in the Ethiroli repository.'
    },
    {
      id: 'b2',
      name: 'Streak Master',
      icon: '🔥',
      tier: 'Platinum',
      status: 'EARNED',
      earnedDate: 'June 01, 2026',
      description: 'Clocked in on time for 7 consecutive working days without a single late mark.'
    },
    {
      id: 'b3',
      name: 'Bug Buster',
      icon: '🎯',
      tier: 'Silver',
      status: 'EARNED',
      earnedDate: 'June 08, 2026',
      description: 'Identified and fixed 5 reported bugs in the project backlog.'
    },
    {
      id: 'b4',
      name: 'Speed Demon',
      icon: '⚡',
      tier: 'Gold',
      status: 'EARNED',
      earnedDate: 'June 10, 2026',
      description: 'Submitted assignment solution 24 hours before the deadline.'
    },
    {
      id: 'b5',
      name: 'Top Performer',
      icon: '🌟',
      tier: 'Platinum',
      status: 'IN_PROGRESS',
      progress: 80,
      target: '1 of 2 Weeks 5/5',
      description: 'Rated 5/5 by mentor for 2 consecutive weekly evaluations.'
    },
    {
      id: 'b6',
      name: 'Course Champion',
      icon: '🎓',
      tier: 'Diamond',
      status: 'IN_PROGRESS',
      progress: 68,
      target: '68% of 100%',
      description: 'Complete 100% of all assigned LMS training modules.'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Siddharth M', points: 1420, tasks: 32, streak: '18 Days', avatar: 'SM' },
    { rank: 2, name: 'Ananya R', points: 1310, tasks: 29, streak: '15 Days', avatar: 'AR' },
    { rank: 3, name: 'Jeevananthan V (You)', points: 1240, tasks: 28, streak: '14 Days', avatar: 'JV', isCurrent: true },
    { rank: 4, name: 'Vikram S', points: 1180, tasks: 26, streak: '12 Days', avatar: 'VS' },
    { rank: 5, name: 'Priya N', points: 1100, tasks: 25, streak: '10 Days', avatar: 'PN' }
  ];

  return (
    <AdminPage
      title="Achievements & Gamification"
      subtitle="Milestone badges, engineering streaks, points system, and cohort leaderboard"
    >
      <div className="container-fluid px-0">
        {/* KPI Stats Cards */}
        <div className="row g-3 mb-2">
          {stats.map((st) => (
            <div key={st.label} className="col-sm-6 col-lg-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body p-3 d-flex align-items-center gap-3">
                  <div className={`p-3 rounded-circle bg-${st.color}-subtle text-${st.color}`}>
                    <i className={`bi ${st.icon} fs-3`}></i>
                  </div>
                  <div>
                    <small className="text-muted fw-semibold d-block">{st.label}</small>
                    <h3 className="fw-bold mb-0 text-dark">{st.value}</h3>
                    <small className="text-muted">{st.subtext}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="card shadow-sm border-0 mb-2">
          <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold text-dark">
              <i className="bi bi-patch-check-fill text-warning me-2"></i>Badges & Honors
            </h5>
            <span className="badge bg-light text-secondary border">
              {badges.filter((b) => b.status === 'EARNED').length} of {badges.length} Unlocked
            </span>
          </div>
          <div className="card-body p-3 pt-0">
            <div className="row g-3">
              {badges.map((b) => (
                <div key={b.id} className="col-md-6 col-lg-4">
                  <div
                    className={`card border p-3 h-100 rounded-3 text-center ${
                      b.status === 'EARNED' ? 'bg-light-subtle' : 'opacity-75'
                    }`}
                  >
                    <div className="display-4 mb-2">{b.icon}</div>
                    <h6 className="fw-bold mb-1 text-dark">{b.name}</h6>
                    <div className="mb-2">
                      <span className="badge bg-warning-subtle text-dark border small me-1">
                        {b.tier}
                      </span>
                      <span
                        className={`badge small ${
                          b.status === 'EARNED' ? 'bg-success-subtle text-success' : 'bg-secondary'
                        }`}
                      >
                        {b.status === 'EARNED' ? 'Earned' : 'In Progress'}
                      </span>
                    </div>

                    <p className="text-muted small mb-3 flex-grow-1">{b.description}</p>

                    {b.status === 'EARNED' ? (
                      <small className="text-muted border-top pt-2">
                        Earned on {b.earnedDate}
                      </small>
                    ) : (
                      <div className="border-top pt-2 mt-auto">
                        <div className="d-flex justify-content-between small text-muted mb-1">
                          <span>{b.target}</span>
                          <strong>{b.progress}%</strong>
                        </div>
                        <div className="progress" style={{ height: '6px' }}>
                          <div
                            className="progress-bar bg-primary"
                            style={{ width: `${b.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cohort Leaderboard & Points System */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h5 className="mb-0 fw-bold text-dark">
                <i className="bi bi-trophy-fill text-warning me-2"></i>Cohort Leaderboard
              </h5>
              <small className="text-muted">
                Points: Attendance (+10/day), Task completed (+25), Assignment on time (+50), High mentor rating (+30)
              </small>
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setShowLeaderboard(!showLeaderboard)}
            >
              {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
            </button>
          </div>

          {showLeaderboard && (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4" style={{ width: '60px' }}>Rank</th>
                    <th scope="col">Intern</th>
                    <th scope="col">Total Points</th>
                    <th scope="col">Tasks Completed</th>
                    <th scope="col">Current Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((item) => (
                    <tr
                      key={item.rank}
                      className={item.isCurrent ? 'table-primary fw-bold' : ''}
                    >
                      <td className="ps-4">
                        {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar-circle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center small fw-bold" style={{ width: '32px', height: '32px' }}>
                            {item.avatar}
                          </div>
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td className="text-primary">{item.points} pts</td>
                      <td>{item.tasks} tasks</td>
                      <td>
                        <span className="badge bg-warning-subtle text-dark border">
                          <i className="bi bi-fire text-warning me-1"></i>{item.streak}
                        </span>
                      </td>
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
