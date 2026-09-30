import React, { useState, useEffect, useCallback } from 'react';
import badgeApi from '../../../../services/api/badgeApi'

export default function BadgeDisplay({ userId }) {
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBadges()
  }, [userId, fetchBadges])

  const fetchBadges = useCallback(async () => {
    try {
      const data = await badgeApi.getUserBadges(userId)
      setBadges(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  if (loading) {
    return <div className="loading">Loading badges...</div>
  }

  if (error) {
    return <div className="emptyState textDanger">Error: {error}</div>
  }

  if (badges.length === 0) {
    return (
      <div className="card">
        <div className="cardBody textCenter">
          <h4 className="textMuted">No badges earned yet</h4>
          <p className="textSecondary textSm">Complete courses and activities to earn badges</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gridCols4">
      {badges.map((badge) => (
        <div key={badge.id} className="card textCenter">
          <div className="cardBody">
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: badge.color || 'var(--admin-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '28px',
              }}
            >
              {badge.icon || '🏆'}
            </div>
            <h4 className="fontSemibold textPrimary">{badge.name}</h4>
            <p className="textSecondary textSm">{badge.description}</p>
            <p className="textMuted textXs mt2">
              Earned: {new Date(badge.earnedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
