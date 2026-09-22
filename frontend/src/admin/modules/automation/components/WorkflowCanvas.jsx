import React, { useEffect, useState } from 'react';
import { getAutomationWorkflows } from '../../../../services/api/automationApi.js';

export default function WorkflowCanvas() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAutomationWorkflows().catch(() => []);
        setWorkflows(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load workflows:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading workflows...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Automation Workflows</h2>
          <p className="pageSubtitle">Visual workflow automation builder</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {workflows.length === 0 ? (
            <div className="emptyState"><h3>No Workflows</h3><p>Create your first automation workflow.</p></div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {workflows.map((wf) => (
                <div key={wf.id} style={{ padding: '16px', border: '1px solid var(--admin-border-subtle)', borderRadius: '10px', background: 'var(--admin-bg-elevated)' }}>
                  <h4 style={{ margin: '0 0 8px' }}>{wf.name}</h4>
                  <p style={{ color: 'var(--admin-text-secondary)', fontSize: '13px', margin: 0 }}>{wf.description || 'No description'}</p>
                  <div style={{ marginTop: '8px' }}>
                    <span className="statusTag active">Active</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
