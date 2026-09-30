import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function ReceptionRegistration() {
  const [formData, setFormData] = useState({
    candidate_type: 'STUDENT',
    full_name: '',
    email: '',
    phone: '',
    college: '',
    qualification: '',
    course_or_track: 'Full Stack Development',
    start_date: '',
    emergency_contact: ''
  });
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setFormData({
        candidate_type: 'STUDENT',
        full_name: '',
        email: '',
        phone: '',
        college: '',
        qualification: '',
        course_or_track: 'Full Stack Development',
        start_date: '',
        emergency_contact: ''
      });
    }, 3000);
  };

  return (
    <AdminPage
      title="Student & Intern Registration Form"
      subtitle="Direct on-campus registration portal for prospective trainees and intern onboarding"
    >
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
            {successMsg && (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-check-circle-fill fs-5"></i>
                <div>
                  <strong>Registration Successful!</strong> Temporary badge and orientation welcome kit generated.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label fw-bold">Candidate Type</label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="candidate_type"
                      id="typeStudent"
                      checked={formData.candidate_type === 'STUDENT'}
                      onChange={() => setFormData({ ...formData, candidate_type: 'STUDENT' })}
                    />
                    <label className="form-check-label" htmlFor="typeStudent">
                      Course Student
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="candidate_type"
                      id="typeIntern"
                      checked={formData.candidate_type === 'INTERN'}
                      onChange={() => setFormData({ ...formData, candidate_type: 'INTERN' })}
                    />
                    <label className="form-check-label" htmlFor="typeIntern">
                      Industrial Intern
                    </label>
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    required
                    placeholder="+91 "
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">College / University</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.college}
                    onChange={e => setFormData({ ...formData, college: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Track / Domain *</label>
                  <select
                    className="form-select"
                    value={formData.course_or_track}
                    onChange={e => setFormData({ ...formData, course_or_track: e.target.value })}
                  >
                    <option value="Full Stack Development">Full Stack Web Development</option>
                    <option value="Data Science & AI">Data Science & AI</option>
                    <option value="Cloud Computing">Cloud Computing & DevOps</option>
                    <option value="UI/UX Design">UI/UX Product Design</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Target Start Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    required
                    value={formData.start_date}
                    onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label">Emergency Contact Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Parent / Guardian phone number"
                  value={formData.emergency_contact}
                  onChange={e => setFormData({ ...formData, emergency_contact: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="reset" className="btn btn-light" onClick={() => setFormData({})}>Reset</button>
                <button type="submit" className="btn btn-primary d-flex align-items-center gap-2">
                  <i className="bi bi-person-plus-fill"></i>
                  <span>Submit Registration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
