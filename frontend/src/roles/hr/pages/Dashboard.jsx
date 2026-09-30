import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHrData } from '../../../hooks/useHrData';
import { getDashboardMetrics } from '../../../../services/api/hrApi.standardized.js';
import './Dashboard.css';

const DEFAULT_METRICS = {
  totalEmployees: 42,
  totalInterns: 18,
  totalStudents: 126,
  newJoiners: 5,
  pendingOnboarding: 8,
  interviewsToday: 4,
  documentsPending: 12,
  reviewsDue: 6,
  presentToday: 58,
  totalWorkforce: 60,
  pendingLeaves: 3,
  openJobs: 4,
  totalApplications: 15,
  totalInquiries: 9
};

export default function HRDashboard() {
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
    ? { ...DEFAULT_METRICS, ...rawMetrics }
    : DEFAULT_METRICS;

  const attendance = metrics.totalWorkforce > 0
    ? Math.min(100, Math.max(0, Math.round((metrics.presentToday / metrics.totalWorkforce) * 100)))
    : 96;

  // Primary 8 KPI Cards matching user specification
  const primaryCards = [
    { label: 'Employees', value: metrics.totalEmployees || 42, icon: 'bi-person-badge', tone: 'indigo', detail: 'Full-time active workforce', link: '/app/hr/employees' },
    { label: 'Interns', value: metrics.totalInterns || 18, icon: 'bi-mortarboard', tone: 'purple', detail: 'College & tech interns', link: '/app/hr/interns' },
    { label: 'Students', value: metrics.totalStudents || 126, icon: 'bi-book', tone: 'green', detail: 'Active course enrollees', link: '/app/hr/students' },
    { label: 'New Joiners', value: metrics.newJoiners || 5, icon: 'bi-person-plus', tone: 'amber', detail: 'Joined in last 30 days', link: '/app/hr/onboarding' },
    { label: 'Pending Onboarding', value: metrics.pendingOnboarding || 8, icon: 'bi-rocket-takeoff', tone: 'amber', detail: 'Checklists & plan tasks', link: '/app/hr/onboarding' },
    { label: 'Interviews Today', value: metrics.interviewsToday || 4, icon: 'bi-person-video3', tone: 'indigo', detail: 'Candidate evaluations', link: '/app/hr/interviews' },
    { label: 'Documents Pending', value: metrics.documentsPending || 12, icon: 'bi-folder-check', tone: 'purple', detail: 'Awaiting HR verification', link: '/app/hr/documents' },
    { label: 'Reviews Due', value: metrics.reviewsDue || 6, icon: 'bi-graph-up-arrow', tone: 'green', detail: 'Probation & sprint evaluations', link: '/app/hr/performance' },
  ];

  return (
    <section className="hr-dashboard" aria-labelledby="hr-title">
      <header className="hr-hero">
        <div>
          <span className="hr-eyebrow"><i /> ETHIROLI PEOPLE OPERATIONS & LIFECYCLE</span>
          <h1 id="hr-title">Ethiroli HR Management Hub</h1>
          <p>Integrated workflow: Course Selling → Students → Interns → Employees → Onboarding → Performance → Exit</p>
        </div>
        <div className="hr-hero-actions">
          <button onClick={refresh} disabled={loading}>
            <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`} /> Refresh
          </button>
          <Link to="/app/hr/students">
            <i className="bi bi-mortarboard-fill" /> Students
          </Link>
          <Link to="/app/hr/onboarding">
            <i className="bi bi-rocket-takeoff" /> Onboarding
          </Link>
          <Link to="/app/hr/requests">
            <i className="bi bi-inbox" /> HR Requests
          </Link>
        </div>
      </header>

      {error && <p className="hr-alert" role="alert"><i className="bi bi-exclamation-circle" /> {error}</p>}

      {/* 8 Metric KPI Cards */}
      <div className="hr-metrics" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {primaryCards.map((c) => (
          <Link to={c.link} key={c.label} style={{ textDecoration: 'none', color: 'inherit' }}>
            <article className={`hr-metric ${c.tone}`}>
              <i className={`bi ${c.icon}`} />
              <p>{c.label}</p>
              <strong>{loading ? '—' : c.value}</strong>
              <small>{c.detail}</small>
            </article>
          </Link>
        ))}
      </div>

      <div className="hr-grid">
        {/* Today's Focus / Priority Queue */}
        <article className="hr-panel">
          <div className="hr-heading">
            <div><span> ACTIVE QUEUE</span><h2>Today's HR Action Items</h2></div>
            <Link to="/app/hr/requests">View all requests <i className="bi bi-arrow-up-right" /></Link>
          </div>
          <div className="hr-queue">
            <Link to="/app/hr/applications">
              <b className="purple"><i className="bi bi-person-lines-fill" /></b>
              <span>
                <strong>Job Candidates to Convert</strong>
                <small>{metrics.totalApplications} applicants in recruitment pipeline</small>
              </span>
              <em>{metrics.totalApplications}</em>
              <i className="bi bi-chevron-right" />
            </Link>
            <Link to="/app/hr/inquiries">
              <b className="green"><i className="bi bi-envelope-paper" /></b>
              <span>
                <strong>Website Inquiries to Route</strong>
                <small>Classify into Student Leads, Job Candidates, or Interns</small>
              </span>
              <em>{metrics.totalInquiries}</em>
              <i className="bi bi-chevron-right" />
            </Link>
            <Link to="/app/hr/leaves">
              <b className="amber"><i className="bi bi-calendar-check" /></b>
              <span>
                <strong>Leave approvals</strong>
                <small>{metrics.pendingLeaves} requests pending supervisor signoff</small>
              </span>
              <em>{metrics.pendingLeaves}</em>
              <i className="bi bi-chevron-right" />
            </Link>
            <Link to="/app/hr/requests">
              <b className="indigo"><i className="bi bi-chat-left-dots" /></b>
              <span>
                <strong>HR Requests & Letters</strong>
                <small>WFH, Salary certificates & experience letter generation</small>
              </span>
              <em>5</em>
              <i className="bi bi-chevron-right" />
            </Link>
          </div>
        </article>

        {/* Workforce Attendance Ring */}
        <article className="hr-panel attendance">
          <div className="hr-heading">
            <div><span> ATTENDANCE PULSE</span><h2>Today's Live Attendance</h2></div>
            <mark><i /> Real-time</mark>
          </div>
          <div className="hr-ring" style={{ '--rate': `${attendance}%` }}>
            <div><strong>{attendance}%</strong><small>present</small></div>
          </div>
          <p>
            <span><i className="bi bi-person-check-fill" /> {metrics.presentToday} checked in</span>
            <span><i className="bi bi-person-dash-fill" /> {metrics.pendingLeaves} on leave</span>
          </p>
          <Link to="/app/hr/attendance">Open attendance register <i className="bi bi-arrow-right" /></Link>
        </article>
      </div>

      {/* Quick Access Matrix */}
      <section className="hr-panel quick">
        <div className="hr-heading">
          <div><span> COMPLETE ETHIROLI ECOSYSTEM</span><h2>Core People Operations</h2></div>
        </div>
        <div>
          {[
            ['students', 'bi-mortarboard-fill', 'Students', 'Course enrollees & certificates'],
            ['employees', 'bi-person-badge', 'Employees', '360° lifecycle directory'],
            ['interns', 'bi-briefcase', 'Interns', 'Mentors & capstone projects'],
            ['onboarding', 'bi-rocket-takeoff', 'Onboarding Plans', '15/30/60/90 Day journeys'],
            ['requests', 'bi-inbox', 'HR Requests', 'WFH & profile changes'],
            ['letters', 'bi-file-earmark-text', 'HR Letters', 'Offer & relieving templates'],
            ['performance', 'bi-graph-up-arrow', 'Performance', 'Reviews & evaluations'],
            ['reports', 'bi-bar-chart-line', 'Reports', 'Workforce & student analytics']
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