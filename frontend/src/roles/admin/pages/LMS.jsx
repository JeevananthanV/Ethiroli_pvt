import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage'
import { courseApi } from '../../../services/api/courseApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import Input from '../../../common/components/Input'

export default function AdminLMS() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({ title: '', description: '', category: 'technology', level: 'beginner', status: 'draft' })

  const fetchCourses = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await courseApi.getAll()
      setCourses(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = !formData.category || course.category === formData.category
    return matchesSearch && matchesFilter
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedCourse) {
        await courseApi.update(selectedCourse.id, formData)
      } else {
        await courseApi.create(formData)
      }
      setShowModal(false)
      setSelectedCourse(null)
      setFormData({ title: '', description: '', category: 'technology', level: 'beginner', status: 'draft' })
      fetchCourses()
    } catch (err) {
      alert('Failed to save course: ' + err.message)
    }
  }

  const handleEdit = (course) => {
    setSelectedCourse(course)
    setFormData({
      title: course.title || '',
      description: course.description || '',
      category: course.category || 'technology',
      level: course.level || 'beginner',
      status: course.status || 'draft',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return
    try {
      await courseApi.delete(id)
      setCourses((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      alert('Failed to delete course: ' + error.message)
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'published':
        return 'active'
      case 'draft':
        return 'pending'
      case 'archived':
        return 'error'
      default:
        return 'pending'
    }
  }

  return (
    <AdminPage
      title="Courses"
      subtitle="Manage and organize courses"
      loading={loading}
      error={error}
      onRetry={fetchCourses}
      actions={
        <Button onClick={() => { setSelectedCourse(null); setFormData({ title: '', description: '', category: 'technology', level: 'beginner', status: 'draft' }); setShowModal(true) }}>
          Create Course
        </Button>
      }
    >
      <div className="flex gap3 mb4">
        <input
          type="text"
          className="inputField"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <select
          className="select"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          style={{ maxWidth: '200px' }}
        >
          <option value="technology">Technology</option>
          <option value="business">Business</option>
          <option value="design">Design</option>
          <option value="marketing">Marketing</option>
        </select>
      </div>

      <div className="grid gridCols3">
        {filteredCourses.map((course) => (
          <div key={course.id} className="card">
            <div className="cardBody">
              <div className="flex justifyBetween itemsCenter mb3">
                <span className={`statusTag ${getStatusClass(course.status)}`}>
                  {course.status}
                </span>
                <span className="textMuted textSm">{course.level}</span>
              </div>
              <h3 className="fontSemibold textPrimary mb2">{course.title}</h3>
              <p className="textSecondary textSm mb3 truncate">{course.description}</p>
              <div className="flex gap3">
                <Button size="small" onClick={() => handleEdit(course)}>
                  Edit
                </Button>
                <Button size="small" variant="danger" onClick={() => handleDelete(course.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="emptyState">
          <h3>No courses found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedCourse ? 'Edit Course' : 'Create Course'}>
        <form onSubmit={handleSubmit}>
          <div className="form">
            <div className="formGroup">
              <label className="label required">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="formGroup">
              <label className="label">Description</label>
              <textarea
                className="inputField"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="formGroup">
              <label className="label">Category</label>
              <select
                className="select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
            <div className="formGroup">
              <label className="label">Level</label>
              <select
                className="select"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="formGroup">
              <label className="label">Status</label>
              <select
                className="select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {selectedCourse ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </AdminPage>
  )
}
