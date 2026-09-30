import React, { useState, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';

const RESOURCE_TYPES = ['ALL', 'PDF', 'CODE', 'GITHUB', 'CHEAT_SHEET', 'VIDEO', 'TEMPLATE'];

const RESOURCES_LIST = [
  {
    id: 'RES-01',
    title: 'React 18 & 19 Core Hooks Cheatsheet (useState, useEffect, useMemo, useCallback)',
    type: 'CHEAT_SHEET',
    course: 'Full Stack + AI Web Developer',
    module: 'Module 4: React Architecture',
    size: '1.4 MB',
    format: 'PDF',
    updatedAt: '2026-09-28',
    url: 'https://cdn.ethiroli.edu/resources/react-hooks-cheatsheet.pdf',
    description: 'Comprehensive cheatsheet detailing dependency arrays, cleanups, ref forwarding, and memoization rules.'
  },
  {
    id: 'RES-02',
    title: 'Full Stack MERN Microservices Starter Template with JWT Auth',
    type: 'TEMPLATE',
    course: 'Full Stack + AI Web Developer',
    module: 'Module 7: Node.js & Express Architecture',
    size: '2.8 MB',
    format: 'ZIP',
    updatedAt: '2026-09-25',
    url: 'https://cdn.ethiroli.edu/resources/mern-microservices-starter.zip',
    description: 'Boilerplate repository featuring Docker Compose, Express routing, Mongoose schemas, and Swagger API documentation.'
  },
  {
    id: 'RES-03',
    title: 'Modern CSS Grid & Flexbox Complete Visual Guidebook',
    type: 'PDF',
    course: 'Full Stack + AI Web Developer',
    module: 'Module 2: Modern CSS3 Layouts',
    size: '4.2 MB',
    format: 'PDF',
    updatedAt: '2026-09-20',
    url: 'https://cdn.ethiroli.edu/resources/css-grid-flexbox-guide.pdf',
    description: 'High-resolution diagrammatic guide to auto-fit, minmax, template areas, and mobile-first responsive breakpoints.'
  },
  {
    id: 'RES-04',
    title: 'PostgreSQL & SQL Performance Query Optimization Handbook',
    type: 'PDF',
    course: 'Full Stack + AI Web Developer',
    module: 'Module 8: Database Engineering',
    size: '3.1 MB',
    format: 'PDF',
    updatedAt: '2026-09-18',
    url: 'https://cdn.ethiroli.edu/resources/postgres-optimization-handbook.pdf',
    description: 'Explains B-Tree indices, EXPLAIN ANALYZE execution plans, connection pooling, and ACID transaction locks.'
  },
  {
    id: 'RES-05',
    title: 'Official Ethiroli Course Capstone Project GitHub Repository',
    type: 'GITHUB',
    course: 'Full Stack + AI Web Developer',
    module: 'Module 10: Capstone Project',
    size: 'External',
    format: 'Git Repo',
    updatedAt: '2026-09-27',
    url: 'https://github.com/ethiroli-academy/fullstack-ecommerce-capstone',
    description: 'Reference source code for multi-vendor eCommerce SaaS with Stripe payments, Redux state, and automated tests.'
  },
  {
    id: 'RES-06',
    title: 'JavaScript ES6+ Array Methods & Functional Programming Algorithms',
    type: 'CODE',
    course: 'Full Stack + AI Web Developer',
    module: 'Module 3: Core JavaScript ES6+',
    size: '120 KB',
    format: 'JS/MD',
    updatedAt: '2026-09-15',
    url: 'https://cdn.ethiroli.edu/resources/js-array-algorithms.js',
    description: 'Interactive code snippets covering map, reduce, filter, flatMap, currying, and memoize utilities.'
  },
  {
    id: 'RES-07',
    title: 'AI Prompt Engineering & Gemini API Integration Recipes',
    type: 'CHEAT_SHEET',
    course: 'Full Stack + AI Web Developer',
    module: 'Module 9: AI Integration & LLMs',
    size: '1.8 MB',
    format: 'PDF',
    updatedAt: '2026-09-29',
    url: 'https://cdn.ethiroli.edu/resources/gemini-prompt-recipes.pdf',
    description: 'Techniques for structured JSON output, few-shot prompting, schema-constrained generation, and embeddings.'
  }
];

export default function Resources() {
  const [activeType, setActiveType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = useMemo(() => {
    return RESOURCES_LIST.filter((item) => {
      const matchType = activeType === 'ALL' || item.type === activeType;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [activeType, searchQuery]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'PDF':
        return <i className="bi bi-file-earmark-pdf-fill text-danger fs-4" />;
      case 'CHEAT_SHEET':
        return <i className="bi bi-file-earmark-text-fill text-primary fs-4" />;
      case 'TEMPLATE':
        return <i className="bi bi-file-earmark-zip-fill text-warning fs-4" />;
      case 'GITHUB':
        return <i className="bi bi-github text-dark fs-4" />;
      case 'CODE':
        return <i className="bi bi-file-earmark-code-fill text-success fs-4" />;
      case 'VIDEO':
        return <i className="bi bi-play-btn-fill text-info fs-4" />;
      default:
        return <i className="bi bi-folder-fill text-secondary fs-4" />;
    }
  };

  return (
    <AdminPage
      title="Student Resource Library & Learning Assets"
      subtitle="Download cheat sheets, starter templates, curriculum lecture notes, code repositories, and reference guides."
    >
      {/* Search & Filter Bar */}
      <div className="card shadow-sm border-0 mb-4 bg-light">
        <div className="card-body p-3">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search notes, cheat sheets, code templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-7">
              <div className="d-flex flex-wrap gap-1 justify-content-md-end">
                {RESOURCE_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveType(t)}
                    className={`btn btn-sm ${activeType === t ? 'btn-primary' : 'btn-outline-secondary'}`}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="row g-3">
        {filteredResources.map((res) => (
          <div key={res.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 border shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center gap-2">
                    {getTypeIcon(res.type)}
                    <div>
                      <span className="badge bg-secondary-subtle text-secondary">{res.format}</span>
                      <span className="text-muted small ms-2">{res.size}</span>
                    </div>
                  </div>
                  <span className="badge bg-light text-muted border">{res.updatedAt}</span>
                </div>

                <h5 className="card-title h6 fw-bold text-dark mb-1">{res.title}</h5>
                <div className="small text-primary fw-semibold mb-2">{res.module}</div>
                <p className="small text-muted mb-3 flex-grow-1">{res.description}</p>

                <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
                  <span className="small text-muted">{res.course}</span>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
                  >
                    {res.type === 'GITHUB' ? (
                      <>
                        <i className="bi bi-box-arrow-up-right" /> Open Repo
                      </>
                    ) : (
                      <>
                        <i className="bi bi-download" /> Download
                      </>
                    )}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminPage>
  );
}
