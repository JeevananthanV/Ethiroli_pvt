import { useEffect, useState } from 'react';
import { projectApi } from '../../../services/api/projectApi'
import { assignmentApi } from '../../../services/api/assignmentApi'

export const useSprintBurndown = (sprintId, projectId) => {
  const [burndown, setBurndown] = useState({
    planned: 0,
    completed: 0,
    remaining: 0,
    percentage: 0,
    velocityTrend: [],
    lastUpdated: null
  })

  useEffect(() => {
    let cancelled = false

    const loadBurndown = async () => {
      if (cancelled) return

      try {
        // Get sprint details
        const sprint = await projectApi.getProjectDetails({ sprintId })

        // Get all tasks for this project
        const tasks = await assignmentApi.getAll({ projectId })

        // Calculate burndown
        const planned = tasks.reduce((sum, t) => {
          return sum + (t.estimatedHours || 0)
        }, 0)

        const completed = tasks
          .filter(t => t.status === 'completed' && t.sprintId === sprintId)
          .reduce((sum, t) => sum + (t.estimatedHours || 0), 0)

        const remaining = planned - completed
        const percentage = planned > 0 ? Math.round((completed / planned) * 100) : 0

        // Get velocity history from completed sprints
        const velocityHistory = await getVelocityHistory(projectId)

        if (!cancelled) {
          setBurndown({
            planned,
            completed,
            remaining,
            percentage,
            velocityTrend: velocityHistory,
            lastUpdated: new Date().toISOString()
          })
        }
      } catch (err) {
        console.error('Burndown calculation error:', err)
        if (!cancelled) {
          setBurndown({
            planned: 0,
            completed: 0,
            remaining: 0,
            percentage: 0,
            velocityTrend: [],
            lastUpdated: null
          })
        }
      }
    }

    // Initial load
    loadBurndown()

    // Poll every minute for live updates
    const interval = setInterval(() => !cancelled && loadBurndown(), 60000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [sprintId, projectId])

  // Helper: Get velocity history from completed sprints
  const getVelocityHistory = async (projectId) => {
    try {
      const sprints = await projectApi.listSprints({ projectId })
      const completedSprints = sprints.filter(s => s.status === 'COMPLETED')

      return completedSprints
        .sort((a, b) => new Date(b.end_date) - new Date(a.start_date))
        .slice(0, 6) // Last 6 sprints
        .map(s => ({
          sprint: s.sprint_name,
          targetVelocity: s.target_velocity || 0,
          actualVelocity: s.actual_velocity || 0,
          efficiency: s.target_velocity
            ? Math.round((s.actual_velocity / s.target_velocity) * 100)
            : 0,
          completedAt: s.end_date
        })
    ) || []
  } catch (err) {
    console.error('Velocity history error:', err)
    return []
  }
}