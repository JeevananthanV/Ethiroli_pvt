import React, { useEffect, useState } from 'react';
import { getSalaryStructures, createSalaryStructure } from '../../../../services/api/payrollApi.js';

export default function SalaryStructureForm() {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ role: '', basic: '', allowances: '' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getSalaryStructures().catch(() => []);
        setStructures(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load salary structures:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSalaryStructure({ ...form, basic: Number(form.basic), allowances: Number(form.allowances) });
      setShowForm(false);
      setForm({ role: '', basic: '', allowances: '' });
    } catch (err) {
      console.error('Failed to create salary structure:', err);
    }
  };

  if (loading) return <div className="loading">Loading salary structures...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Salary Structures</h2>
          <p className="pageSubtitle">Configure employee salary structures</p>
        </div>
        <div className="pageActions">
          <button onClick={() => setShowForm(true)} className="btn btnPrimary">+ Add Structure</button>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {structures.length === 0 ? (
            <div className="emptyState"><h3>No Structures</h3><p>No salary structures configured.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Role</th><th>Basic</th><th>Allowances</th><th>Total</th></tr></thead>
              <tbody>
                {structures.map((struct) => (
                  <tr key={struct.id}>
                    <td>{struct.role}</td>
                    <td>${(struct.basic || 0).toLocaleString()}</td>
                    <td>${(struct.allowances || 0).toLocaleString()}</td>
                    <td>${((struct.basic || 0) + (struct.allowances || 0)).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {showForm && (
        <div className="modalOverlay" onClick={() => setShowForm(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>Add Salary Structure</h3>
            <form onSubmit={handleSubmit}>
              <div className="formGroup">
                <label className="label">Role</label>
                <input className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Basic Salary</label>
                <input className="input" type="number" value={form.basic} onChange={(e) => setForm({ ...form, basic: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Allowances</label>
                <input className="input" type="number" value={form.allowances} onChange={(e) => setForm({ ...form, allowances: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn">Cancel</button>
                <button type="submit" className="btn btnPrimary">Save Structure</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
