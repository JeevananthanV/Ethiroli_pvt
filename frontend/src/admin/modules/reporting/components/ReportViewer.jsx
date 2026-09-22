import React, { useEffect, useState } from 'react';
import { listReportDefinitions, executeReport } from '../../../../services/api/reportApi.js';

export default function ReportViewer() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await listReportDefinitions().catch(() => []);
        setReports(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRun = async (id) => {
    try {
      const res = await executeReport(id);
      setResult(res);
    } catch (err) {
      console.error('Failed to run report:', err);
    }
  };

  if (loading) return <div className="loading">Loading reports...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Report Viewer</h2>
          <p className="pageSubtitle">Execute and view report results</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {reports.length === 0 ? (
            <div className="emptyState"><h3>No Reports</h3><p>No report definitions found.</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reports.map((report) => (
                <div key={report.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--admin-border-subtle)', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px' }}>{report.name}</h4>
                    <p style={{ margin: 0, color: 'var(--admin-text-secondary)', fontSize: '13px' }}>{report.type || 'Standard'}</p>
                  </div>
                  <button onClick={() => handleRun(report.id)} className="btn btnPrimary" style={{ padding: '6px 16px', fontSize: '13px' }}>Run</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {result && (
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="cardHeader"><h3 className="cardTitle">Report Result</h3></div>
          <div className="cardBody">
            <pre style={{ background: 'var(--admin-bg-default)', padding: '16px', borderRadius: '8px', overflow: 'auto' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
