import React from 'react'

export default function LeadCard({ lead, onDragStart }) {
  const formatCurrency = (val) => {
    if (!val) return '-'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
  }

  const handleDragStart = (e) => {
    onDragStart(e, lead)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="card"
      style={{ marginBottom: '10px', cursor: 'grab', border: '1px solid var(--admin-border)' }}
    >
      <div className="cardBody" style={{ padding: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--admin-text-primary)', fontWeight: 600 }}>{lead.name || 'Unnamed Lead'}</h4>
            <p className="textSecondary" style={{ fontSize: '12px', margin: '2px 0 0' }}>{lead.company || '-'}</p>
          </div>
          <span className={`statusTag ${lead.status === 'won' || lead.status === 'new' ? 'active' : lead.status === 'lost' ? 'error' : 'pending'}`} style={{ fontSize: '11px', textTransform: 'capitalize' }}>
            {lead.status || 'new'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: 'var(--admin-text-secondary)', marginBottom: '10px' }}>
          {lead.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--admin-text-muted)' }}>Email:</span>
              <span>{lead.email}</span>
            </div>
          )}
          {lead.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--admin-text-muted)' }}>Phone:</span>
              <span>{lead.phone}</span>
            </div>
          )}
          {lead.source && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--admin-text-muted)' }}>Source:</span>
              <span style={{ textTransform: 'capitalize' }}>{lead.source}</span>
            </div>
          )}
          {lead.value && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--admin-text-muted)' }}>Value:</span>
              <span className="textSuccess" style={{ fontWeight: 600 }}>{formatCurrency(lead.value)}</span>
            </div>
          )}
        </div>

        {lead.notes && (
          <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: 0, lineHeight: '1.4', borderTop: '1px solid var(--admin-border)', paddingTop: '8px' }}>
            {lead.notes}
          </p>
        )}
      </div>
    </div>
  )
}
