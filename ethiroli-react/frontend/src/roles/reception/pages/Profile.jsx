import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { useAuth } from '../../../common/hooks/useAuth.js';

export default function ReceptionProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.full_name || 'Kavitha Ramasamy',
    staff_id: 'REC-STAFF-02',
    email: user?.email || 'reception@ethiroli.org',
    phone: '+91 98401 99887',
    terminal_id: 'DESK-01-MAIN-LOBBY',
    intercom_ext: '100',
    shift: 'General Day Shift (08:30 AM - 05:30 PM)',
    handover_notes: 'VIP guest Mr. Suresh (Infosys) scheduled at 10:30 AM. Badge VIP-01 pre-assigned. 3 candidate inquiries pending WhatsApp brochure dispatch.'
  });

  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    }, 600);
  };

  return (
    <AdminPage
      title="Front Desk Officer Profile & Terminal Settings"
      subtitle="Shift schedule information, front desk terminal configurations, shift handover notes, and emergency speed dials"
    >
      <div className="row g-4">
        {/* Left Column: Officer Identity & Station */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white text-center mb-4">
            <div className="rounded-circle bg-primary bg-gradient text-white mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold fs-2" style={{ width: '80px', height: '80px' }}>
              {profile.name.charAt(0)}
            </div>
            <h5 className="fw-bold text-dark mb-1">{profile.name}</h5>
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1 mb-2">
              Front Desk & Reception Officer
            </span>
            <p className="small text-muted mb-3 font-monospace">{profile.staff_id} &bull; Terminal: {profile.terminal_id}</p>
            <div className="p-3 bg-light rounded-3 text-start small">
              <div className="mb-2"><strong>Intercom:</strong> Ext {profile.intercom_ext}</div>
              <div className="mb-2"><strong>Email:</strong> {profile.email}</div>
              <div><strong>Shift:</strong> {profile.shift}</div>
            </div>
          </div>

          {/* Emergency Hotlines */}
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <h6 className="fw-bold text-dark mb-3">
              <i className="bi bi-shield-fill-exclamation text-danger me-2"></i>Campus Emergency Speed Dials
            </h6>
            <div className="d-flex flex-column gap-2 small">
              <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded-2">
                <span><i className="bi bi-shield-lock me-2 text-primary"></i>Main Campus Security</span>
                <span className="badge bg-dark font-monospace">Ext 199</span>
              </div>
              <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded-2">
                <span><i className="bi bi-wrench me-2 text-warning"></i>Facilities & Maintenance</span>
                <span className="badge bg-dark font-monospace">Ext 105</span>
              </div>
              <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded-2">
                <span><i className="bi bi-heart-pulse me-2 text-danger"></i>First Aid & Medical Station</span>
                <span className="badge bg-dark font-monospace">Ext 108</span>
              </div>
              <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded-2">
                <span><i className="bi bi-pc-display me-2 text-info"></i>IT Systems & Turnstiles</span>
                <span className="badge bg-dark font-monospace">Ext 204</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Handover */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <h5 className="fw-bold text-dark mb-3">Front Desk Workstation Details</h5>

            {savedMsg && (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-check-circle-fill"></i>
                <span>Workstation information and shift handover notes updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Officer Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Contact Mobile Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Official Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Front Desk Intercom Extension</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.intercom_ext}
                    onChange={(e) => setProfile({ ...profile, intercom_ext: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Assigned Shift Schedule</label>
                  <select
                    className="form-select"
                    value={profile.shift}
                    onChange={(e) => setProfile({ ...profile, shift: e.target.value })}
                  >
                    <option value="Morning Shift (07:30 AM - 03:30 PM)">Morning Shift (07:30 AM - 03:30 PM)</option>
                    <option value="General Day Shift (08:30 AM - 05:30 PM)">General Day Shift (08:30 AM - 05:30 PM)</option>
                    <option value="Evening / Late Shift (11:30 AM - 08:30 PM)">Evening / Late Shift (11:30 AM - 08:30 PM)</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Shift Handover Log & Briefing Notes</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={profile.handover_notes}
                    onChange={(e) => setProfile({ ...profile, handover_notes: e.target.value })}
                    placeholder="Notes for the next receptionist (e.g. pending courier pickup, VIP visitor arriving later, pending callbacks)..."
                  ></textarea>
                  <small className="text-muted">These notes are visible to the incoming front desk officer upon shift rotation.</small>
                </div>
              </div>

              <div className="border-top pt-3 mt-4 text-end">
                <button type="submit" className="btn btn-primary px-4 shadow-sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Handover & Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
