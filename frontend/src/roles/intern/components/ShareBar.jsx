import React, { useState } from 'react';
import InlineNotice from './InlineNotice.jsx';
import {
  buildShareTargets,
  tryNativeShare,
  copyToClipboard,
  openShareWindow,
} from './documentActions.js';

/**
 * Social share row for a document or certificate.
 *
 * Prefers the OS share sheet where it exists (so mobile users get WhatsApp,
 * Messages, etc. natively), and always renders explicit per-network buttons so
 * the action is reachable on desktop too.
 */
export default function ShareBar({ title, text, url, label = 'Share', onShared }) {
  const [notice, setNotice] = useState('');
  const targets = buildShareTargets({ title, text, url });
  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  const handleTarget = (t) => {
    openShareWindow(t.href);
    if (onShared) onShared(t.label);
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(url);
    setNotice(ok ? 'Link copied to clipboard.' : 'Could not copy — please copy the address bar instead.');
  };

  const handleNative = async () => {
    const used = await tryNativeShare({ title, text, url });
    if (!used) setNotice('Sharing is not available on this device — use a network below.');
    else if (onShared) onShared('Share sheet');
  };

  return (
    <div className="ims-sharebar">
      <div className="d-flex flex-wrap align-items-center gap-2">
        <span className="ims-sharebar-label">
          <i className="bi bi-share me-1" aria-hidden="true" />
          {label}
        </span>

        {canNativeShare && (
          <button type="button" className="ims-share-btn ims-share-native" onClick={handleNative}>
            <i className={`bi ${canNativeShare ? 'bi-share' : 'bi-share'}`} aria-hidden="true" />
            <span>Share</span>
          </button>
        )}

        {targets.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`ims-share-btn ${t.className}`}
            onClick={() => handleTarget(t)}
            title={`Share on ${t.label}`}
            aria-label={`Share on ${t.label}`}
          >
            <i className={`bi ${t.icon}`} aria-hidden="true" />
            <span>{t.label}</span>
          </button>
        ))}

        <button type="button" className="ims-share-btn ims-share-copy" onClick={handleCopy}>
          <i className="bi bi-link-45deg" aria-hidden="true" />
          <span>Copy link</span>
        </button>
      </div>

      {notice && (
        <div className="mt-2">
          <InlineNotice message={notice} onDismiss={() => setNotice('')} />
        </div>
      )}
    </div>
  );
}
