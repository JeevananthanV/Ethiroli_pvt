import React, { useState, useEffect } from 'react';
import liveQuizApi from '../../../../services/api/liveQuizApi'

export default function LiveQuizLeaderboard({ quizId }) {
  const [leaderboard, setLeaderboard] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const data = await liveQuizApi.getLeaderboard(quizId)
        if (active) setLeaderboard(data)
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 5000)
    return () => { active = false; clearInterval(interval) }
  }, [quizId])

  if (loading) return <div className="loading">Loading leaderboard...</div>
  if (error) return <div className="emptyState textDanger">Error: {error}</div>

  const getMedal = (index) => {
    switch (index) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return `${index + 1}.`
    }
  }

  return (
    <div className="card">
      <div className="cardHeader">
        <h3 className="cardTitle">Live Leaderboard</h3>
        <span className="statusTag active">Live</span>
      </div>
      <div className="cardBody">
        {leaderboard.length === 0 ? (
          <div className="emptyState">
            <p>No participants yet</p>
          </div>
        ) : (
          <div className="flex flexCol gap3">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.userId}
                className="card"
                style={{
                  border: '1px solid var(--admin-border)',
                  background: index < 3 ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                }}
              >
                <div className="cardBody">
                  <div className="flex itemsCenter justifyBetween">
                    <div className="flex itemsCenter gap3">
                      <span className="textXl fontSemibold">{getMedal(index)}</span>
                      <div>
                        <h4 className="fontSemibold textPrimary">{entry.userName}</h4>
                        <p className="textSecondary textSm">{entry.answersCorrect || 0} correct</p>
                      </div>
                    </div>
                    <div className="textRight">
                      <div className="textXl fontSemibold textPrimary">{entry.score}</div>
                      <div className="textSecondary textSm">points</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
