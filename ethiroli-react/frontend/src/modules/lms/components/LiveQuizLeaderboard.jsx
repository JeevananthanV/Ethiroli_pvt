import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { getLiveQuizLeaderboard } from '../../services/api/liveQuizApi.js';

export default function LiveQuizLeaderboard({ quizId }) {
  const [entries, setEntries] = useState([]);
  const [_loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setEntries((await getLiveQuizLeaderboard(quizId).catch(() => [])) || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [quizId]);

  useEffect(() => { load(); }, [load]);

  return (
    <AdminPage title="Live Quiz Leaderboard" subtitle="Real-time rankings">
      <div className="card">
        <div className="cardBody">
          {entries.length === 0 ? <p className="textSecondary">No entries yet.</p> : (
            <div className="overflowAuto">
              <table className="table">
                <thead><tr><th>Rank</th><th>Participant</th><th>Score</th></tr></thead>
                <tbody>
                  {entries.map((entry, idx) => (
                    <tr key={entry.id}>
                      <td className="textSecondary">#{idx + 1}</td>
                      <td className="textPrimary" style={{ fontWeight: 500 }}>{entry.participant_name || entry.participant_id}</td>
                      <td className="textSecondary">{entry.score}</td>
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
