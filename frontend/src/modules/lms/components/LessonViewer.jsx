import React, { useState, useEffect, useCallback } from 'react'
import lessonApi from '../../../../services/api/lessonApi'
import AdminPage from '../../../common/components/AdminPage'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'

export default function LessonViewer({ lessonId }) {
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    fetchLesson()
  }, [lessonId, fetchLesson])

  const fetchLesson = useCallback(async () => {
    try {
      const data = await lessonApi.getById(lessonId)
      setLesson(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [lessonId])

  const handleMarkComplete = async () => {
    try {
      await lessonApi.complete(lessonId)
      setCompleted(true)
    } catch (error) {
      alert('Failed to mark lesson complete: ' + error.message)
    }
  }

  if (loading) {
    return <div className="loading">Loading lesson...</div>
  }

  if (error) {
    return <div className="emptyState textDanger">Error: {error}</div>
  }

  if (!lesson) {
    return <div className="emptyState">Lesson not found</div>
  }

  return (
    <div className="card">
      <div className="cardHeader">
        <h3 className="cardTitle">{lesson.title}</h3>
        {completed && <span className="statusTag active">Completed</span>}
      </div>
      <div className="cardBody">
        <div className="mb4">
          <p className="textSecondary">{lesson.description}</p>
        </div>

        {lesson.content && (
          <div className="card mb4" style={{ background: 'var(--admin-bg-light)' }}>
            <div className="cardBody">
              <h4 className="fontSemibold mb3">Content</h4>
              <div className="textSecondary" dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </div>
          </div>
        )}

        {lesson.videoUrl && (
          <div className="mb4">
            <video controls style={{ width: '100%', borderRadius: 'var(--admin-radius)' }} src={lesson.videoUrl} />
          </div>
        )}

        {lesson.attachments?.length > 0 && (
          <div className="mb4">
            <h4 className="fontSemibold mb3">Attachments</h4>
            <div className="flex flexCol gap2">
              {lesson.attachments.map((file, i) => (
                <a key={i} href={file.url} className="btn secondary" style={{ textAlign: 'left' }}>
                  📎 {file.name}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap3">
          <button
            className="btn primary"
            onClick={handleMarkComplete}
            disabled={completed}
          >
            {completed ? 'Completed' : 'Mark as Complete'}
          </button>
        </div>
      </div>
    </div>
  )
}
