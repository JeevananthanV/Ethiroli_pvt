import React, { useEffect, useState } from 'react';
import { getTemplates } from '../../../../services/api/templateApi.js';

export default function TemplateLibrary() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getTemplates().catch(() => []);
        setTemplates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load templates:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading templates...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Template Library</h2>
          <p className="pageSubtitle">Pre-built message templates</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {templates.length === 0 ? (
            <div className="emptyState"><h3>No Templates</h3><p>No templates found.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Name</th><th>Subject</th></tr></thead>
              <tbody>
                {templates.map((t) => (
                  <tr key={t.id}>
                    <td>{t.name}</td>
                    <td>{t.subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
