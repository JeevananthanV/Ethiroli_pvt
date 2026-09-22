import React, { useEffect, useState } from 'react';
import { getMindMapNodes } from '../../../../services/api/mindMapApi.js';

export default function MindMapEditor() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getMindMapNodes().catch(() => []);
        setNodes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load nodes:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading mind map...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Knowledge Mind Map</h2>
          <p className="pageSubtitle">Interactive knowledge planning board</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {nodes.length === 0 ? (
            <div className="emptyState"><h3>No Nodes</h3><p>Create mind map nodes to get started.</p></div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {nodes.map((node) => (
                <div key={node.id} style={{ padding: '12px', border: '1px solid var(--admin-border-subtle)', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 4px' }}>{node.title}</h4>
                  <p style={{ margin: 0, color: 'var(--admin-text-secondary)', fontSize: '13px' }}>{node.description || 'No description'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
