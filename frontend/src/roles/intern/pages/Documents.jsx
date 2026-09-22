import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Documents() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const docs = [
    {
      id: 'doc-1',
      title: 'Ethiroli Engineering Onboarding Handbook',
      category: 'HANDBOOK',
      size: '2.4 MB',
      format: 'PDF',
      updatedAt: '2026-09-01',
      description: 'Comprehensive guidelines covering git workflows, code style, and engineering ethics.'
    },
    {
      id: 'doc-2',
      title: 'Company Code of Conduct & Remote Work Policy',
      category: 'POLICY',
      size: '1.1 MB',
      format: 'PDF',
      updatedAt: '2026-08-15',
      description: 'Official policies regarding work hours, confidentiality, and professional standards.'
    },
    {
      id: 'doc-3',
      title: 'Bootstrap 5 UI Design System & Component Guidelines',
      category: 'GUIDE',
      size: '3.8 MB',
      format: 'PDF',
      updatedAt: '2026-09-05',
      description: 'Color tokens, typography scale, and responsive layout specifications.'
    },
    {
      id: 'doc-4',
      title: 'REST API Documentation & Postman Environment Collection',
      category: 'PROJECT_ASSET',
      size: '420 KB',
      format: 'JSON',
      updatedAt: '2026-09-08',
      description: 'Exported Postman collection and environment variables for local API testing.'
    },
    {
      id: 'doc-5',
      title: 'PostgreSQL Relational Schema & Migration Seed Scripts',
      category: 'PROJECT_ASSET',
      size: '780 KB',
      format: 'SQL',
      updatedAt: '2026-09-04',
      description: 'Seed scripts containing sample user fixtures, course curricula, and quiz banks.'
    },
    {
      id: 'doc-6',
      title: 'Internship Performance Evaluation Rubric (360 Framework)',
      category: 'GUIDE',
      size: '1.5 MB',
      format: 'PDF',
      updatedAt: '2026-08-20',
      description: 'Criteria used by mentors to grade technical skills, communication, and attendance.'
    }
  ];

  const filteredDocs = selectedCategory === 'ALL'
    ? docs
    : docs.filter((d) => d.category === selectedCategory);

  const handleDownload = (doc) => {
    alert(`Downloading: "${doc.title}" (${doc.size})`);
  };

  return (
    <AdminPage
      title="Document Management System"
      subtitle="Access official company handbooks, engineering guidelines, policies, and project assets"
    >
      <div className="container-fluid px-0">
        {/* Category Filter Pills */}
        <div className="d-flex gap-2 flex-wrap mb-4">
          <button
            className={`btn btn-sm ${selectedCategory === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setSelectedCategory('ALL')}
          >
            All Documents ({docs.length})
          </button>
          <button
            className={`btn btn-sm ${selectedCategory === 'HANDBOOK' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setSelectedCategory('HANDBOOK')}
          >
            <i className="bi bi-book me-1"></i>Handbooks
          </button>
          <button
            className={`btn btn-sm ${selectedCategory === 'POLICY' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setSelectedCategory('POLICY')}
          >
            <i className="bi bi-shield-check me-1"></i>Policies
          </button>
          <button
            className={`btn btn-sm ${selectedCategory === 'GUIDE' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setSelectedCategory('GUIDE')}
          >
            <i className="bi bi-compass me-1"></i>Guidelines
          </button>
          <button
            className={`btn btn-sm ${selectedCategory === 'PROJECT_ASSET' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setSelectedCategory('PROJECT_ASSET')}
          >
            <i className="bi bi-file-earmark-code me-1"></i>Project Assets
          </button>
        </div>

        {/* Documents Grid */}
        <div className="row g-4">
          {filteredDocs.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-light text-primary border fw-semibold">
                      {item.category.replace('_', ' ')}
                    </span>
                    <span className="badge bg-secondary-subtle text-secondary small">
                      {item.format}
                    </span>
                  </div>

                  <h5 className="fw-bold mb-2 text-dark">{item.title}</h5>
                  <p className="text-muted small mb-4">{item.description}</p>

                  <div className="mt-auto border-top pt-3 d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted d-block">{item.size}</small>
                      <small className="text-muted">Updated: {item.updatedAt}</small>
                    </div>
                    <button
                      className="btn btn-outline-primary btn-sm px-3"
                      onClick={() => handleDownload(item)}
                    >
                      <i className="bi bi-download me-1"></i> Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
