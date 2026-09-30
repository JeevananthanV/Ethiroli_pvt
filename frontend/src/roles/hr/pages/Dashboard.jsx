import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHrData } from '../../../hooks/useHrData';
import { getDashboardMetrics } from '../../../../services/api/hrApi.standardized.js';
import './Dashboard.css';

const empty = {
  totalEmployees: 0,
  totalInterns: 0,
  onLeaveToday: 0,
  presentToday: 0,
  pendingLeaves: 0,
  openJobs: 0,
  upcomingInterviews: 0,
  totalApplications: 0,
  totalInquiries: 0
};

/**
 * HRDashboard - Dynamic Dashboard with Proper Data Flow
 * 
 * Uses useHrData hook for consistent state management,
 * hrApi.standardized.js for consistent API calls,
 * and AdminPage for unified loading/error/empty states.
 */
export default function HRDashboard() {
  // --- Data Hook with Proper Flow ---
  const {
    data: rawMetrics,
    loading,
    error,
    refresh,
  } = useHrData(
    getDashboardMetrics,
    undefined,
    undefined,
    undefined,
    undefined
  );

  const metrics = rawMetrics && typeof rawMetrics === 'object' && !Array.isArray(rawMetrics)
    ? { ...empty, ...rawMetrics }
    : empty;

  const attendance = metrics.totalEmployees > 0
    ? Math.min(100, Math.max(0, Math.round((metrics.presentToday / metrics.totalEmployees) * 100)))
    : 0;

  // cards derived from metrics
  const cards = [
    ['Active employees', metrics.totalEmployees, 'bi-people', 'indigo', 'Across all departments'],
    ['Job applications', metrics.totalApplications, 'bi-person-lines-fill', 'purple', 'From website career page'],
    ['Website inquiries', metrics.totalInquiries, 'bi-envelope-paper', 'green', 'From marketing contact form'],
    ['Pending leave', metrics.pendingLeaves, 'bi-calendar2-week', 'amber', 'Needs your review'],
    ['Open roles', metrics.openJobs, 'bi-briefcase', 'indigo', `${metrics.upcomingInterviews} interviews scheduled`],
  ];

  return (
    <section className="hr-dashboard" aria-labelledby="hr-title">
      <header className="hr-hero">
        <div>
          <span className="hr-eyebrow"><i /> PEOPLE OPERATIONS & TALENT</span>
          <h1 id="hr-title">Good morning, HR team.</h1>
          <p>Your workforce pulse, live career applications, and website inquiries, all in one place.</p>
        </div>
        <div className="hr-hero-actions">
          <button onClick={refresh} disabled={loading}>
            <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`} /> Refresh
          </button>
          <Link to="/app/hr/applications">
            <i className="bi bi-person-lines-fill" /> Review Applications
          </Link>
          <Link to="/app/hr/inquiries">
            <i className="bi bi-envelope-paper" /> View Inquiries
          </Link>
        </div>
      </header>

      {error && <p className="hr-alert" role="alert"><i className="bi bi-exclamation-circle" /> {error}</p>}

      <div className="hr-metrics">
        {cards.map(([label, value, icon, tone, detail]) => (
          <article className={`hr-metric ${tone}`} key={label}>
            <i className={`bi ${icon}`} />
            <p>{label}</p>
            <strong>{loading ? '—' : value}</strong>
            <small>{detail}</small>
          </article>
        ))}
      </div>

      <div className="hr-grid">
        <article className="hr-panel">
          <div className="hr-heading">
            <div><span> TODAY'S FOCUS</span><h2>Priority queue</h2></div>
            <Link to="/app/hr/leaves">View all <i className="bi bi-arrow-up-right" /></Link>
          </div>
          <div className="hr-queue">
            <Link to="/app/hr/applications">
              <b className="purple"><i className="bi bi-person-lines-fill" /></b>
              <span>
                <strong>Career Applications</strong>
                <small>{metrics.totalApplications ? `${metrics.totalApplications} applicant${metrics.totalApplications > 1 ? 's' : ''} awaiting review` : 'No new applications'}</small>
              </span>
              <em>{metrics.totalApplications}</em>
              <i className="bi bi-chevron-right" />
            </Link>
            <Link to="/app/hr/inquiries">
              <b className="green"><i className="bi bi-envelope-paper" /></b>
              <span>
                <strong>Website Inquiries</strong>
                <small>{metrics.totalInquiries ? `${metrics.totalInquiries} message${metrics.totalInquiries > 1 ? 's' : ''} in contact inbox` : 'Inbox clear'}</small>
              </span>
              <em>{metrics.totalInquiries}</em>
              <i className="bi bi-chevron-right" />
            </Link>
            <Link to="/app/hr/leaves">
              <b className="amber"><i className="bi bi-calendar-check" /></b>
              <span>
                <strong>Leave approvals</strong>
                <small>{metrics.pendingLeaves ? `${metrics.pendingLeaves} request${metrics.pendingLeaves > 1 ? 's' : ''} awaiting a decision` : 'No requests awaiting review'}</small>
              </span>
              <em>{metrics.pendingLeaves}</em>
              <i className="bi bi-chevron-right" />
            </Link>
            <Link to="/app/hr/interviews">
              <b className="purple"><i className="bi bi-person-video3" /></b>
              <span>
                <strong>Interview schedule</strong>
                <small>{metrics.upcomingInterviews ? `${metrics.upcomingInterviews} interviews coming up` : 'No interviews scheduled'}</small>
              </span>
              <em>{metrics.upcomingInterviews}</em>
              <i className="bi bi-chevron-right" />
            </Link>
          </div>
        </article>

        <article className="hr-panel attendance">
          <div className="hr-heading">
            <div><span> WORKFORCE HEALTH</span><h2>Today's attendance</h2></div>
            <mark><i /> Live Database</mark>
          </div>
          <div className="hr-ring" style={{ '--rate': `${attendance}%` }}>
            <div><strong>{attendance}%</strong><small>present</small></div>
          </div>
          <p>
            <span><i className="bi bi-person-check-fill" /> {metrics.presentToday} present</span>
            <span><i className="bi bi-person-dash-fill" /> {metrics.onLeaveToday} on leave</span>
          </p>
          <Link to="/app/hr/attendance">Open attendance register <i className="bi bi-arrow-right" /></Link>
        </article>
      </div>

      <section className="hr-panel quick">
        <div className="hr-heading">
          <div><span> QUICK ACCESS</span><h2>Manage your workday</h2></div>
        </div>
        <div>
          {[
            ['applications', 'bi-person-lines-fill', 'Job Applications', 'Candidate pipeline & resume links'],
            ['inquiries', 'bi-envelope-paper', 'Inquiries', 'Marketing contact messages'],
            ['employees', 'bi-person-badge', 'Employees', 'Directory & records'],
            ['onboarding', 'bi-rocket-takeoff', 'Onboarding', 'New joiner journeys'],
            ['payroll', 'bi-wallet2', 'Payroll', 'Compensation hub'],
            ['documents', 'bi-folder2-open', 'Documents', 'Secure employee files'],
            ['reports', 'bi-bar-chart-line', 'Reports', 'People analytics']
          ].map(([path, icon, name, detail]) => (
            <Link key={path} to={`/app/hr/${path}`}>
              <i className={`bi ${icon}`} />
              <strong>{name}</strong>
              <small>{detail}</small>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}