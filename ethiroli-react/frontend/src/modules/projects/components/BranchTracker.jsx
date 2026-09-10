import React, { useState, useEffect, useCallback } from 'react';
import { getBranches, getBranchDetails } from '../../services/api/projectApi';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../common/components/Button/Button.jsx';

const BranchTracker = ({ projectId }) => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const loadBranches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBranches(projectId);
      setBranches(data.branches || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadBranches();
  }, [projectId, loadBranches]);

  const handleViewDetails = async (branch) => {
    setDetailsLoading(true);
    setSelectedBranch(branch);
    try {
      const data = await getBranchDetails(projectId, branch.id);
      setDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (!status) return 'pending';
    const lower = status.toLowerCase();
    if (lower === 'merged' || lower === 'deployed' || lower === 'success') return 'active';
    if (lower === 'open' || lower === 'pending') return 'pending';
    if (lower === 'failed' || lower === 'error') return 'error';
    return 'pending';
  };

  if (loading) return <div className="loading">Loading branches...</div>;
  if (error) return <div className="emptyState"><h3>Error</h3><p>{error}</p><button className="btn primary" onClick={loadBranches}>Retry</button></div>;

  return (
    <AdminPage
      title="Branch Tracker"
      subtitle="Track git branches and deployment status"
      loading={loading}
      error={error}
      onRetry={loadBranches}
      actions={<button className="btn primary" onClick={loadBranches}>Refresh</button>}
    >
      <div className="dashboardGrid" style={{ marginBottom: '24px' }}>
        <div className="statCard">
          <p className="statLabel">Total Branches</p>
          <h3 className="statValue">{branches.length || 0}</h3>
        </div>
        <div className="statCard">
          <p className="statLabel">Merged</p>
          <h3 className="statValue textSuccess">{branches.filter(b => b.status?.toLowerCase() === 'merged').length || 0}</h3>
        </div>
        <div className="statCard">
          <p className="statLabel">Open</p>
          <h3 className="statValue textWarning">{branches.filter(b => b.status?.toLowerCase() === 'open').length || 0}</h3>
        </div>
        <div className="statCard">
          <p className="statLabel">Deployed</p>
          <h3 className="statValue textInfo">{branches.filter(b => b.deployed).length || 0}</h3>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Branches</h3>
        </div>
        <div className="cardBody">
          {branches.length === 0 ? (
            <div className="emptyState">
              <h3>No branches found</h3>
              <p>No branch information available.</p>
            </div>
          ) : (
            <div className="overflowAuto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Branch Name</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Last Commit</th>
                    <th>Deployed</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((branch) => (
                    <tr key={branch.id || branch.name}>
                      <td className="textPrimary">{branch.name}</td>
                      <td className="textSecondary">{branch.author || '-'}</td>
                      <td>
                        <span className={`statusTag ${getStatusClass(branch.status)}`}>
                          {branch.status || 'Open'}
                        </span>
                      </td>
                      <td className="textSecondary">{branch.lastCommit ? new Date(branch.lastCommit).toLocaleDateString() : '-'}</td>
                      <td className="textSecondary">{branch.deployed ? 'Yes' : 'No'}</td>
                      <td>
                        <button className="btn btnSm secondary" onClick={() => handleViewDetails(branch)}>Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedBranch && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Branch Details: {selectedBranch.name}</h3>
          </div>
          <div className="cardBody">
            {detailsLoading ? (
              <div className="loading">Loading details...</div>
            ) : details ? (
              <div>
                <div className="formGroup">
                  <label className="label">Commit Message</label>
                  <p className="textSecondary">{details.commitMessage || details.message || 'No message'}</p>
                </div>
                <div className="formGroup" style={{ marginTop: '12px' }}>
                  <label className="label">Commit Hash</label>
                  <p className="textSecondary">{details.commitHash || details.hash || '-'}</p>
                </div>
                <div className="formGroup" style={{ marginTop: '12px' }}>
                  <label className="label">Deployment Status</label>
                  <span className={`statusTag ${getStatusClass(details.deploymentStatus)}`}>
                    {details.deploymentStatus || 'Not Deployed'}
                  </span>
                </div>
                <div className="formGroup" style={{ marginTop: '12px' }}>
                  <label className="label">Deployment URL</label>
                  <p className="textSecondary">{details.deploymentUrl || '-'}</p>
                </div>
              </div>
            ) : (
              <p className="textSecondary">No details available.</p>
            )}
          </div>
        </div>
      )}
    </AdminPage>
  );
};

export default BranchTracker;
