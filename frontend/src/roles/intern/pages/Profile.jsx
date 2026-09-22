import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { useAuth } from '../../../common/hooks/useAuth.js';

export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    firstName: user?.firstName || 'Jeevananthan',
    lastName: user?.lastName || 'V',
    email: user?.email || 'jeeva@ethiroli.net',
    phone: user?.phone || '+91 63800 49042',
    domain: 'Full-Stack Web Engineering',
    cohort: 'Cohort 2026-Q3',
    college: 'Government College of Engineering, Salem',
    degree: 'B.E. Computer Science & Engineering',
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    mentorName: 'Karthik Raja',
    github: 'https://github.com/jeevananthan',
    linkedin: 'https://linkedin.com/in/jeevananthan',
    bio: 'Aspiring Full-Stack Software Engineer passionate about React, Node.js, and high-performance branding platforms.'
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminPage
      title="Intern Profile & Identity"
      subtitle="Manage your personal information, academic credentials, and internship details"
    >
      <div className="container-fluid px-0">
        {saved && (
          <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
            <i className="bi bi-check-circle me-2"></i>Profile details successfully updated!
            <button type="button" className="btn-close" onClick={() => setSaved(false)}></button>
          </div>
        )}

        <div className="row g-4 mb-4">
          {/* Identity Card */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 text-center p-4">
              <div
                className="bg-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold fs-2"
                style={{ width: '90px', height: '90px' }}
              >
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </div>
              <h4 className="fw-bold mb-1">{profile.firstName} {profile.lastName}</h4>
              <p className="badge bg-primary-subtle text-primary border mb-3">{profile.domain}</p>

              <div className="text-start border-top pt-3 small">
                <p className="mb-2 text-muted">
                  <i className="bi bi-mortarboard me-2 text-primary"></i>{profile.college}
                </p>
                <p className="mb-2 text-muted">
                  <i className="bi bi-journal-bookmark me-2 text-primary"></i>{profile.degree}
                </p>
                <p className="mb-2 text-muted">
                  <i className="bi bi-person-check me-2 text-primary"></i>Mentor: <strong>{profile.mentorName}</strong>
                </p>
                <p className="mb-2 text-muted">
                  <i className="bi bi-calendar-range me-2 text-primary"></i>{profile.startDate} to {profile.endDate}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 border-0">
                <h5 className="mb-0 fw-bold">Edit Profile Details</h5>
              </div>
              <div className="card-body p-4 pt-0">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <label className="form-label small fw-semibold">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label small fw-semibold">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <label className="form-label small fw-semibold">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label small fw-semibold">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <label className="form-label small fw-semibold">GitHub Profile URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={profile.github}
                        onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label small fw-semibold">LinkedIn Profile URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={profile.linkedin}
                        onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Professional Bio</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary px-4 fw-semibold">
                    Save Profile Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
