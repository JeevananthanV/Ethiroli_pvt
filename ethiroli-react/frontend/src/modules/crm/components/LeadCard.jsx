import React from 'react';

export default function LeadCard({ lead, onClick }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', lead.id);
  };

  return (
    <div
      className="card"
      draggable
      onDragStart={handleDragStart}
      onClick={() => onClick(lead)}
      style={{ cursor: 'pointer', marginBottom: 10 }}
    >
      <h4 className="cardName">{lead.name}</h4>
      <p className="cardInfo">Phone: {lead.phone || 'No phone'}</p>
      <p className="cardInfo">Email: {lead.email || 'No email'}</p>
      <span className="sourceTag">{lead.source}</span>
    </div>
  );
}
