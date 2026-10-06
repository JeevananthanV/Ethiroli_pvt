import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import AvatarUploader from '../../../common/components/AvatarUploader/AvatarUploader.jsx';
import { useAuth } from '../../../common/contexts/AuthContext.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';

/**
 * My Employee Profile.
 *
 * Layout follows the approved design: identity card on the left, Contact &
 * Identity beside Employment Details on the right, and Tax & Banking running
 * underneath them.
 *
 * The Employment Details card carries all six rows from the design on purpose -
 * it is what makes the right-hand column tall enough to sit level with the
 * identity card. A trimmed-down card left a block of dead space beneath it.
 *
 * Three of those rows (Employment Type, Reporting Manager, Work Location) have no
 * column on the `employees` table, so they report "Not on record" rather than
 * showing invented values such as "Full-time" or "Salem, Tamil Nadu". HR fills
 * them once the columns exist.
 */

const formatDay = (value) => {
  if (!value) return null;
  const raw = String(value);
  // A MySQL DATE arrives as an ISO timestamp; parsing it directly renders the
  // previous day for anyone west of Greenwich.
  const dateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const d = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(raw);
  return Number.isNaN(d.getTime()) ? raw : d.toLocaleDateString();
};

/** Shows the value, or an honest "not on record" when there isn't one. */
const Value = ({ children }) => {
  const has = children !== null && children !== undefined && children !== '';
  if (!has) return <span className="emp-prof__value emp-prof__value--empty">Not on record</span>;
  return <span className="emp-prof__value">{children}</span>;
};

/**
 * Masked payroll value with a reveal toggle.
 *
 * Masked by default. The employee can reveal their OWN value to check it is
 * correct, but can never edit it - the backend rejects writes to PAN / PF / UAN /
 * bank account with a 403, and this control only changes what is displayed,
 * never what is sent.
 */
const MaskedValue = ({ value, label, revealed, onToggle }) => {
  if (!value) {
    return (
      <span className="emp-prof__value emp-prof__value--empty">
        Not on record
        <i className="bi bi-eye-slash ms-2" aria-hidden="true"></i>
      </span>
    );
  }
  return (
    <span className="emp-prof__value emp-prof__value--masked">
      {revealed ? String(value) : `••••••••${String(value).slice(-4)}`}
      <button
        type="button"
        className="emp-prof__reveal"
        onClick={onToggle}
        aria-pressed={revealed}
        aria-label={revealed ? `Hide ${label}` : `Show full ${label}`}
        title={revealed ? 'Hide' : 'Show full value'}
      >
        <i className={`bi ${revealed ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true"></i>
      </button>
    </span>
  );
};

export default function Profile() {
  const { updateProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Contact details are read-only until Edit is pressed, so a stray click cannot
  // silently start overwriting real values.
  const [editing, setEditing] = useState(false);

  /**
   * Which payroll values the employee has chosen to reveal. Display-only, and
   * masked by default so the numbers are not exposed on a shared screen.
   */
  const [revealed, setRevealed] = useState({});

  const toggleReveal = (key) => setRevealed((r) => ({ ...r, [key]: !r[key] }));
  const hideAll = () => setRevealed({});
  const anyRevealed = Object.values(revealed).some(Boolean);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    avatar_url: ''
  });

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getMyProfile();
      const data = res?.data || res;
      setProfile(data);
      if (data?.user) {
        setFormData({
          full_name: data.user.full_name || '',
          phone: data.user.phone || '',
          avatar_url: data.user.avatar_url || ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load your profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleAvatarChange = async (newAvatar) => {
    setFormData((prev) => ({ ...prev, avatar_url: newAvatar || '' }));
    try {
      await employeePortalApi.updateMyProfile({ avatar_url: newAvatar || '' });
      updateProfile({ avatar_url: newAvatar || null });
      setSuccessMsg('Profile photo updated.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update the profile photo');
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: profile?.user?.full_name || '',
      phone: profile?.user?.phone || '',
      avatar_url: profile?.user?.avatar_url || ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg('');
    try {
      await employeePortalApi.updateMyProfile(formData);
      updateProfile({ full_name: formData.full_name, avatar_url: formData.avatar_url || null });
      setSuccessMsg('Contact details saved.');
      setEditing(false);
      await loadProfile();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save your details');
    } finally {
      setSaving(false);
    }
  };

  const user = profile?.user;
  const emp = profile?.employee;

  /**
   * Profile completion.
   *
   * Counts only what the EMPLOYEE can actually complete. PAN, PF, UAN and the
   * bank account are excluded because they are entered by HR - scoring them here
   * would tell the employee to fill in fields they cannot reach, and the bar
   * could never reach 100% on their own.
   */
  const completion = useMemo(() => {
    const checks = [
      { key: 'full name', filled: Boolean(user?.full_name) },
      { key: 'phone number', filled: Boolean(user?.phone) },
      { key: 'profile photo', filled: Boolean(user?.avatar_url) },
      { key: 'email address', filled: Boolean(user?.email) },
      { key: 'employee ID', filled: Boolean(emp?.employee_code) },
      { key: 'department', filled: Boolean(emp?.department) },
      { key: 'designation', filled: Boolean(emp?.designation) },
      { key: 'joining date', filled: Boolean(emp?.date_of_joining) },
    ];
    const filled = checks.filter((c) => c.filled).length;
    return {
      percent: Math.round((filled / checks.length) * 100),
      missing: checks.filter((c) => !c.filled).map((c) => c.key),
      filled,
      total: checks.length,
    };
  }, [user, emp]);

  const completionCard = (
    <div className="card shadow-sm border-0 emp-prof__completionCard">
      <div className="card-body py-2 px-3">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="emp-prof__cardTitle">Profile Completion</span>
          <span className="emp-prof__completionPct">{completion.percent}%</span>
        </div>
        <div
          className="progress"
          style={{ height: '7px' }}
          role="progressbar"
          aria-valuenow={completion.percent}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Profile completion"
        >
          <div className="progress-bar bg-success" style={{ width: `${completion.percent}%` }}></div>
        </div>
        <div className="text-muted small mt-1">
          {completion.filled} of {completion.total} details on record
        </div>
      </div>
    </div>
  );

  const tipCard = (
    <div className="card shadow-sm border-0 emp-prof__tipCard">
      <div className="card-body py-2 px-3 d-flex align-items-center gap-2">
        <i
          className={`bi ${completion.percent === 100 ? 'bi-check-circle-fill' : 'bi-check-circle'} emp-prof__tipIcon`}
          aria-hidden="true"
        ></i>
        <div className="small">
          {completion.percent === 100
            ? 'Your profile is complete'
            : 'Complete your contact information to reach 100%'}
          {completion.missing.length > 0 && completion.percent !== 100 && (
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
              Still needed: {completion.missing.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <AdminPage
      title="My Employee Profile"
      subtitle="View your employment details and keep your personal information up to date"
      loading={loading}
      error={error}
      onRetry={loadProfile}
      actions={
        <div className="d-flex gap-2 flex-wrap justify-content-end">
          <div className="emp-prof__completionWrap">{completionCard}</div>
          <div className="emp-prof__tipWrap">{tipCard}</div>
        </div>
      }
    >
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-3" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          <div>{successMsg}</div>
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      <div className="row g-3">
        {/* ---- Identity ---- */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center d-flex flex-column">
              <div className="mb-2">
                <AvatarUploader
                  value={formData.avatar_url}
                  onChange={handleAvatarChange}
                  name={user?.full_name || 'Employee'}
                  size={112}
                />
              </div>

              <h5 className="fw-bold mb-1 emp-prof__name">{user?.full_name || 'Employee'}</h5>
              <p className="text-muted small mb-2"><Value>{emp?.designation}</Value></p>

              <span className="emp-prof__deptBadge">{emp?.department || 'No department'}</span>

              <hr className="my-3" />

              <ul className="emp-prof__factList list-unstyled text-start mb-0">
                <li>
                  <i className="bi bi-upc-scan" aria-hidden="true"></i>
                  <div>
                    <span className="emp-prof__factLabel">Employee ID</span>
                    <span className="emp-prof__factValue"><Value>{emp?.employee_code}</Value></span>
                  </div>
                </li>
                <li>
                  <i className="bi bi-envelope" aria-hidden="true"></i>
                  <div>
                    <span className="emp-prof__factLabel">Official Email</span>
                    <span className="emp-prof__factValue text-break"><Value>{user?.email}</Value></span>
                  </div>
                </li>
                <li>
                  <i className="bi bi-calendar3" aria-hidden="true"></i>
                  <div>
                    <span className="emp-prof__factLabel">Joining Date</span>
                    <span className="emp-prof__factValue">
                      <Value>{formatDay(emp?.date_of_joining)}</Value>
                    </span>
                  </div>
                </li>
                <li>
                  <i className="bi bi-shield-lock" aria-hidden="true"></i>
                  <div>
                    <span className="emp-prof__factLabel">System Role</span>
                    <span className="emp-prof__factValue">
                      <span className="badge bg-dark">{user?.role || 'EMPLOYEE'}</span>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ---- Contact + employment ---- */}
        <div className="col-lg-8">
          <div className="row g-3">
            {/* Contact & identity */}
            <div className="col-xl-7">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white emp-prof__cardHead">
                  <div className="d-flex align-items-center gap-2">
                    <span className="emp-prof__headIcon emp-prof__headIcon--green" aria-hidden="true">
                      <i className="bi bi-person-fill"></i>
                    </span>
                    <h6 className="mb-0 fw-bold">Contact &amp; Identity Details</h6>
                  </div>
                  {!editing && (
                    <button type="button" className="btn btn-sm btn-outline-success" onClick={() => setEditing(true)}>
                      <i className="bi bi-pencil me-1" aria-hidden="true"></i>Edit
                    </button>
                  )}
                </div>

                <div className="card-body p-3">
                  <form onSubmit={handleUpdate} className="d-flex flex-column h-100">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="prof-name">
                          Full Legal Name
                        </label>
                        {editing ? (
                          <input
                            id="prof-name"
                            type="text"
                            className="form-control"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            required
                          />
                        ) : (
                          <div className="emp-prof__readField">{formData.full_name || '—'}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="prof-email">
                          Email Address <span className="emp-prof__ro">(Read-Only)</span>
                        </label>
                        <input
                          id="prof-email"
                          type="email"
                          className="form-control bg-light"
                          value={user?.email || ''}
                          disabled
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="prof-phone">
                          Phone Number
                        </label>
                        {editing ? (
                          <input
                            id="prof-phone"
                            type="tel"
                            className="form-control"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                          />
                        ) : (
                          <div className="emp-prof__readField">
                            {formData.phone || <span className="text-muted">Not on record</span>}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="prof-code">
                          Employee Code <span className="emp-prof__ro">(Read-Only)</span>
                        </label>
                        <input
                          id="prof-code"
                          type="text"
                          className="form-control bg-light"
                          value={emp?.employee_code || ''}
                          disabled
                        />
                      </div>
                    </div>

                    {/* Pushes the save button to the bottom so it lines up with
                        the Employment Details card beside it. */}
                    <div className="mt-auto pt-3 text-end">
                      {editing ? (
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => { setEditing(false); resetForm(); }}
                            disabled={saving}
                          >
                            Cancel
                          </button>
                          <button type="submit" className="btn btn-success px-4" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      ) : (
                        <button type="submit" className="btn btn-success px-4" disabled>
                          Save Changes
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Employment details - all six design rows, which is what gives
                this column its height. */}
            <div className="col-xl-5">
              <div className="card shadow-sm border-0 h-100 emp-prof__empCard">
                <div className="card-header emp-prof__cardHead emp-prof__empHead">
                  <div className="d-flex align-items-center gap-2">
                    <span className="emp-prof__headIcon emp-prof__headIcon--blue" aria-hidden="true">
                      <i className="bi bi-briefcase-fill"></i>
                    </span>
                    <h6 className="mb-0 fw-bold">Employment Details</h6>
                  </div>
                </div>
                <ul className="list-unstyled mb-0 emp-prof__empList">
                  <li>
                    <i className="bi bi-building" aria-hidden="true"></i>
                    <span className="emp-prof__empLabel">Department</span>
                    <span className="emp-prof__empValue"><Value>{emp?.department}</Value></span>
                  </li>
                  <li>
                    <i className="bi bi-person-badge" aria-hidden="true"></i>
                    <span className="emp-prof__empLabel">Designation</span>
                    <span className="emp-prof__empValue"><Value>{emp?.designation}</Value></span>
                  </li>
                  <li>
                    <i className="bi bi-file-earmark-text" aria-hidden="true"></i>
                    <span className="emp-prof__empLabel">Employment Type</span>
                    <span className="emp-prof__empValue"><Value>{emp?.employment_type}</Value></span>
                  </li>
                  <li>
                    <i className="bi bi-calendar3" aria-hidden="true"></i>
                    <span className="emp-prof__empLabel">Date of Joining</span>
                    <span className="emp-prof__empValue"><Value>{formatDay(emp?.date_of_joining)}</Value></span>
                  </li>
                  <li>
                    <i className="bi bi-person-lines-fill" aria-hidden="true"></i>
                    <span className="emp-prof__empLabel">Reporting Manager</span>
                    <span className="emp-prof__empValue"><Value>{emp?.reporting_manager_name}</Value></span>
                  </li>
                  <li>
                    <i className="bi bi-geo-alt" aria-hidden="true"></i>
                    <span className="emp-prof__empLabel">Work Location</span>
                    <span className="emp-prof__empValue"><Value>{emp?.work_location}</Value></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ---- Payroll ---- */}
          <div className="card shadow-sm border-0 emp-prof__payCard mt-3">
            <div className="card-header emp-prof__cardHead emp-prof__payHead">
              <div className="d-flex align-items-center gap-2">
                <span className="emp-prof__headIcon emp-prof__headIcon--amber" aria-hidden="true">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <h6 className="mb-0 fw-bold">Tax &amp; Banking Compliance</h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                {anyRevealed && (
                  <button type="button" className="btn btn-sm btn-link p-0" onClick={hideAll}>
                    Hide all
                  </button>
                )}
                <span className="badge bg-light text-muted border fw-semibold">
                  <i className="bi bi-lock-fill me-1" aria-hidden="true"></i>Read-only
                </span>
              </div>
            </div>

            <div className="card-body p-3">
              <div className="row g-3">
                <div className="col-md-4">
                  <span className="emp-prof__payLabel">PAN Number</span>
                  <div className="emp-prof__payField">
                    <MaskedValue
                      value={emp?.pan}
                      label="PAN number"
                      revealed={Boolean(revealed.pan)}
                      onToggle={() => toggleReveal('pan')}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <span className="emp-prof__payLabel">PF / UAN Number</span>
                  <div className="emp-prof__payField">
                    <MaskedValue
                      value={emp?.pf_number || emp?.uan}
                      label="PF or UAN number"
                      revealed={Boolean(revealed.pf)}
                      onToggle={() => toggleReveal('pf')}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <span className="emp-prof__payLabel">Bank Account</span>
                  <div className="emp-prof__payField">
                    <MaskedValue
                      value={emp?.bank_account}
                      label="bank account number"
                      revealed={Boolean(revealed.bank)}
                      onToggle={() => toggleReveal('bank')}
                    />
                  </div>
                </div>
              </div>

              <div className="emp-prof__notice mt-3">
                <i className="bi bi-info-circle-fill" aria-hidden="true"></i>
                <span>
                  Tap the eye to check a full number. These details are managed and verified by
                  HR / Finance &mdash; please contact HR if you need to update them.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}