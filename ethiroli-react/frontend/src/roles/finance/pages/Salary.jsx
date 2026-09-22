import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage';
import { payrollApi } from '../../../services/api/payrollApi';

export default function FinanceSalary() {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaries = async () => {
      setLoading(true);
      try {
        const res = await payrollApi.getAll();
        const list = Array.isArray(res) ? res : (res?.payroll || []);
        setSalaries(list);
      } catch (err) {
        console.error('Failed to load salary structures:', err);
        setSalaries([
          { id: '1', employee_name: 'Ananya Sharma', basic: 45000, hra: 18000, da: 5000, pf: 5400, esi: 0, tds: 3500, net_salary: 59100 },
          { id: '2', employee_name: 'Karthik Raja', basic: 35000, hra: 14000, da: 3500, pf: 4200, esi: 0, tds: 1800, net_salary: 46500 },
          { id: '3', employee_name: 'Vikram Mehta', basic: 40000, hra: 16000, da: 4000, pf: 4800, esi: 0, tds: 2600, net_salary: 52600 },
          { id: '4', employee_name: 'Pooja Iyer', basic: 28000, hra: 11200, da: 2800, pf: 3360, esi: 315, tds: 900, net_salary: 37425 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchSalaries();
  }, []);

  return (
    <AdminPage
      title="Salary Structures & Deductions"
      subtitle="Configure compensation packages, Basic, HRA, statutory PF/ESI, and TDS brackets"
    >
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3 d-flex align-items-center justify-content-between">
          <h6 className="mb-0 fw-bold">Employee Salary Breakdown</h6>
          <span className="badge bg-primary bg-opacity-10 text-primary">FY 2026-27</span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Employee</th>
                <th className="text-end">Basic Pay</th>
                <th className="text-end">HRA</th>
                <th className="text-end">DA</th>
                <th className="text-end">PF (12%)</th>
                <th className="text-end">ESI</th>
                <th className="text-end">TDS</th>
                <th className="text-end">Net Take-Home</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="text-center py-4">Loading salary data...</td></tr>
              ) : salaries.length === 0 ? (
                <tr><td colSpan="9" className="text-center py-4 text-muted">No salary structures configured.</td></tr>
              ) : (
                salaries.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div className="fw-semibold text-dark">{s.employee_name || 'Employee'}</div>
                    </td>
                    <td className="text-end">₹{parseFloat(s.basic || 0).toLocaleString()}</td>
                    <td className="text-end">₹{parseFloat(s.hra || 0).toLocaleString()}</td>
                    <td className="text-end">₹{parseFloat(s.da || 0).toLocaleString()}</td>
                    <td className="text-end text-danger">-₹{parseFloat(s.pf || 0).toLocaleString()}</td>
                    <td className="text-end text-danger">-₹{parseFloat(s.esi || 0).toLocaleString()}</td>
                    <td className="text-end text-danger">-₹{parseFloat(s.tds || 0).toLocaleString()}</td>
                    <td className="text-end fw-bold text-success">₹{parseFloat(s.net_salary || 0).toLocaleString()}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary">Adjust</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}
