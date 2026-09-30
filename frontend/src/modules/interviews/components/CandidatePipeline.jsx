import React, { useState, useEffect } from 'react';
import candidateApi from '../../../../services/api/candidateApi'
import interviewApi from '../../../../services/api/interviewApi'

const STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected']

export default function CandidatePipeline() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      const data = await candidateApi.getAll()
      setCandidates(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const moveCandidate = async (candidateId, newStage) => {
    try {
      await interviewApi.updateStatus(candidateId, newStage.toLowerCase())
      setCandidates((prev) =>
        prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
      )
    } catch (err) {
      console.error('Failed to move candidate:', err)
    }
  }

  if (loading) return <div className="loading">Loading pipeline...</div>
  if (error) return <div className="emptyState textDanger">Error: {error}</div>

  return (
    <div className="overflowAuto">
      <div className="flex gap4" style={{ minWidth: `${STAGES.length * 280}px` }}>
        {STAGES.map((stage) => (
          <div key={stage} className="card" style={{ flex: '0 0 260px' }}>
            <div className="cardHeader">
              <h3 className="cardTitle">{stage}</h3>
              <span className="textMuted textSm">
                {candidates.filter((c) => c.stage === stage).length}
              </span>
            </div>
            <div className="cardBody" style={{ minHeight: '400px' }}>
              {candidates
                .filter((c) => c.stage === stage)
                .map((candidate) => (
                  <div
                    key={candidate.id}
                    className="card mb3 cursorPointer"
                    onClick={() => setSelectedCandidate(candidate)}
                    style={{ border: '1px solid var(--admin-border)' }}
                  >
                    <div className="cardBody">
                      <h4 className="fontSemibold textPrimary">{candidate.name}</h4>
                      <p className="textSecondary textSm">{candidate.role}</p>
                      <span className={`statusTag ${candidate.status === 'active' ? 'active' : 'pending'}`}>
                        {candidate.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {selectedCandidate && (
        <div className="overlay" onClick={() => setSelectedCandidate(null)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2 className="modalTitle">{selectedCandidate.name}</h2>
              <button className="closeBtn" onClick={() => setSelectedCandidate(null)}>
                &times;
              </button>
            </div>
            <div className="modalBody">
              <div className="form">
                <div className="formGroup">
                  <label className="label">Email</label>
                  <input className="inputField" value={selectedCandidate.email || ''} readOnly />
                </div>
                <div className="formGroup">
                  <label className="label">Role</label>
                  <input className="inputField" value={selectedCandidate.role || ''} readOnly />
                </div>
                <div className="formGroup">
                  <label className="label">Current Stage</label>
                  <select
                    className="select"
                    value={selectedCandidate.stage}
                    onChange={(e) => moveCandidate(selectedCandidate.id, e.target.value)}
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
