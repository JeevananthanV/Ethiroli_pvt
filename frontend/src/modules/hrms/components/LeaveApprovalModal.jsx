import React, { useState, useEffect } from 'react'
import Modal from '../../../common/components/Modal/Modal.jsx'
import Input from '../../../common/components/Input/Input.jsx'
import Button from '../../../common/components/Button/Button.jsx'
import { leaveApi } from '../../../services/api/leaveApi.js'

export default function LeaveApprovalModal({ isOpen, onClose, leaveRequest, onApproved }) {
  const [comment, setComment] = useState('')
  const [action, setAction] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setComment('')
      setAction(null)
      setError(null)
    }
  }, [isOpen, leaveRequest])

  const handleSubmit = async (selectedAction) => {
    if (!selectedAction) {
      setError('Please select an action')
      return
    }
    setAction(selectedAction)
    setSubmitting(true)
    setError(null)
    try {
      if (selectedAction === 'approve') {
        await leaveApi.approve(leaveRequest.id)
      } else {
        await leaveApi.reject(leaveRequest.id)
      }
      onApproved?.({
        ...leaveRequest,
        status: selectedAction === 'approve' ? 'approved' : 'rejected',
        comment,
      })
      onClose?.()
    } catch (err) {
      setError(err.message || `Failed to ${selectedAction} leave request`)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString()
  }

  const getLeaveTypeLabel = (type) => {
    if (!type) return 'Leave'
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Leave Request - ${leaveRequest?.employeeName || 'Employee'}`}>
      {leaveRequest && (
        <div className="form">
          <div className="card" style={{ marginBottom: '20px', background: 'var(--admin-bg-light)' }}>
            <div className="cardBody" style={{ padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                <div>
                  <span className="textMuted" style={{ fontSize: '12px' }}>Employee</span>
                  <div style={{ color: 'var(--admin-text-primary)', fontWeight: 500 }}>{leaveRequest.employeeName || '-'}</div>
                </div>
                <div>
                  <span className="textMuted" style={{ fontSize: '12px' }}>Leave Type</span>
                  <div style={{ color: 'var(--admin-text-primary)', fontWeight: 500 }}>{getLeaveTypeLabel(leaveRequest.leaveType)}</div>
                </div>
                <div>
                  <span className="textMuted" style={{ fontSize: '12px' }}>Start Date</span>
                  <div style={{ color: 'var(--admin-text-primary)', fontWeight: 500 }}>{formatDate(leaveRequest.startDate)}</div>
                </div>
                <div>
                  <span className="textMuted" style={{ fontSize: '12px' }}>End Date</span>
                  <div style={{ color: 'var(--admin-text-primary)', fontWeight: 500 }}>{formatDate(leaveRequest.endDate)}</div>
                </div>
                <div>
                  <span className="textMuted" style={{ fontSize: '12px' }}>Duration</span>
                  <div style={{ color: 'var(--admin-text-primary)', fontWeight: 500 }}>{leaveRequest.days || '-'} days</div>
                </div>
                <div>
                  <span className="textMuted" style={{ fontSize: '12px' }}>Applied On</span>
                  <div style={{ color: 'var(--admin-text-primary)', fontWeight: 500 }}>{formatDate(leaveRequest.createdAt || leaveRequest.appliedAt)}</div>
                </div>
              </div>
              {leaveRequest.reason && (
                <div style={{ marginTop: '12px' }}>
                  <span className="textMuted" style={{ fontSize: '12px' }}>Reason</span>
                  <p style={{ margin: '4px 0 0', color: 'var(--admin-text-secondary)', fontSize: '14px' }}>{leaveRequest.reason}</p>
                </div>
              )}
            </div>
          </div>

          <div className="formGroup">
            <label className="label">Comments</label>
            <textarea
              className="inputField"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Add a comment (optional)"
              style={{ resize: 'vertical' }}
            />
          </div>

          {error && <div className="emptyState" style={{ marginBottom: '12px' }}><p className="textDanger">{error}</p></div>}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button variant="danger" onClick={() => handleSubmit('reject')} disabled={submitting}>
              {submitting && action === 'reject' ? 'Rejecting...' : 'Reject'}
            </Button>
            <Button variant="success" onClick={() => handleSubmit('approve')} disabled={submitting}>
              {submitting && action === 'approve' ? 'Approving...' : 'Approve'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
