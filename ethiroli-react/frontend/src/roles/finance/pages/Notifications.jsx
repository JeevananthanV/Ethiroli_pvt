import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function FinanceNotifications() {
  const [alerts] = useState([
    { id: '1', title: 'GSTR-3B Monthly Return Filing Due', description: 'GSTR-3B summary for August 2026 is due in 10 days (20th Sept). Net payable: ₹1,22,200.', type: 'WARNING', time: '1 hour ago', read: false },
    { id: '2', title: 'Overdue Invoice Reminder Dispatched', description: 'Payment reminder sent to Nexus Corp for INV-2026-035 (₹45,000, 21 days past due).', type: 'INFO', time: '3 hours ago', read: false },
    { id: '3', title: 'Client Retainer Renewed', description: 'BlueWave Enterprises DevOps retainer contract renewed successfully for FY 2026-27.', type: 'SUCCESS', time: 'Yesterday', read: true },
    { id: '4', title: 'TDS Challan 281 Payment Clearance', description: 'Withheld TDS of ₹38,400 successfully credited to NSDL tax portal.', type: 'SUCCESS', time: '2 days ago', read: true },
    { id: '5', title: 'High Value Expense Approval Required', description: 'AWS infrastructure bill of ₹48,500 requires Dual Finance Sign-off.', type: 'WARNING', time: '3 days ago', read: true }
  ]);

  return (
    <AdminPage
      title="Financial Alerts & Compliance Notifications"
      subtitle="Real-time notifications for overdue receivables, statutory tax deadlines, and liquidity alerts"
    >
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold">Recent Finance Activity & System Pings</h6>
          <span className="badge bg-primary bg-opacity-10 text-primary">All Systems Operational</span>
        </div>

        <div className="list-group list-group-flush">
          {alerts.map(a => (
            <div key={a.id} className={`list-group-item p-3 ${!a.read ? 'bg-light bg-opacity-50' : ''}`}>
              <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex gap-3">
                  <div className="mt-1">
                    {a.type === 'WARNING' && <i className="bi bi-exclamation-triangle-fill text-warning fs-5"></i>}
                    {a.type === 'INFO' && <i className="bi bi-info-circle-fill text-primary fs-5"></i>}
                    {a.type === 'SUCCESS' && <i className="bi bi-check-circle-fill text-success fs-5"></i>}
                  </div>
                  <div>
                    <h6 className="mb-1 fw-bold text-dark">{a.title}</h6>
                    <p className="mb-1 text-muted small">{a.description}</p>
                    <small className="text-secondary">{a.time}</small>
                  </div>
                </div>
                {!a.read && <span className="badge bg-primary rounded-pill">New</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
