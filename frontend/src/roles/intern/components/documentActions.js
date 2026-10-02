/**
 * Real file downloads and social sharing for the intern portal.
 *
 * The Download buttons in Documents and Certificates previously only fired a
 * success message after a setTimeout - nothing was ever written to disk. These
 * helpers produce an actual file and hand it to the browser.
 */

/** Downloads a data: URI (used for the generated document previews). */
export function downloadDataUri(dataUri, filename) {
  const a = document.createElement('a');
  a.href = dataUri;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/** Downloads arbitrary text as a Blob, with the correct MIME type. */
export function downloadTextFile(text, filename, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  downloadDataUri(url, filename);
  // Give the browser a moment to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Turns a free-text title into a safe, readable filename. */
export function safeFilename(name, fallback = 'document') {
  const cleaned = String(name || '')
    .trim()
    .replace(/[^\w\s.-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return cleaned || fallback;
}

/**
 * A self-contained, printable certificate. A real PDF would need a PDF
 * library, so this ships a standalone HTML file that opens in any browser and
 * prints straight to PDF via the browser's own print dialog.
 */
export function buildCertificateHtml(cert) {
  const esc = (s) =>
    String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(cert.title)}</title>
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
    <h1>${esc(cert.title)}</h1>
    <div class="sub">Internship Management System &middot; Accredited Credential</div>
    <div class="rule"></div>

    <div class="label">Awarded to</div>
    <div class="value">${esc(cert.recipient || 'Intern')}</div>

    <div class="label">For the track</div>
    <div class="value">${esc(cert.track)}</div>

    <div class="grid">
      <div class="cell"><div class="label">Credential ID</div><div class="value">${esc(cert.certificateNumber)}</div></div>
      <div class="cell"><div class="label">Grade</div><div class="value">${esc(cert.grade)}</div></div>
      <div class="cell"><div class="label">Issued To</div><div class="value">${esc(cert.issuedTo)}</div></div>
    </div>

    <div class="sig">${esc(cert.authorizedSignatory || 'Authorised Signatory')}</div>
    <div class="sub">${esc(cert.authorizedSignatoryTitle || 'Ethiroli Internship Programme')}</div>

    <div class="hash">SHA-256: ${esc(cert.hash)}</div>
    <div class="sub" style="margin-top:10px">Verify at ${esc(cert.verifyUrl || '')}</div>
  </div>
</body></html>`;
}

/** Canonical public page for a credential, used as the share link. */
export function buildVerifyUrl(certificateNumber) {
  return `https://ethiroli.net/verify/${certificateNumber}`;
}

/**
 * Opens the OS share sheet where available (mobile), otherwise reports that
 * the caller should fall back to the individual network buttons.
 * @returns {boolean} true when the native sheet was used
 */
export async function tryNativeShare({ title, text, url }) {
  if (typeof navigator === 'undefined' || !navigator.share) return false;
  try {
    await navigator.share({ title, text, url });
    return true;
  } catch {
    // AbortError just means the user closed the sheet - not worth surfacing.
    return false;
  }
}

/** Copies text to the clipboard, with a fallback for non-secure contexts. */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function openShareWindow(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/** The share targets rendered by ShareBar, in display order. */
export function buildShareTargets({ title, text, url }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const combined = encodeURIComponent(`${text} ${url}`);

  return [
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: 'bi-whatsapp',
      className: 'ims-share-whatsapp',
      href: `https://wa.me/?text=${combined}`,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: 'bi-linkedin',
      className: 'ims-share-linkedin',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      key: 'x',
      label: 'X',
      icon: 'bi-twitter-x',
      className: 'ims-share-x',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: 'bi-facebook',
      className: 'ims-share-facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      key: 'email',
      label: 'Email',
      icon: 'bi-envelope-fill',
      className: 'ims-share-email',
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${combined}`,
    },
  ];
}
