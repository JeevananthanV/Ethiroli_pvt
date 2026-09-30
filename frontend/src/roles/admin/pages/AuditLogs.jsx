import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage'
import { systemApi } from '../../../services/api/systemApi'
import Button from '../../../common/components/Button'

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await systemApi.getAuditLogs()
      setLogs(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  return (
    <AdminPage
      title="Audit Logs"
      subtitle="System audit trail and change history"
      loading={loading}
      error={error}
      onRetry={fetchLogs}
      actions={
        <Button onClick={fetchLogs}>
          Refresh
        </Button>
      }
    >
      <div className="card overflowAuto">
        <table className="table">
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Action</th>
              <th>User</th>
              <th>Resource</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="5" className="textCenter textMuted py4">
                  No audit logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td><code>{log.id || 'N/A'}</code></td>
                  <td>{log.action || 'Unknown'}</td>
                  <td>{log.user || 'System'}</td>
                  <td>{log.resource || 'N/A'}</td>
                  <td className="textSecondary" style={{ fontSize: '12px' }}>
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminPage>
  )
}
