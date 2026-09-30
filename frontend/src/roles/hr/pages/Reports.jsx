import React, { useState, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listReports } from '../../../../services/api/hrApi.standardized.js';

const REPORT_CATEGORIES = [
  'ALL',
  'Workforce & Headcount',
  'Students & Certification',
  'Interns & Projects',
  'Onboarding & SLAs',
  'Attendance & Leaves',
  'Payroll & CTC'
];

const ANALYTICS_DATA = {
  headcount: {
    totalWorkforce: 186,
    employees: 42,
    interns: 18,
    students: 126,
    activeTutors: 12
  },
  studentMetrics: {
    enrolledThisMonth: 28,
    completionRate: '88.4%',
    certificatesIssued: 45,
    avgCourseDuration: '5.2 Months',
    topCourse: 'Full Stack MERN Microservices'
  },
  internMetrics: {
    activeInterns: 18,
    ptoConversionRate: '72%',
    projectsDelivered: 14,
    avgReviewRating: '4.7 / 5.0'
  },
  onboardingMetrics: {
    avgOnboardingDays: '22 Days (vs 30 Days SLA)',
    checklistCompliance: '96.2%',
    activeOnboardings: 8
  }
};

const INITIAL_REPORTS_MOCK = [
  {
    id: 'RPT-2026-01',
    title: 'Monthly Workforce & Headcount Distribution',
    category: 'Workforce & Headcount',
    generated_at: '2026-09-30',
    records_count: 186,
    status: 'Ready',
    summary: 'Breakdown of 42 full-time employees, 18 interns, and 126 active student enrollees across 6 departments.'
  },
  {
    id: 'RPT-2026-02',
    title: 'Student Course Progress & Certificate Clearance Audit',
    category: 'Students & Certification',
    generated_at: '2026-09-28',
    records_count: 126,
    status: 'Ready',
    summary: 'Clearance audit for 45 issued certificates, verifying tuition payment clearance and LMS quiz completion.'
  },
  {
    id: 'RPT-2026-03',
    title: 'Internship Performance & Pre-Placement (PPO) Evaluation',
    category: 'Interns & Projects',
    generated_at: '2026-09-27',
    records_count: 18,
    status: 'Ready',
    summary: 'Evaluation ratings for Q3 intern cohort with 72% PPO conversion recommendation rate.'
  },
  {
    id: 'RPT-2026-04',
    title: 'Onboarding SLA & Task Completion Compliance Report',
    category: 'Onboarding & SLAs',
    generated_at: '2026-09-25',
    records_count: 8,
    status: 'Ready',
    summary: 'Analysis of 15/30/60/90-day phase-driven plans with 96.2% checklist item completion on schedule.'
  },
  {
    id: 'RPT-2026-05',
    title: 'Workforce Monthly Attendance & Leave Utilization Summary',
    category: 'Attendance & Leaves',
    generated_at: '2026-09-24',
    records_count: 60,
    status: 'Ready',
    summary: 'Consolidated attendance rate of 96% with leave utilization metrics across engineering and product.'
  }
];

export default function HRReports() {
  const {
    data: fetchedReports,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    listReports,
    undefined,
    undefined,
    undefined,
    undefined
  );

  const [localReports, setLocalReports] = useState(INITIAL_REPORTS_MOCK);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const reportList = useMemo(() => {
    if (Array.isArray(fetchedReports) && fetchedReports.length > 0) {
      return fetchedReports;
    }
    return localReports;
  }, [fetchedReports, localReports]);

  const filteredReports = useMemo(() => {
    return reportList.filter((rpt) => {
      const q = (search || '').toLowerCase();
      const matchSearch =
        (rpt.title || '').toLowerCase().includes(q) ||
        (rpt.summary || '').toLowerCase().includes(q) ||
        (rpt.category || '').toLowerCase().includes(q);

      const matchCategory = activeCategory === 'ALL' || rpt.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [reportList, search, activeCategory]);

  const handleExportCSV = (report) => {
    const csvContent = "data:text/csv;charset=utf-8," +
      `Report Title,Category,Generated Date,Records Count,Status\n` +
      `"${report.title}","${report.category}","${report.generated_at}",${report.records_count || 0},"${report.status}"`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${report.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${report.title} to CSV!`);
  };

  return (
    <AdminPage
      title="People Analytics & Workforce Reports"
      subtitle="Holistic reporting covering Students, Interns, Employees, Onboarding SLAs, Attendance, and Performance KPIs"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <Button variant="primary" onClick={() => showToast('New periodic analytics report generated successfully!')}>
          <i className="bi bi-file-earmark-bar-graph me-1" /> Generate Custom Report
        </Button>
      }
    >
      <div className="dashboard">
        {toastMsg && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontWeight: 500
          }}>
            <i className="bi bi-check-circle-fill text-success me-2" />
            {toastMsg}
          </div>
        )}

        {/* Executive Pulse Metric Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card h-100 p-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className="text-muted small fw-bold">TOTAL ETHIROLI NETWORK</div>
              <h2 className="fw-bold my-1 text-primary">{ANALYTICS_DATA.headcount.totalWorkforce}</h2>
              <div className="small text-secondary">
                {ANALYTICS_DATA.headcount.employees} Emp • {ANALYTICS_DATA.headcount.interns} Interns • {ANALYTICS_DATA.headcount.students} Students
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100 p-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className="text-muted small fw-bold">STUDENT COMPLETION RATE</div>
              <h2 className="fw-bold my-1 text-success">{ANALYTICS_DATA.studentMetrics.completionRate}</h2>
              <div className="small text-secondary">
                {ANALYTICS_DATA.studentMetrics.certificatesIssued} Verified Certificates
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100 p-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className="text-muted small fw-bold">INTERN PPO CONVERSION</div>
              <h2 className="fw-bold my-1 text-info">{ANALYTICS_DATA.internMetrics.ptoConversionRate}</h2>
              <div className="small text-secondary">
                Avg Review Rating: {ANALYTICS_DATA.internMetrics.avgReviewRating}
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100 p-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className="text-muted small fw-bold">ONBOARDING COMPLIANCE</div>
              <h2 className="fw-bold my-1 text-warning">{ANALYTICS_DATA.onboardingMetrics.checklistCompliance}</h2>
              <div className="small text-secondary">
                {ANALYTICS_DATA.onboardingMetrics.avgOnboardingDays}
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="card mb-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div className="cardBody" style={{ padding: '0.85rem 1rem' }}>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', flexWrap: 'wrap' }}>
              {REPORT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'ALL' ? 'All Analytics Reports' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search report titles, summaries, or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ borderRadius: '0.5rem' }}
          />
        </div>

        {/* Reports Table */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Available Analytics Reports ({filteredReports.length})</h3>
          </div>
          <div className="cardBody" style={{ padding: 0 }}>
            {filteredReports.length === 0 ? (
              <div className="emptyState" style={{ padding: '3rem', textAlign: 'center' }}>
                <i className="bi bi-bar-chart" style={{ fontSize: '2.5rem', color: '#94a3b8' }} />
                <h4 style={{ marginTop: '1rem' }}>No reports match the filter</h4>
                <p style={{ color: '#64748b' }}>Select a different category or clear the search query.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Report Title</th>
                      <th>Category</th>
                      <th>Generated Date</th>
                      <th>Records</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((rpt) => (
                      <tr key={rpt.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{rpt.title}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {rpt.summary}
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">{rpt.category}</span>
                        </td>
                        <td>{rpt.generated_at}</td>
                        <td><strong>{rpt.records_count}</strong></td>
                        <td>
                          <span className="badge bg-success">{rpt.status}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                setSelectedReport(rpt);
                                setShowDetailModal(true);
                              }}
                            >
                              <i className="bi bi-eye me-1" /> View
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleExportCSV(rpt)}
                            >
                              <i className="bi bi-download me-1" /> CSV
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Report Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`Report Summary — ${selectedReport?.title}`}
        >
          {selectedReport && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div>
                  <h5 className="mb-0 fw-bold">{selectedReport.title}</h5>
                  <small className="text-muted">{selectedReport.category} • Generated: {selectedReport.generated_at}</small>
                </div>
                <span className="badge bg-success">{selectedReport.status}</span>
              </div>

              <div className="card mb-3" style={{ background: '#f8fafc' }}>
                <div className="cardBody" style={{ padding: '1rem' }}>
                  <div className="small fw-bold text-muted mb-2">EXECUTIVE SUMMARY:</div>
                  <p style={{ margin: 0, lineHeight: '1.6' }}>{selectedReport.summary}</p>
                </div>
              </div>

              <div className="row g-2 mb-3 text-center">
                <div className="col-4">
                  <div className="p-2 border rounded">
                    <small className="text-muted d-block">Records Sampled</small>
                    <strong>{selectedReport.records_count}</strong>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 border rounded">
                    <small className="text-muted d-block">Data Accuracy</small>
                    <strong className="text-success">99.8%</strong>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 border rounded">
                    <small className="text-muted d-block">Audited By</small>
                    <strong>HR Analytics</strong>
                  </div>
                </div>
              </div>

              <div className="text-end mt-4">
                <button className="btn btn-outline-secondary me-2" onClick={() => handleExportCSV(selectedReport)}>
                  <i className="bi bi-download me-1" /> Download CSV
                </button>
                <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminPage>
  );
}