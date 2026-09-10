import React, { useState, useEffect } from 'react'
import { leadApi } from '../../../services/api/leadApi.js'
import KanbanColumn from './KanbanColumn.jsx'

const STAGES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']

export default function KanbanBoard() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [draggedLead, setDraggedLead] = useState(null)

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await leadApi.getAll()
      setLeads(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (e, lead) => {
    setDraggedLead(lead)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, stage) => {
    e.preventDefault()
    if (!draggedLead || draggedLead.status === stage) {
      setDraggedLead(null)
      return
    }
    const updatedLead = { ...draggedLead, status: stage }
    try {
      await leadApi.updateStatus(draggedLead.id, stage)
      setLeads(leads.map((l) => (l.id === draggedLead.id ? updatedLead : l)))
    } catch (err) {
      setError(err.message || 'Failed to update lead status')
    } finally {
      setDraggedLead(null)
    }
  }

  const getStageLeads = (stage) => leads.filter((l) => l.status === stage)

  if (loading) {
    return (
      <div className="loading">
        <div className="skeleton" style={{ width: '100%', height: '400px' }} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="emptyState">
        <h3 className="textDanger">Error Loading Board</h3>
        <p className="textSecondary">{error}</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '4px' }}>
      {STAGES.map((stage) => (
        <KanbanColumn
          key={stage}
          stage={stage}
          leads={getStageLeads(stage)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, stage)}
          onDragStart={handleDragStart}
        />
      ))}
    </div>
  )
}
