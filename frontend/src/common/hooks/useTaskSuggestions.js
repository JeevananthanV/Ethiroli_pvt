import { useEffect, useState } from 'react';
import { projectApi, assignmentApi } from '../../../services/api'

export const useTaskSuggestions = (currentTasks, projectId) => {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadSuggestions = async () => {
      if (cancelled) return
      setLoading(true)

      try {
        // Get all projects to analyze workload
        const projects = await projectApi.getAll()
        const newSuggestions = []

        projects.forEach(project => {
          const projectTasks = currentTasks.filter(
            t => t.projectId === project.id && t.status !== 'completed'
          )
          const inProgressCount = projectTasks.length
          const maxTasksPerProject = 3 // Configurable limit

          if (inProgressCount < maxTasksPerProject) {
            newSuggestions.push({
              projectId: project.id,
              projectName: project.name,
              suggestedSlots: maxTasksPerProject - inProgressCount,
              priority: inProgressCount === 0 ? 'high' : 'medium'
            })
          }
        })

        // Sort by priority (projects with 0 tasks first)
        newSuggestions.sort((a, b) => {
          if (a.priority === b.priority) return 0
          return a.priority === 'high' ? -1 : 1
        })

        if (!cancelled) setSuggestions(newSuggestions)
      } catch (err) {
        console.error('Failed to load task suggestions:', err)
        if (!cancelled) setSuggestions([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadSuggestions()

    // Re-load when currentTasks or projectId changes
    return () => {
      cancelled = true
    }
  }, [currentTasks, projectId])

  return { suggestions, loading }
}