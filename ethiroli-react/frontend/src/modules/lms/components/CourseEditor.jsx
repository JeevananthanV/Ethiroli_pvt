import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Input from '../../../common/components/Input/Input.jsx';

export default function CourseEditor() {
  const [course, setCourse] = useState({ title: '', description: '', level: 'beginner' });
  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState('');

  const addModule = () => {
    if (!newModule.trim()) return;
    setModules([...modules, { title: newModule, lessons: [] }]);
    setNewModule('');
  };

  return (
    <AdminPage title="Course Editor" subtitle="Create and edit courses">
      <div style={{ display: 'grid', gap: 20 }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Course Details</h3></div>
          <div className="cardBody">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="formGroup">
                <label className="label">Title</label>
                <Input value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Level</label>
                <select className="select" value={course.level} onChange={(e) => setCourse({ ...course, level: e.target.value })}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="formGroup" style={{ gridColumn: '1 / -1' }}>
                <label className="label">Description</label>
                <textarea className="textarea" value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} rows={3} />
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Modules</h3></div>
          <div className="cardBody">
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <input className="inputField" value={newModule} onChange={(e) => setNewModule(e.target.value)} placeholder="Module title" />
              <button type="button" className="btn primary" onClick={addModule}>Add Module</button>
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
      </div>
    </AdminPage>
  );
}
