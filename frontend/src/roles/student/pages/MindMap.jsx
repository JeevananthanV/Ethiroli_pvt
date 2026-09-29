import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getMindMapNodes } from '../../../services/api/mindMapApi.js';

const TYPE_LABELS = {
  ROOT: 'Topic',
  BRANCH: 'Branch',
  LEAF: 'Detail',
  IDEA: 'Idea',
  RESOURCE: 'Resource',
  TASK: 'Task'
};

const labelFor = (type) => TYPE_LABELS[String(type || '').toUpperCase()] || 'Node';

/**
 * Visual MindMap - renders the shared curriculum mind map (mindmap_nodes) as a
 * nested pathway so learners can see course topics and their prerequisites.
 */
export default function StudentMindMap() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  const fetchNodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMindMapNodes({ limit: 500 });
      setNodes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load the mind map');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);

  // parent_id -> children, so the flat table becomes a tree.
  const { roots, childrenOf, total } = useMemo(() => {
    const byParent = {};
    const ids = new Set();
    nodes.forEach((node) => {
      ids.add(node.id);
      const key = node.parent_id || '__root__';
      (byParent[key] = byParent[key] || []).push(node);
    });
    // A parent that is not in the result set (pagination) is treated as a root.
    const rootList = byParent.__root__ || [];
    const dangling = nodes.filter(
      (node) => node.parent_id && !ids.has(node.parent_id) && !(rootList.some((r) => r.id === node.id))
    );
    return {
      roots: [...rootList, ...dangling],
      childrenOf: (id) => byParent[id] || [],
      total: nodes.length
    };
  }, [nodes]);

  // Open the first two levels by default so the map is readable on load.
  useEffect(() => {
    if (roots.length === 0) return;
    const initial = {};
    roots.forEach((node) => {
      initial[node.id] = true;
      childrenOf(node.id).forEach((child) => { initial[child.id] = true; });
    });
    setExpanded(initial);
  }, [roots, childrenOf]);

  const renderNode = (node, depth) => {
    const children = childrenOf(node.id);
    const isOpen = expanded[node.id] !== false;
    const color = node.color || 'var(--admin-primary)';

    return (
      <div key={node.id} style={{ marginLeft: depth === 0 ? 0 : 22, marginTop: 10 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '10px 14px',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid var(--admin-border-subtle)`,
            borderLeft: `4px solid ${color}`
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 2 }}>
            {children.length > 0 && (
              <button
                onClick={() => setExpanded((prev) => ({ ...prev, [node.id]: !isOpen }))}
                aria-label={isOpen ? 'Collapse' : 'Expand'}
                style={{ background: 'none', border: 0, color: 'var(--admin-text-muted)', cursor: 'pointer', fontSize: 11, padding: 0, lineHeight: 1 }}
              >
                {isOpen ? '▾' : '▸'}
              </button>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {node.icon && <span>{node.icon}</span>}
              <strong style={{ fontSize: depth === 0 ? 15 : 14 }}>{node.title}</strong>
              <span
                style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '2px 7px',
                  borderRadius: 20,
                  background: 'rgba(129,158,53,0.14)',
                  color: 'var(--admin-primary)'
                }}
              >
                {labelFor(node.node_type)}
              </span>
              {children.length > 0 && (
                <span style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>
                  {children.length} sub-topic{children.length === 1 ? '' : 's'}
                </span>
              )}
            </div>
            {node.content && (
              <p style={{ margin: '6px 0 0 0', fontSize: 13, color: 'var(--admin-text-secondary)' }}>
                {node.content}
              </p>
            )}
          </div>
        </div>

        {isOpen && children.length > 0 && children.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <AdminPage
      title="Visual MindMap"
      subtitle="Interactive course pathways and prerequisites"
      loading={loading}
      error={error}
      onRetry={fetchNodes}
    >
      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Visual MindMap Syllabus</h3>
          <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
            {total} node{total === 1 ? '' : 's'}
          </span>
        </div>
        <div className="cardBody">
          {roots.length === 0 ? (
            <div className="emptyState">
              <h3>No mind map published yet</h3>
              <p>Your tutor has not published a course pathway for this account yet.</p>
            </div>
          ) : (
            <div>{roots.map((node) => renderNode(node, 0))}</div>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
