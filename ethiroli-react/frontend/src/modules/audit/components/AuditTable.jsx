import React, { useEffect, useState } from 'react';
import { getAuditLogs } from '../../../services/api/auditApi.js';

export default function AuditTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await getAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, []);

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">System Audit Trail</h2>
          <p className="pageSubtitle">Track all system activities and changes</p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Loading audit logs...</div>
        ) : (
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="textSecondary">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="textPrimary" style={{fontWeight:500}}>{log.user_email || 'System'}</td>
                    <td><span className="actionTag">{log.action}</span></td>
                    <td className="textSecondary">{log.entity_type} ({log.entity_id || 'N/A'})</td>
                    <td className="textMuted">{log.ip_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}