import React, { useState, useEffect, useCallback } from 'react'
import courseApi from '../../../services/api/courseApi'
import moduleApi from '../../../services/api/moduleApi'

export default function CourseEditor({ courseId, onSuccess }) {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    status: 'draft',
    thumbnail: '',
    modules: [],
  })

  useEffect(() => {
    if (courseId) {
      fetchCourse()
    } else {
      setLoading(false)
    }
  }, [courseId, fetchCourse])

  const fetchCourse = useCallback(async () => {
    try {
      const [courseData, modulesData] = await Promise.all([
        courseApi.getById(courseId),
        moduleApi.getAll(),
      ])
      setModules(modulesData.filter((m) => m.courseId === courseId))
      setFormData({
        title: courseData.title || '',
        description: courseData.description || '',
        category: courseData.category || '',
        level: courseData.level || 'beginner',
        status: courseData.status || 'draft',
        thumbnail: courseData.thumbnail || '',
        modules: modulesData.filter((m) => m.courseId === courseId).map((m) => m.id),
      })
    } catch (error) {
      console.error('Failed to fetch course:', error)
    } finally {
      setLoading(false)
    }
  }, [courseId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleModule = (moduleId) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(moduleId)
        ? prev.modules.filter((id) => id !== moduleId)
        : [...prev.modules, moduleId],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (courseId) {
        await courseApi.update(courseId, formData)
      } else {
        await courseApi.create(formData)
      }
      onSuccess?.()
    } catch (error) {
      alert('Failed to save course: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading course...</div>
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="flex gap3 mb4">
        <button
          type="button"
          className={`btn ${activeTab === 'details' ? 'primary' : 'secondary'}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          type="button"
          className={`btn ${activeTab === 'modules' ? 'primary' : 'secondary'}`}
          onClick={() => setActiveTab('modules')}
        >
          Modules & Lessons
        </button>
      </div>

      {activeTab === 'details' && (
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Course Details</h3>
          </div>
          <div className="cardBody">
            <div className="formGroup">
              <label className="label required">Course Title</label>
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
              <label className="label required">Description</label>
              <textarea
                name="description"
                className="inputField"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="grid gridCols2">
              <div className="formGroup">
                <label className="label">Category</label>
                <select className="select" name="category" value={formData.category} onChange={handleChange}>
                  <option value="">Select category</option>
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>

              <div className="formGroup">
                <label className="label">Level</label>
                <select className="select" name="level" value={formData.level} onChange={handleChange}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="formGroup">
              <label className="label">Thumbnail URL</label>
              <input
                type="url"
                name="thumbnail"
                className="inputField"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="formGroup">
              <label className="label">Status</label>
              <select className="select" name="status" value={formData.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'modules' && (
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Modules</h3>
          </div>
          <div className="cardBody">
            <div className="flex flexCol gap3">
              {modules.map((mod) => (
                <label key={mod.id} className="flex itemsCenter gap2 cursorPointer">
                  <input
                    type="checkbox"
                    checked={formData.modules.includes(mod.id)}
                    onChange={() => toggleModule(mod.id)}
                  />
                  <span className="fontMedium">{mod.title}</span>
                  <span className="textMuted textSm">{mod.lessons?.length || 0} lessons</span>
                </label>
              ))}
              {modules.length === 0 && (
                <p className="textMuted">No modules available. Create modules first.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap3 mt4">
        <button type="submit" className="btn primary" disabled={saving}>
          {saving ? 'Saving...' : courseId ? 'Update Course' : 'Create Course'}
        </button>
      </div>
    </form>
  )
}
