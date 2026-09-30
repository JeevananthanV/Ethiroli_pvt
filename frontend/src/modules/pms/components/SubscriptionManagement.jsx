import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { subscriptionApi } from '../../services/api/subscriptionApi'

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    loadSubscriptions()
  }, [loadSubscriptions])

  const loadSubscriptions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await subscriptionApi.getAll()
      const filtered = statusFilter ? data.filter((s) => s.status === statusFilter) : data
      setSubscriptions(filtered)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  const handleStatusChange = async (id, status) => {
    try {
      await subscriptionApi.update(id, { status })
      setSubscriptions(subscriptions.map((s) => (s.id === id ? { ...s, status } : s)))
    } catch (err) {
      setError(err.message)
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'active'
      case 'pending':
        return 'pending'
      case 'cancelled':
        return 'error'
      default:
        return 'pending'
    }
  }

  return (
    <AdminPage
      title="Subscription Management"
      subtitle="Manage user subscriptions and billing"
      loading={loading}
      error={error}
      onRetry={loadSubscriptions}
      actions={
        <select
          className="select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: '150px' }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      }
    >
      <div className="card">
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No subscriptions found</span>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.userName || sub.userId}</td>
                    <td>{sub.plan}</td>
                    <td>${(sub.amount || 0).toLocaleString()}</td>
                    <td>{sub.startDate ? new Date(sub.startDate).toLocaleDateString() : '-'}</td>
                    <td>{sub.endDate ? new Date(sub.endDate).toLocaleDateString() : '-'}</td>
                    <td>
                      <span className={`statusTag ${getStatusClass(sub.status)}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td>
                      {sub.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button size="small" variant="success" onClick={() => handleStatusChange(sub.id, 'active')}>
                            Approve
                          </Button>
                          <Button size="small" variant="danger" onClick={() => handleStatusChange(sub.id, 'cancelled')}>
                            Cancel
                          </Button>
                        </div>
                      )}
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
