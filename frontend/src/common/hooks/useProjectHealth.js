import { useEffect, useState } from 'react'
import { projectApi } from '../../../services/api/projectApi'

// weighted KPI components
const WEIGHTS = {
  milestoneCompletion: 0.30,
  onTimeDelivery: 0.25,
  budgetAdherence: 0.20,
  teamUtilization: 0.15,
  riskScore: 0.10
}

export const useProjectHealth = (projectId) => {
  const [health, setHealth] = useState({
    score: 0,
    grade: 'F',
    components: {},
    trend: 'stable',
    lastCalculated: null
  })

  useEffect(() => {
    let cancelled = false

    const calculateHealth = async () => {
      if (cancelled) return

      try {
        // Fetch all component data in parallel
        const [
          kpis,
          milestones,
          expenses,
          tasks
        ] = await Promise.all([
          projectApi.getPerformanceKPIs(),
          projectApi.listMilestones({ projectId }),
          projectApi.listExpenses({ projectId }),
          assignmentApi.getAll({ projectId })
        ])

        if (cancelled) return

        // 1. Milestone Completion (30% weight)
        const totalMilestones = milestones.length || 1
        const completedMilestones = milestones.filter(m => m.status === 'COMPLETED').length
        const milestoneCompletion = Math.round((completedMilestones / totalMilestones) * 100)

        // 2. On-Time Delivery (25% weight)
        const onTimeDeliveryRaw = parseFloat(kpis?.kpis?.onTimeDeliveryRate?.replace('%', '') || 0)
        const onTimeDelivery = Math.min(100, Math.max(0, onTimeDeliveryRaw))

        // 3. Budget Adherence (20% weight)
        const totalBudget = expenses?.reduce((sum, e) => sum + parseFloat(e.budgeted_amount || 0), 0) || 1
        const totalSpent = expenses?.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0) || 0
        const budgetAdherence = Math.round((1 - totalSpent / totalBudget) * 100)
        const budgetAdherence = Math.max(0, Math.min(100, budgetAdherence))

        // 4. Team Utilization (15% weight)
        const totalTasks = tasks.length || 1
        const activeTasks = tasks.filter(t => ['in-progress', 'pending'].includes(t.status)).length
        const teamUtilization = Math.round((activeTasks / totalTasks) * 100)

        // 5. Risk Score (10% weight)
        const delayedMilestones = milestones.filter(m => m.status === 'DELAYED').length || 0
        const overdueTasks = tasks.filter(t => {
          const due = new Date(t.dueDate)
          return due < new Date() && t.status !== 'completed'
        }).length || 0
        const riskScore = (delayedMilestones > 0 || overdueTasks > 0) ? 30 : 5

        // Calculate weighted final score
        const score = Math.round(
          WEIGHTS.milestoneCompletion * milestoneCompletion +
          WEIGHTS.onTimeDelivery * onTimeDelivery /
          100 +
          WEIGHTS.budgetAdherence * budgetAdherence /
          100 +
          WEIGHTS.teamUtilization * teamUtilization /
          100 +
          WEIGHTS.riskScore * riskScore /
          100
        )

        // Determine grade
        let grade = 'F'
        if (score >= 90) grade = 'A+'
        else if (score >= 80) grade = 'A'
        else if (score >= 70) grade = 'B'
        else if (score >= 60) grade = 'C'
        else if (score >= 50) grade = 'D'

        // Calculate trend (compare with previous)
        const trend = calculateTrend(health.score, score)

        if (!cancelled) {
          setHealth({
            score,
            grade,
            components: {
              milestoneCompletion: `${milestoneCompletion}%`,
              onTimeDelivery: `${onTimeDelivery}%`,
              budgetAdherence: `${budgetAdherence}%`,
              teamUtilization: `${teamUtilization}%`,
              riskScore: `${riskScore}%`
            },
            trend,
            lastCalculated: new Date().toISOString()
          })
        }
      } catch (err) {
        console.error('Project health calculation error:', err)
      }
    }

    // Initial calculation + poll every 2 minutes
    calculateHealth()
    const interval = setInterval(() => !cancelled && calculateHealth(), 120000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [projectId])

  return health
}

// Helper: Calculate trend direction
const calculateTrend = (previous, current) => {
  if (previous === null || previous === undefined) return 'stable'
  const change = current - previous
  if (change >= 10) return 'improving'
  if (change <= -10) return 'declining'
  return 'stable'
}