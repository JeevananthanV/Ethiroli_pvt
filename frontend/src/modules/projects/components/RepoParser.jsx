import React, { useState, useEffect } from 'react';
import { getRepos, getRepoDetails, parseRepo, getRepoMetrics } from '../../services/api/projectApi';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../common/components/Button/Button.jsx';

const RepoParser = ({ repoId }) => {
  const [repos, setRepos] = useState([]);
  const [details, setDetails] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parsing, setParsing] = useState(false);

  useEffect(() => {
    loadRepos();
  }, []);

  useEffect(() => {
    if (repoId) {
      loadRepoDetails(repoId);
    }
  }, [repoId]);

  const loadRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRepos();
      setRepos(data.repos || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRepoDetails = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const [detailsData, metricsData] = await Promise.all([
        getRepoDetails(id),
        getRepoMetrics(id)
      ]);
      setDetails(detailsData);
      setMetrics(metricsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleParse = async () => {
    if (!repoId) return;
    setParsing(true);
    setError(null);
    try {
      const result = await parseRepo(repoId);
      setDetails(result);
      alert('Repository parsed successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setParsing(false);
    }
  };

  if (loading) return <div className="loading">Loading repositories...</div>;
  if (error) return <div className="emptyState"><h3>Error</h3><p>{error}</p><button className="btn primary" onClick={loadRepos}>Retry</button></div>;

  if (repoId && details) {
    return (
      <AdminPage
        title="Repository Analysis"
        subtitle="Repository structure and metrics"
        loading={loading}
        error={error}
        onRetry={() => loadRepoDetails(repoId)}
        actions={<button className="btn primary" onClick={handleParse} disabled={parsing}>{parsing ? 'Parsing...' : 'Re-parse'}</button>}
      >
        <div className="dashboardGrid" style={{ marginBottom: '24px' }}>
          <div className="statCard">
            <p className="statLabel">Total Files</p>
            <h3 className="statValue">{metrics?.totalFiles || details?.fileCount || 'N/A'}</h3>
          </div>
          <div className="statCard">
            <p className="statLabel">Lines of Code</p>
            <h3 className="statValue">{metrics?.linesOfCode || details?.loc || 'N/A'}</h3>
          </div>
          <div className="statCard">
            <p className="statLabel">Languages</p>
            <h3 className="statValue">{metrics?.languages?.length || details?.languages?.length || 'N/A'}</h3>
          </div>
          <div className="statCard">
            <p className="statLabel">Tech Stack</p>
            <h3 className="statValue textSecondary">{metrics?.techStack?.length || details?.techStack?.length || 'N/A'}</h3>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="cardHeader">
            <h3 className="cardTitle">File Structure</h3>
          </div>
          <div className="cardBody">
            {details?.fileStructure ? (
              <pre className="textSecondary" style={{ background: 'var(--admin-bg-input)', padding: '16px', borderRadius: '8px', overflow: 'auto', maxHeight: '400px' }}>
                {JSON.stringify(details.fileStructure, null, 2)}
              </pre>
            ) : (
              <p className="textSecondary">No file structure available.</p>
            )}
          </div>
        </div>

        {metrics?.languages && metrics.languages.length > 0 && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="cardHeader">
              <h3 className="cardTitle">Languages</h3>
            </div>
            <div className="cardBody">
              <div className="overflowAuto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Language</th>
                      <th>Files</th>
                      <th>Lines</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.languages.map((lang, idx) => (
                      <tr key={idx}>
                        <td className="textPrimary">{lang.name || lang.language}</td>
                        <td className="textSecondary">{lang.files || 0}</td>
                        <td className="textSecondary">{lang.lines || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </AdminPage>
    );
  }

  return (
    <AdminPage
      title="Repository Parser"
      subtitle="Analyze repository structure and metrics"
      loading={loading}
      error={error}
      onRetry={loadRepos}
      actions={<button className="btn primary" onClick={loadRepos}>Refresh</button>}
    >
      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Repositories</h3>
        </div>
        <div className="cardBody">
          {repos.length === 0 ? (
            <div className="emptyState">
              <h3>No repositories found</h3>
              <p>No repositories available for analysis.</p>
            </div>
          ) : (
            <div className="overflowAuto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>URL</th>
                    <th>Language</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {repos.map((repo) => (
                    <tr key={repo.id}>
                      <td className="textPrimary">{repo.name}</td>
                      <td className="textSecondary">{repo.url || '-'}</td>
                      <td className="textSecondary">{repo.language || '-'}</td>
                      <td className="textSecondary">{repo.lastUpdated ? new Date(repo.lastUpdated).toLocaleDateString() : '-'}</td>
                      <td>
                        <button className="btn btnSm secondary" onClick={() => loadRepoDetails(repo.id)}>Analyze</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminPage>
  );
};

export default RepoParser;
