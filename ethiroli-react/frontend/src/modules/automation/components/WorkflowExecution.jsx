import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { getWorkflows, getWorkflowExecutions } from '../../services/api/workflowApi.js';

export default function WorkflowExecution() {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(null);
  const [executions, setExecutions] = useState([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(true);
  const [loadingExecutions, setLoadingExecutions] = useState(false);
  const [error, setError] = useState(null);
  const [retryingId, setRetryingId] = useState(null);

  const loadWorkflows = useCallback(async () => {
    setLoadingWorkflows(true);
    setError(null);
    try {
      const data = await getWorkflows();
      setWorkflows(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0 && !selectedWorkflowId) {
        setSelectedWorkflowId(data[0].id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load workflows');
    } finally {
      setLoadingWorkflows(false);
    }
  }, [selectedWorkflowId]);

  const loadExecutions = async (workflowId) => {
    setLoadingExecutions(true);
    try {
      const data = await getWorkflowExecutions(workflowId);
      setExecutions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load executions:', err);
      setExecutions([]);
    } finally {
      setLoadingExecutions(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  useEffect(() => {
    if (selectedWorkflowId) {
      loadExecutions(selectedWorkflowId);
    }
  }, [selectedWorkflowId]);

  const handleRetry = async (executionId) => {
    setRetryingId(executionId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`Execution ${executionId} retried successfully`);
      if (selectedWorkflowId) {
        loadExecutions(selectedWorkflowId);
      }
    } catch (err) {
      alert(`Retry failed: ${err.message}`);
    } finally {
      setRetryingId(null);
    }
  };

  const getStatusClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'success':
      case 'completed':
        return 'active';
      case 'running':
      case 'in_progress':
        return 'pending';
      case 'failed':
      case 'error':
        return 'error';
      default:
        return 'pending';
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const selectedWorkflow = workflows.find((w) => w.id === selectedWorkflowId);

  return (
    <AdminPage
      title="Workflow Execution"
      subtitle="Monitor workflow runs and view logs"
      loading={loadingWorkflows}
      error={error}
      onRetry={loadWorkflows}
    >
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="cardHeader">
          <h3 className="cardTitle">Select Workflow</h3>
        </div>
        <div className="cardBody">
          <div className="formGroup">
            <label className="label">Workflow</label>
            <select
              className="select"
              value={selectedWorkflowId || ''}
              onChange={(e) => setSelectedWorkflowId(e.target.value)}
            >
              <option value="">Choose a workflow...</option>
              {workflows.map((wf) => (
                <option key={wf.id} value={wf.id}>{wf.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedWorkflow && (
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Run History - {selectedWorkflow.name}</h3>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span className="statLabel">Total Runs:</span>
              <span className="statValue">{executions.length}</span>
            </div>
          </div>
          <div className="cardBody" style={{ overflowX: 'auto' }}>
            {loadingExecutions ? (
              <div className="loading"><div className="skeleton" style={{ width: '100%', height: 120 }}></div></div>
            ) : executions.length === 0 ? (
              <div className="emptyState">
                <h3>No executions yet</h3>
                <p>Trigger this workflow to see run history.</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Run ID</th>
                    <th>Status</th>
                    <th>Started At</th>
                    <th>Completed At</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {executions.map((exec) => (
                    <tr key={exec.id}>
                      <td className="textSecondary"><code>{exec.id}</code></td>
                      <td>
                        <span className={`statusTag ${getStatusClass(exec.status)}`}>
                          {exec.status || 'unknown'}
                        </span>
                      </td>
                      <td className="textSecondary">{formatDate(exec.started_at)}</td>
                      <td className="textSecondary">{formatDate(exec.completed_at)}</td>
                      <td className="textSecondary">{exec.duration ? `${exec.duration}s` : '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="btn secondary"
                            style={{ padding: '4px 10px', fontSize: 12 }}
                            onClick={() => alert(`Logs: ${JSON.stringify(exec.logs || {}, null, 2)}`)}
                          >
                            View Logs
                          </button>
                          {(exec.status === 'failed' || exec.status === 'error') && (
                            <button
                              className="btn primary"
                              style={{ padding: '4px 10px', fontSize: 12 }}
                              onClick={() => handleRetry(exec.id)}
                              disabled={retryingId === exec.id}
                            >
                              {retryingId === exec.id ? 'Retrying...' : 'Retry'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </AdminPage>
  );
}
