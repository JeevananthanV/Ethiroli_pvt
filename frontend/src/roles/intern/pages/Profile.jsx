import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import AvatarUploader from '../../../common/components/AvatarUploader/AvatarUploader.jsx';
import { useAuth } from '../../../common/hooks/useAuth.js';
import { updateMyProfile } from '../../../services/api/userApi.js';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'academic' | 'internship' | 'skills' | 'social' | 'security'
  const [alert, setAlert] = useState({ type: '', text: '' });
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.full_name ? user.full_name.split(' ')[0] : 'Jeevananthan',
    lastName: user?.full_name ? user.full_name.split(' ').slice(1).join(' ') : 'V',
    email: user?.email || 'jeeva@ethiroli.net',
    phone: user?.phone || '+91 63800 49042',
    dob: '2004-05-14',
    gender: 'Male',
    address: '42, Innovation Street, Anna Nagar, Chennai, Tamil Nadu - 600040',
    emergencyContactName: 'V. Ramasamy',
    emergencyContactPhone: '+91 94432 12345',
    emergencyRelation: 'Father'
  });

  useEffect(() => {
    if (user) {
      if (user.avatar_url) setAvatarUrl(user.avatar_url);
      if (user.email) setPersonalInfo(p => ({ ...p, email: user.email }));
      if (user.full_name) {
        const parts = user.full_name.split(' ');
        setPersonalInfo(p => ({
          ...p,
          firstName: parts[0] || '',
          lastName: parts.slice(1).join(' ') || ''
        }));
      }
    }
  }, [user]);

  const handleAvatarChange = async (newAvatar) => {
    setAvatarUrl(newAvatar || '');
    try {
      await updateMyProfile({ avatar_url: newAvatar || '' });
      updateProfile({ avatar_url: newAvatar || null });
      setAlert({ type: 'success', text: 'Profile picture successfully updated!' });
    } catch (err) {
      setAlert({ type: 'danger', text: err?.message || 'Failed to update profile picture' });
    }
  };

  const [academicInfo, setAcademicInfo] = useState({
    college: 'Government College of Engineering, Salem',
    degree: 'Bachelor of Engineering (B.E.)',
    department: 'Computer Science & Engineering',
    yearOfStudy: 'Final Year (4th Year)',
    rollNumber: '7376221CS101',
    cgpa: '8.74 / 10.0'
  });

  const [internshipInfo] = useState({
    track: 'Full Stack Web Development (MERN Stack)',
    cohort: 'Cohort 2026-Q3 (Batch 12)',
    startDate: 'May 15, 2026',
    endDate: 'June 30, 2026',
    mentorName: 'Arun Kumar (Senior Full Stack Developer)',
    assignedProject: 'Ethiroli Web Portal v2',
    status: 'ACTIVE'
  });

  const [skills, setSkills] = useState([
    'React 19', 'JavaScript (ES6+)', 'Redux Toolkit', 'Node.js', 'Express.js',
    'HTML5 & CSS3', 'Bootstrap 5', 'PostgreSQL', 'MySQL', 'Git & GitHub', 'REST APIs'
  ]);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [socialLinks, setSocialLinks] = useState({
    github: 'https://github.com/jeevananthan',
    linkedin: 'https://linkedin.com/in/jeevananthan-v',
    portfolio: 'https://jeevananthan.dev',
    twitter: 'https://twitter.com/jeevadev'
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
    try {
      await updateMyProfile({
        full_name: fullName,
        phone: personalInfo.phone,
        avatar_url: avatarUrl || null
      });
      updateProfile({
        full_name: fullName,
        phone: personalInfo.phone,
        avatar_url: avatarUrl || null
      });
      setAlert({ type: 'success', text: 'Profile details successfully updated!' });
    } catch (err) {
      setAlert({ type: 'danger', text: err?.message || 'Failed to update profile' });
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setAlert({ type: 'danger', text: 'New passwords do not match.' });
      return;
    }
    setAlert({ type: 'success', text: 'Password successfully changed!' });
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <AdminPage
      title="Intern Profile & Account Settings"
      subtitle="Manage your personal details, academic credentials, skills tags, social handles, and security settings"
    >
      <div className="container-fluid px-0">
        {alert.text && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show mb-2`} role="alert">
            <i className="bi bi-check-circle me-2"></i>{alert.text}
            <button type="button" className="btn-close" onClick={() => setAlert({ type: '', text: '' })}></button>
          </div>
        )}

        <div className="row g-4 mb-2">
          {/* Identity Card */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 text-center p-4">
              <div className="mb-3">
                <AvatarUploader
                  value={avatarUrl}
                  onChange={handleAvatarChange}
                  name={`${personalInfo.firstName} ${personalInfo.lastName}`}
                  size={100}
                />
              </div>
              <h4 className="fw-bold mb-1 text-dark">
                {personalInfo.firstName} {personalInfo.lastName}
              </h4>
              <span className="badge bg-primary-subtle text-primary border mb-3">
                {internshipInfo.track}
              </span>

              <div className="text-start border-top pt-3 small">
                <p className="mb-2 text-muted">
                  <i className="bi bi-mortarboard me-2 text-primary"></i>{academicInfo.college}
                </p>
                <p className="mb-2 text-muted">
                  <i className="bi bi-journal-bookmark me-2 text-primary"></i>{academicInfo.degree}
                </p>
                <p className="mb-2 text-muted">
                  <i className="bi bi-person-workspace me-2 text-primary"></i>Mentor: <strong>{internshipInfo.mentorName}</strong>
                </p>
                <p className="mb-2 text-muted">
                  <i className="bi bi-calendar-range me-2 text-primary"></i>{internshipInfo.startDate} – {internshipInfo.endDate}
                </p>
              </div>
            </div>
          </div>

          {/* Tabbed Settings Area */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-0 pt-3 pb-0">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'personal' ? 'active fw-bold' : 'text-muted'}`}
                      onClick={() => setActiveTab('personal')}
                    >
                      Personal
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'academic' ? 'active fw-bold' : 'text-muted'}`}
                      onClick={() => setActiveTab('academic')}
                    >
                      Academic
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'internship' ? 'active fw-bold' : 'text-muted'}`}
                      onClick={() => setActiveTab('internship')}
                    >
                      Internship
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'skills' ? 'active fw-bold' : 'text-muted'}`}
                      onClick={() => setActiveTab('skills')}
                    >
                      Skills
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'social' ? 'active fw-bold' : 'text-muted'}`}
                      onClick={() => setActiveTab('social')}
                    >
                      Social Links
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'security' ? 'active fw-bold' : 'text-muted'}`}
                      onClick={() => setActiveTab('security')}
                    >
                      Security
                    </button>
                  </li>
                </ul>
              </div>

              <div className="card-body p-3">
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <form onSubmit={handleSaveProfile}>
                    <div className="row g-3 mb-3">
                      <div className="col-sm-6">
                        <label className="form-label small fw-semibold">First Name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={personalInfo.firstName}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label small fw-semibold">Last Name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={personalInfo.lastName}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-sm-6">
                        <label className="form-label small fw-semibold">Email Address</label>
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label small fw-semibold">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control form-control-sm"
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-sm-6">
                        <label className="form-label small fw-semibold">Date of Birth</label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={personalInfo.dob}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label small fw-semibold">Gender</label>
                        <select
                          className="form-select form-select-sm"
                          value={personalInfo.gender}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Residential Address</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows="2"
                        value={personalInfo.address}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                      ></textarea>
                    </div>

                    <h6 className="fw-bold text-dark small mt-4 mb-2">Emergency Contact Information</h6>
                    <div className="row g-3 mb-3">
                      <div className="col-sm-4">
                        <label className="form-label small fw-semibold">Contact Name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={personalInfo.emergencyContactName}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, emergencyContactName: e.target.value })}
                        />
                      </div>
                      <div className="col-sm-4">
                        <label className="form-label small fw-semibold">Contact Phone</label>
                        <input
                          type="tel"
                          className="form-control form-control-sm"
                          value={personalInfo.emergencyContactPhone}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, emergencyContactPhone: e.target.value })}
                        />
                      </div>
                      <div className="col-sm-4">
                        <label className="form-label small fw-semibold">Relation</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={personalInfo.emergencyRelation}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, emergencyRelation: e.target.value })}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-sm px-4">
                      Save Personal Information
                    </button>
                  </form>
                )}

                {/* Academic Information Tab */}
                {activeTab === 'academic' && (
                  <form onSubmit={handleSaveProfile}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">College / University Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={academicInfo.college}
                        onChange={(e) => setAcademicInfo({ ...academicInfo, college: e.target.value })}
                        required
                      />
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-sm-6">
                        <label className="form-label small fw-semibold">Degree Program</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={academicInfo.degree}
                          onChange={(e) => setAcademicInfo({ ...academicInfo, degree: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label small fw-semibold">Department / Branch</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={academicInfo.department}
                          onChange={(e) => setAcademicInfo({ ...academicInfo, department: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-sm-4">
                        <label className="form-label small fw-semibold">Year of Study</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={academicInfo.yearOfStudy}
                          onChange={(e) => setAcademicInfo({ ...academicInfo, yearOfStudy: e.target.value })}
                        />
                      </div>
                      <div className="col-sm-4">
                        <label className="form-label small fw-semibold">Roll Number / Reg No</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={academicInfo.rollNumber}
                          onChange={(e) => setAcademicInfo({ ...academicInfo, rollNumber: e.target.value })}
                        />
                      </div>
                      <div className="col-sm-4">
                        <label className="form-label small fw-semibold">Cumulative CGPA</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={academicInfo.cgpa}
                          onChange={(e) => setAcademicInfo({ ...academicInfo, cgpa: e.target.value })}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-sm px-4">
                      Save Academic Information
                    </button>
                  </form>
                )}

                {/* Internship Information Tab (Read-Only) */}
                {activeTab === 'internship' && (
                  <div>
                    <div className="row g-3 small">
                      <div className="col-sm-6 p-3 bg-light rounded-3 border">
                        <span className="text-muted d-block">Internship Track</span>
                        <strong className="text-dark">{internshipInfo.track}</strong>
                      </div>
                      <div className="col-sm-6 p-3 bg-light rounded-3 border">
                        <span className="text-muted d-block">Cohort / Batch</span>
                        <strong className="text-dark">{internshipInfo.cohort}</strong>
                      </div>
                      <div className="col-sm-6 p-3 bg-light rounded-3 border">
                        <span className="text-muted d-block">Assigned Mentor</span>
                        <strong className="text-dark">{internshipInfo.mentorName}</strong>
                      </div>
                      <div className="col-sm-6 p-3 bg-light rounded-3 border">
                        <span className="text-muted d-block">Assigned Project</span>
                        <strong className="text-dark">{internshipInfo.assignedProject}</strong>
                      </div>
                      <div className="col-sm-6 p-3 bg-light rounded-3 border">
                        <span className="text-muted d-block">Internship Period</span>
                        <strong className="text-dark">{internshipInfo.startDate} – {internshipInfo.endDate}</strong>
                      </div>
                      <div className="col-sm-6 p-3 bg-light rounded-3 border">
                        <span className="text-muted d-block">Status</span>
                        <span className="badge bg-success-subtle text-success">{internshipInfo.status}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Skills & Tech Stack Tab */}
                {activeTab === 'skills' && (
                  <div>
                    <h6 className="fw-bold text-dark small mb-2">Technical Skills & Competencies</h6>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {skills.map((skill) => (
                        <span key={skill} className="badge bg-light text-dark border p-2 d-flex align-items-center gap-2">
                          {skill}
                          <button
                            type="button"
                            className="btn-close btn-close-white"
                            style={{ fontSize: '0.6rem' }}
                            onClick={() => handleRemoveSkill(skill)}
                            aria-label={`Remove ${skill}`}
                          ></button>
                        </span>
                      ))}
                    </div>

                    <form onSubmit={handleAddSkill} className="row g-2 align-items-center">
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Add a new skill (e.g. Docker, GraphQL, Redis)..."
                          value={newSkillInput}
                          onChange={(e) => setNewSkillInput(e.target.value)}
                        />
                      </div>
                      <div className="col-sm-4">
                        <button type="submit" className="btn btn-outline-primary btn-sm w-100">
                          + Add Skill
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Social Links Tab */}
                {activeTab === 'social' && (
                  <form onSubmit={handleSaveProfile}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        <i className="bi bi-github me-1"></i>GitHub Profile URL
                      </label>
                      <input
                        type="url"
                        className="form-control form-control-sm"
                        value={socialLinks.github}
                        onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        <i className="bi bi-linkedin me-1 text-primary"></i>LinkedIn Profile URL
                      </label>
                      <input
                        type="url"
                        className="form-control form-control-sm"
                        value={socialLinks.linkedin}
                        onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        <i className="bi bi-globe me-1 text-info"></i>Personal Portfolio URL
                      </label>
                      <input
                        type="url"
                        className="form-control form-control-sm"
                        value={socialLinks.portfolio}
                        onChange={(e) => setSocialLinks({ ...socialLinks, portfolio: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small fw-semibold">
                        <i className="bi bi-twitter-x me-1"></i>Twitter / X Profile URL
                      </label>
                      <input
                        type="url"
                        className="form-control form-control-sm"
                        value={socialLinks.twitter}
                        onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm px-4">
                      Save Social Links
                    </button>
                  </form>
                )}

                {/* Account Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h6 className="fw-bold text-dark small mb-3">Change Password</h6>
                    <form onSubmit={handleChangePassword}>
                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Current Password</label>
                        <input
                          type="password"
                          className="form-control form-control-sm"
                          value={passwords.currentPassword}
                          onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                          required
                        />
                      </div>
                      <div className="row g-3 mb-3">
                        <div className="col-sm-6">
                          <label className="form-label small fw-semibold">New Password</label>
                          <input
                            type="password"
                            className="form-control form-control-sm"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label small fw-semibold">Confirm New Password</label>
                          <input
                            type="password"
                            className="form-control form-control-sm"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn btn-danger btn-sm px-4 mb-2">
                        Update Password
                      </button>
                    </form>

                    <hr />

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong className="text-dark small d-block">Two-Factor Authentication (2FA)</strong>
                        <span className="text-muted small">Protect your intern account with time-based OTP.</span>
                      </div>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => alert('2FA setup initiated via Authenticator app.')}>
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
