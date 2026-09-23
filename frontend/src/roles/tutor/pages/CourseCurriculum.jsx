import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listCourses } from '../../../services/api/courseApi.js';
import { listModules, createModule, updateModule, deleteModule, reorderModules } from '../../../services/api/moduleApi.js';
import { listLessons, createLesson, updateLesson, deleteLesson, reorderLessons, createLessonBlock } from '../../../services/api/lessonApi.js';
import axios from '../../../services/axios.js';

export default function TutorCurriculum() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals & Forms
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  const [editingModule, setEditingModule] = useState(null);

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState(null);
  const [lessonForm, setLessonForm] = useState({ title: '', video_url: '', content: '' });

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [targetLessonId, setTargetLessonId] = useState(null);
  const [blockForm, setBlockForm] = useState({ block_type: 'MARKDOWN', body: '', code: '', url: '', is_interactive: false });

  const [showImportModal, setShowImportModal] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importing, setImporting] = useState(false);

  // 1. Fetch Courses
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCourses().catch(() => []);
      const courseList = Array.isArray(data) ? data : [];
      setCourses(courseList);
      if (courseList.length > 0 && !selectedCourseId) {
        setSelectedCourseId(courseList[0].id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // 2. Fetch Modules & Lessons for Selected Course
  const fetchCurriculum = useCallback(async (courseId) => {
    if (!courseId) return;
    try {
      const mods = await listModules(courseId);
      const sortedModules = Array.isArray(mods) ? mods.sort((a, b) => a.module_order - b.module_order) : [];

      const enriched = await Promise.all(
        sortedModules.map(async (mod) => {
          const lsns = await listLessons(mod.id);
          const sortedLessons = Array.isArray(lsns) ? lsns.sort((a, b) => a.lesson_order - b.lesson_order) : [];
          return { ...mod, lessons: sortedLessons };
        })
      );
      setModules(enriched);
    } catch (err) {
      console.error('Failed to load course modules', err);
    }
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchCurriculum(selectedCourseId);
    }
  }, [selectedCourseId, fetchCurriculum]);

  // 3. Module Operations
  const handleSaveModule = async (e) => {
    e.preventDefault();
    if (!moduleTitle.trim() || !selectedCourseId) return;
    try {
      if (editingModule) {
        await updateModule(editingModule.id, { title: moduleTitle });
      } else {
        await createModule(selectedCourseId, { title: moduleTitle });
      }
      setShowModuleModal(false);
      setModuleTitle('');
      setEditingModule(null);
      fetchCurriculum(selectedCourseId);
    } catch (err) {
      alert('Failed to save module: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Are you sure you want to delete this module and all its lessons?')) return;
    try {
      await deleteModule(moduleId);
      fetchCurriculum(selectedCourseId);
    } catch (err) {
      alert('Failed to delete module: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleMoveModule = async (index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= modules.length) return;

    const reordered = [...modules];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIdx, 0, moved);

    setModules(reordered);
    try {
      await reorderModules(selectedCourseId, reordered.map(m => m.id));
    } catch (err) {
      console.error('Failed to save module order', err);
      fetchCurriculum(selectedCourseId);
    }
  };

  // 4. Lesson Operations
  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim() || !targetModuleId) return;
    try {
      await createLesson(targetModuleId, lessonForm);
      setShowLessonModal(false);
      setLessonForm({ title: '', video_url: '', content: '' });
      fetchCurriculum(selectedCourseId);
    } catch (err) {
      alert('Failed to create lesson: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await deleteLesson(lessonId);
      fetchCurriculum(selectedCourseId);
    } catch (err) {
      alert('Failed to delete lesson: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleMoveLesson = async (modId, lsnIndex, direction) => {
    const mod = modules.find(m => m.id === modId);
    if (!mod || !mod.lessons) return;

    const newIdx = direction === 'up' ? lsnIndex - 1 : lsnIndex + 1;
    if (newIdx < 0 || newIdx >= mod.lessons.length) return;

    const reorderedLessons = [...mod.lessons];
    const [moved] = reorderedLessons.splice(lsnIndex, 1);
    reorderedLessons.splice(newIdx, 0, moved);

    setModules(prev => prev.map(m => m.id === modId ? { ...m, lessons: reorderedLessons } : m));

    try {
      await reorderLessons(modId, reorderedLessons.map(l => l.id));
    } catch (err) {
      console.error('Failed to reorder lessons', err);
      fetchCurriculum(selectedCourseId);
    }
  };

  // 5. Block Operations
  const handleSaveBlock = async (e) => {
    e.preventDefault();
    if (!targetLessonId) return;

    let payload = {};
    if (blockForm.block_type === 'MARKDOWN') payload = { body: blockForm.body };
    else if (blockForm.block_type === 'CODE_PLAYGROUND') payload = { code: blockForm.code };
    else if (blockForm.block_type === 'RESOURCE_DOWNLOAD') payload = { url: blockForm.url, title: blockForm.body || 'Resource' };

    try {
      await createLessonBlock(targetLessonId, {
        block_type: blockForm.block_type,
        content_payload: payload,
        is_interactive: blockForm.is_interactive
      });
      setShowBlockModal(false);
      setBlockForm({ block_type: 'MARKDOWN', body: '', code: '', url: '', is_interactive: false });
      alert('Interactive block added to lesson successfully!');
    } catch (err) {
      alert('Failed to add block: ' + (err.response?.data?.message || err.message));
    }
  };

  // 6. Bulk Export & Import
  const handleExportCurriculum = async () => {
    try {
      const res = await axios.get(`/courses/${selectedCourseId}/export`);
      const exportData = res.data?.data || res.data;
      const jsonStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `curriculum-${selectedCourseId}.json`;
      a.click();
    } catch (err) {
      alert('Export failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleImportCurriculum = async (e) => {
    e.preventDefault();
    setImporting(true);
    try {
      const parsed = JSON.parse(importJson);
      const modulesList = parsed.modules || (Array.isArray(parsed) ? parsed : []);
      await axios.post(`/courses/${selectedCourseId}/import`, { modules: modulesList });
      setShowImportModal(false);
      setImportJson('');
      fetchCurriculum(selectedCourseId);
      alert('Curriculum successfully imported!');
    } catch (err) {
      alert('Import failed: Check JSON structure. ' + (err.response?.data?.message || err.message));
    } finally {
      setImporting(false);
    }
  };

  return (
    <AdminPage
      title="Curriculum Studio"
      subtitle="Interactive syllabus designer with real-time student synchronization"
      loading={loading}
      error={error}
      onRetry={fetchCourses}
    >
      {/* Course Bar & Actions */}
      <div className="card" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontWeight: 600, fontSize: 14 }}>Managing Course:</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              background: 'var(--admin-card-bg)',
              color: 'var(--admin-text-primary)',
              border: '1px solid var(--admin-border-subtle)',
              fontSize: 14,
              minWidth: 260
            }}
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.name || c.title} ({c.code || 'Course'})</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={handleExportCurriculum} className="btn secondary" style={{ fontSize: 13 }}>
            📥 Export JSON
          </button>
          <button onClick={() => setShowImportModal(true)} className="btn secondary" style={{ fontSize: 13 }}>
            📤 Import JSON
          </button>
          <button
            onClick={() => {
              setEditingModule(null);
              setModuleTitle('');
              setShowModuleModal(true);
            }}
            className="btn primary"
            style={{ fontSize: 13 }}
          >
            + Add Module
          </button>
        </div>
      </div>

      {/* Modules & Lessons Studio Tree */}
      {modules.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <span style={{ fontSize: 44 }}>📚</span>
          <h3 style={{ margin: '12px 0 6px 0' }}>No curriculum modules defined yet</h3>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: 14, marginBottom: 18 }}>
            Start building your course structure by adding your first syllabus module.
          </p>
          <button
            onClick={() => setShowModuleModal(true)}
            className="btn primary"
          >
            + Create First Module
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {modules.map((mod, modIdx) => (
            <div key={mod.id} className="card" style={{ padding: 20 }}>
              {/* Module Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, borderBottom: '1px solid var(--admin-border-subtle)', paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <button
                      disabled={modIdx === 0}
                      onClick={() => handleMoveModule(modIdx, 'up')}
                      style={{ background: 'none', border: 0, color: modIdx === 0 ? 'gray' : 'white', cursor: modIdx === 0 ? 'default' : 'pointer', fontSize: 12, padding: 0 }}
                    >
                      ▲
                    </button>
                    <button
                      disabled={modIdx === modules.length - 1}
                      onClick={() => handleMoveModule(modIdx, 'down')}
                      style={{ background: 'none', border: 0, color: modIdx === modules.length - 1 ? 'gray' : 'white', cursor: modIdx === modules.length - 1 ? 'default' : 'pointer', fontSize: 12, padding: 0 }}
                    >
                      ▼
                    </button>
                  </div>

                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--admin-primary)', textTransform: 'uppercase' }}>
                      Module {modIdx + 1}
                    </span>
                    <h3 style={{ margin: 0, fontSize: 18 }}>{mod.title}</h3>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => {
                      setTargetModuleId(mod.id);
                      setLessonForm({ title: '', video_url: '', content: '' });
                      setShowLessonModal(true);
                    }}
                    className="btn primary"
                    style={{ fontSize: 12, padding: '6px 12px' }}
                  >
                    + Add Lesson
                  </button>
                  <button
                    onClick={() => {
                      setEditingModule(mod);
                      setModuleTitle(mod.title);
                      setShowModuleModal(true);
                    }}
                    className="btn secondary"
                    style={{ fontSize: 12, padding: '6px 12px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteModule(mod.id)}
                    className="btn secondary"
                    style={{ fontSize: 12, padding: '6px 10px', color: '#ff5252' }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Module Lessons */}
              <div style={{ marginTop: 12 }}>
                {mod.lessons?.length === 0 ? (
                  <p style={{ color: 'var(--admin-text-muted)', fontSize: 13, margin: '8px 0', fontStyle: 'italic' }}>
                    No lessons yet. Click "+ Add Lesson" to create content for this module.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {mod.lessons.map((lsn, lsnIdx) => (
                      <div
                        key={lsn.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 14px',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--admin-border-subtle)',
                          borderRadius: 6
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {/* Lesson Reorder Buttons */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <button
                              disabled={lsnIdx === 0}
                              onClick={() => handleMoveLesson(mod.id, lsnIdx, 'up')}
                              style={{ background: 'none', border: 0, color: lsnIdx === 0 ? 'gray' : 'white', cursor: lsnIdx === 0 ? 'default' : 'pointer', fontSize: 10, padding: 0 }}
                            >
                              ▲
                            </button>
                            <button
                              disabled={lsnIdx === mod.lessons.length - 1}
                              onClick={() => handleMoveLesson(mod.id, lsnIdx, 'down')}
                              style={{ background: 'none', border: 0, color: lsnIdx === mod.lessons.length - 1 ? 'gray' : 'white', cursor: lsnIdx === mod.lessons.length - 1 ? 'default' : 'pointer', fontSize: 10, padding: 0 }}
                            >
                              ▼
                            </button>
                          </div>

                          <span style={{ fontSize: 14, fontWeight: 500 }}>
                            {lsnIdx + 1}. {lsn.title}
                          </span>

                          {lsn.video_url && (
                            <span style={{ fontSize: 12, padding: '2px 6px', borderRadius: 4, background: 'rgba(0,122,255,0.15)', color: 'var(--admin-primary)' }}>
                              📹 Video
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => {
                              setTargetLessonId(lsn.id);
                              setShowBlockModal(true);
                            }}
                            className="btn secondary"
                            style={{ fontSize: 11, padding: '4px 8px' }}
                          >
                            + Block
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lsn.id)}
                            className="btn secondary"
                            style={{ fontSize: 11, padding: '4px 8px', color: '#ff5252' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Module Modal */}
      {showModuleModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '90%', maxWidth: 450, padding: 24 }}>
            <h3 style={{ marginTop: 0 }}>{editingModule ? 'Edit Module' : 'Create New Module'}</h3>
            <form onSubmit={handleSaveModule}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Module Title</label>
                <input
                  type="text"
                  required
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  placeholder="e.g., Foundations of State Management"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" onClick={() => setShowModuleModal(false)} className="btn secondary">Cancel</button>
                <button type="submit" className="btn primary">Save Module</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lesson Modal */}
      {showLessonModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '90%', maxWidth: 500, padding: 24 }}>
            <h3 style={{ marginTop: 0 }}>Add Lesson to Module</h3>
            <form onSubmit={handleSaveLesson}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Lesson Title</label>
                <input
                  type="text"
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="e.g., Redux Toolkit Quickstart"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Video URL (YouTube, Vimeo, MP4)</label>
                <input
                  type="url"
                  value={lessonForm.video_url}
                  onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Reading Material / Notes</label>
                <textarea
                  rows={4}
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                  placeholder="Key concepts, takeaways, or code references..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" onClick={() => setShowLessonModal(false)} className="btn secondary">Cancel</button>
                <button type="submit" className="btn primary">Create Lesson</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Content Block Modal */}
      {showBlockModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '90%', maxWidth: 500, padding: 24 }}>
            <h3 style={{ marginTop: 0 }}>Add Interactive Content Block</h3>
            <form onSubmit={handleSaveBlock}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Block Type</label>
                <select
                  value={blockForm.block_type}
                  onChange={(e) => setBlockForm({ ...blockForm, block_type: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'var(--admin-card-bg)', color: 'white', border: '1px solid var(--admin-border-subtle)' }}
                >
                  <option value="MARKDOWN">Markdown / Formatted Notes</option>
                  <option value="CODE_PLAYGROUND">Code Playground / Sandbox</option>
                  <option value="RESOURCE_DOWNLOAD">Downloadable Resource</option>
                </select>
              </div>

              {blockForm.block_type === 'CODE_PLAYGROUND' ? (
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Starter Code Snippet</label>
                  <textarea
                    rows={5}
                    value={blockForm.code}
                    onChange={(e) => setBlockForm({ ...blockForm, code: e.target.value })}
                    placeholder="// function example() { ... }"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white', fontFamily: 'monospace' }}
                  />
                </div>
              ) : blockForm.block_type === 'RESOURCE_DOWNLOAD' ? (
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Download URL</label>
                  <input
                    type="url"
                    value={blockForm.url}
                    onChange={(e) => setBlockForm({ ...blockForm, url: e.target.value })}
                    placeholder="https://..."
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                  />
                </div>
              ) : (
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Content Body</label>
                  <textarea
                    rows={4}
                    value={blockForm.body}
                    onChange={(e) => setBlockForm({ ...blockForm, body: e.target.value })}
                    placeholder="Write formatted notes..."
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                  />
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={blockForm.is_interactive}
                    onChange={(e) => setBlockForm({ ...blockForm, is_interactive: e.target.checked })}
                  />
                  <span>Mark as Interactive Student Exercise</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" onClick={() => setShowBlockModal(false)} className="btn secondary">Cancel</button>
                <button type="submit" className="btn primary">Attach Block</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showImportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '90%', maxWidth: 550, padding: 24 }}>
            <h3 style={{ marginTop: 0 }}>Bulk Import Course Curriculum</h3>
            <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginBottom: 12 }}>
              Paste a JSON curriculum definition with modules and lessons array.
            </p>
            <form onSubmit={handleImportCurriculum}>
              <textarea
                required
                rows={10}
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder={`{\n  "modules": [\n    {\n      "title": "Module 1: Introduction",\n      "lessons": [\n        { "title": "Lesson 1: Getting Started", "content": "Overview text..." }\n      ]\n    }\n  ]\n}`}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white', fontFamily: 'monospace', fontSize: 12 }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button type="button" onClick={() => setShowImportModal(false)} className="btn secondary">Cancel</button>
                <button type="submit" disabled={importing} className="btn primary">
                  {importing ? 'Importing...' : 'Run Bulk Import'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminPage>
  );
}