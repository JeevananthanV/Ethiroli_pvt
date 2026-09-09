import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function MindMapEditor() {
  const [nodes, setNodes] = useState([{ id: 1, x: 200, y: 150, text: 'Central Topic' }]);
  const [selected, setSelected] = useState(null);

  const addNode = () => {
    setNodes([...nodes, { id: Date.now(), x: 120, y: 120, text: 'New Node' }]);
  };

  return (
    <AdminPage title="Mind Map Editor" subtitle="Visual idea mapping">
      <div className="card">
        <div className="cardHeader"><h3 className="cardTitle">Canvas</h3></div>
        <div className="cardBody">
          <div style={{ position: 'relative', height: 400, border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 8 }}>
            {nodes.map((node) => (
              <div key={node.id} onClick={() => setSelected(node.id)} style={{ position: 'absolute', left: node.x, top: node.y, padding: '8px 12px', borderRadius: 8, background: selected === node.id ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}>
                {node.text}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
            <button type="button" className="btn primary" onClick={addNode}>Add Node</button>
            <button type="button" className="btn secondary" onClick={() => setNodes([])}>Clear</button>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
