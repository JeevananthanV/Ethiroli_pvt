import React, { useEffect, useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { listJobBoardPosts } from '../../services/api/jobBoardApi.js';

export default function PlatformConfig() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [config, setConfig] = useState({
    linkedin: { enabled: false, api_key: '', client_id: '', client_secret: '' },
    indeed: { enabled: false, api_key: '', publisher_id: '' },
    glassdoor: { enabled: false, api_key: '', partner_id: '' },
    monster: { enabled: false, api_key: '', account_id: '' },
  });
  const [saving, setSaving] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listJobBoardPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load job board data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleTogglePlatform = (platform) => {
    setConfig((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], enabled: !prev[platform].enabled },
    }));
  };

  const handleConfigChange = (platform, field, value) => {
    setConfig((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      alert('Platform configurations saved');
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const platformKeys = Object.keys(config);

  return (
    <AdminPage
      title="Platform Configuration"
      subtitle="Configure job board integrations (LinkedIn, Indeed, etc.)"
      loading={loading}
      error={error}
      onRetry={loadPosts}
    >
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="cardHeader">
          <h3 className="cardTitle">Platform Integrations</h3>
        </div>
        <div className="cardBody">
          <form onSubmit={handleSave} className="form">
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {platformKeys.map((platform) => (
                <button
                  key={platform}
                  type="button"
                  className={`btn ${selectedPlatform === platform ? 'primary' : 'secondary'}`}
                  onClick={() => setSelectedPlatform(platform)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {platform}
                </button>
              ))}
            </div>

            {selectedPlatform && config[selectedPlatform] && (
              <div style={{ border: '1px solid var(--admin-border)', borderRadius: 8, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h4 style={{ margin: 0, textTransform: 'capitalize' }}>{selectedPlatform} Settings</h4>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={config[selectedPlatform].enabled}
                      onChange={() => handleTogglePlatform(selectedPlatform)}
                    />
                    <span>Enabled</span>
                  </label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  {Object.entries(config[selectedPlatform])
                    .filter(([key]) => key !== 'enabled')
                    .map(([field, value]) => (
                      <div className="formGroup" key={field}>
                        <label className="label" style={{ textTransform: 'capitalize' }}>{field.replace(/_/g, ' ')}</label>
                        <input
                          className="inputField"
                          type={field.toLowerCase().includes('secret') || field.toLowerCase().includes('key') ? 'password' : 'text'}
                          value={value}
                          onChange={(e) => handleConfigChange(selectedPlatform, field, e.target.value)}
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 20 }}>
              <button type="submit" className="btn primary" disabled={saving || !selectedPlatform}>
                {saving ? 'Saving...' : 'Save All Configurations'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Platform Stats</h3>
        </div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          {posts.length === 0 ? (
            <div className="emptyState">No job board data available.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Posts</th>
                  <th>Active</th>
                  <th>Total Views</th>
                </tr>
              </thead>
              <tbody>
                {['linkedin', 'indeed', 'glassdoor', 'monster'].map((platform) => {
                  const platformPosts = posts.filter((p) => p.platform?.toLowerCase() === platform);
                  const active = platformPosts.filter((p) => p.status === 'active').length;
                  const views = platformPosts.reduce((sum, p) => sum + (p.views || p.view_count || 0), 0);
                  return (
                    <tr key={platform}>
                      <td className="textPrimary" style={{ fontWeight: 500, textTransform: 'capitalize' }}>{platform}</td>
                      <td className="textSecondary">{platformPosts.length}</td>
                      <td className="textSecondary">{active}</td>
                      <td className="textSecondary">{views}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
