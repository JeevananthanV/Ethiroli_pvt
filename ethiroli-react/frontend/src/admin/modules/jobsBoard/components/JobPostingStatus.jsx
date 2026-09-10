import React from 'react';

export default function JobPostingStatus() {
  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Publish Statuses</h2>
          <p className="pageSubtitle">Job posting publication status</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          <div className="emptyState">
            <h3>No Status Updates</h3>
            <p>Job posting status updates will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
