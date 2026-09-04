import React from 'react';

export default function StudentCertificates() {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">My Earned E-Learning Certificates</h2>
      </div>
      <div className="cardBody">
        <div className="card" style={{ maxWidth: '380px', textAlign: 'center' }}>
          <h4>Frontend Engineering Specialist</h4>
          <p style={{ margin: '10px 0', fontSize: '13px' }}>Issued on Aug 21, 2026</p>
          <button className="actionTag" onClick={() => alert('Certificate PDF generated!')}>Download PDF copy</button>
        </div>
      </div>
    </div>
  );
}