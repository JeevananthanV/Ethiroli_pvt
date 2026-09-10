import React, { useState, useEffect } from 'react';
import { getMindMapNodes, createMindMapNode, updateMindMapNode, deleteMindMapNode } from '../../services/api/mindMapApi';
import Modal from '../../common/components/Modal/Modal.jsx';
import Input from '../../common/components/Input/Input.jsx';
import Button from '../../common/components/Button/Button.jsx';

const MindMapEditor = () => {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    loadNodes();
  }, []);

  const loadNodes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMindMapNodes();
      setNodes(data.nodes || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNode = () => {
    setSelectedNode(null);
    setFormData({ title: '', content: '' });
    setShowModal(true);
  };

  const handleEditNode = (node) => {
    setSelectedNode(node);
    setFormData({ title: node.title || '', content: node.content || '' });
    setShowModal(true);
  };

  const handleSaveNode = async (e) => {
    e.preventDefault();
    try {
      if (selectedNode) {
        const updated = await updateMindMapNode(selectedNode.id, formData);
        setNodes(nodes.map(n => n.id === selectedNode.id ? updated : n));
      } else {
        const created = await createMindMapNode(formData);
        setNodes([...nodes, created]);
      }
      setShowModal(false);
      setFormData({ title: '', content: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteNode = async (nodeId) => {
    if (!window.confirm('Are you sure you want to delete this node?')) return;
    try {
      await deleteMindMapNode(nodeId);
      setNodes(nodes.filter(n => n.id !== nodeId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading mind map...</div>;
  if (error) return <div className="emptyState"><h3>Error</h3><p>{error}</p><button className="btn primary" onClick={loadNodes}>Retry</button></div>;

  return (
    <div className="card">
      <div className="cardHeader">
        <h3 className="cardTitle">Mind Map Editor</h3>
        <div className="pageActions">
          <button className="btn secondary" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>Zoom Out</button>
          <button className="btn secondary" onClick={() => setZoom(z => Math.min(2, z + 0.1))}>Zoom In</button>
          <button className="btn primary" onClick={handleAddNode}>Add Node</button>
        </div>
      </div>
      <div className="cardBody">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.2s' }}>
          {nodes.length === 0 ? (
            <div className="emptyState">
              <h3>No nodes yet</h3>
              <p>Add your first mind map node to get started.</p>
            </div>
          ) : (
            <div style={{ position: 'relative', minHeight: '400px', overflow: 'auto' }}>
              {nodes.map((node, index) => (
                <div
                  key={node.id}
                  className="card"
                  style={{
                    position: 'absolute',
                    left: `${(index % 4) * 220 + 20}px`,
                    top: `${Math.floor(index / 4) * 120 + 20}px`,
                    cursor: 'pointer',
                    minWidth: '180px'
                  }}
                  onClick={() => handleEditNode(node)}
                >
                  <div className="cardTitle">{node.title || 'Untitled Node'}</div>
                  <div className="cardBody">{node.content || 'No content'}</div>
                  <div className="pageActions" style={{ marginTop: '8px' }}>
                    <button className="btn btnSm secondary" onClick={(e) => { e.stopPropagation(); handleEditNode(node); }}>Edit</button>
                    <button className="btn btnSm danger" onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id); }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={selectedNode ? 'Edit Node' : 'Add Node'}
        >
          <form onSubmit={handleSaveNode}>
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <div className="formGroup" style={{ marginTop: '12px' }}>
              <label className="label">Content</label>
              <textarea
                className="textarea"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
              />
            </div>
            <div className="pageActions" style={{ marginTop: '16px' }}>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MindMapEditor;
