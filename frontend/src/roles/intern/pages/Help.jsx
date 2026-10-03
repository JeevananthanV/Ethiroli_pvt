import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { useModalDismiss, backdropClick } from '../components/useModalDismiss.js';

export default function InternHelp() {
  const [showModal, setShowModal] = useState(false);
  // Escape closes the dialog and stops the page scrolling behind it.
  useModalDismiss(showModal, () => setShowModal(false));
  const [tickets, setTickets] = useState([
    {
      id: 'ETH-1021',
      title: 'Unable to submit assignment for React Todo App',
      category: 'Training Issue',
      priority: 'High',
      status: 'IN_PROGRESS',
      assignedTo: 'HR / LMS Support',
      createdAt: 'Sep 21, 2026',
      description: 'The file upload was showing a network timeout error during code bundle upload.'
    },
    {
      id: 'ETH-1014',
      title: 'Clock-in location mismatch on remote days',
      category: 'Attendance Issue',
      priority: 'Medium',
      status: 'RESOLVED',
      assignedTo: 'HR Operations',
      createdAt: 'Sep 15, 2026',
      description: 'Clock-in tagged as office instead of remote mode.'
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical Issue',
    priority: 'Medium',
    description: ''
  });

  const categories = [
    'Technical Issue',
    'Attendance Issue',
    'Training Issue',
    'Payment / Stipend',
    'Document Issue',
    'Account Issue',
    'Other'
  ];

  // The FAQ used to be a Bootstrap accordion driven by data-bs-toggle, but
  // Bootstrap's JavaScript is never imported in this project (only its CSS),
  // so those data attributes were inert and clicking a question did nothing.
  // Driving the open/closed state from React fixes it without pulling the
  // whole Bootstrap JS bundle into a React tree.
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (id) => setOpenFaq((prev) => (prev === id ? null : id));

  const faqs = [
    {
      id: 'faq-attendance-correction',
      q: 'How do I request attendance correction for a missed clock-in?',
      a: (
        <>
          Navigate to the <strong>Attendance</strong> page, click the{' '}
          <strong>"Attendance Correction"</strong> button, select the date and
          provide your supervisor&apos;s approval note.
        </>
      )
    },
    {
      id: 'faq-stipends',
      q: 'When and how are monthly stipends disbursed?',
      a: (
        <>
          Stipends are credited on the 5th of each month to your registered bank
          account once your daily work logs and timesheets are verified by your
          mentor.
        </>
      )
    },
    {
      id: 'faq-certificate',
      q: 'How do I get my internship completion certificate?',
      a: (
        <>
          Once you complete the 45-day curriculum, pass the final evaluation,
          and achieve at least 90% attendance, your certificate will
          automatically be generated in the <strong>Certificates</strong> tab.
        </>
      )
    }
  ];

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    const newTicket = {
      id: `ETH-${Math.floor(1000 + Math.random() * 9000)}`,
      title: formData.title,
      category: formData.category,
      priority: formData.priority,
      status: 'OPEN',
      assignedTo: 'Support Queue',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: formData.description
    };

    setTickets([newTicket, ...tickets]);
    setShowModal(false);
    setFormData({ title: '', category: 'Technical Issue', priority: 'Medium', description: '' });
  };

  return (
    <AdminPage
      title="Help & Support Desk"
      subtitle="Submit support tickets, report technical difficulties, or ask administrative questions"
      actions={
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle"></i> Create Ticket
        </button>
      }
    >
      {/* Help Categories Banner */}
      <div className="row g-3 mb-2">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-3 fs-3">
                <i className="bi bi-headset"></i>
              </div>
              <div>
                <h6 className="mb-1 fw-bold text-dark">LMS & Tech Support</h6>
                <small className="text-muted">Portal issues, assignments, environment bugs</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 fs-3">
                <i className="bi bi-calendar-check"></i>
              </div>
              <div>
                <h6 className="mb-1 fw-bold text-dark">Attendance & Leaves</h6>
                <small className="text-muted">Clock-in corrections, leave approvals</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-3 fs-3">
                <i className="bi bi-cash-coin"></i>
              </div>
              <div>
                <h6 className="mb-1 fw-bold text-dark">HR & Stipends</h6>
                <small className="text-muted">Offer letters, stipend invoices, certificates</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Tickets Section */}
      <div className="card border-0 shadow-sm rounded-3 bg-white mb-2">
        <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold text-dark">
            <i className="bi bi-ticket-perforated me-2 text-primary"></i> My Support Tickets
          </h6>
          <span className="badge bg-light text-dark border">{tickets.length} Total</span>
        </div>
        <div className="card-body">
          {tickets.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox display-6 text-muted"></i>
              <p className="text-muted mt-3 mb-0">No support tickets yet.</p>
            </div>
          ) : (
            <div className="row g-3">
              {tickets.map((t) => (
                <div className="col-12 col-xl-6" key={t.id}>
                  <div className="ims-ticket-card h-100">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <span className="font-monospace fw-bold text-primary">{t.id}</span>
                      <span className={`badge ${
                        t.status === 'RESOLVED'
                          ? 'bg-success bg-opacity-10 text-success'
                          : t.status === 'IN_PROGRESS'
                          ? 'bg-warning bg-opacity-10 text-warning'
                          : 'bg-secondary bg-opacity-10 text-secondary'
                      }`}>
                        {t.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h6 className="fw-bold text-dark mb-1">{t.title}</h6>
                    <p className="text-muted small mb-3">{t.description}</p>

                    <div className="d-flex flex-wrap gap-2 mt-auto pt-2 border-top">
                      <span className="badge bg-light text-dark border">
                        <i className="bi bi-tag me-1"></i>{t.category}
                      </span>
                      <span className={`badge ${t.priority === 'High' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-info bg-opacity-10 text-info'}`}>
                        <i className="bi bi-flag me-1"></i>{t.priority}
                      </span>
                      <span className="badge bg-light text-dark border">
                        <i className="bi bi-person me-1"></i>{t.assignedTo}
                      </span>
                      <span className="badge bg-light text-dark border">
                        <i className="bi bi-calendar3 me-1"></i>{t.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions - each question is its own card so the
          rows align to a single grid instead of Bootstrap's accordion chrome,
          which left uneven backgrounds and a stray focus ring. */}
      <div className="card border-0 shadow-sm rounded-3 bg-white mb-2">
        <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold text-dark">
            <i className="bi bi-question-circle me-2 text-primary"></i> Frequently Asked Questions
          </h6>
          <span className="badge bg-light text-dark border">{faqs.length} Articles</span>
        </div>
        <div className="card-body">
          <div className="d-flex flex-column gap-3">
            {faqs.map((item) => {
              const isOpen = openFaq === item.id;
              return (
                <div
                  key={item.id}
                  className={`ims-faq-card${isOpen ? ' is-open' : ''}`}
                >
                  <button
                    type="button"
                    className="ims-faq-q"
                    onClick={() => toggleFaq(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`${item.id}-answer`}
                  >
                    <span className="ims-faq-q-text">{item.q}</span>
                    <i
                      className={`bi bi-chevron-down ims-faq-chevron${isOpen ? ' is-open' : ''}`}
                      aria-hidden="true"
                    ></i>
                  </button>

                  {isOpen && (
                    <div className="ims-faq-a" id={`${item.id}-answer`} role="region">
                      <i className="bi bi-lightbulb me-2" aria-hidden="true"></i>
                      <span>{item.a}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          aria-label="Create Support Ticket"
          onClick={backdropClick(() => setShowModal(false))}
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Create Support Ticket</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreateTicket}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label small fw-semibold">Category</label>
                    <select id="category"
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="subject-title" className="form-label small fw-semibold">Subject / Title</label>
                    <input id="subject-title"
                      type="text"
                      className="form-control"
                      placeholder="Brief summary of the issue..."
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="priority" className="form-label small fw-semibold">Priority</label>
                    <select id="priority"
                      className="form-select"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label small fw-semibold">Description</label>
                    <textarea id="description"
                      className="form-control"
                      rows="4"
                      placeholder="Explain the problem and include any error messages..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Submit Ticket</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
