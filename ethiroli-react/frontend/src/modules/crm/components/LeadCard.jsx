import React from 'react';

export default function LeadCard({ lead, onClick, onDragStart }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', lead.id);
    if (onDragStart) onDragStart(lead.id);
  };

  return (
    <div 
      className="card"
      draggable
      onDragStart={handleDragStart}
      onClick={() => onClick(lead)}
    >
      <h4 className="cardName">{lead.name}</h4>
      <p className="cardInfo">Phone: {lead.phone || 'No phone'}</p>
      <span className="sourceTag">{lead.source}</span>
    </div>
  );
}