import React, { useEffect, useState } from 'react';
import { getApiKeys } from '../api/apiKeyApi.js';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function ApiPlayground() {
  const [requestMethod, setRequestMethod] = useState('GET');
  const [requestUrl, setRequestUrl] = useState('/v1/leads');
  const [requestBody, setRequestBody] = useState('{}');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [selectedApiKey, setSelectedApiKey] = useState('');

  useEffect(() => {
    getApiKeys().then((data) => {
      setApiKeys(Array.isArray(data) ? data : []);
    }).catch(() => {});
  }, []);

  const handleSendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const options = {
        method: requestMethod,
        headers: {
          'Content-Type': 'application/json',
          ...(selectedApiKey && { Authorization: `Bearer ${selectedApiKey}` }),
        },
      };
      if (requestMethod !== 'GET' && requestMethod !== 'DELETE') {
        try {
          options.body = JSON.stringify(JSON.parse(requestBody));
        } catch {
          options.body = requestBody;
        }
      }
      const res = await fetch(requestUrl, options);
      const contentType = res.headers.get('content-type');
      const data = contentType && contentType.includes('application/json') ? await res.json() : await res.text();
      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data,
      });
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPage
      title="API Playground"
      subtitle="Test API endpoints directly from the admin panel"
      loading={false}
      error={null}
      onRetry={() => {}}
      actions={
        <select
          className="select"
          value={selectedApiKey}
          onChange={(e) => setSelectedApiKey(e.target.value)}
          style={{ width: 200 }}
        >
          <option value="">No Auth</option>
          {apiKeys.map((key) => (
            <option key={key.id} value={key.key}>{key.name}</option>
          ))}
        </select>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Request</h3></div>
          <div className="cardBody">
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <select className="select" value={requestMethod} onChange={(e) => setRequestMethod(e.target.value)} style={{ width: 120 }}>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input
                className="inputField"
                value={requestUrl}
                onChange={(e) => setRequestUrl(e.target.value)}
                placeholder="/v1/endpoint"
                style={{ flex: 1 }}
              />
            </div>
            {(requestMethod === 'POST' || requestMethod === 'PUT' || requestMethod === 'PATCH') && (
              <div className="textareaGroup">
                <label className="label">Request Body (JSON)</label>
                <textarea
                  className="textarea"
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  rows={10}
                />
              </div>
            )}
            <button className="btn primary" onClick={handleSendRequest} disabled={loading} style={{ marginTop: 16 }}>
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </div>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Response</h3></div>
          <div className="cardBody">
            {error && (
              <div style={{ padding: 12, borderRadius: 8, background: 'rgba(244, 63, 94, 0.1)', color: 'var(--admin-danger)', marginBottom: 12 }}>
                {error}
              </div>
            )}
            {response ? (
              <div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <span className={`statusTag ${response.status < 300 ? 'active' : 'error'}`}>{response.status} {response.statusText}</span>
                </div>
                <div className="textareaGroup">
                  <label className="label">Response Body</label>
                  <pre className="textarea" style={{ background: 'var(--admin-bg-input)', padding: 12, borderRadius: 6, overflow: 'auto', maxHeight: 400 }}>
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--admin-text-muted)' }}>Send a request to see the response here.</p>
            )}
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
