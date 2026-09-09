import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function AssignmentSubmit() {
  const [form, setForm] = useState({ assignment_id: '', text: '', file: null });
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    setForm({ assignment_id: '', text: '', file: null });
  };

  return (
    <AdminPage title="Submit Assignment" subtitle="Upload or type your submission">
      <div className="card" style={{ maxWidth: 700 }}>
        <div className="cardHeader"><h3 className="cardTitle">New Submission</h3></div>
        <form onSubmit={submit} className="form">
          <div className="formGroup">
            <label className="label">Assignment ID</label>
            <input className="inputField" value={form.assignment_id} onChange={(e) => setForm({ ...form, assignment_id: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Text</label>
            <textarea className="textarea" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={4} />
          </div>
          <div className="formGroup">
            <label className="label">File</label>
            <input type="file" onChange={(e) => setForm({ ...form, file: e.target.files[0] })} />
          </div>
          <button type="submit" className="btn primary" disabled={submitted}>{submitted ? 'Submitted' : 'Submit'}</button>
        </form>
      </div>
    </AdminPage>
  );
}
