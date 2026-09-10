import React from 'react';

export default function GSTCalculator() {
  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">GST Calculator</h2>
          <p className="pageSubtitle">Calculate GST on invoices</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          <div className="emptyState">
            <h3>GST Calculator</h3>
            <p>Use the form below to calculate GST.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
