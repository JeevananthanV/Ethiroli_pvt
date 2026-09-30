import React from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

const BADGES = [
  {
    id: 'BADGE-01',
    title: '7-Day Learning Streak',
    category: 'Consistency',
    unlocked: true,
    unlockedDate: '2026-09-28',
    xp: 150,
    icon: 'bi-fire',
    color: 'danger',
    description: 'Completed coding exercises and lessons 7 days consecutively without missing.',
  },
  {
    id: 'BADGE-02',
    title: 'Perfect Quiz Score (100%)',
    category: 'Excellence',
    unlocked: true,
    unlockedDate: '2026-09-22',
    xp: 200,
    icon: 'bi-star-fill',
    color: 'warning',
    description: 'Scored 20/20 in the JavaScript ES6+ Async Algorithms assessment.',
  },
  {
    id: 'BADGE-03',
    title: 'Phase 1 Master',
    category: 'Curriculum',
    unlocked: true,
    unlockedDate: '2026-09-18',
    xp: 300,
    icon: 'bi-trophy-fill',
    color: 'primary',
    description: 'Successfully finished all 8 day lessons, sandbox tasks, and the Phase 1 milestone.',
  },
  {
    id: 'BADGE-04',
    title: '90%+ Attendance Club',
    category: 'Discipline',
    unlocked: true,
    unlockedDate: '2026-09-30',
    xp: 100,
    icon: 'bi-calendar-check-fill',
    color: 'success',
    description: 'Maintained 94% live lecture and platform session attendance record.',
  },
  {
    id: 'BADGE-05',
    title: 'Code Sandbox Speedster',
    category: 'Speed',
    unlocked: true,
    unlockedDate: '2026-09-25',
    xp: 100,
    icon: 'bi-lightning-charge-fill',
    color: 'warning',
    description: 'Solved in-browser JavaScript sandbox challenge in under 4 minutes with zero errors.',
  },
  {
    id: 'BADGE-06',
    title: 'Community Doubt Solver',
    category: 'Collaboration',
    unlocked: false,
    unlockedDate: null,
    xp: 250,
    icon: 'bi-chat-heart-fill',
    color: 'info',
    description: 'Provide 3 verified and accepted answers to peer doubts in the Discussion Forum.',
  },
  {
    id: 'BADGE-07',
    title: 'Full Stack Capstone Hero',
    category: 'Capstone',
    unlocked: false,
    unlockedDate: null,
    xp: 500,
    icon: 'bi-award-fill',
    color: 'purple',
    description: 'Deploy the full production capstone app with CI/CD and secure certificate clearance.',
  },
  {
    id: 'BADGE-08',
    title: '30-Day Dev Marathon',
    category: 'Consistency',
    unlocked: false,
    unlockedDate: null,
    xp: 600,
    icon: 'bi-gem',
    color: 'indigo',
    description: 'Reach a 30-day continuous learning streak across lessons, tests, and code repos.',
  },
];

const LEADERBOARD = [
  { rank: 1, name: 'Balaji Venkatesh', xp: 1250, streak: '14 Days', level: 6, avatar: 'BV' },
  { rank: 2, name: 'Jeeva Karthik (You)', xp: 850, streak: '7 Days', level: 4, avatar: 'JK', isUser: true },
  { rank: 3, name: 'Aishwarya Rajesh', xp: 820, streak: '6 Days', level: 4, avatar: 'AR' },
  { rank: 4, name: 'Gowtham Chandran', xp: 790, streak: '5 Days', level: 3, avatar: 'GC' },
  { rank: 5, name: 'Sneha Mohan', xp: 740, streak: '5 Days', level: 3, avatar: 'SM' },
];

export default function Achievements() {
  return (
    <AdminPage
      title="Student Achievements & Gamification Hub"
      subtitle="Earn XP, unlock technical skill badges, maintain learning streaks, and celebrate your coding milestones."
    >
      {/* Gamification Status Bar */}
      <div className="card shadow-sm border-0 mb-4 bg-gradient bg-primary text-white">
        <div className="card-body p-4">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-3 text-center text-md-start border-end border-white border-opacity-25">
              <span className="badge bg-white text-primary fw-bold px-3 py-1 rounded-pill mb-1">
                CURRENT RANKING
              </span>
              <h2 className="display-6 fw-bold mb-0">Level 4</h2>
              <div className="small opacity-75">Senior Apprentice Developer</div>
            </div>

            <div className="col-12 col-md-3 text-center border-end border-white border-opacity-25">
              <div className="small opacity-75">Total Experience Points</div>
              <h2 className="display-6 fw-bold mb-0">850 XP</h2>
              <div className="small opacity-75">150 XP to Level 5</div>
            </div>

            <div className="col-12 col-md-3 text-center border-end border-white border-opacity-25">
              <div className="small opacity-75">Active Learning Streak</div>
              <h2 className="display-6 fw-bold mb-0 text-warning">
                7 Days <i className="bi bi-fire text-warning" />
              </h2>
              <div className="small opacity-75">Daily study & practice streak</div>
            </div>

            <div className="col-12 col-md-3 text-center">
              <div className="small opacity-75">Badges Unlocked</div>
              <h2 className="display-6 fw-bold mb-0">5 / 8</h2>
              <div className="small opacity-75">62.5% Showcase Complete</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Badges Grid */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="mb-0 fw-bold text-dark">
                <i className="bi bi-award-fill text-warning me-2" /> Technical & Milestone Badges
              </h5>
            </div>
            <div className="card-body p-3">
              <div className="row g-3">
                {BADGES.map((b) => (
                  <div key={b.id} className="col-12 col-sm-6">
                    <div
                      className={`card h-100 border p-3 ${
                        b.unlocked
                          ? 'border-primary-subtle bg-light'
                          : 'border-light-subtle bg-light bg-opacity-50 opacity-60'
                      }`}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div
                          className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-${
                            b.unlocked ? b.color : 'secondary'
                          } text-white shadow-sm`}
                          style={{ width: 48, height: 48 }}
                        >
                          <i className={`bi ${b.icon} fs-4`} />
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <h6 className="mb-0 fw-bold text-dark small">{b.title}</h6>
                            <span className="badge bg-primary-subtle text-primary">+{b.xp} XP</span>
                          </div>
                          <p className="small text-muted mb-2" style={{ fontSize: 11 }}>
                            {b.description}
                          </p>
                          <div className="small text-muted border-top pt-1 d-flex justify-content-between">
                            <span>{b.category}</span>
                            {b.unlocked ? (
                              <span className="text-success fw-semibold">
                                <i className="bi bi-check-circle-fill me-1" /> Unlocked
                              </span>
                            ) : (
                              <span className="text-muted">
                                <i className="bi bi-lock-fill me-1" /> Locked
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cohort Leaderboard */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="mb-0 fw-bold text-dark">
                <i className="bi bi-trophy text-warning me-2" /> Cohort Leaderboard
              </h5>
              <small className="text-muted">Batch: Full Stack 2026-Q3</small>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {LEADERBOARD.map((user) => (
                  <div
                    key={user.rank}
                    className={`list-group-item d-flex align-items-center justify-content-between p-3 ${
                      user.isUser ? 'bg-primary-subtle bg-opacity-30 fw-bold' : ''
                    }`}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <span
                        className={`badge rounded-circle p-2 ${
                          user.rank === 1
                            ? 'bg-warning text-dark'
                            : user.rank === 2
                            ? 'bg-secondary text-white'
                            : user.rank === 3
                            ? 'bg-danger text-white'
                            : 'bg-light text-dark border'
                        }`}
                        style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {user.rank}
                      </span>
                      <div>
                        <div className="text-dark small">{user.name}</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>
                          Level {user.level} · Streak: {user.streak} 🔥
                        </div>
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-primary text-white">{user.xp} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
