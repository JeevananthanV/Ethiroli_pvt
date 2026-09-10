import React, { useState, useEffect } from 'react'
import jobApi from '../../../../services/api/jobApi'
import integrationApi from '../../../../services/api/integrationApi'

export default function PostToPlatforms({ jobId, onSuccess }) {
  const [job, setJob] = useState(null)
  const [platforms, setPlatforms] = useState([])
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobData, integrations] = await Promise.all([
          jobApi.getById(jobId),
          integrationApi.getAll(),
        ])
        setJob(jobData)
        setPlatforms(integrations.filter((i) => i.active && i.type === 'job-board'))
        setSelectedPlatforms(integrations.filter((i) => i.active && i.type === 'job-board').map((p) => p.id))
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [jobId])

  const togglePlatform = (id) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handlePublish = async () => {
    setPosting(true)
    setResult(null)
    try {
      const data = await jobApi.publish(jobId, selectedPlatforms)
      setResult(data)
      onSuccess?.()
    } catch (error) {
      setResult({ status: 'error', message: error.message })
    } finally {
      setPosting(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading platforms...</div>
  }

  if (!job) {
    return <div className="emptyState">Job not found</div>
  }

  return (
    <div className="card">
      <div className="cardHeader">
        <h3 className="cardTitle">Post to Platforms</h3>
        <span className="textSecondary textSm">{job.title}</span>
      </div>
      <div className="cardBody">
        <div className="formGroup mb4">
          <label className="label">Select Platforms</label>
          <div className="flex flexCol gap2">
            {platforms.length === 0 ? (
              <p className="textMuted">No active platforms configured. Configure integrations first.</p>
            ) : (
              platforms.map((platform) => (
                <label key={platform.id} className="flex itemsCenter gap2 cursorPointer">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform.id)}
                    onChange={() => togglePlatform(platform.id)}
                  />
                  <span className="fontMedium">{platform.name}</span>
                  <span className={`statusTag ${platform.connected ? 'active' : 'error'}`}>
                    {platform.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="flex gap3">
          <button
            className="btn primary"
            onClick={handlePublish}
            disabled={posting || selectedPlatforms.length === 0}
          >
            {posting ? 'Posting...' : `Post to ${selectedPlatforms.length} Platform${selectedPlatforms.length !== 1 ? 's' : ''}`}
          </button>
        </div>

        {result && (
          <div className={`card mt4 ${result.status === 'success' ? 'border textSuccess' : 'border textDanger'}`}>
            <div className="cardBody">
              <h4 className="fontSemibold">Publish Result: {result.status}</h4>
              <p className="textSecondary">{result.message}</p>
              {result.posted && (
                <ul className="textSecondary textSm mt2">
                  {result.posted.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
