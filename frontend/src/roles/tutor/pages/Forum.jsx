import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { forumApi } from '../../../services/api/forumApi'
import { listCourses } from '../../../services/api/courseApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import Input from '../../../common/components/Input'

const EMPTY_FORM = { title: '', content: '', category: 'general', course_id: '' }

export default function TutorForum() {
  const [threads, setThreads] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedThread, setSelectedThread] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)

  const fetchThreads = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await forumApi.getAllThreads()
      setThreads(Array.isArray(data) ? data : (data?.data || []))
    } catch (err) {
      setError(err.message || 'Failed to load forum threads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchThreads()
    // The course picker is required: forum_posts.course_id is NOT NULL, so a
    // thread cannot be created without belonging to a course.
    listCourses()
      .then((data) => setCourses(Array.isArray(data) ? data : (data?.data || [])))
      .catch(() => setCourses([]))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedThread) {
        await forumApi.createReply(selectedThread.id, { content: formData.content })
      } else {
        if (!formData.course_id) {
          alert('Please choose a course for this thread.')
          return
        }
        await forumApi.createThread(formData)
      }
      setShowModal(false)
      setSelectedThread(null)
      setFormData(EMPTY_FORM)
      fetchThreads()
    } catch (err) {
      alert('Failed to save: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleReply = (thread) => {
    setSelectedThread(thread)
    setFormData(EMPTY_FORM)
    setShowModal(true)
  }

  const handleVote = async (postId, value) => {
    try {
      await forumApi.vote(postId, value)
      fetchThreads()
    } catch (err) {
      alert('Failed to vote: ' + err.message)
    }
  }

  return (
    <AdminPage
      title="Forum Management"
      subtitle="Manage forum threads and discussions"
      loading={loading}
      error={error}
      onRetry={fetchThreads}
      actions={
        <Button onClick={() => { setSelectedThread(null); setFormData(EMPTY_FORM); setShowModal(true) }}>
          New Thread
        </Button>
      }
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Total Threads</div>
          <div className="statValue">{threads.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Active</div>
          <div className="statValue" style={{ color: 'var(--admin-success)' }}>
            {threads.filter((t) => t.status === 'active' || !t.status).length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Replies</div>
          <div className="statValue" style={{ color: 'var(--admin-info)' }}>
            {threads.reduce((sum, t) => sum + (Number(t.replyCount) || 0), 0)}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Forum Threads</h3>
        </div>
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Replies</th>
                <th>Last Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {threads.length === 0 ? (
                <tr>
                  <td colSpan="5" className="textCenter textMuted py4">
                    No forum threads found
                  </td>
                </tr>
              ) : (
                threads.map((thread) => (
                  <tr key={thread.id}>
                    <td className="fontSemibold">{thread.title}</td>
                    <td>{thread.category || 'general'}</td>
                    <td>{Number(thread.replyCount) || 0}</td>
                    <td className="textSecondary">
                      {thread.updatedAt ? new Date(thread.updatedAt).toLocaleDateString() : '-'}
                    </td>
                    <td>
                      <div className="flex gap2">
                        <Button size="small" onClick={() => handleReply(thread)}>
                          Reply
                        </Button>
                        <Button size="small" variant="secondary" onClick={() => handleVote(thread.id, 1)}>
                          Upvote
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedThread ? 'Reply to Thread' : 'New Thread'}>
        <form onSubmit={handleSubmit}>
          <div className="form">
            {!selectedThread && (
              <div className="formGroup">
                <label className="label required">Course</label>
                <select
                  className="select"
                  value={formData.course_id}
                  onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                  required
                >
                  <option value="">Choose a course…</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code ? `${course.code} - ` : ''}{course.name}
                    </option>
                  ))}
                </select>
                {courses.length === 0 && (
                  <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--admin-text-muted)' }}>
                    No courses assigned to you yet - a thread must belong to a course.
                  </p>
                )}
              </div>
            )}
            {!selectedThread && (
              <div className="formGroup">
                <label className="label required">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            )}
            <div className="formGroup">
              <label className="label required">Content</label>
              <textarea
                className="inputField"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={5}
                required
              />
            </div>
            {!selectedThread && (
              <div className="formGroup">
                <label className="label">Category</label>
                <select
                  className="select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="questions">Questions</option>
                  <option value="discussions">Discussions</option>
                  <option value="announcements">Announcements</option>
                </select>
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {selectedThread ? 'Reply' : 'Post'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </AdminPage>
  )
}
