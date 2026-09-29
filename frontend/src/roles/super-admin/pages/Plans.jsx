import React, { useState } from 'react';

export default function Plans() {
  const [plans, setPlans] = useState([
    {
      id: 'starter',
      name: 'Starter Tier',
      priceMonthly: '₹4,999',
      priceAnnual: '₹49,990',
      activeTenants: 18,
      userLimit: 'Up to 25 Users',
      features: ['Core CRM & Leads', 'Basic LMS & Courses', 'Up to 1,000 Inquiries', 'Community Support'],
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional Tier',
      priceMonthly: '₹14,999',
      priceAnnual: '₹149,990',
      activeTenants: 24,
      userLimit: 'Up to 100 Users',
      features: ['Full HR & Payroll', 'Advanced LMS + Live Quizzes', 'Project Management & Sprints', 'Automations & Webhooks', 'Priority SLA Support'],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Tier',
      priceMonthly: '₹39,999',
      priceAnnual: '₹399,990',
      activeTenants: 6,
      userLimit: 'Unlimited Users',
      features: ['Dedicated Sharded DB', 'Custom Domain & SSO / SAML', 'Custom AI Analytics Engine', '24/7 Dedicated Account Manager', 'Custom Integration Concierge'],
      popular: false
    },
  ]);

  return (
    <div className="container-fluid p-3 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-card-checklist text-primary" aria-hidden="true"></i>
            SaaS Subscription Plans & Packaging
          </h2>
          <p className="text-secondary small mb-0">
            Define multi-tenant feature entitlements, user thresholds, and subscription tiers across the platform.
          </p>
        </div>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-1">
          <i className="bi bi-plus-lg" aria-hidden="true"></i> Add New Plan Tier
        </button>
      </div>

      {/* Plan Summary Stats */}
      <div className="row g-3 mb-2">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Total Subscribed Tenants</span>
            <h3 className="fw-bold text-primary my-1">48 Organizations</h3>
            <span className="text-success small"><i className="bi bi-arrow-up-right me-1"></i>+4 new this month</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Monthly Recurring Revenue (MRR)</span>
            <h3 className="fw-bold text-success my-1">₹6,89,952</h3>
            <span className="text-muted small">Average Revenue Per Tenant: ₹14,374</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Plan Retention Rate</span>
            <h3 className="fw-bold text-info my-1">97.8%</h3>
            <span className="text-muted small">Churn Rate: 2.2% annual</span>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="row g-4">
        {plans.map(p => (
          <div key={p.id} className="col-lg-4">
            <div className={`card h-100 border-0 shadow-sm rounded-3 bg-white position-relative ${p.popular ? 'border-top border-primary border-4' : ''}`}>
              {p.popular && (
                <span className="badge bg-primary position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill">
                  Most Popular
                </span>
              )}
              <div className="p-3">
                <h4 className="fw-bold text-dark mb-1">{p.name}</h4>
                <div className="d-flex align-items-baseline gap-1 my-3">
                  <span className="fs-2 fw-bold text-dark">{p.priceMonthly}</span>
                  <span className="text-secondary">/ month</span>
                </div>
                <p className="text-muted small mb-3">Or {p.priceAnnual} billed annually (Save 17%)</p>
                <div className="badge bg-light text-primary border px-3 py-2 mb-2 d-inline-block">
                  <i className="bi bi-people me-1"></i> {p.userLimit}
                </div>

                <hr className="my-2 opacity-25" />

                <div className="my-3">
                  <h6 className="fw-semibold text-dark small text-uppercase">Included Capabilities:</h6>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-2 mt-2">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="small d-flex align-items-center gap-2 text-secondary">
                        <i className="bi bi-check-circle-fill text-success" aria-hidden="true"></i>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                  <span className="small text-muted font-monospace">{p.activeTenants} active tenants</span>
                  <button className="btn btn-outline-primary btn-sm">Edit Tier Details</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
