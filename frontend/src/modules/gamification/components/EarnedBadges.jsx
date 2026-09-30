import React, { useState, useEffect } from 'react';
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import { badgeApi } from '../../services/api/badgeApi'

export default function EarnedBadges() {
  const [earnedBadges, setEarnedBadges] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadEarnedBadges()
  }, [])

  const loadEarnedBadges = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await badgeApi.getUserBadges()
      setEarnedBadges(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminPage
      title="Earned Badges"
      subtitle="View badges earned by users"
      loading={loading}
      error={error}
      onRetry={loadEarnedBadges}
    >
      <div className="card">
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Badge</th>
                <th>Earned At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {earnedBadges.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No earned badges found</span>
                  </td>
                </tr>
              ) : (
                earnedBadges.map((item) => (
                  <tr key={`${item.userId}-${item.badgeId}-${item.id}`}>
                    <td>{item.userName || item.userId}</td>
                    <td>{item.badgeName}</td>
                    <td>{new Date(item.earnedAt).toLocaleString()}</td>
                    <td>
                      <span className="statusTag active">Earned</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  )
}
