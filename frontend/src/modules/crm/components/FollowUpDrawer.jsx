import React, { useEffect, useState, useCallback } from 'react'
import { getFollowUps, createFollowUp, deleteFollowUp } from '../../../services/api/followUpApi.js'
import { sendFollowUp } from '../../../services/api/leadApi.js'
import Modal from '../../../common/components/Modal/Modal.jsx'
import Input from '../../../common/components/Input/Input.jsx'
import Button from '../../../common/components/Button/Button.jsx'

export default function FollowUpDrawer({ isOpen, onClose, lead }) {
  const [followUps, setFollowUps] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newFollowUp, setNewFollowUp] = useState({ date: '', notes: '', channel: 'email' })
  const [submitting, setSubmitting] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailMsg, setEmailMsg] = useState('')
  const [error, setError] = useState(null)

  const loadFollowUps = useCallback(async () => {
    if (!lead?.id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getFollowUps(lead.id)
      setFollowUps(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load follow-ups')
    } finally {
      setLoading(false)
    }
  }, [lead?.id])

  useEffect(() => {
    if (isOpen && lead?.id) {
      loadFollowUps()
    }
  }, [isOpen, lead?.id, loadFollowUps])

  const handleCreate = async () => {
    if (!newFollowUp.date || !newFollowUp.notes) return
    setSubmitting(true)
    setError(null)
    try {
      const data = await createFollowUp({ ...newFollowUp, leadId: lead.id })
      setFollowUps([...followUps, data])
      setNewFollowUp({ date: '', notes: '', channel: 'email' })
      setShowAddForm(false)
    } catch (err) {
      setError(err.message || 'Failed to create follow-up')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteFollowUp(id)
      setFollowUps(followUps.filter((f) => f.id !== id))
    } catch (err) {
      setError(err.message || 'Failed to delete follow-up')
    }
  }

  const handleSendEmail = async () => {
    if (!lead?.id) return
    setSendingEmail(true)
    setEmailMsg('')
    try {
      const result = await sendFollowUp(lead.id, { channel: 'email' })
      setEmailMsg(result.message || 'Follow-up email sent successfully')
    } catch (err) {
      setEmailMsg(err.message || 'Failed to send follow-up email')
    } finally {
      setSendingEmail(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString()
  }

  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`} style={{ position: 'fixed', right: 0, top: 0, height: '100vh', width: '420px', background: 'var(--admin-bg-card)', borderLeft: '1px solid var(--admin-border)', boxShadow: '-4px 0 15px rgba(0,0,0,0.3)', zIndex: 1000, transform: isOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0, color: 'var(--admin-text-primary)' }}>Follow-Ups for {lead?.name || 'Lead'}</h3>
        <button className="closeBtn" onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--admin-text-secondary)', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
      </div>

      <div style={{ padding: '20px', overflowY: 'auto', height: 'calc(100vh - 140px)' }}>
        {error && <div className="emptyState" style={{ marginBottom: '16px' }}><p className="textDanger">{error}</p></div>}

        <div style={{ marginBottom: '16px' }}>
          <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)} style={{ marginRight: '8px' }}>
            {showAddForm ? 'Cancel' : 'Add Follow-Up'}
          </Button>
          <Button variant="secondary" onClick={handleSendEmail} disabled={sendingEmail}>
            {sendingEmail ? 'Sending...' : 'Send Follow-Up Email'}
          </Button>
        </div>

        {emailMsg && <div className="emptyState" style={{ marginBottom: '16px' }}><p className={emailMsg.includes('Failed') ? 'textDanger' : 'textSuccess'}>{emailMsg}</p></div>}

        {showAddForm && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="cardBody">
              <div className="form">
                <div className="formGroup">
                  <label className="label required">Date</label>
                  <Input type="date" value={newFollowUp.date} onChange={(e) => setNewFollowUp({ ...newFollowUp, date: e.target.value })} />
                </div>
                <div className="formGroup">
                  <label className="label required">Notes</label>
                  <textarea
                    className="inputField"
                    value={newFollowUp.notes}
                    onChange={(e) => setNewFollowUp({ ...newFollowUp, notes: e.target.value })}
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <div className="formGroup">
                  <label className="label">Channel</label>
                  <select
                    className="select"
                    value={newFollowUp.channel}
                    onChange={(e) => setNewFollowUp({ ...newFollowUp, channel: e.target.value })}
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
                <Button variant="primary" onClick={handleCreate} disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Follow-Up'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading"><div className="skeleton" style={{ width: '100%', height: '200px' }} /></div>
        ) : followUps.length === 0 ? (
          <div className="emptyState">
            <p className="textMuted">No follow-ups yet</p>
          </div>
        ) : (
          <div>
            {followUps.map((followUp) => (
              <div key={followUp.id} className="card" style={{ marginBottom: '12px' }}>
                <div className="cardBody" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span className="statusTag active" style={{ marginRight: '8px' }}>{followUp.channel || 'follow-up'}</span>
                      <span className="textSecondary">{formatDate(followUp.date)}</span>
                    </div>
                    <Button size="small" variant="danger" onClick={() => handleDelete(followUp.id)}>
                      Delete
                    </Button>
                  </div>
                  <p style={{ margin: 0, color: 'var(--admin-text-secondary)', fontSize: '14px' }}>{followUp.notes}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
