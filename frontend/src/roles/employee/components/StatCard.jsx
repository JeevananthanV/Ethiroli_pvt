import React from 'react';

/**
 * Employee portal shared presentational primitives.
 *
 * NOTE: this file previously also exported a `StatCard` KPI tile and carried a
 * `export default StatCard`. Nothing imported either - the KPI tiles on the
 * Dashboard and Attendance pages hand-roll the `.emp-stat` markup directly, so
 * the component was unreachable dead code. It has been removed rather than
 * left in place. `EmptyState` and `LiveDot` below are both genuinely used.
 */

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
 *
 * The pulsing circle is decorative (`aria-hidden`), so a screen reader gets no
 * information from it unless a `label` is supplied. The Attendance page uses
 * this next to an adjacent "Current Session" caption; `label` exists so the
 * indicator can also announce itself for assistive technology.
 */
export function LiveDot({ label }) {
  return (
    <span className="d-inline-flex align-items-center gap-2">
      <span className="emp-live-dot" aria-hidden="true"></span>
      {label ? (
        <span className="visually-hidden">{label}</span>
      ) : null}
    </span>
  );
}