import React, { useState, useEffect, useCallback } from 'react'
import moduleApi from '../../../../services/api/moduleApi'
import lessonApi from '../../../../services/api/lessonApi'

export default function ModuleEditor({ moduleId, courseId, onSuccess }) {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0,
    courseId: courseId || '',
  })

  useEffect(() => {
    if (moduleId) {
      fetchModule()
    } else {
      setLoading(false)
    }
  }, [moduleId, fetchModule])

  const fetchModule = useCallback(async () => {
    try {
      const data = await moduleApi.getById(moduleId)
      setFormData({
        title: data.title || '',
        description: data.description || '',
        order: data.order || 0,
        courseId: data.courseId || courseId || '',
      })

      const allLessons = await lessonApi.getAll()
      setLessons(allLessons.filter((l) => l.moduleId === moduleId))
    } catch (error) {
      console.error('Failed to fetch module:', error)
    } finally {
      setLoading(false)
    }
  }, [moduleId, courseId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (moduleId) {
        await moduleApi.update(moduleId, formData)
      } else {
        await moduleApi.create(formData)
      }
      onSuccess?.()
    } catch (error) {
      alert('Failed to save module: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading module...</div>
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">{moduleId ? 'Edit Module' : 'Create Module'}</h3>
        </div>
        <div className="cardBody">
          <div className="formGroup">
            <label className="label required">Module Title</label>
            <input
              type="text"
              name="title"
              className="inputField"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label className="label">Description</label>
            <textarea
              name="description"
              className="inputField"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="grid gridCols2">
            <div className="formGroup">
              <label className="label">Order</label>
              <input
                type="number"
                name="order"
                className="inputField"
                value={formData.order}
                onChange={handleChange}
                min={0}
              />
            </div>

            <div className="formGroup">
              <label className="label">Course</label>
              <select className="select" name="courseId" value={formData.courseId} onChange={handleChange}>
                <option value="">Select course</option>
                {/* In a real app, courses would be fetched */}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt4">
        <h4 className="fontSemibold mb3">Lessons in this Module</h4>
        <div className="flex flexCol gap2">
          {lessons.length === 0 ? (
            <p className="textMuted">No lessons in this module yet</p>
          ) : (
            lessons.map((lesson) => (
              <div key={lesson.id} className="card" style={{ border: '1px solid var(--admin-border)' }}>
                <div className="cardBody">
                  <span className="textPrimary">{lesson.title}</span>
                  <span className="textMuted textSm ml2">Order: {lesson.order}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex gap3 mt4">
        <button type="submit" className="btn primary" disabled={saving}>
          {saving ? 'Saving...' : moduleId ? 'Update Module' : 'Create Module'}
        </button>
      </div>
    </form>
  )
}
