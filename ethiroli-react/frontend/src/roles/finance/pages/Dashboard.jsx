import React from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Dashboard() {
  return (
    <AdminPage title="Finance Dashboard" subtitle="Financial overview and reporting">
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <h6 className="card-title">Monthly Revenue</h6>
              <h2 className="card-text">₹45,678</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <h6 className="card-title">Outstanding Invoices</h6>
              <h2 className="card-text">23</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark h-100">
            <div className="card-body">
              <h6 className="card-title">Expense Ratio</h6>
              <h2 className="card-text">34%</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <h6 className="card-title">Payroll Due</h6>
              <h2 className="card-text">₹12,345</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-12">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">Financial Operations</h6>
            </div>
            <div className="card-body">
              <div className="d-flex gap-2 flex-wrap">
                <a href="/app/finance/clients" className="btn btn-outline-primary">Customers / Clients</a>
                <a href="/app/finance/salary" className="btn btn-outline-success">Salary</a>
                <a href="/app/finance/tax" className="btn btn-outline-info">Tax</a>
                <a href="/app/finance/refunds" className="btn btn-outline-warning">Refunds</a>
                <a href="/app/finance/receivables" className="btn btn-outline-secondary">Receivables</a>
                <a href="/app/finance/payables" className="btn btn-outline-dark">Payables</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">Reports & Analytics</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li><a href="/app/finance/reports" className="text-decoration-none">Financial Reports</a></li>
                <li><a href="/app/finance/income" className="text-decoration-none">Income</a></li>
                <li><a href="/app/finance/expenses" className="text-decoration-none">Expenses</a></li>
                <li><a href="/app/finance/invoices" className="text-decoration-none">Invoices</a></li>
                <li><a href="/app/finance/payments" className="text-decoration-none">Payments</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}