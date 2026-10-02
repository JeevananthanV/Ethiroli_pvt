import React from 'react';

/**
 * Dismissible inline status message.
 *
 * Replaces the raw window.alert() calls that several intern buttons used to
 * fire. A browser alert blocks the page, cannot be styled, and reads as a
 * broken demo next to the rest of the portal; this renders in-flow instead.
 *
 * Pass an empty `message` to render nothing.
 */
export default function InlineNotice({ message, onDismiss, tone = 'info', icon = 'bi-info-circle' }) {
  if (!message) return null;

  return (
    <div
      className={`alert alert-${tone} d-flex align-items-center justify-content-between gap-3 py-2 px-3 mb-0`}
      role="status"
      aria-live="polite"
    >
      <span className="small">
        <i className={`bi ${icon} me-2`} aria-hidden="true" />
        {message}
      </span>
      {onDismiss && (
        <button type="button" className="btn-close" aria-label="Dismiss" onClick={onDismiss} />
      )}
    </div>
  );
}
