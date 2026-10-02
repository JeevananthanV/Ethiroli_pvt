import React from 'react';

/**
 * StatCard - branded KPI tile used across the Employee portal.
 *
 * tone: olive | gold | clay | teal  (maps to the .emp-stat--* accent rail)
 */
export function StatCard({ label, value, hint, tone = 'olive', icon, delay = 0 }) {
  return (
    <div
      className={`emp-stat emp-stat--${tone} h-100`}
      style={{ '--emp-delay': `${delay}ms` }}
    >
      <div className="emp-reveal" style={{ '--emp-delay': `${delay}ms` }}>
        <div className="d-flex justify-content-between align-items-start gap-2">
          <div className="flex-grow-1">
            <div className="emp-stat__label">{label}</div>
            <div className="emp-stat__value">{value}</div>
            {hint && <div className="emp-stat__hint">{hint}</div>}
          </div>
          {icon && (
            <i className={`bi ${icon} fs-4 opacity-25`} aria-hidden="true"></i>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * EmptyState - consistent, branded empty/zero-data presentation.
 * Replaces ad-hoc inline markup so every page reads the same way.
 */
export function EmptyState({ icon = 'bi-inbox', title, text, action, compact = false }) {
  return (
    <div className="emp-empty" style={compact ? { padding: '1.5rem 1rem' } : undefined}>
      <div className="emp-empty__icon" aria-hidden="true">
        <i className={`bi ${icon}`}></i>
      </div>
      {title && <h5 className="emp-empty__title">{title}</h5>}
      {text && <p className="emp-empty__text">{text}</p>}
      {action}
    </div>
  );
}

/**
 * LiveDot - small pulsing indicator used for an open work session.
 */
export function LiveDot({ label }) {
  return (
    <span className="d-inline-flex align-items-center gap-2">
      <span className="emp-live-dot" aria-hidden="true"></span>
      {label && <span>{label}</span>}
    </span>
  );
}

export default StatCard;