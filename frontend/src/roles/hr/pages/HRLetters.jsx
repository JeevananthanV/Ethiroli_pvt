import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';

const LETTER_TEMPLATES = [
  {
    id: 'offer-letter',
    title: 'Offer Letter',
    category: 'Employment',
    description: 'Formal employment offer letter stating designation, compensation, joining date, and terms.',
    template: `Date: {{current_date}}

To:
{{employee_name}}
{{address}}

Dear {{employee_name}},

Subject: Offer of Employment as {{designation}}

We are pleased to offer you the position of {{designation}} in the {{department}} Department at Ethiroli Pvt Ltd ("Company").

Key Terms of Employment:
1. Position: {{designation}}
2. Department: {{department}}
3. Reporting Manager: {{manager}}
4. Proposed Joining Date: {{joining_date}}
5. Annual Cost to Company (CTC): {{salary}}
6. Work Location: Chennai, India / Hybrid

We look forward to welcoming you to the Ethiroli team and building cutting-edge educational & technology platforms together.

Sincerely,

Authorized Signatory
Human Resources Department
Ethiroli Pvt Ltd`
  },
  {
    id: 'appointment-letter',
    title: 'Appointment Letter',
    category: 'Employment',
    description: 'Official confirmation of appointment post offer acceptance and document verification.',
    template: `Date: {{current_date}}

CONFIDENTIAL

To:
{{employee_name}}
Employee ID: {{employee_id}}

Dear {{employee_name}},

Subject: Letter of Appointment

With reference to your offer acceptance and subsequent document verification, we have pleasure in appointing you as {{designation}} in the {{department}} Department of Ethiroli Pvt Ltd with effect from {{joining_date}}.

Your initial probation period shall be {{duration}}, during which your performance and conduct will be reviewed by {{manager}}.

Welcome aboard, and we wish you a long, rewarding career with Ethiroli.

Warm regards,

Head of Human Resources
Ethiroli Pvt Ltd`
  },
  {
    id: 'internship-offer',
    title: 'Internship Offer Letter',
    category: 'Internship',
    description: 'Internship opportunity offer with mentorship track, duration, and stipend information.',
    template: `Date: {{current_date}}

To:
{{employee_name}}
College: {{college_name}}

Dear {{employee_name}},

Subject: Internship Offer - {{designation}}

We are thrilled to extend an offer for a {{duration}} internship at Ethiroli Pvt Ltd.

Internship Particulars:
- Track: {{designation}}
- Department: {{department}}
- Start Date: {{joining_date}}
- Duration: {{duration}}
- Assigned Mentor: {{manager}}
- Monthly Stipend: {{salary}}

During your internship, you will receive hands-on training, live project exposure, and periodic reviews. Successful completion will qualify you for an Internship Completion Certificate and potential Pre-Placement Offer (PPO).

Congratulations and welcome to Ethiroli!

Sincerely,

Human Resources Lead
Ethiroli Pvt Ltd`
  },
  {
    id: 'internship-certificate',
    title: 'Internship Completion Certificate',
    category: 'Internship',
    description: 'Certificate of completion awarded to interns following final project evaluation.',
    template: `CERTIFICATE OF INTERNSHIP COMPLETION
Ethiroli Pvt Ltd • Chennai, India

This is to certify that

{{employee_name}}
from {{college_name}}

has successfully completed an intensive {{duration}} internship in {{department}} as {{designation}} from {{joining_date}} to {{current_date}} under the guidance of {{manager}}.

During the internship tenure, {{employee_name}} exhibited outstanding technical skills, diligence, and dedication while delivering production projects.

We congratulate {{employee_name}} and wish them great success in all future professional endeavors.

Issued Date: {{current_date}}

Authorized Signatory
Chief Technology Officer & Head of People
Ethiroli Pvt Ltd`
  },
  {
    id: 'experience-letter',
    title: 'Experience Letter',
    category: 'Relieving / Exit',
    description: 'Official service record certifying employment tenure, roles held, and conduct.',
    template: `Date: {{current_date}}

TO WHOMSOEVER IT MAY CONCERN

This is to certify that {{employee_name}} was employed with Ethiroli Pvt Ltd as {{designation}} in the {{department}} Department from {{joining_date}} to {{current_date}}.

During their tenure, {{employee_name}} demonstrated strong professional capability, integrity, and dedication. They reported to {{manager}} and consistently met expectations.

{{employee_name}} is relieved of their duties at their own request. We wish them success in their future career pursuits.

For Ethiroli Pvt Ltd,

Authorized HR Signatory`
  },
  {
    id: 'relieving-letter',
    title: 'Relieving & No-Dues Letter',
    category: 'Relieving / Exit',
    description: 'Formal confirmation that the employee/intern is relieved of all organizational obligations.',
    template: `Date: {{current_date}}

To:
{{employee_name}}

Dear {{employee_name}},

Subject: Relieving Letter & Full and Final Clearance

With reference to your resignation letter and subsequent handover, we confirm that you are relieved from your duties as {{designation}} at Ethiroli Pvt Ltd at the close of business hours on {{current_date}}.

All company assets and credentials have been returned in satisfactory order. There are no outstanding dues pending against you.

We thank you for your contributions during your tenure and wish you the best for your future.

Yours sincerely,

HR Operations
Ethiroli Pvt Ltd`
  }
];

export default function HRLetters() {
  const [selectedTemplate, setSelectedTemplate] = useState(LETTER_TEMPLATES[0]);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const [variables, setVariables] = useState({
    employee_name: 'Priyadharshini Kumar',
    employee_id: 'ETH-2026-042',
    designation: 'Software Engineer',
    department: 'Engineering',
    manager: 'Karthik Subramanian',
    joining_date: '2026-10-15',
    salary: '₹ 8,50,000 per annum',
    duration: '3 Months',
    college_name: 'College of Engineering Guindy, Anna University',
    address: 'Anna Nagar, Chennai - 600040',
    current_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleOpenGenerator = (tpl) => {
    setSelectedTemplate(tpl);
    generateContent(tpl, variables);
    setShowGeneratorModal(true);
  };

  const generateContent = (tpl, vars) => {
    let text = tpl.template;
    Object.entries(vars).forEach(([key, val]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      text = text.replace(regex, val || `[${key}]`);
    });
    setGeneratedLetter(text);
  };

  const handleVariableChange = (key, value) => {
    const updated = { ...variables, [key]: value };
    setVariables(updated);
    generateContent(selectedTemplate, updated);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${selectedTemplate.title} - Ethiroli HR</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; font-size: 14pt; line-height: 1.6; color: #111; }
            pre { font-family: inherit; white-space: pre-wrap; word-wrap: break-word; }
            .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 25px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin:0;">ETHIROLI PRIVATE LIMITED</h2>
            <div style="font-size:10pt; color:#555;">Official HR & People Operations Document</div>
          </div>
          <pre>${generatedLetter}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    showToast('Letter copied to clipboard!');
  };

  return (
    <AdminPage
      title="HR Letters & Document Generator"
      subtitle="Generate, preview, and print official HR letters using dynamic variable templates"
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

        {/* Template Catalog Grid */}
        <div className="row g-4">
          {LETTER_TEMPLATES.map((tpl) => (
            <div className="col-md-6 col-lg-4" key={tpl.id}>
              <div className="card h-100" style={{ border: '1px solid #e2e8f0', borderRadius: '0.75rem' }}>
                <div className="cardHeader" style={{ background: '#f8fafc', padding: '1rem' }}>
                  <span className="badge bg-secondary mb-2">{tpl.category}</span>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{tpl.title}</h4>
                </div>
                <div className="cardBody" style={{ padding: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', minHeight: '45px' }}>
                    {tpl.description}
                  </p>
                </div>
                <div className="cardFooter" style={{ background: '#ffffff', borderTop: '1px solid #f1f5f9', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleOpenGenerator(tpl)}
                  >
                    <i className="bi bi-file-earmark-text me-1" /> Generate Letter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Generator & Preview Modal */}
        <Modal
          isOpen={showGeneratorModal}
          onClose={() => setShowGeneratorModal(false)}
          title={`Generate ${selectedTemplate?.title}`}
        >
          <div className="row g-3">
            {/* Variables Panel */}
            <div className="col-lg-5" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '12px' }}>
              <h6 className="fw-bold mb-3"><i className="bi bi-sliders me-1" /> Template Placeholders</h6>
              
              <div className="mb-2">
                <label className="form-label small">Recipient / Employee Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={variables.employee_name}
                  onChange={(e) => handleVariableChange('employee_name', e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small">Designation / Role Title</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={variables.designation}
                  onChange={(e) => handleVariableChange('designation', e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small">Department</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={variables.department}
                  onChange={(e) => handleVariableChange('department', e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small">Reporting Manager / Mentor</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={variables.manager}
                  onChange={(e) => handleVariableChange('manager', e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small">Joining / Start Date</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={variables.joining_date}
                  onChange={(e) => handleVariableChange('joining_date', e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small">Salary / Stipend / CTC</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={variables.salary}
                  onChange={(e) => handleVariableChange('salary', e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small">Duration / Probation Period</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={variables.duration}
                  onChange={(e) => handleVariableChange('duration', e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small">College / Institute (if Intern)</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={variables.college_name}
                  onChange={(e) => handleVariableChange('college_name', e.target.value)}
                />
              </div>
            </div>

            {/* Letter Live Preview */}
            <div className="col-lg-7">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0"><i className="bi bi-file-earmark-richtext me-1" /> Live Preview</h6>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-sm btn-outline-secondary" onClick={handleCopy}>
                    <i className="bi bi-clipboard me-1" /> Copy Text
                  </button>
                  <button className="btn btn-sm btn-success" onClick={handlePrint}>
                    <i className="bi bi-printer me-1" /> Print / Save PDF
                  </button>
                </div>
              </div>
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '1.25rem',
                  height: '60vh',
                  overflowY: 'auto',
                  fontFamily: 'serif',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                {generatedLetter}
              </div>
            </div>
          </div>

          <div className="text-end mt-4">
            <button className="btn btn-secondary" onClick={() => setShowGeneratorModal(false)}>Close</button>
          </div>
        </Modal>
      </div>
    </AdminPage>
  );
}
