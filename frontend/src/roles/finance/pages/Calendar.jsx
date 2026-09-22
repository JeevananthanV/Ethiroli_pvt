import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function FinanceCalendar() {
  const [events] = useState([
    { id: '1', title: 'TDS Payment Deposit (Challan 281)', date: '2026-09-07', type: 'TAX', category: 'Statutory TDS' },
    { id: '2', title: 'GSTR-1 Outward Supplies Filing Due', date: '2026-09-11', type: 'GST', category: 'GST Compliance' },
    { id: '3', title: 'Advance Tax Q2 Installment (45% Cumulative)', date: '2026-09-15', type: 'INCOME_TAX', category: 'Income Tax' },
    { id: '4', title: 'GSTR-3B Monthly Return & Tax Payment Due', date: '2026-09-20', type: 'GST', category: 'GST Compliance' },
    { id: '5', title: 'Monthly Payroll Cut-off & Attendance Lock', date: '2026-09-28', type: 'PAYROLL', category: 'HR & Payroll' },
    { id: '6', title: 'Bank NEFT Salary Batch Payout Disbursement', date: '2026-09-30', type: 'PAYROLL', category: 'HR & Payroll' }
  ]);

  return (
    <AdminPage
      title="Financial & Statutory Tax Calendar"
      subtitle="Critical statutory filing dates, GST deadlines, TDS payment deposits, advance tax, and monthly payroll cut-offs"
    >
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold">Compliance Schedule &bull; September 2026</h6>
          <span className="badge bg-primary bg-opacity-10 text-primary">FY 2026-27 (Quarter 2)</span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Due Date</th>
                <th>Event / Statutory Obligation</th>
                <th>Category</th>
                <th>Governing Authority</th>
                <th className="text-end">Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map(e => (
                <tr key={e.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-calendar-event text-primary"></i>
                      <strong className="text-dark">{e.date}</strong>
                    </div>
                  </td>
                  <td><div className="fw-semibold text-dark">{e.title}</div></td>
                  <td>
                    <span className={`badge ${e.type === 'GST' ? 'bg-primary bg-opacity-10 text-primary' : e.type === 'TAX' ? 'bg-info bg-opacity-10 text-info' : 'bg-success bg-opacity-10 text-success'}`}>
                      {e.category}
                    </span>
                  </td>
                  <td><small className="text-muted">{e.type === 'GST' ? 'GSTN Portal' : e.type === 'PAYROLL' ? 'Corporate Bank' : 'Income Tax Dept'}</small></td>
                  <td className="text-end">
                    <span className="badge bg-light text-dark border">Scheduled</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}
