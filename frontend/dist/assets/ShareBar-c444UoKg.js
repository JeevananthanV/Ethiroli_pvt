import{r as b,j as t}from"./vendor-react-CyNzO99t.js";import{I as u}from"./InlineNotice-DUdOSySP.js";function f(a,e){const i=document.createElement("a");i.href=a,i.download=e,i.rel="noopener",document.body.appendChild(i),i.click(),document.body.removeChild(i)}function $(a,e,i="text/plain;charset=utf-8"){const n=new Blob([a],{type:i}),o=URL.createObjectURL(n);f(o,e),setTimeout(()=>URL.revokeObjectURL(o),1e3)}function N(a,e="document"){return String(a||"").trim().replace(/[^\w\s.-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"")||e}function j(a){const e=i=>String(i??"").replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n]);return`<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${e(a.title)}</title>
<style>
  body{font-family:Georgia,'Times New Roman',serif;margin:0;padding:48px;background:#f8fafc;color:#1e293b}
  .sheet{max-width:820px;margin:0 auto;background:#fff;border:8px double #819E35;padding:56px 48px;text-align:center}
  h1{margin:0 0 4px;font-size:30px;letter-spacing:.04em;color:#0c1a19}
  .org{color:#819E35;font-weight:700;letter-spacing:.22em;text-transform:uppercase;font-size:12px}
  .sub{color:#64748b;font-size:13px;margin-top:6px}
  .rule{height:2px;background:#e2e8f0;margin:32px 0}
  .label{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#94a3b8;font-weight:700}
  .value{font-size:22px;font-weight:700;margin:6px 0 26px}
  .grid{display:flex;gap:28px;justify-content:center;flex-wrap:wrap;margin-top:8px}
  .cell{flex:1 1 200px;border:1px solid #e2e8f0;border-radius:10px;padding:16px}
  .cell .value{font-size:16px;margin:4px 0 0}
  .sig{margin-top:44px;font-style:italic;color:#334155;font-size:20px}
  .hash{margin-top:26px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11px;color:#64748b;word-break:break-all}
  @media print{body{background:#fff;padding:0}.sheet{border-color:#819E35}}
</style></head>
<body>
  <div class="sheet">
    <div class="org">Ethiroli</div>
    <h1>${e(a.title)}</h1>
    <div class="sub">Internship Management System &middot; Accredited Credential</div>
    <div class="rule"></div>

    <div class="label">Awarded to</div>
    <div class="value">${e(a.recipient)}</div>

    <div class="label">For the track</div>
    <div class="value">${e(a.track)}</div>

    <div class="grid">
      <div class="cell"><div class="label">Credential ID</div><div class="value">${e(a.certificateNumber)}</div></div>
      <div class="cell"><div class="label">Grade</div><div class="value">${e(a.grade)}</div></div>
      <div class="cell"><div class="label">Issued To</div><div class="value">${e(a.issuedTo)}</div></div>
    </div>

    <div class="sig">${e(a.authorizedSignatory)}</div>
    <div class="sub">${e(a.authorizedSignatoryTitle)}</div>

    <div class="hash">SHA-256: ${e(a.hash)}</div>
    <div class="sub" style="margin-top:10px">Verify at ${e(a.verifyUrl||"")}</div>
  </div>
</body></html>`}function C(a){return`https://ethiroli.net/verify/${a}`}async function v({title:a,text:e,url:i}){if(typeof navigator>"u"||!navigator.share)return!1;try{return await navigator.share({title:a,text:e,url:i}),!0}catch{return!1}}async function x(a){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(a),!0}catch{}try{const e=document.createElement("textarea");e.value=a,e.setAttribute("readonly",""),e.style.position="fixed",e.style.opacity="0",document.body.appendChild(e),e.select();const i=document.execCommand("copy");return document.body.removeChild(e),i}catch{return!1}}function g(a){window.open(a,"_blank","noopener,noreferrer")}function y({title:a,text:e,url:i}){const n=encodeURIComponent(i),o=encodeURIComponent(e),r=encodeURIComponent(`${e} ${i}`);return[{key:"whatsapp",label:"WhatsApp",icon:"bi-whatsapp",className:"ims-share-whatsapp",href:`https://wa.me/?text=${r}`},{key:"linkedin",label:"LinkedIn",icon:"bi-linkedin",className:"ims-share-linkedin",href:`https://www.linkedin.com/sharing/share-offsite/?url=${n}`},{key:"x",label:"X",icon:"bi-twitter-x",className:"ims-share-x",href:`https://twitter.com/intent/tweet?text=${o}&url=${n}`},{key:"facebook",label:"Facebook",icon:"bi-facebook",className:"ims-share-facebook",href:`https://www.facebook.com/sharer/sharer.php?u=${n}`},{key:"email",label:"Email",icon:"bi-envelope-fill",className:"ims-share-email",href:`mailto:?subject=${encodeURIComponent(a)}&body=${r}`}]}function S({title:a,text:e,url:i,label:n="Share",onShared:o}){const[r,l]=b.useState(""),d=y({title:a,text:e,url:i}),c=typeof navigator<"u"&&!!navigator.share,p=s=>{g(s.href),o&&o(s.label)},h=async()=>{const s=await x(i);l(s?"Link copied to clipboard.":"Could not copy — please copy the address bar instead.")},m=async()=>{await v({title:a,text:e,url:i})?o&&o("Share sheet"):l("Sharing is not available on this device — use a network below.")};return t.jsxs("div",{className:"ims-sharebar",children:[t.jsxs("div",{className:"d-flex flex-wrap align-items-center gap-2",children:[t.jsxs("span",{className:"ims-sharebar-label",children:[t.jsx("i",{className:"bi bi-share me-1","aria-hidden":"true"}),n]}),c&&t.jsxs("button",{type:"button",className:"ims-share-btn ims-share-native",onClick:m,children:[t.jsx("i",{className:"bi bi-share","aria-hidden":"true"}),t.jsx("span",{children:"Share"})]}),d.map(s=>t.jsxs("button",{type:"button",className:`ims-share-btn ${s.className}`,onClick:()=>p(s),title:`Share on ${s.label}`,"aria-label":`Share on ${s.label}`,children:[t.jsx("i",{className:`bi ${s.icon}`,"aria-hidden":"true"}),t.jsx("span",{children:s.label})]},s.key)),t.jsxs("button",{type:"button",className:"ims-share-btn ims-share-copy",onClick:h,children:[t.jsx("i",{className:"bi bi-link-45deg","aria-hidden":"true"}),t.jsx("span",{children:"Copy link"})]})]}),r&&t.jsx("div",{className:"mt-2",children:t.jsx(u,{message:r,onDismiss:()=>l("")})})]})}export{S,j as a,C as b,$ as c,f as d,N as s};
