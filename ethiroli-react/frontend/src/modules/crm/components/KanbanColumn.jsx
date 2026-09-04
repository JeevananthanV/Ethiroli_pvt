import React from 'react';
import LeadCard from './LeadCard.jsx';

export default function KanbanColumn({ status, leads, onLeadClick, onLeadDrop }) {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      onLeadDrop(leadId, status);
    }
  };

  return (
    <div 
      className="column"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="columnHeader">
        <h3>{status}</h3>
        <span className="leadCount">{leads.length}</span>
      </div>
      <div className="columnBody">
        {leads.map((lead) => (
          <LeadCard 
            key={lead.id} 
            lead={lead} 
            onClick={onLeadClick} 
          />
        ))}
      </div>
    </div>
  );
}