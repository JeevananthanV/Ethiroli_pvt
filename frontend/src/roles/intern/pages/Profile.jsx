import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import AvatarUploader from '../../../common/components/AvatarUploader/AvatarUploader.jsx';
import { useAuth } from '../../../common/hooks/useAuth.js';
import { getMyInternProfile, updateMyInternProfile } from '../../../services/api/internApi.js';
import { changePassword } from '../../../services/api/authApi.js';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'academic' | 'internship' | 'skills' | 'social' | 'security'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Not Specified',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyRelation: ''
  });

  const [academicInfo, setAcademicInfo] = useState({
    college: '',
    degree: '',
    department: '',
    yearOfStudy: '',
    rollNumber: '',
    cgpa: ''
  });

  const [internshipInfo, setInternshipInfo] = useState({
    track: '',
    cohort: '',
    startDate: '',
    endDate: '',
    mentorName: '',
    assignedProject: '',
    status: 'ACTIVE',
    stipend: '₹0',
    progress: 0
  });

  const [skills, setSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [socialLinks, setSocialLinks] = useState({
    github: '',
    linkedin: '',
    portfolio: '',
    twitter: ''
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch full dynamic intern profile on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      try {
        const data = await getMyInternProfile();
        if (!isMounted) return;

        if (data) {
          if (data.avatar_url) setAvatarUrl(data.avatar_url);

          if (data.personal) {
            setPersonalInfo({
              firstName: data.personal.firstName || (data.full_name ? data.full_name.split(' ')[0] : ''),
              lastName: data.personal.lastName || (data.full_name ? data.full_name.split(' ').slice(1).join(' ') : ''),
              email: data.personal.email || data.email || user?.email || '',
              phone: data.personal.phone || data.phone || user?.phone || '',
              dob: data.personal.dob || '',
              gender: data.personal.gender || 'Not Specified',
              address: data.personal.address || '',
              emergencyContactName: data.personal.emergencyContactName || '',
              emergencyContactPhone: data.personal.emergencyContactPhone || '',
              emergencyRelation: data.personal.emergencyRelation || ''
            });
          }

          if (data.academic) {
            setAcademicInfo({
              college: data.academic.college || data.college_name || '',
              degree: data.academic.degree || '',
              department: data.academic.department || '',
              yearOfStudy: data.academic.yearOfStudy || '',
              rollNumber: data.academic.rollNumber || '',
              cgpa: data.academic.cgpa || ''
            });
          }

          if (data.internship) {
            setInternshipInfo({
              track: data.internship.track || data.project_target || 'Full Stack Web Development',
              cohort: data.internship.cohort || 'Cohort 2026',
              startDate: data.internship.startDate || (data.start_date ? new Date(data.start_date).toISOString().slice(0, 10) : ''),
              endDate: data.internship.endDate || (data.end_date ? new Date(data.end_date).toISOString().slice(0, 10) : ''),
              mentorName: data.internship.mentorName || data.mentor_name || 'Not Assigned Yet',
              assignedProject: data.internship.assignedProject || data.project_target || 'Full Stack Development',
              status: data.internship.status || 'ACTIVE',
              stipend: data.internship.stipend || (data.stipend ? `₹${Number(data.stipend).toLocaleString('en-IN')}` : '₹0'),
              progress: data.internship.progress || 0
            });
          }

          if (Array.isArray(data.skills)) {
            setSkills(data.skills);
          }

          if (data.socialLinks) {
            setSocialLinks({
              github: data.socialLinks.github || '',
              linkedin: data.socialLinks.linkedin || '',
              portfolio: data.socialLinks.portfolio || '',
              twitter: data.socialLinks.twitter || ''
            });
          }
        }
      } catch (err) {
        console.error('Failed to load intern profile:', err);
        if (isMounted) {
          setAlert({
            type: 'danger',
            text: err?.response?.data?.message || err?.message || 'Failed to retrieve profile from server.'
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleAvatarChange = async (newAvatar) => {
    setAvatarUrl(newAvatar || '');
    try {
      await updateMyInternProfile({ avatar_url: newAvatar || '' });
      if (updateProfile) updateProfile({ avatar_url: newAvatar || null });
      setAlert({ type: 'success', text: 'Profile picture successfully updated!' });
    } catch (err) {
      setAlert({ type: 'danger', text: err?.response?.data?.message || err?.message || 'Failed to update profile picture' });
    }
  };

  const handleSavePersonal = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
    try {
      await updateMyInternProfile({
        personal: personalInfo,
        full_name: fullName,
        phone: personalInfo.phone
      });
      if (updateProfile) {
        updateProfile({
          full_name: fullName,
          phone: personalInfo.phone
        });
      }
      setAlert({ type: 'success', text: 'Personal details successfully saved!' });
    } catch (err) {
      setAlert({ type: 'danger', text: err?.response?.data?.message || err?.message || 'Failed to update personal details.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAcademic = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMyInternProfile({
        academic: academicInfo
      });
      setAlert({ type: 'success', text: 'Academic credentials successfully saved!' });
    } catch (err) {
      setAlert({ type: 'danger', text: err?.response?.data?.message || err?.message || 'Failed to update academic details.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveInternship = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMyInternProfile({
        internship: internshipInfo
      });
      setAlert({ type: 'success', text: 'Internship details successfully saved to live database!' });
    } catch (err) {
      setAlert({ type: 'danger', text: err?.response?.data?.message || err?.message || 'Failed to update internship details.' });
    } finally {
      setSaving(false);
    }
  };

  const POPULAR_SKILLS = [
    'React', 'Node.js', 'Express.js', 'MySQL', 'JavaScript',
    'TypeScript', 'Python', 'Git', 'Docker', 'HTML/CSS',
    'Tailwind CSS', 'Redux', 'REST APIs', 'Next.js'
  ];

  const handleQuickAddSkill = async (skillName) => {
    if (!skills.includes(skillName)) {
      const updated = [...skills, skillName];
      setSkills(updated);
      try {
        await updateMyInternProfile({ skills: updated });
        setAlert({ type: 'success', text: `Skill "${skillName}" added and saved!` });
      } catch (err) {
        setAlert({ type: 'danger', text: err?.response?.data?.message || err?.message || 'Failed to save skill.' });
      }
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const val = newSkillInput.trim();
    if (val && !skills.includes(val)) {
      const updated = [...skills, val];
      setSkills(updated);
      setNewSkillInput('');
      try {
        await updateMyInternProfile({ skills: updated });
        setAlert({ type: 'success', text: `Skill "${val}" added successfully!` });
      } catch (err) {
        setAlert({ type: 'danger', text: err?.response?.data?.message || err?.message || 'Failed to save skill.' });
      }
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    try {
      await updateMyInternProfile({ skills: updated });
      setAlert({ type: 'success', text: `Skill "${skillToRemove}" removed!` });
    } catch (err) {
      setAlert({ type: 'danger', text: err?.response?.data?.message || err?.message || 'Failed to update skills.' });
    }
  };

  const handleSaveSocial = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMyInternProfile({
        socialLinks
      });
      setAlert({ type: 'success', text: 'Social links successfully saved!' });
    } catch (err) {
      setAlert({ type: 'danger', text: err?.response?.data?.message || err?.message || 'Failed to save social links.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      setAlert({ type: 'danger', text: 'Current password is required.' });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setAlert({ type: 'danger', text: 'New passwords do not match.' });
      return;
    }
    if (passwords.newPassword.length < 8) {
      setAlert({ type: 'danger', text: 'New password must be at least 8 characters.' });
      return;
    }
    setSaving(true);
    try {
      await changePassword(passwords.currentPassword, passwords.newPassword);
      setAlert({ type: 'success', text: 'Password successfully updated! Your account credentials are saved.' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setAlert({ type: 'danger', text: err?.response?.data?.message || err?.message || 'Failed to update password.' });
    } finally {
      setSaving(false);
    }
  };

  const fullNameDisplay = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || user?.full_name || 'Intern Profile';

  return (
    <AdminPage
      title="Intern Profile & Account Settings"
      subtitle="Manage your personal details, academic credentials, skills tags, social handles, and security settings"
    >
      <div className="container-fluid px-0">
        {alert.text && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show mb-3`} role="alert">
            <i className={`bi ${alert.type === 'danger' ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
            {alert.text}
            <button type="button" className="btn-close" aria-label="Dismiss" onClick={() => setAlert({ type: '', text: '' })}></button>
          </div>
        )}

        {loading ? (
          <div className="card shadow-sm border-0 p-5 text-center my-4">
            <div className="spinner-border text-primary mx-auto mb-3" role="status">
              <span className="visually-hidden">Loading profile...</span>
            </div>
            <p className="text-muted mb-0">Loading your live intern profile...</p>
          </div>
        ) : (
          <div className="row g-4 mb-2">
            {/* Identity Card */}
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 text-center p-3">
                <div className="mb-3">
                  <AvatarUploader
                    value={avatarUrl}
                    onChange={handleAvatarChange}
                    name={fullNameDisplay}
                    size={100}
                  />
                </div>
                <h4 className="fw-bold mb-1 text-dark">
                  {fullNameDisplay}
                </h4>
                <span className="badge bg-primary-subtle text-primary border mb-3">
                  {internshipInfo.track || 'Internship Track'}
                </span>

                <div className="text-start border-top pt-3 small">
                  <p className="mb-2 text-muted">
                    <i className="bi bi-mortarboard me-2 text-primary"></i>
                    {academicInfo.college || <span className="fst-italic text-secondary">College not specified</span>}
                  </p>
                  <p className="mb-2 text-muted">
                    <i className="bi bi-journal-bookmark me-2 text-primary"></i>
                    {academicInfo.degree || (academicInfo.department || <span className="fst-italic text-secondary">Degree not specified</span>)}
                  </p>
                  <p className="mb-2 text-muted">
                    <i className="bi bi-person-workspace me-2 text-primary"></i>
                    Mentor: <strong>{internshipInfo.mentorName || 'Not Assigned Yet'}</strong>
                  </p>
                  <p className="mb-2 text-muted">
                    <i className="bi bi-calendar-range me-2 text-primary"></i>
                    {internshipInfo.startDate && internshipInfo.endDate ? (
                      `${internshipInfo.startDate} – ${internshipInfo.endDate}`
                    ) : (
                      <span className="fst-italic text-secondary">Internship duration active</span>
                    )}
                  </p>
                  {internshipInfo.stipend && internshipInfo.stipend !== '₹0' && (
                    <p className="mb-2 text-muted">
                      <i className="bi bi-cash-coin me-2 text-success"></i>
                      Stipend: <strong>{internshipInfo.stipend}</strong>
                    </p>
                  )}
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
                    <form onSubmit={handleSavePersonal}>
                      <div className="row g-3 mb-3">
                        <div className="col-sm-6">
                          <label htmlFor="first-name" className="form-label small fw-semibold">First Name</label>
                          <input
                            id="first-name"
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Your first name"
                            value={personalInfo.firstName}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-sm-6">
                          <label htmlFor="last-name" className="form-label small fw-semibold">Last Name</label>
                          <input
                            id="last-name"
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Your last name"
                            value={personalInfo.lastName}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-sm-6">
                          <label htmlFor="email-address" className="form-label small fw-semibold">Email Address</label>
                          <input
                            id="email-address"
                            type="email"
                            className="form-control form-control-sm bg-light"
                            value={personalInfo.email}
                            readOnly
                            disabled
                          />
                          <span className="form-text text-muted" style={{ fontSize: '0.75rem' }}>Email is your primary login identifier and managed by system admin.</span>
                        </div>
                        <div className="col-sm-6">
                          <label htmlFor="phone-number" className="form-label small fw-semibold">Phone Number</label>
                          <input
                            id="phone-number"
                            type="tel"
                            className="form-control form-control-sm"
                            placeholder="+91 98765 43210"
                            value={personalInfo.phone}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-sm-6">
                          <label htmlFor="date-of-birth" className="form-label small fw-semibold">Date of Birth</label>
                          <input
                            id="date-of-birth"
                            type="date"
                            className="form-control form-control-sm"
                            value={personalInfo.dob}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label htmlFor="gender" className="form-label small fw-semibold">Gender</label>
                          <select
                            id="gender"
                            className="form-select form-select-sm"
                            value={personalInfo.gender}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                          >
                            <option value="Not Specified">Not Specified</option>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="residential-address" className="form-label small fw-semibold">Residential Address</label>
                        <textarea
                          id="residential-address"
                          className="form-control form-control-sm"
                          rows="2"
                          placeholder="Door No, Street, City, State, PIN"
                          value={personalInfo.address}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                        ></textarea>
                      </div>

                      <h6 className="fw-bold text-dark small mt-4 mb-2">Emergency Contact Information</h6>
                      <div className="row g-3 mb-3">
                        <div className="col-sm-4">
                          <label htmlFor="contact-name" className="form-label small fw-semibold">Contact Name</label>
                          <input
                            id="contact-name"
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Name of contact"
                            value={personalInfo.emergencyContactName}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, emergencyContactName: e.target.value })}
                          />
                        </div>
                        <div className="col-sm-4">
                          <label htmlFor="contact-phone" className="form-label small fw-semibold">Contact Phone</label>
                          <input
                            id="contact-phone"
                            type="tel"
                            className="form-control form-control-sm"
                            placeholder="+91 94400 00000"
                            value={personalInfo.emergencyContactPhone}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, emergencyContactPhone: e.target.value })}
                          />
                        </div>
                        <div className="col-sm-4">
                          <label htmlFor="relation" className="form-label small fw-semibold">Relation</label>
                          <input
                            id="relation"
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Parent / Guardian"
                            value={personalInfo.emergencyRelation}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, emergencyRelation: e.target.value })}
                          />
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary btn-sm px-4" disabled={saving}>
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          'Save Personal Information'
                        )}
                      </button>
                    </form>
                  )}

                  {/* Academic Information Tab */}
                  {activeTab === 'academic' && (
                    <form onSubmit={handleSaveAcademic}>
                      <div className="mb-3">
                        <label htmlFor="college-university-name" className="form-label small fw-semibold">College / University Name</label>
                        <input
                          id="college-university-name"
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. Anna University, PSG College of Technology"
                          value={academicInfo.college}
                          onChange={(e) => setAcademicInfo({ ...academicInfo, college: e.target.value })}
                          required
                        />
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-sm-6">
                          <label htmlFor="degree-program" className="form-label small fw-semibold">Degree Program</label>
                          <input
                            id="degree-program"
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="e.g. Bachelor of Engineering (B.E.) / B.Tech / MCA"
                            value={academicInfo.degree}
                            onChange={(e) => setAcademicInfo({ ...academicInfo, degree: e.target.value })}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label htmlFor="department-branch" className="form-label small fw-semibold">Department / Branch</label>
                          <input
                            id="department-branch"
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="e.g. Computer Science & Engineering"
                            value={academicInfo.department}
                            onChange={(e) => setAcademicInfo({ ...academicInfo, department: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-sm-4">
                          <label htmlFor="year-of-study" className="form-label small fw-semibold">Year of Study</label>
                          <input
                            id="year-of-study"
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="e.g. Final Year (4th Year)"
                            value={academicInfo.yearOfStudy}
                            onChange={(e) => setAcademicInfo({ ...academicInfo, yearOfStudy: e.target.value })}
                          />
                        </div>
                        <div className="col-sm-4">
                          <label htmlFor="roll-number-reg-no" className="form-label small fw-semibold">Roll Number / Reg No</label>
                          <input
                            id="roll-number-reg-no"
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="e.g. 7376221CS101"
                            value={academicInfo.rollNumber}
                            onChange={(e) => setAcademicInfo({ ...academicInfo, rollNumber: e.target.value })}
                          />
                        </div>
                        <div className="col-sm-4">
                          <label htmlFor="cumulative-cgpa" className="form-label small fw-semibold">Cumulative CGPA</label>
                          <input
                            id="cumulative-cgpa"
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="e.g. 8.75 / 10.0"
                            value={academicInfo.cgpa}
                            onChange={(e) => setAcademicInfo({ ...academicInfo, cgpa: e.target.value })}
                          />
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary btn-sm px-4" disabled={saving}>
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          'Save Academic Information'
                        )}
                      </button>
                    </form>
                  )}

                  {/* Internship Information Tab (Dynamic & Live Saved) */}
                  {activeTab === 'internship' && (
                    <form onSubmit={handleSaveInternship}>
                      <div className="row g-3 mb-3">
                        <div className="col-sm-6">
                          <label htmlFor="internship-track" className="form-label small fw-semibold">
                            Internship Track / Domain
                          </label>
                          <input
                            id="internship-track"
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="e.g. Full Stack Web Development"
                            value={internshipInfo.track}
                            onChange={(e) => setInternshipInfo({ ...internshipInfo, track: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-sm-6">
                          <label htmlFor="internship-cohort" className="form-label small fw-semibold">
                            Cohort / Batch
                          </label>
                          <input
                            id="internship-cohort"
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="e.g. Cohort 2026 - Batch 1"
                            value={internshipInfo.cohort}
                            onChange={(e) => setInternshipInfo({ ...internshipInfo, cohort: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="assigned-project" className="form-label small fw-semibold">
                          Assigned Project / Focus Area
                        </label>
                        <input
                          id="assigned-project"
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. Enterprise HR & Learning Management Platform"
                          value={internshipInfo.assignedProject}
                          onChange={(e) => setInternshipInfo({ ...internshipInfo, assignedProject: e.target.value })}
                        />
                      </div>

                      <div className="row g-3 small mb-4">
                        <div className="col-sm-6 p-3 bg-light rounded-3 border">
                          <span className="text-muted d-block">Assigned Mentor</span>
                          <strong className="text-dark">{internshipInfo.mentorName || 'Not Assigned Yet'}</strong>
                          {internshipInfo.mentorEmail && (
                            <span className="text-muted d-block mt-1">{internshipInfo.mentorEmail}</span>
                          )}
                        </div>
                        <div className="col-sm-6 p-3 bg-light rounded-3 border">
                          <span className="text-muted d-block">Internship Period</span>
                          <strong className="text-dark">
                            {internshipInfo.startDate && internshipInfo.endDate
                              ? `${internshipInfo.startDate} – ${internshipInfo.endDate}`
                              : 'Period Active'}
                          </strong>
                        </div>
                        <div className="col-sm-6 p-3 bg-light rounded-3 border">
                          <span className="text-muted d-block">Status</span>
                          <span className="badge bg-success-subtle text-success">{internshipInfo.status || 'ACTIVE'}</span>
                        </div>
                        <div className="col-sm-6 p-3 bg-light rounded-3 border">
                          <span className="text-muted d-block">Monthly Stipend</span>
                          <strong className="text-dark">{internshipInfo.stipend || '₹0'}</strong>
                        </div>
                        <div className="col-12 p-3 bg-light rounded-3 border">
                          <span className="text-muted d-block">Overall Milestone Progress</span>
                          <div className="d-flex align-items-center gap-2 mt-1">
                            <div className="progress flex-grow-1" style={{ height: '8px' }}>
                              <div
                                className="progress-bar bg-primary"
                                role="progressbar"
                                style={{ width: `${internshipInfo.progress || 10}%` }}
                                aria-valuenow={internshipInfo.progress || 10}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <span className="fw-bold">{internshipInfo.progress || 10}%</span>
                          </div>
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary btn-sm px-4" disabled={saving}>
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          'Save Internship Details'
                        )}
                      </button>
                    </form>
                  )}

                  {/* Skills & Tech Stack Tab */}
                  {activeTab === 'skills' && (
                    <div>
                      <h6 className="fw-bold text-dark small mb-2">Technical Skills & Competencies</h6>
                      <p className="text-muted small mb-3">Add the programming languages, frameworks, libraries, and tools you have worked with. Changes are automatically saved to your live profile in the database.</p>

                      <div className="d-flex flex-wrap gap-2 mb-3 min-vh-20">
                        {skills.length === 0 ? (
                          <div className="p-3 text-muted border rounded bg-light w-100 text-center">
                            No skills tagged yet. Pick a suggested skill below or add custom skills!
                          </div>
                        ) : (
                          skills.map((skill) => (
                            <span key={skill} className="badge bg-primary-subtle text-primary border p-2 d-flex align-items-center gap-2">
                              {skill}
                              <button
                                type="button"
                                className="btn-close"
                                style={{ fontSize: '0.65rem' }}
                                onClick={() => handleRemoveSkill(skill)}
                                aria-label={`Remove ${skill}`}
                              ></button>
                            </span>
                          ))
                        )}
                      </div>

                      {/* Quick Suggestion Pills */}
                      <div className="mb-3 p-3 bg-light rounded-3 border">
                        <span className="text-muted small fw-semibold d-block mb-2">
                          <i className="bi bi-stars text-warning me-1"></i> Popular Suggestions (Click to Add):
                        </span>
                        <div className="d-flex flex-wrap gap-2">
                          {POPULAR_SKILLS.filter(s => !skills.includes(s)).map((skill) => (
                            <button
                              key={skill}
                              type="button"
                              className="btn btn-sm btn-white bg-white border text-secondary"
                              style={{ fontSize: '0.78rem' }}
                              onClick={() => handleQuickAddSkill(skill)}
                            >
                              + {skill}
                            </button>
                          ))}
                        </div>
                      </div>

                      <form onSubmit={handleAddSkill} className="row g-2 align-items-center">
                        <div className="col-sm-8">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Add a custom skill (e.g. GraphQL, AWS, Figma)..."
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
                    <form onSubmit={handleSaveSocial}>
                      <div className="mb-3">
                        <label htmlFor="github-profile-url" className="form-label small fw-semibold">
                          <i className="bi bi-github me-1"></i>GitHub Profile URL
                        </label>
                        <input
                          id="github-profile-url"
                          type="url"
                          className="form-control form-control-sm"
                          placeholder="https://github.com/yourusername"
                          value={socialLinks.github}
                          onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="linkedin-profile-url" className="form-label small fw-semibold">
                          <i className="bi bi-linkedin me-1 text-primary"></i>LinkedIn Profile URL
                        </label>
                        <input
                          id="linkedin-profile-url"
                          type="url"
                          className="form-control form-control-sm"
                          placeholder="https://linkedin.com/in/yourprofile"
                          value={socialLinks.linkedin}
                          onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="personal-portfolio-url" className="form-label small fw-semibold">
                          <i className="bi bi-globe me-1 text-info"></i>Personal Portfolio URL
                        </label>
                        <input
                          id="personal-portfolio-url"
                          type="url"
                          className="form-control form-control-sm"
                          placeholder="https://yourportfolio.dev"
                          value={socialLinks.portfolio}
                          onChange={(e) => setSocialLinks({ ...socialLinks, portfolio: e.target.value })}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="twitter-x-profile-url" className="form-label small fw-semibold">
                          <i className="bi bi-twitter-x me-1"></i>Twitter / X Profile URL
                        </label>
                        <input
                          id="twitter-x-profile-url"
                          type="url"
                          className="form-control form-control-sm"
                          placeholder="https://x.com/yourhandle"
                          value={socialLinks.twitter}
                          onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary btn-sm px-4" disabled={saving}>
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          'Save Social Links'
                        )}
                      </button>
                    </form>
                  )}

                  {/* Account Security Tab */}
                  {activeTab === 'security' && (
                    <div>
                      <h6 className="fw-bold text-dark small mb-3">Change Password</h6>
                      <form onSubmit={handleChangePassword}>
                        <div className="mb-3">
                          <label htmlFor="current-password" className="form-label small fw-semibold">Current Password</label>
                          <input
                            id="current-password"
                            type="password"
                            className="form-control form-control-sm"
                            placeholder="Enter your current password"
                            value={passwords.currentPassword}
                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                            required
                          />
                        </div>
                        <div className="row g-3 mb-3">
                          <div className="col-sm-6">
                            <label htmlFor="new-password" className="form-label small fw-semibold">New Password</label>
                            <input
                              id="new-password"
                              type="password"
                              className="form-control form-control-sm"
                              placeholder="Minimum 8 characters"
                              value={passwords.newPassword}
                              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                              required
                            />
                          </div>
                          <div className="col-sm-6">
                            <label htmlFor="confirm-new-password" className="form-label small fw-semibold">Confirm New Password</label>
                            <input
                              id="confirm-new-password"
                              type="password"
                              className="form-control form-control-sm"
                              placeholder="Re-enter new password"
                              value={passwords.confirmPassword}
                              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <button type="submit" className="btn btn-danger btn-sm px-4 mb-2" disabled={saving}>
                          {saving ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Updating...
                            </>
                          ) : (
                            'Update Password'
                          )}
                        </button>
                      </form>

                      <hr />

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong className="text-dark small d-block">Two-Factor Authentication (2FA)</strong>
                          <span className="text-muted small">Protect your intern account with time-based OTP.</span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setAlert({ type: 'info', text: 'Time-based OTP two-factor authentication is configured for your role by organizational policy.' })}
                        >
                          2FA Settings
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
