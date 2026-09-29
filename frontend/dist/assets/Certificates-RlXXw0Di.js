import{r as a,j as i}from"./vendor-react-DjmqOxD7.js";import{A as j}from"./AdminPage-BO7_p5hn.js";import{a as b}from"./ErrorBoundary-Cl9MLlId.js";const h=t=>t?.data??null,N=async t=>{const s=await b.get("/v1/certificates",{params:t});return h(s)},_=N,k=async t=>{const s=await b.get(`/v1/certificates/${t}/download`);return h(s)},o=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),v=t=>{if(!t)return"N/A";const s=new Date(t);return Number.isNaN(s.getTime())?String(t):s.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})};function z(t){const s=o(t.student_name||t.full_name||"Learner"),u=o(t.course_name||t.course_title||t.title||"Course"),r=o(t.course_code||""),f=o(t.certificate_number||""),d=o(v(t.issue_date||t.issued_at)),p=o(t.tutor_name||""),m=o(`${window.location.origin}/api/v1/certificates/verify/${t.certificate_number||""}`);return`<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Certificate - ${s}</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  body { margin:0; font-family: Georgia, 'Times New Roman', serif; background:#f7f5f1; color:#1f2937; }
  .sheet { position:relative; width:275mm; min-height:190mm; margin:20px auto; background:#fff;
           border:2px solid #819E35; box-sizing:border-box; padding:26mm 22mm; text-align:center; }
  .sheet:before { content:''; position:absolute; inset:7mm; border:1px solid rgba(128,158,53,.45); pointer-events:none; }
  .eyebrow { letter-spacing:.34em; font-size:11px; text-transform:uppercase; color:#819E35; }
  h1 { font-size:44px; margin:14px 0 6px; color:#1A4B48; font-weight:600; }
  .lead { font-size:15px; color:#6b7280; margin:0 0 26px; }
  .name { font-size:34px; margin:10px 0; color:#111827; border-bottom:1px solid #d6d3cd; display:inline-block; padding:0 40px 8px; }
  .course { font-size:24px; margin:26px 0 4px; color:#AF431E; }
  .meta { margin-top:34px; display:flex; justify-content:space-between; font-size:12px; color:#6b7280; }
  .meta div { text-align:left; }
  .meta b { display:block; color:#1f2937; font-size:13px; }
  .seal { position:absolute; right:22mm; bottom:22mm; width:34mm; height:34mm; border:2px solid #819E35;
          border-radius:50%; display:flex; align-items:center; justify-content:center; text-align:center;
          font-size:10px; letter-spacing:.08em; color:#819E35; text-transform:uppercase; }
  .verify { margin-top:26px; font-size:11px; color:#9ca3af; word-break:break-all; }
</style>
</head>
<body>
  <div class="sheet">
    <div class="eyebrow">Ethiroli Learning</div>
    <h1>Certificate of Completion</h1>
    <p class="lead">This is to certify that</p>
    <div class="name">${s}</div>
    <p class="lead">has successfully completed the course</p>
    <div class="course">${u}${r?` (${r})`:""}</div>
    <div class="meta">
      <div><b>Certificate No.</b>${f||"-"}</div>
      <div><b>Issued On</b>${d}</div>
      <div><b>Issued By</b>${p||"Ethiroli"}</div>
    </div>
    <div class="seal">Verified<br />Completion</div>
    <div class="verify">Verify: ${m}</div>
  </div>
  <script>window.onload = function () { setTimeout(function () { window.print(); }, 400); };<\/script>
</body>
</html>`}function T(){const[t,s]=a.useState([]),[u,r]=a.useState(!0),[f,d]=a.useState(null),[p,m]=a.useState(null),[g,l]=a.useState(null),x=a.useCallback(async()=>{r(!0),d(null);try{const e=await _().catch(()=>[]);s(Array.isArray(e)?e:[])}catch(e){d(e.message||"Failed to load certificates")}finally{r(!1)}},[]);a.useEffect(()=>{x()},[x]);const w=a.useCallback(async e=>{m(e.id);try{const y=await k(e.id).catch(()=>e)||e,c=window.open("","_blank");if(!c){l("Allow pop-ups to open the printable certificate.");return}c.document.write(z(y)),c.document.close()}catch(n){l(n.message||"Could not prepare the certificate download.")}finally{m(null)}},[]),C=a.useCallback(async e=>{const n=`${window.location.origin}/api/v1/certificates/verify/${e.certificate_number||""}`;try{await navigator.clipboard.writeText(n),l("Verification link copied to clipboard.")}catch{l(n)}},[]);return i.jsx(j,{title:"My Certificates",subtitle:"View, print and share the certificates you have earned",loading:u,error:f,onRetry:x,children:i.jsxs("div",{className:"dashboard",children:[g&&i.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,padding:"10px 14px",marginBottom:18,borderRadius:8,background:"rgba(129, 158, 53, 0.12)",border:"1px solid rgba(129, 158, 53, 0.4)",fontSize:13},children:[i.jsx("span",{children:g}),i.jsx("button",{onClick:()=>l(null),className:"btn secondary",style:{padding:"4px 10px"},children:"Dismiss"})]}),t.length===0?i.jsxs("div",{className:"emptyState",children:[i.jsx("h3",{children:"No certificates yet"}),i.jsx("p",{children:"Complete every lesson in a course and your certificate is issued automatically."})]}):i.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:18},children:t.map(e=>{const n=e.course_name||e.course_title||e.title||"Certificate",y=e.student_name||e.full_name||"",c=e.issue_date||e.issued_at;return i.jsxs("div",{className:"card",style:{display:"flex",flexDirection:"column"},children:[i.jsxs("div",{className:"cardHeader",children:[i.jsx("h3",{className:"cardTitle",style:{fontSize:16},children:n}),i.jsx("span",{className:"statusTag active",style:{fontSize:11},children:"Issued"})]}),i.jsxs("div",{className:"cardBody",style:{flex:1,display:"flex",flexDirection:"column"},children:[i.jsxs("div",{style:{border:"2px dashed rgba(129, 158, 53, 0.6)",borderRadius:8,padding:"16px 14px",textAlign:"center",background:"rgba(129, 158, 53, 0.06)"},children:[i.jsx("div",{style:{fontSize:10,letterSpacing:"0.24em",textTransform:"uppercase",color:"var(--admin-primary)"},children:"Certificate of Completion"}),i.jsx("div",{style:{fontSize:18,margin:"8px 0 4px",fontWeight:600},children:y||"You"}),i.jsxs("div",{style:{fontSize:12,color:"var(--admin-text-secondary)"},children:[e.course_code?`${e.course_code} · `:"",v(c)]}),i.jsxs("div",{style:{fontSize:11,color:"var(--admin-text-muted)",marginTop:8},children:["No. ",e.certificate_number||"—"]})]}),i.jsxs("div",{style:{display:"flex",gap:8,marginTop:16},children:[i.jsx("button",{className:"btn primary",style:{flex:1},disabled:p===e.id,onClick:()=>w(e),children:p===e.id?"Preparing…":"Download PDF"}),i.jsx("button",{className:"btn secondary",onClick:()=>C(e),title:"Copy the public verification link",children:"Copy Verify Link"})]})]})]},e.id)})})]})})}export{T as default};
