import React, { useEffect, useState } from 'react';
import { getQuizzes } from '../../../../services/api/quizApi.js';

export default function LiveQuizLeaderboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getQuizzes().catch(() => []);
        setQuizzes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load quizzes:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading leaderboard...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Live Leaderboard</h2>
          <p className="pageSubtitle">Real-time quiz rankings</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {quizzes.length === 0 ? (
            <div className="emptyState"><h3>No Quizzes</h3><p>No quiz data available.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Rank</th><th>Student</th><th>Score</th></tr></thead>
              <tbody>
                {quizzes.map((quiz, idx) => (
                  <tr key={quiz.id}>
                    <td>#{idx + 1}</td>
                    <td>{quiz.student_name || quiz.student_id}</td>
                    <td><span className="statusTag active">{quiz.score || 0}</span></td>
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
