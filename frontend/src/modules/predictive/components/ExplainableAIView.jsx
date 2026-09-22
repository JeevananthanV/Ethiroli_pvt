import React from 'react';

export default function ExplainableAIView() {
  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Explainable AI</h2>
          <p className="pageSubtitle">AI model explanations and interpretability</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          <div className="emptyState">
            <h3>No Explanations</h3>
            <p>AI model explanations will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
