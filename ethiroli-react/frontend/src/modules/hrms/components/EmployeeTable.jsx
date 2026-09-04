import React, { useEffect, useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { listEmployees } from '../../services/api/employeeApi.js';

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listEmployees();
      setEmployees(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const getStatusTag = (isActive) => {
    if (isActive) return <span className="statusTag active">Active</span>;
    return <span className="statusTag inactive">Inactive</span>;
  };

  return (
    <AdminPage
      title="Employees"
      subtitle="Full-time staff directory with employment details"
      loading={loading}
      error={error}
      onRetry={fetchEmployees}
      actions={
        <button className="btn primary" onClick={() => alert('Add Employee modal placeholder')}>
          + Add Employee
        </button>
      }
    >
      <div className="card">
        {employees.length === 0 ? (
          <div className="emptyState">
            <h3>No employees found</h3>
            <p>Add your first employee to get started.</p>
          </div>
        ) : (
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Employee Code</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{emp.full_name}</td>
                    <td className="textSecondary">{emp.email}</td>
                    <td className="textSecondary">{emp.employee_code || '-'}</td>
                    <td className="textSecondary">{emp.department || '-'}</td>
                    <td className="textSecondary">{emp.designation || '-'}</td>
                    <td className="textSecondary">{emp.date_of_joining || '-'}</td>
                    <td>{getStatusTag(emp.is_active)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
