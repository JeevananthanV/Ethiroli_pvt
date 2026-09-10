import React from 'react'
import LeadCard from './LeadCard.jsx'

export default function KanbanColumn({ stage, leads, onDragOver, onDrop, onDragStart }) {
  const formatStage = (s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1')

  return (
    <div
      className="card"
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{ minWidth: '280px', maxWidth: '320px', flex: '1 1 280px', background: 'var(--admin-bg-light)' }}
    >
      <div className="cardHeader" style={{ borderBottom: '1px solid var(--admin-border)' }}>
        <h3 className="cardTitle" style={{ fontSize: '14px', textTransform: 'capitalize' }}>{formatStage(stage)}</h3>
        <span className="statusTag pending" style={{ fontSize: '12px' }}>{leads.length}</span>
      </div>
      <div className="cardBody" style={{ padding: '12px', minHeight: '100px' }}>
        {leads.length === 0 ? (
          <div className="emptyState" style={{ padding: '20px 0' }}>
            <p className="textMuted" style={{ fontSize: '13px' }}>No leads</p>
          </div>
        ) : (
          leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onDragStart={onDragStart} />
          ))
        )}
      </div>
    </div>
  )
}
