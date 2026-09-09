import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Input from '../../../common/components/Input/Input.jsx';

export default function ModuleEditor() {
  const [modules, setModules] = useState([]);
  const [newTitle, setNewTitle] = useState('');

  const addModule = () => {
    if (!newTitle.trim()) return;
    setModules([...modules, { title: newTitle, lessons: [] }]);
    setNewTitle('');
  };

  return (
    <AdminPage title="Module Editor" subtitle="Organize course modules and lessons">
      <div className="card" style={{ maxWidth: 700 }}>
        <div className="cardHeader"><h3 className="cardTitle">Modules</h3></div>
        <div className="cardBody">
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Module title" />
            <button type="button" className="btn primary" onClick={addModule}>Add</button>
          </div>
          {modules.length === 0 ? <p className="textSecondary">No modules yet.</p> : (
            <div className="overflowAuto">
              <table className="table">
                <thead><tr><th>#</th><th>Title</th><th>Lessons</th></tr></thead>
                <tbody>
                  {modules.map((m, idx) => (
                    <tr key={idx}>
                      <td className="textSecondary">{idx + 1}</td>
                      <td className="textPrimary" style={{ fontWeight: 500 }}>{m.title}</td>
                      <td className="textSecondary">{m.lessons.length}</td>
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
}
