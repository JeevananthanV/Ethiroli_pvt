import React, { useState, useEffect, useRef, useCallback } from 'react';
import courseApi from '../../../../services/api/courseApi'
import lessonApi from '../../../../services/api/lessonApi'
import enrollmentApi from '../../../../services/api/enrollmentApi'

export default function CoursePlayer({ courseId, userId }) {
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [currentLesson, setCurrentLesson] = useState(null)
  const [completedLessons, setCompletedLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef(null)

  useEffect(() => {
    fetchData()
  }, [courseId, fetchData])

  const fetchData = useCallback(async () => {
    try {
      const [courseData, allLessons] = await Promise.all([
        courseApi.getById(courseId),
        lessonApi.getAll(),
      ])
      setCourse(courseData)
      const courseLessons = allLessons.filter((l) => l.courseId === courseId)
      setLessons(courseLessons)
      if (courseLessons.length > 0) {
        setCurrentLesson(courseLessons[0])
      }

      const enrollments = await enrollmentApi.getAll()
      const enrollment = enrollments.find((e) => e.courseId === courseId && e.userId === userId)
      if (enrollment) {
        setCompletedLessons(enrollment.completedLessons || [])
        setProgress(enrollment.progress || 0)
      }
    } catch (error) {
      console.error('Failed to fetch course data:', error)
    } finally {
      setLoading(false)
    }
  }, [courseId, userId])

  const selectLesson = (lesson) => {
    setCurrentLesson(lesson)
  }

  const markComplete = async () => {
    if (!currentLesson) return
    try {
      await lessonApi.complete(currentLesson.id)
      setCompletedLessons((prev) => {
        const newCompleted = [...prev, currentLesson.id]
        const newProgress = Math.round((newCompleted.length / lessons.length) * 100)
        setProgress(newProgress)
        enrollmentApi.updateProgress(courseId, newProgress)
        return newCompleted
      })
    } catch (error) {
      console.error('Failed to mark lesson complete:', error)
    }
  }

  const nextLesson = () => {
    const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id)
    if (currentIndex < lessons.length - 1) {
      setCurrentLesson(lessons[currentIndex + 1])
    }
  }

  const prevLesson = () => {
    const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id)
    if (currentIndex > 0) {
      setCurrentLesson(lessons[currentIndex - 1])
    }
  }

  if (loading) {
    return <div className="loading">Loading course...</div>
  }

  if (!course) {
    return <div className="emptyState">Course not found</div>
  }

  const isCompleted = completedLessons.includes(currentLesson?.id)

  return (
    <div className="flex gap4" style={{ height: 'calc(100vh - 200px)' }}>
      <div className="card" style={{ flex: '1', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="cardBody" style={{ flex: 1, overflow: 'auto' }}>
          {currentLesson?.videoUrl ? (
            <video
              ref={videoRef}
              controls
              style={{ width: '100%', borderRadius: 'var(--admin-radius)' }}
              src={currentLesson.videoUrl}
            />
          ) : (
            <div className="textCenter py4">
              <h3 className="textPrimary mb3">{currentLesson?.title || 'Select a lesson'}</h3>
              <p className="textSecondary">{currentLesson?.content || ''}</p>
            </div>
          )}
        </div>
        <div className="cardHeader" style={{ borderTop: '1px solid var(--admin-border)' }}>
          <div className="flex gap3">
            <button className="btn secondary" onClick={prevLesson} disabled={lessons.findIndex((l) => l.id === currentLesson?.id) === 0}>
              Previous
            </button>
            <button className="btn primary" onClick={markComplete} disabled={isCompleted}>
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
            <button className="btn secondary" onClick={nextLesson} disabled={lessons.findIndex((l) => l.id === currentLesson?.id) === lessons.length - 1}>
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ width: '300px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="cardHeader">
          <h3 className="cardTitle">Course Content</h3>
          <span className="textMuted textSm">{progress}%</span>
        </div>
        <div className="cardBody" style={{ flex: 1, overflow: 'auto' }}>
          <div className="flex flexCol gap2">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`card cursorPointer ${currentLesson?.id === lesson.id ? 'border textPrimary' : ''}`}
                onClick={() => selectLesson(lesson)}
                style={{ border: '1px solid var(--admin-border)' }}
              >
                <div className="cardBody" style={{ padding: '12px' }}>
                  <div className="flex itemsCenter gap2">
                    <span className={`statusTag ${completedLessons.includes(lesson.id) ? 'active' : 'pending'}`}>
                      {completedLessons.includes(lesson.id) ? '✓' : '○'}
                    </span>
                    <span className="textSm truncate">{lesson.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
