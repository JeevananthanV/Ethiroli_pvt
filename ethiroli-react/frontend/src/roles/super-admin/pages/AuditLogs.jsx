import React from 'react';
import AuditTable from '../../../modules/audit/components/AuditTable.jsx';

export default function AuditLogs() {
  return (
    <div className="card">
      <div className="cardHeader" style={{ borderBottom: '1px solid var(--admin-border-subtle)', paddingBottom: '16px', marginBottom: '20px' }}>
        <div>
          <h2 className="cardTitle" style={{ fontSize: '20px' }}>System Audit Logs</h2>
          <p style={{ color: 'var(--admin-text-secondary)', fontSize: '13px', marginTop: '4px' }}>Security ledger auditing actions triggered by administrators, tutors, and HR managers.</p>
        </div>
      </div>
      <div className="cardBody">
        <AuditTable />
      </div>
    </div>
  );
}