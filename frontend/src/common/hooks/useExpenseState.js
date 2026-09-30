import { useEffect, useState } from 'react';
import { projectApi } from '../../../services/api/projectApi'

// Approval state machine thresholds
const APPROVAL_THRESHOLDS = {
  autoApprove: 1000,     // Auto-approve under $1,000
  pmApprove: 5000,       // PM can approve $1K-$5K
  adminApprove: 25000,   // Admin can approve $5K-$25K
  seniorApprove: Infinity // Senior exec for over $25K
}

// Approval role mappings
const APPROVAL_ROLES = {
  PROJECT_MANAGER: 'pmApprove',
  ADMIN: 'adminApprove',
  SUPER_ADMIN: 'seniorApprove'
}

export const useExpenseState = (expenses, userRole) => {
  const [approvalQueue, setApprovalQueue] = useState([])
  const [myApprovals, setMyApprovals] = useState([])
  const [userRoleState, setUserRoleState] = useState(userRole || '')

  useEffect(() => {
    const categorizeExpenses = (expenses, role) => {
      setUserRoleState(role)

      return expenses.map(exp => {
        const amount = parseFloat(exp.amount || 0)
        let state = 'pending'
        let approver = null

        // Determine approval state based on amount and role
        if (amount <= APPROVAL_THRESHOLDS.autoApprove) {
          state = 'auto-approved'
          approver = 'System'
        } else if (
          role === APPROVAL_ROLES.PROJECT_MANAGER &&
          amount <= APPROVAL_THRESHOLDS.pmApprove
        ) {
          state = 'pm-approvable'
          approver = 'PM'
        } else if (
          role === APPROVAL_ROLES.ADMIN &&
          amount <= APPROVAL_THRESHOLDS.adminApprove
        ) {
          state = 'admin-approvable'
          approver = 'Admin'
        } else {
          state = 'senior-required'
          approver = 'Senior Executive'
        }

        return {
          ...exp,
          approvalState: state,
          approvalThreshold: amount <= APPROVAL_THRESHOLDS.autoApprove
            ? 'auto'
            : amount <= APPROVAL_THRESHOLDS.pmApprove
            ? 'pm'
            : amount <= APPROVAL_THRESHOLDS.adminApprove
            ? 'admin'
            : 'senior',
          suggestedApprover: approver,
          canApprove: canUserApprove(role, amount),
          buttonLabel: getButtonLabel(state),
          buttonColor: getButtonColor(state)
        }
      })
    )

    if (expenses) {
      const categorized = categorizeExpenses(expenses, userRole)
      setApprovalQueue(categorized.filter(e => e.approvalState !== 'auto-approved' && e.approvalState !== 'rejected'))
      setMyApprovals(categorized.filter(e => e.canApprove))
    }
  }, [expenses, userRole])

  // Helper functions
  const canUserApprove = (role, amount) => {
    if (amount <= APPROVAL_THRESHOLDS.autoApprove) return true
    if (role === APPROVAL_ROLES.PROJECT_MANAGER && amount <= APPROVAL_THRESHOLDS.pmApprove) return true
    if (role === APPROVAL_ROLES.ADMIN && amount <= APPROVAL_THRESHOLDS.adminApprove) return true
    return false
  }

  const getButtonLabel = (state) => {
    switch (state) {
      case 'auto-approved': return 'Auto-Approved'
      case 'pm-approvable': return 'Approve'
      case 'admin-approvable': return 'Approve'
      case 'senior-required': return 'Send to Senior'
      case 'rejected': return 'Rejected'
      default: return 'Pending'
    }
  }

  const getButtonColor = (state) => {
    switch (state) {
      case 'auto-approved': return 'success'
      case 'pm-approvable': return 'info'
      case 'admin-approvable': return 'primary'
      case 'senior-required': return 'warning'
      case 'rejected': return 'error'
      default: return 'secondary'
    }
  }

  return {
    approvalQueue,
    myApprovals,
    userRole: userRoleState,
    canUserApprove,
    getButtonLabel,
    getButtonColor
  }
}