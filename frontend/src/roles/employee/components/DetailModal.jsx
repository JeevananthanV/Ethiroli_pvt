import React, { useEffect, useRef } from 'react';

/**
 * DetailModal - the shared "click a row to see the full record" dialog used by
 * the Employee portal (My Tasks, My Projects, Assignments, Messages,
 * Notifications).
 *
 * Built as a real modal rather than a Bootstrap `.modal` instance because the
 * portal does not load bootstrap.js, so `data-bs-toggle` never wired up and
 * previous "open detail" controls were inert. This handles its own overlay,
 * Escape key and focus so it works with markup only.
 *
 * Accessibility:
 *  - role="dialog" + aria-modal, labelled by `title`
 *  - focus moves into the dialog on open and returns to the trigger on close
 *  - Escape and backdrop click both close
 *  - background scroll is locked while open
 */

/** Renders `—` for empty values so a row never shows a blank cell. */
export const dash = (value) => (value === null || value === undefined || value === '' ? '—' : value);

export function DetailRow({ label, value, mono = false }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="emp-detail__row">
      <dt className="emp-detail__label">{label}</dt>
      <dd className={`emp-detail__value${mono ? ' font-monospace text-break' : ''}`}>{value}</dd>
    </div>
  );
}

export function DetailSection({ title, children, icon }) {
  if (!children) return null;
  return (
    <div className="emp-detail__section">
      {title && (
        <h6 className="emp-detail__section-title">
          {icon && <i className={`bi ${icon} me-2`} aria-hidden="true"></i>}
          {title}
        </h6>
      )}
      {children}
    </div>
  );
}

export default function DetailModal({
  open,
  onClose,
  title,
  subtitle,
  icon = 'bi-card-text',
  accent = 'primary',
  badge,
  children,
  footer,
  size = 'modal-lg'
}) {
  const dialogRef = useRef(null);
  const lastFocused = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    lastFocused.current = document.activeElement;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog so keyboard and screen-reader users land in the
    // content rather than continuing from behind the overlay.
    const timer = setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      clearTimeout(timer);
      if (lastFocused.current instanceof HTMLElement) {
        lastFocused.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="emp-modal-backdrop"
      onMouseDown={(e) => {
        // Only a click on the backdrop itself closes, so dragging a text
        // selection out of the dialog does not dismiss it.
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="empDetailTitle"
        tabIndex={-1}
      >
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header emp-detail__header">
            <div className={`emp-detail__icon emp-detail__icon--${accent}`} aria-hidden="true">
              <i className={`bi ${icon}`}></i>
            </div>
            <div className="flex-grow-1 min-w-0">
              <h5 className="modal-title emp-detail__title text-truncate" id="empDetailTitle">
                {title}
              </h5>
              {subtitle && <div className="emp-detail__subtitle text-truncate">{subtitle}</div>}
            </div>
            {badge}
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>

          <div className="modal-body emp-detail__body">{children}</div>

          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

/**
 * DetailBodyText - long free-text field (a task description, a message) rendered
 * with preserved line breaks inside a readable block.
 */
export function DetailBodyText({ children }) {
  if (!children) return null;
  return <div className="emp-detail__prose">{children}</div>;
}

/** Small labelled pill used inside the modal header. */
export function DetailBadge({ children, tone = 'secondary' }) {
  return <span className={`badge bg-${tone} bg-opacity-10 text-${tone} border border-${tone} border-opacity-25 emp-detail__badge`}>{children}</span>;
}
