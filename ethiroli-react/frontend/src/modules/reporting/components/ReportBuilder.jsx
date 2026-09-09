import React, { useEffect, useState } from 'react';
import { listReportDefinitions, executeReport } from '../../../services/api/reportApi.js';

export default function ReportBuilder() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [results, setResults] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const repRes = await listReportDefinitions().catch(() => []);
      setReports(Array.isArray(repRes) ? repRes : []);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExecute = async (reportId) => {
    setExecuting(true);
    try {
      const res = await executeReport(reportId);
      setResults(res);
    } catch (err) {
      console.error('Failed to execute report:', err);
    } finally {
      setExecuting(false);
    }
  };

  if (loading) return <div className="loading">Loading reports...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Reports & Analytics</h2>
          <p className="pageSubtitle">Build, schedule, and execute reports</p>
        </div>
      </div>
      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Report Definitions ({reports.length})</h3></div>
          <div className="cardBody">
            {reports.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No reports defined.</p>
            ) : (
              <table className="table">
                <thead><tr><th>Name</th><th>Type</th><th>Actions</th></tr></thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.name}</td>
                      <td>{report.type || 'Standard'}</td>
                      <td>
                        <button onClick={() => handleExecute(report.id)} className="btn" style={{ padding: '6px 12px', fontSize: '12px' }} disabled={executing}>
                          {executing ? 'Running...' : 'Run'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {results && (
          <div className="card">
            <div className="cardHeader"><h3 className="cardTitle">Execution Results</h3></div>
            <div className="cardBody">
              <pre style={{ background: 'var(--admin-bg-default)', padding: '16px', borderRadius: '8px', overflow: 'auto' }}>
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
