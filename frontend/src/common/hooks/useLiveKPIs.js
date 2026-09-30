import { useEffect, useState } from 'react'
import { projectApi } from '../../../services/api/projectApi'

export const useLiveKPIs = () => {
  const [kpis, setKpis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  let pollingId = null

  const fetchKPIs = async () => {
    try {
      setLoading(true)
      const response = await projectApi.getPerformanceKPIs()
      const data = response.data || {}
      setKpis({
        portfolio: data?.portfolio || { total_projects: 0, active_projects: 0 },
        onTimeDeliveryRate: data?.onTimeDeliveryRate || '0%',
        milestoneStats: data?.milestoneStats || { total_milestones: 0, completed_count: 0, delayed_count: 0 },
        financials: data?.financials || { total_expenses: 0, billable: 0 },
        teamVelocityAverage: data?.teamVelocityAverage || 0
      })
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to load KPIs')
      // Set fallback values on error
      setKpis({
        portfolio: { total_projects: 0, active_projects: 0 },
        onTimeDeliveryRate: '0%',
        milestoneStats: { total_milestones: 0, completed_count: 0, delayed_count: 0 },
        financials: { total_expenses: 0, billable: 0 },
        teamVelocityAverage: 0
      })
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch + polling every 30 seconds
  useEffect(() => {
    fetchKPIs()
    pollingId = setInterval(fetchKPIs, 30000)

    return () => {
      if (pollingId) clearInterval(pollingId)
    }
  }, [])

  // Storage event listener for cross-tab sync
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'pm_kpis_updated') {
        try {
          const data = JSON.parse(event.newValue || '{}')
          setKpis(data.kpis)
        } catch (e) {
          console.error('Failed to parse storage data', e)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return { kpis, loading, error, refreshKPIs: fetchKPIs }
}