import{r,j as e}from"./vendor-react-DjmqOxD7.js";import{A as C}from"./AdminPage-Dc0J-txs.js";import{M as _}from"./Modal-CzqZkKNw.js";const u=[{id:"offer-letter",title:"Offer Letter",category:"Employment",description:"Formal employment offer letter stating designation, compensation, joining date, and terms.",template:`Date: {{current_date}}

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
Ethiroli Pvt Ltd`},{id:"appointment-letter",title:"Appointment Letter",category:"Employment",description:"Official confirmation of appointment post offer acceptance and document verification.",template:`Date: {{current_date}}

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
Ethiroli Pvt Ltd`},{id:"internship-offer",title:"Internship Offer Letter",category:"Internship",description:"Internship opportunity offer with mentorship track, duration, and stipend information.",template:`Date: {{current_date}}

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
Ethiroli Pvt Ltd`},{id:"internship-certificate",title:"Internship Completion Certificate",category:"Internship",description:"Certificate of completion awarded to interns following final project evaluation.",template:`CERTIFICATE OF INTERNSHIP COMPLETION
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
Ethiroli Pvt Ltd`},{id:"experience-letter",title:"Experience Letter",category:"Relieving / Exit",description:"Official service record certifying employment tenure, roles held, and conduct.",template:`Date: {{current_date}}

TO WHOMSOEVER IT MAY CONCERN

This is to certify that {{employee_name}} was employed with Ethiroli Pvt Ltd as {{designation}} in the {{department}} Department from {{joining_date}} to {{current_date}}.

During their tenure, {{employee_name}} demonstrated strong professional capability, integrity, and dedication. They reported to {{manager}} and consistently met expectations.

{{employee_name}} is relieved of their duties at their own request. We wish them success in their future career pursuits.

For Ethiroli Pvt Ltd,

Authorized HR Signatory`},{id:"relieving-letter",title:"Relieving & No-Dues Letter",category:"Relieving / Exit",description:"Formal confirmation that the employee/intern is relieved of all organizational obligations.",template:`Date: {{current_date}}

To:
{{employee_name}}

Dear {{employee_name}},

Subject: Relieving Letter & Full and Final Clearance

With reference to your resignation letter and subsequent handover, we confirm that you are relieved from your duties as {{designation}} at Ethiroli Pvt Ltd at the close of business hours on {{current_date}}.

All company assets and credentials have been returned in satisfactory order. There are no outstanding dues pending against you.

We thank you for your contributions during your tenure and wish you the best for your future.

Yours sincerely,

HR Operations
Ethiroli Pvt Ltd`}];function P(){const[o,f]=r.useState(u[0]),[g,s]=r.useState(!1),[l,y]=r.useState(""),[c,m]=r.useState(""),[a,b]=r.useState({employee_name:"Priyadharshini Kumar",employee_id:"ETH-2026-042",designation:"Software Engineer",department:"Engineering",manager:"Karthik Subramanian",joining_date:"2026-10-15",salary:"₹ 8,50,000 per annum",duration:"3 Months",college_name:"College of Engineering Guindy, Anna University",address:"Anna Nagar, Chennai - 600040",current_date:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"})}),x=t=>{m(t),setTimeout(()=>m(""),4e3)},v=t=>{f(t),p(t,a),s(!0)},p=(t,d)=>{let i=t.template;Object.entries(d).forEach(([h,w])=>{const E=new RegExp(`{{${h}}}`,"g");i=i.replace(E,w||`[${h}]`)}),y(i)},n=(t,d)=>{const i={...a,[t]:d};b(i),p(o,i)},j=()=>{const t=window.open("","_blank");t.document.write(`
      <html>
        <head>
          <title>${o.title} - Ethiroli HR</title>
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
          <pre>${l}</pre>
        </body>
      </html>
    `),t.document.close(),t.focus(),t.print()},N=()=>{navigator.clipboard.writeText(l),x("Letter copied to clipboard!")};return e.jsx(C,{title:"HR Letters & Document Generator",subtitle:"Generate, preview, and print official HR letters using dynamic variable templates",children:e.jsxs("div",{className:"dashboard",children:[c&&e.jsxs("div",{style:{background:"#ecfdf5",color:"#065f46",border:"1px solid #a7f3d0",padding:"0.75rem 1rem",borderRadius:"0.5rem",marginBottom:"1rem",fontWeight:500},children:[e.jsx("i",{className:"bi bi-check-circle-fill text-success me-2"}),c]}),e.jsx("div",{className:"row g-4",children:u.map(t=>e.jsx("div",{className:"col-md-6 col-lg-4",children:e.jsxs("div",{className:"card h-100",style:{border:"1px solid #e2e8f0",borderRadius:"0.75rem"},children:[e.jsxs("div",{className:"cardHeader",style:{background:"#f8fafc",padding:"1rem"},children:[e.jsx("span",{className:"badge bg-secondary mb-2",children:t.category}),e.jsx("h4",{style:{margin:0,fontSize:"1.1rem",fontWeight:700},children:t.title})]}),e.jsx("div",{className:"cardBody",style:{padding:"1rem"},children:e.jsx("p",{style:{fontSize:"0.85rem",color:"#64748b",minHeight:"45px"},children:t.description})}),e.jsx("div",{className:"cardFooter",style:{background:"#ffffff",borderTop:"1px solid #f1f5f9",padding:"0.75rem 1rem",display:"flex",justifyContent:"flex-end"},children:e.jsxs("button",{className:"btn btn-sm btn-primary",onClick:()=>v(t),children:[e.jsx("i",{className:"bi bi-file-earmark-text me-1"})," Generate Letter"]})})]})},t.id))}),e.jsxs(_,{isOpen:g,onClose:()=>s(!1),title:`Generate ${o?.title}`,children:[e.jsxs("div",{className:"row g-3",children:[e.jsxs("div",{className:"col-lg-5",style:{maxHeight:"70vh",overflowY:"auto",paddingRight:"12px"},children:[e.jsxs("h6",{className:"fw-bold mb-3",children:[e.jsx("i",{className:"bi bi-sliders me-1"})," Template Placeholders"]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{className:"form-label small",children:"Recipient / Employee Name"}),e.jsx("input",{type:"text",className:"form-control form-control-sm",value:a.employee_name,onChange:t=>n("employee_name",t.target.value)})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{className:"form-label small",children:"Designation / Role Title"}),e.jsx("input",{type:"text",className:"form-control form-control-sm",value:a.designation,onChange:t=>n("designation",t.target.value)})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{className:"form-label small",children:"Department"}),e.jsx("input",{type:"text",className:"form-control form-control-sm",value:a.department,onChange:t=>n("department",t.target.value)})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{className:"form-label small",children:"Reporting Manager / Mentor"}),e.jsx("input",{type:"text",className:"form-control form-control-sm",value:a.manager,onChange:t=>n("manager",t.target.value)})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{className:"form-label small",children:"Joining / Start Date"}),e.jsx("input",{type:"text",className:"form-control form-control-sm",value:a.joining_date,onChange:t=>n("joining_date",t.target.value)})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{className:"form-label small",children:"Salary / Stipend / CTC"}),e.jsx("input",{type:"text",className:"form-control form-control-sm",value:a.salary,onChange:t=>n("salary",t.target.value)})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{className:"form-label small",children:"Duration / Probation Period"}),e.jsx("input",{type:"text",className:"form-control form-control-sm",value:a.duration,onChange:t=>n("duration",t.target.value)})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{className:"form-label small",children:"College / Institute (if Intern)"}),e.jsx("input",{type:"text",className:"form-control form-control-sm",value:a.college_name,onChange:t=>n("college_name",t.target.value)})]})]}),e.jsxs("div",{className:"col-lg-7",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-2",children:[e.jsxs("h6",{className:"fw-bold mb-0",children:[e.jsx("i",{className:"bi bi-file-earmark-richtext me-1"})," Live Preview"]}),e.jsxs("div",{style:{display:"flex",gap:"6px"},children:[e.jsxs("button",{className:"btn btn-sm btn-outline-secondary",onClick:N,children:[e.jsx("i",{className:"bi bi-clipboard me-1"})," Copy Text"]}),e.jsxs("button",{className:"btn btn-sm btn-success",onClick:j,children:[e.jsx("i",{className:"bi bi-printer me-1"})," Print / Save PDF"]})]})]}),e.jsx("div",{style:{background:"#ffffff",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"1.25rem",height:"60vh",overflowY:"auto",fontFamily:"serif",fontSize:"0.9rem",lineHeight:"1.6",whiteSpace:"pre-wrap",boxShadow:"inset 0 1px 3px rgba(0,0,0,0.05)"},children:l})]})]}),e.jsx("div",{className:"text-end mt-4",children:e.jsx("button",{className:"btn btn-secondary",onClick:()=>s(!1),children:"Close"})})]})]})})}export{P as default};
