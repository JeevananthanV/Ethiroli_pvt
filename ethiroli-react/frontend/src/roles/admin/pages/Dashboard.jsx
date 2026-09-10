import React from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Dashboard() {
  return (
    <AdminPage title="Admin Dashboard" subtitle="Administrative overview and management">
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <h6 className="card-title">Team Members</h6>
              <h2 className="card-text">87</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <h6 className="card-title">Active Projects</h6>
              <h2 className="card-text">24</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-dark h-100">
            <div className="card-body">
              <h6 className="card-title">Open Tickets</h6>
              <h2 className="card-text">8</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">People Management</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li><a href="/app/admin/employees" className="text-decoration-none">Employees</a></li>
                <li><a href="/app/admin/interns" className="text-decoration-none">Interns</a></li>
                <li><a href="/app/admin/students" className="text-decoration-none">Students</a></li>
                <li><a href="/app/admin/tutors" className="text-decoration-none">Tutors</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">Learning Management</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li><a href="/app/admin/courses" className="text-decoration-none">Courses</a></li>
                <li><a href="/app/admin/curriculum" className="text-decoration-none">Curriculum</a></li>
                <li><a href="/app/admin/batches" className="text-decoration-none">Batches</a></li>
                <li><a href="/app/admin/training" className="text-decoration-none">Training</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">Projects & CRM</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li><a href="/app/admin/projects" className="text-decoration-none">Projects</a></li>
                <li><a href="/app/admin/tasks" className="text-decoration-none">Tasks</a></li>
                <li><a href="/app/admin/teams" className="text-decoration-none">Teams</a></li>
                <li><a href="/app/admin/leads" className="text-decoration-none">Leads</a></li>
                <li><a href="/app/admin/contacts" className="text-decoration-none">Contacts</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">Finance & HR</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li><a href="/app/admin/income" className="text-decoration-none">Income</a></li>
                <li><a href="/app/admin/expenses" className="text-decoration-none">Expenses</a></li>
                <li><a href="/app/admin/invoices" className="text-decoration-none">Invoices</a></li>
                <li><a href="/app/admin/payroll" className="text-decoration-none">Payroll</a></li>
                <li><a href="/app/admin/attendance" className="text-decoration-none">Attendance</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}