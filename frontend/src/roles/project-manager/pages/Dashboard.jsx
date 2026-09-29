import React from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Dashboard() {
  return (
    <AdminPage title="Project Manager Dashboard" subtitle="Project and client management">
      <div className="row g-3 mb-2">
        <div className="col-md-4">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <h6 className="card-title">Active Projects</h6>
              <h2 className="card-text">12</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <h6 className="card-title">On-Time Tasks</h6>
              <h2 className="card-text">68%</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <h6 className="card-title">Client Meetings</h6>
              <h2 className="card-text">4</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-2">
        <div className="col-md-12">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">Project Management</h6>
            </div>
            <div className="card-body">
              <div className="d-flex gap-2 flex-wrap">
                <a href="/app/pm/projects" className="btn btn-outline-primary">Projects</a>
                <a href="/app/pm/tasks" className="btn btn-outline-success">Tasks</a>
                <a href="/app/pm/team" className="btn btn-outline-info">Team</a>
                <a href="/app/pm/timesheets" className="btn btn-outline-warning">Timesheets</a>
                <a href="/app/pm/client-comms" className="btn btn-outline-secondary">Client Communication</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-2">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">Financial Overview</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li><a href="/app/pm/invoices" className="text-decoration-none">Invoices</a></li>
                <li><a href="/app/pm/reports" className="text-decoration-none">Project Reports</a></li>
                <li><a href="/app/pm/approvals" className="text-decoration-none">Approvals</a></li>
                <li><a href="/app/pm/calendar" className="text-decoration-none">Calendar</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">Company Settings</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li><a href="/app/pm/settings" className="text-decoration-none">Company Settings</a></li>
                <li><a href="/app/pm/subscriptions" className="text-decoration-none">Subscriptions</a></li>
                <li><a href="/app/pm/clients" className="text-decoration-none">Clients</a></li>
                <li><a href="/app/pm/company-settings" className="text-decoration-none">Company Settings</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}