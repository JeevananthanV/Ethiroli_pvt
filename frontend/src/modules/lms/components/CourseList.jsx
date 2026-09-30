import React, { useState, useEffect, useCallback } from 'react';
import courseApi from '../../../services/api/courseApi'
import AdminPage from '../../../common/components/AdminPage'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import CourseEditor from './CourseEditor'

export default function CourseList() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  const fetchCourses = useCallback(async () => {
    try {
      const data = await courseApi.getAll()
      setCourses(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = !filterCategory || course.category === filterCategory
    return matchesSearch && matchesFilter
  })

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
        <Button onClick={() => { setSelectedCourse(null); setShowModal(true) }}>
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
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="">All Categories</option>
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
                <Button size="small" onClick={() => { setSelectedCourse(course); setShowModal(true) }}>
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
        <CourseEditor
          courseId={selectedCourse?.id}
          onClose={() => setShowModal(false)}
          onSuccess={fetchCourses}
        />
      </Modal>
    </AdminPage>
  )
}
