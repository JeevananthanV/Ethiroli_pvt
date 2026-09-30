import React, { useEffect, useState, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listInquiries, convertInquiryToLead } from '../../../../services/api/hrApi.standardized.js';

const INQUIRY_CATEGORIES = ['ALL', 'Course Enquiry', 'Job Enquiry', 'Internship', 'General'];

const INITIAL_INQUIRIES_MOCK = [
  {
    id: 'INQ-101',
    sender_name: 'Saravanan Muthu',
    email: 'saravanan.m@gmail.com',
    phone: '+91 98405 11223',
    subject: 'Inquiry regarding Full Stack Web Development course fees and weekend batch timings',
    category: 'Course Enquiry',
    message: 'Hello, I am currently working in tech support and want to transition into Full Stack MERN development. Could you please share the syllabus, fees structure, and schedule for the upcoming weekend batch?',
    submitted_at: '2026-09-29',
    status: 'NEW'
  },
  {
    id: 'INQ-102',
    sender_name: 'Nandhini Jayaraman',
    email: 'nandhini.j@outlook.com',
    phone: '+91 97901 88990',
    subject: 'Summer Internship Opportunity for CSE 3rd Year students',
    category: 'Internship',
    message: 'Respected HR team, our university is commencing semester break and I am seeking a 3-month internship in React.js / Frontend. I have attached my GitHub portfolio link.',
    submitted_at: '2026-09-28',
    status: 'NEW'
  },
  {
    id: 'INQ-103',
    sender_name: 'Ganesh Pandian',
    email: 'ganesh.p@gmail.com',
    phone: '+91 94440 22334',
    subject: 'Application for Senior DevOps / AWS Architect role',
    category: 'Job Enquiry',
    message: 'Hi HR team, I noticed your opening on LinkedIn for DevOps. I have 5 years experience in Terraform, AWS ECS, and Docker. Can I submit my resume directly?',
    submitted_at: '2026-09-26',
    status: 'CONVERTED'
  },
  {
    id: 'INQ-104',
    sender_name: 'Dr. R. Chandrasekhar',
    email: 'chandrasekhar@college.edu',
    subject: 'College Campus Seminar & MoU Collaboration',
    category: 'General',
    message: 'We would like to invite Ethiroli leadership for an AI workshop at our college campus in October.',
    submitted_at: '2026-09-24',
    status: 'PROCESSED'
  }
];

export default function HRInquiries() {
  const {
    data: inquiries,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    listInquiries,
    undefined,
    undefined,
    undefined,
    undefined
  );

  const [localInquiries, setLocalInquiries] = useState(INITIAL_INQUIRIES_MOCK);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [convertTarget, setConvertTarget] = useState('Student Lead');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const inqList = useMemo(() => {
    if (Array.isArray(inquiries) && inquiries.length > 0) {
      return inquiries;
    }
    return localInquiries;
  }, [inquiries, localInquiries]);

  const filteredInquiries = useMemo(() => {
    return inqList.filter((inq) => {
      const name = (inq.sender_name || inq.name || '').toLowerCase();
      const sub = (inq.subject || '').toLowerCase();
      const q = (search || '').toLowerCase();
      const matchSearch = name.includes(q) || sub.includes(q) || (inq.email || '').toLowerCase().includes(q);
      const matchCat = categoryFilter === 'ALL' || inq.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [inqList, search, categoryFilter]);

  const handleOpenConvert = (inq, targetType) => {
    setSelectedInquiry(inq);
    setConvertTarget(targetType);
    setShowConvertModal(true);
  };

  const handleExecuteConvert = async (e) => {
    e.preventDefault();
    await convertInquiryToLead(selectedInquiry.id, convertTarget, {
      name: selectedInquiry.sender_name || selectedInquiry.name,
      email: selectedInquiry.email,
      phone: selectedInquiry.phone
    });

    setLocalInquiries(prev =>
      prev.map(i => (i.id === selectedInquiry.id ? { ...i, status: 'CONVERTED' } : i))
    );
    setShowConvertModal(false);
    showToast(`Inquiry converted to ${convertTarget} successfully!`);
  };

  return (
    <AdminPage
      title="Website Inquiries & Funnel Routing"
      subtitle="Classify inbound messages into Course Student Leads, Job Candidates, or Intern Prospects"
      loading={loading}
      error={error}
      onRetry={refresh}
    >
      <div className="dashboard">
        {toastMsg && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontWeight: 500
          }}>
            <i className="bi bi-check-circle-fill text-success me-2" />
            {toastMsg}
          </div>
        )}

        {/* Funnel Classification Banner */}
        <div className="card mb-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div className="cardBody" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Inbound Inquiry Classification & Funnel Routing
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {INQUIRY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat === 'ALL' ? 'All Inquiries' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search inquiries by sender name, subject, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ borderRadius: '0.5rem' }}
          />
        </div>

        {/* Inquiries Table */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Inbound Contact Inbox ({filteredInquiries.length})</h3>
          </div>
          <div className="cardBody" style={{ padding: 0 }}>
            {filteredInquiries.length === 0 ? (
              <div className="emptyState" style={{ padding: '3rem', textAlign: 'center' }}>
                <i className="bi bi-envelope-paper" style={{ fontSize: '2.5rem', color: '#94a3b8' }} />
                <h4 style={{ marginTop: '1rem' }}>No inquiries in inbox</h4>
                <p style={{ color: '#64748b' }}>All messages have been processed or routed.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Sender Name</th>
                      <th>Category</th>
                      <th>Subject & Preview</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Funnel Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInquiries.map((inq) => (
                      <tr key={inq.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{inq.sender_name || inq.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{inq.email} {inq.phone ? `• ${inq.phone}` : ''}</div>
                        </td>
                        <td>
                          <span className={`badge ${
                            inq.category === 'Course Enquiry' ? 'bg-success' :
                            inq.category === 'Internship' ? 'bg-info text-dark' :
                            inq.category === 'Job Enquiry' ? 'bg-primary' :
                            'bg-secondary'
                          }`}>
                            {inq.category}
                          </span>
                        </td>
                        <td style={{ maxWidth: '320px' }}>
                          <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {inq.subject}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {inq.message}
                          </div>
                        </td>
                        <td>{inq.submitted_at}</td>
                        <td>
                          <span className={`badge ${inq.status === 'CONVERTED' ? 'bg-success' : 'bg-light text-dark border'}`}>
                            {inq.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => {
                                setSelectedInquiry(inq);
                                setShowDetailModal(true);
                              }}
                            >
                              <i className="bi bi-eye me-1" /> Read
                            </button>

                            {inq.status !== 'CONVERTED' && inq.category === 'Course Enquiry' && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleOpenConvert(inq, 'Student Lead')}
                              >
                                <i className="bi bi-person-plus-fill me-1" /> To Student
                              </button>
                            )}

                            {inq.status !== 'CONVERTED' && inq.category === 'Job Enquiry' && (
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleOpenConvert(inq, 'Candidate')}
                              >
                                <i className="bi bi-briefcase-fill me-1" /> To Candidate
                              </button>
                            )}

                            {inq.status !== 'CONVERTED' && inq.category === 'Internship' && (
                              <button
                                className="btn btn-sm btn-info text-dark fw-bold"
                                onClick={() => handleOpenConvert(inq, 'Intern Candidate')}
                              >
                                <i className="bi bi-mortarboard-fill me-1" /> To Intern
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Read Message Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`Inquiry Details — ${selectedInquiry?.subject || 'Message'}`}
        >
          {selectedInquiry && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div>
                  <h5 className="mb-0">{selectedInquiry.sender_name || selectedInquiry.name}</h5>
                  <small className="text-muted">{selectedInquiry.email} {selectedInquiry.phone ? `• ${selectedInquiry.phone}` : ''}</small>
                </div>
                <span className="badge bg-primary">{selectedInquiry.category}</span>
              </div>

              <div className="card mb-3" style={{ background: '#f8fafc' }}>
                <div className="cardBody" style={{ padding: '1rem' }}>
                  <div className="fw-bold mb-2">{selectedInquiry.subject}</div>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{selectedInquiry.message}</div>
                </div>
              </div>

              <div className="text-end mt-4">
                <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
              </div>
            </div>
          )}
        </Modal>

        {/* Funnel Routing Conversion Modal */}
        <Modal
          isOpen={showConvertModal}
          onClose={() => setShowConvertModal(false)}
          title={`Route Inquiry to ${convertTarget}`}
        >
          <form onSubmit={handleExecuteConvert}>
            <div className="alert alert-success py-2 small mb-3">
              <i className="bi bi-funnel me-1" />
              Routing this inquiry will auto-create a pipeline entry under <strong>{convertTarget}</strong>.
            </div>

            <div className="mb-3">
              <label className="form-label">Contact Name</label>
              <input
                type="text"
                readOnly
                className="form-control"
                value={selectedInquiry?.sender_name || selectedInquiry?.name || ''}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                readOnly
                className="form-control"
                value={selectedInquiry?.email || ''}
              />
            </div>

            <div className="text-end mt-4">
              <button type="button" className="btn btn-secondary me-2" onClick={() => setShowConvertModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-success">Confirm Funnel Route</button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminPage>
  );
}