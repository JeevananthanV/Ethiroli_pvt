import React, { useEffect, useState, useCallback } from 'react';
import { getQuizzes } from '../../../services/api/quizApi.js';
import styles from './Lms.module.css';

const LEADERBOARD_MOCK = [
  { rank: 1, name: 'Suresh Kumar', score: 2800 },
  { rank: 2, name: 'Divya R.', score: 2550 },
  { rank: 3, name: 'You', score: 2100 }
];

export default function LiveQuizSession({ sessionId }) {
  const [session, setSession] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(24);
  const [leaderboard] = useState(LEADERBOARD_MOCK);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = sessionId ? await getQuizzes() : null;
        setSession(data?.find(q => q.isLive) || {
          question: {
            text: 'What is the time complexity of searching in a balanced Binary Search Tree (BST)?',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)']
          },
          total: 5,
          number: 3
        });
      } catch (err) {
        setError(err.message || 'Failed to load live session');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Connecting to live session...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.05)'}}>
        <p style={{color: 'var(--admin-danger)', margin: 0}}>{error}</p>
      </div>
    );
  }

  const question = session?.question || session;

  return (
    <div className="card">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
        <div>
          <h3 style={{margin: '0 0 4px', fontSize: 20, fontWeight: 700}}>Live Quiz Arena</h3>
          <p style={{margin: 0, color: 'var(--admin-text-muted)', fontSize: 14}}>Participate in the active class session live</p>
        </div>
        <span className={`statusTag ${submitted ? 'inactive' : 'active'}`}>
          {submitted ? 'Waiting' : 'Live'}
        </span>
      </div>

      <div className={styles.playerLayout}>
        <div className={styles.playerContent}>
          <div className={styles.questionBlock}>
            <div className={styles.questionMeta}>
              <strong style={{fontSize: 14}}>Question {session?.number || 3} of {session?.total || 5}</strong>
              <span className={`${styles.timer} ${timeLeft <= 5 ? 'textDanger' : ''}`} style={{
                color: timeLeft <= 5 ? 'var(--admin-danger)' : 'var(--base-clay, #AF431E)',
                fontWeight: 'bold',
                fontSize: 14
              }}>
                ⏱ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}s
              </span>
            </div>
            <p style={{margin: '0 0 16px', fontSize: 15, lineHeight: 1.6}}>
              <strong>{question?.text}</strong>
            </p>
            <div className={styles.optionsGrid}>
              {question?.options?.map(opt => (
                <label key={opt} className={styles.optionLabel} style={{
                  background: '#fff',
                  padding: '12px 14px',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  border: selectedAnswer === opt ? '2px solid var(--admin-primary)' : '1px solid var(--admin-border-subtle)',
                  opacity: submitted ? 0.6 : 1,
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="radio"
                    name="live-quiz"
                    value={opt}
                    checked={selectedAnswer === opt}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    disabled={submitted}
                    style={{accentColor: 'var(--admin-primary)'}}
                  />
                  <span style={{fontSize: 13.5}}>{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer || submitted}
            className={`btn primary fullWidthBtn`}
            style={{marginTop: 12}}
          >
            {submitted ? 'Answer Submitted! Waiting for next question...' : 'Lock Answer'}
          </button>
        </div>

        <div className={styles.sidebar}>
          <h4 style={{margin: '0 0 16px', fontSize: 16, fontWeight: 700}}>Leaderboard</h4>
          <ul className={styles.leaderboardList} style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8}}>
            {leaderboard.map(user => (
              <li
                key={user.rank}
                className={styles.leaderboardItem}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: user.name === 'You' ? 'rgba(168, 85, 247, 0.08)' : 'transparent',
                  border: user.name === 'You' ? '1px solid rgba(168, 85, 247, 0.2)' : '1px solid transparent',
                  fontWeight: user.name === 'You' ? 700 : 400,
                  color: user.name === 'You' ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{user.rank}. {user.name}</span>
                <span style={{fontWeight: 600, fontSize: 13}}>{user.score} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
