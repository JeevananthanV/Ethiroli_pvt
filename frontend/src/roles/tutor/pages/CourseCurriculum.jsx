import React, { useEffect, useState, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listCourses } from '../../../services/api/courseApi.js';
import { listModules, createModule, updateModule, deleteModule, reorderModules } from '../../../services/api/moduleApi.js';
import { listLessons, createLesson, deleteLesson, reorderLessons, createLessonBlock } from '../../../services/api/lessonApi.js';
import axios from '../../../services/axios.js';

const BLOCK_TYPES = [
  { type: 'MARKDOWN', label: 'Theory / Markdown', icon: 'bi-file-text', color: '#0d6efd' },
  { type: 'VIDEO', label: 'Video Lecture', icon: 'bi-play-btn', color: '#dc3545' },
  { type: 'CODE_PLAYGROUND', label: 'Interactive Code Sandbox', icon: 'bi-code-slash', color: '#198754' },
  { type: 'PDF_VIEWER', label: 'PDF / Slides Guide', icon: 'bi-file-earmark-pdf', color: '#ffc107' },
  { type: 'DOWNLOADABLE', label: 'Downloadable Asset / Repo', icon: 'bi-download', color: '#0dcaf0' },
  { type: 'DAY_QUIZ', label: 'Day Assessment Quiz', icon: 'bi-patch-question', color: '#6f42c1' },
  { type: 'DAY_TASK', label: 'Hands-on Task / Drill', icon: 'bi-check2-circle', color: '#d63384' },
];

export default function TutorCurriculum() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePhase, setActivePhase] = useState('ALL'); // 'ALL' | 1 | 2 | 3 | 4

  // Modals & Forms
  const [showModuleModal, setShowModuleModal] = useState(false);
  const emptyModuleForm = { title: '', description: '', phase_number: 1, duration_days: 4, unlock_rule: 'IMMEDIATE', unlock_date: '' };
  const [moduleForm, setModuleForm] = useState(emptyModuleForm);
  const [editingModule, setEditingModule] = useState(null);

  // Lesson & Day Form
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    day_number: 1,
    estimated_minutes: 30,
    learning_objectives: '',
    video_url: '',
    video_duration_minutes: 25,
    min_watch_percentage: 85,
    unlock_rule: 'IMMEDIATE'
  });

  // Content Block Modal
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [targetLessonId, setTargetLessonId] = useState(null);
  const [blockForm, setBlockForm] = useState({
    block_type: 'MARKDOWN',
    title: '',
    body: '',
    code: '',
    language: 'javascript',
    url: '',
    file_name: '',
    quiz_id: '',
    task_instructions: '',
    max_points: 10
  });

  // Import/Export Modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importing, setImporting] = useState(false);

  // 1. Fetch Courses
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCourses().catch(() => []);
      const courseList = Array.isArray(data) ? data : (data?.data || []);
      setCourses(courseList);
      if (courseList.length > 0) {
        setSelectedCourseId(prev => prev || courseList[0].id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // 2. Fetch Modules & Lessons for Selected Course
  const fetchCurriculum = useCallback(async (courseId) => {
    if (!courseId) return;
    try {
      const mods = await listModules(courseId).catch(() => []);
      let sortedModules = Array.isArray(mods) ? mods.sort((a, b) => (a.module_order || 0) - (b.module_order || 0)) : [];

      // If empty in fresh DB, initialize rich demo Day-based curriculum structure
      if (sortedModules.length === 0) {
        sortedModules = [
          {
            id: 'mod-1',
            title: 'Module 1: Semantic HTML5 & Core Architecture',
            description: 'Days 1–4 of Phase 1: Semantic web standards, form controls, tables, ARIA accessibility, and layouts.',
            phase_number: 1,
            duration_days: 4,
            unlock_rule: 'IMMEDIATE',
            lessons: [
              {
                id: 'lsn-1',
                day_number: 1,
                title: 'Day 1: HTML Architecture & Semantic Structure',
                estimated_minutes: 45,
                learning_objectives: 'Understand DOM tree, semantic tags (<header>, <nav>, <main>, <article>, <aside>, <footer>)',
                video_url: 'https://youtube.com/watch?v=sample-html-1',
                video_duration_minutes: 28,
                min_watch_percentage: 85,
                blocks: [
                  { id: 'b1', block_type: 'MARKDOWN', body: '### HTML5 Semantic Architecture\n\nSemantic HTML provides meaning to web page elements beyond simple visual presentation. Screen readers, search engines, and browser developer tools rely on proper landmark elements.' },
                  { id: 'b2', block_type: 'CODE_PLAYGROUND', language: 'html', code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>Ethiroli Semantic Layout</title>\n</head>\n<body>\n  <header>\n    <h1>Ethiroli Academy</h1>\n  </header>\n</body>\n</html>' },
                  { id: 'b3', block_type: 'DAY_QUIZ', title: 'Day 1 Quick Check (5 MCQ Questions)', max_points: 5 },
                  { id: 'b4', block_type: 'DAY_TASK', task_instructions: 'Build a semantic 3-column portfolio page layout using only HTML5 semantic elements.', max_points: 10 }
                ]
              },
              {
                id: 'lsn-2',
                day_number: 2,
                title: 'Day 2: Advanced Form Controls & Client-Side Validation',
                estimated_minutes: 40,
                learning_objectives: 'HTML5 form validation attributes, inputs (email, tel, pattern, required, min, max)',
                video_url: 'https://youtube.com/watch?v=sample-html-2',
                video_duration_minutes: 32,
                min_watch_percentage: 85,
                blocks: [
                  { id: 'b5', block_type: 'MARKDOWN', body: '### Form Controls & Regex Pattern Matching\n\nForm validation starts at the native browser level before sending payloads to the backend API.' }
                ]
              },
              {
                id: 'lsn-3',
                day_number: 3,
                title: 'Day 3: Tables, Media Embedding & ARIA Landmarks',
                estimated_minutes: 40,
                learning_objectives: 'Accessible tables with <thead>, <tbody>, scope attributes and ARIA roles',
                blocks: []
              },
              {
                id: 'lsn-4',
                day_number: 4,
                title: 'Day 4: Phase 1 Capstone HTML Build & Day 4 Evaluation',
                estimated_minutes: 60,
                learning_objectives: 'Comprehensive evaluation of HTML5 semantic mastery',
                blocks: []
              }
            ]
          },
          {
            id: 'mod-2',
            title: 'Module 2: Modern CSS3 & Flexbox Layouts',
            description: 'Days 5–7 of Phase 1: CSS Box model, Flexbox 1D alignment, and responsive media queries.',
            phase_number: 1,
            duration_days: 3,
            unlock_rule: 'AFTER_PREVIOUS_PASSED',
            lessons: [
              { id: 'lsn-5', day_number: 5, title: 'Day 5: CSS Box Model & Modern Selectors', estimated_minutes: 45, blocks: [] },
              { id: 'lsn-6', day_number: 6, title: 'Day 6: Flexbox Container & Item Alignment', estimated_minutes: 50, blocks: [] },
              { id: 'lsn-7', day_number: 7, title: 'Day 7: Responsive Breakpoints & Mobile-First CSS', estimated_minutes: 55, blocks: [] }
            ]
          },
          {
            id: 'mod-3',
            title: 'Module 3: JavaScript ES6+ & DOM Manipulation',
            description: 'Days 8–10 of Phase 1: Variables, Arrow functions, Array methods, Promises, and DOM manipulation.',
            phase_number: 1,
            duration_days: 3,
            unlock_rule: 'AFTER_PREVIOUS_PASSED',
            lessons: [
              { id: 'lsn-8', day_number: 8, title: 'Day 8: Variables (let/const), Scope & Arrow Functions', estimated_minutes: 45, blocks: [] },
              { id: 'lsn-9', day_number: 9, title: 'Day 9: Map, Filter, Reduce & Array Deconstruction', estimated_minutes: 50, blocks: [] },
              { id: 'lsn-10', day_number: 10, title: 'Day 10: DOM Events & Async/Await API Fetching', estimated_minutes: 60, blocks: [] }
            ]
          }
        ];
      }

      setModules(sortedModules);
    } catch (err) {
      console.error('Failed to load course modules', err);
    }
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchCurriculum(selectedCourseId);
    }
  }, [selectedCourseId, fetchCurriculum]);

  // Filter Modules by Phase
  const filteredModules = useMemo(() => {
    if (activePhase === 'ALL') return modules;
    return modules.filter(m => (m.phase_number || 1) === Number(activePhase));
  }, [modules, activePhase]);

  // Save Module / Phase Group
  const handleSaveModule = async (e) => {
    e.preventDefault();
    if (!moduleForm.title.trim() || !selectedCourseId) return;
    try {
      const payload = {
        title: moduleForm.title.trim(),
        description: moduleForm.description.trim() || null,
        phase_number: Number(moduleForm.phase_number) || 1,
        duration_days: Number(moduleForm.duration_days) || 3,
        unlock_rule: moduleForm.unlock_rule || 'IMMEDIATE',
        unlock_date: moduleForm.unlock_date || null
      };
      if (editingModule) {
        await updateModule(editingModule.id, payload).catch(() => {});
      } else {
        await createModule(selectedCourseId, payload).catch(() => {});
      }
      setShowModuleModal(false);
      setModuleForm(emptyModuleForm);
      setEditingModule(null);
      fetchCurriculum(selectedCourseId);
    } catch (err) {
      alert('Failed to save module: ' + (err.response?.data?.message || err.message));
    }
  };

  // Save Day / Lesson
  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim() || !targetModuleId) return;
    try {
      const payload = {
        title: lessonForm.title.trim(),
        day_number: Number(lessonForm.day_number) || 1,
        estimated_minutes: Number(lessonForm.estimated_minutes) || 30,
        learning_objectives: lessonForm.learning_objectives || '',
        video_url: lessonForm.video_url || null,
        video_duration_minutes: Number(lessonForm.video_duration_minutes) || 20,
        min_watch_percentage: Number(lessonForm.min_watch_percentage) || 85,
        unlock_rule: lessonForm.unlock_rule || 'IMMEDIATE'
      };

      await createLesson(targetModuleId, payload).catch(() => {});
      setShowLessonModal(false);
      setLessonForm({
        title: '',
        day_number: 1,
        estimated_minutes: 30,
        learning_objectives: '',
        video_url: '',
        video_duration_minutes: 25,
        min_watch_percentage: 85,
        unlock_rule: 'IMMEDIATE'
      });
      fetchCurriculum(selectedCourseId);
    } catch (err) {
      alert('Failed to add day lesson: ' + err.message);
    }
  };

  // Add Content Block to Lesson
  const handleSaveBlock = async (e) => {
    e.preventDefault();
    if (!targetLessonId) return;
    try {
      await createLessonBlock(targetLessonId, blockForm).catch(() => {});
      setShowBlockModal(false);
      setBlockForm({
        block_type: 'MARKDOWN',
        title: '',
        body: '',
        code: '',
        language: 'javascript',
        url: '',
        file_name: '',
        quiz_id: '',
        task_instructions: '',
        max_points: 10
      });
      fetchCurriculum(selectedCourseId);
    } catch (err) {
      alert('Failed to attach content block: ' + err.message);
    }
  };

  // Export Course JSON
  const handleExportCourse = () => {
    const activeCourse = courses.find(c => String(c.id) === String(selectedCourseId));
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
      course: activeCourse,
      curriculum: modules
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `curriculum_${activeCourse?.code || 'course'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Total Day Count Computation
  const totalDays = useMemo(() => {
    let count = 0;
    modules.forEach(m => {
      count += (m.lessons?.length || m.duration_days || 0);
    });
    return count;
  }, [modules]);

  const selectedCourseObj = courses.find(c => String(c.id) === String(selectedCourseId));

  return (
    <AdminPage
      title="Curriculum & Day-Based Content Studio"
      subtitle="Author, sequence, and manage hierarchical courses (Phase → Module → Day → Lesson & Assessment Blocks)"
      loading={loading}
      error={error}
      onRetry={fetchCourses}
    >
      {/* Top Header: Course Switcher + Phase Tabs + Export/Import */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--admin-border-subtle)',
              color: 'white',
              fontSize: 14,
              fontWeight: 600,
              minWidth: 280
            }}
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.name || c.title} ({c.code || 'Track'})</option>
            ))}
          </select>

          {/* Phase Filter Tabs with Dynamic Previous & Next Phase */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <button
              className="btn btn-sm btn-outline-secondary"
              title="Previous Phase"
              onClick={() => {
                const phases = ['ALL', 1, 2, 3, 4];
                const currentIndex = phases.indexOf(activePhase);
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : phases.length - 1;
                setActivePhase(phases[prevIndex]);
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <i className="bi bi-chevron-left"></i>
              <span>Prev Phase</span>
            </button>

            <button
              className={`btn btn-sm ${activePhase === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActivePhase('ALL')}
            >
              All ({totalDays} Days)
            </button>
            <button
              className={`btn btn-sm ${activePhase === 1 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActivePhase(1)}
            >
              Phase 1: Foundation
            </button>
            <button
              className={`btn btn-sm ${activePhase === 2 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActivePhase(2)}
            >
              Phase 2: Core
            </button>
            <button
              className={`btn btn-sm ${activePhase === 3 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActivePhase(3)}
            >
              Phase 3: Advanced
            </button>
            <button
              className={`btn btn-sm ${activePhase === 4 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActivePhase(4)}
            >
              Phase 4: Capstone
            </button>

            <button
              className="btn btn-sm btn-outline-secondary"
              title="Next Phase"
              onClick={() => {
                const phases = ['ALL', 1, 2, 3, 4];
                const currentIndex = phases.indexOf(activePhase);
                const nextIndex = currentIndex < phases.length - 1 ? currentIndex + 1 : 0;
                setActivePhase(phases[nextIndex]);
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <span>Next Phase</span>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-secondary"
            onClick={handleExportCourse}
            title="Export full curriculum hierarchy to JSON"
          >
            <i className="bi bi-box-arrow-up"></i> Export JSON
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingModule(null);
              setModuleForm(emptyModuleForm);
              setShowModuleModal(true);
            }}
          >
            <i className="bi bi-plus-lg"></i> Add Module
          </button>
        </div>
      </div>

      {/* Curriculum Module Tree */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {filteredModules.length === 0 ? (
          <div className="lmsCard">
            <div className="lmsCardBody">
              <div className="lmsEmpty">
                <i className="bi bi-journal-code lmsEmptyIcon"></i>
                <h4>No Modules Found for Selected Phase</h4>
                <p>Add a module or day lessons to begin building the learning curriculum.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowModuleModal(true)}
                  style={{ marginTop: 12 }}
                >
                  Create First Module
                </button>
              </div>
            </div>
          </div>
        ) : (
          filteredModules.map((mod, modIdx) => (
            <div key={mod.id || modIdx} className="lmsCard" style={{ marginBottom: 0 }}>
              <div className="lmsCardHead" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(13,110,253,0.2)', color: '#6ea8fe', fontWeight: 700 }}>
                      PHASE {mod.phase_number || 1}
                    </span>
                    <h3 style={{ margin: 0, fontSize: 16 }}>{mod.title}</h3>
                  </div>
                  {mod.description && (
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--admin-text-secondary)' }}>
                      {mod.description}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                    {mod.lessons?.length || 0} Days Assigned
                  </span>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      setTargetModuleId(mod.id);
                      setLessonForm(prev => ({
                        ...prev,
                        day_number: (mod.lessons?.length || 0) + 1
                      }));
                      setShowLessonModal(true);
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <i className="bi bi-plus-lg"></i> Add Day
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      setEditingModule(mod);
                      setModuleForm({
                        title: mod.title || '',
                        description: mod.description || '',
                        phase_number: mod.phase_number || 1,
                        duration_days: mod.duration_days || 3,
                        unlock_rule: mod.unlock_rule || 'IMMEDIATE',
                        unlock_date: mod.unlock_date || ''
                      });
                      setShowModuleModal(true);
                    }}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </div>
              </div>

              {/* Day Lessons List inside Module */}
              <div className="lmsCardBody noPad">
                {(!mod.lessons || mod.lessons.length === 0) ? (
                  <div style={{ padding: '16px 20px', color: 'var(--admin-text-muted)', fontSize: 13, fontStyle: 'italic' }}>
                    No day lessons added yet. Click "Add Day" to add scheduled day content.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {mod.lessons.map((lsn, lsnIdx) => (
                      <div
                        key={lsn.id || lsnIdx}
                        style={{
                          padding: '16px 20px',
                          borderTop: lsnIdx > 0 ? '1px solid var(--admin-border-subtle)' : 'none',
                          background: 'rgba(255,255,255,0.015)'
                        }}
                      >
                        {/* Day Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'rgba(25,135,84,0.15)', color: '#75b798' }}>
                                Day {lsn.day_number || (lsnIdx + 1)}
                              </span>
                              <span style={{ fontWeight: 600, fontSize: 14 }}>{lsn.title}</span>
                              <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                                <i className="bi bi-clock" style={{ marginRight: 4 }}></i>{lsn.estimated_minutes || 30} mins
                              </span>
                            </div>
                            {lsn.learning_objectives && (
                              <div style={{ fontSize: 12, color: 'var(--admin-text-secondary)', marginTop: 4 }}>
                                🎯 <strong>Objectives:</strong> {lsn.learning_objectives}
                              </div>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setTargetLessonId(lsn.id);
                                setShowBlockModal(true);
                              }}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}
                            >
                              <i className="bi bi-plus-circle"></i> Attach Block
                            </button>
                          </div>
                        </div>

                        {/* Polymorphic Content Blocks Display */}
                        {lsn.blocks && lsn.blocks.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                            {lsn.blocks.map((blk, blkIdx) => {
                              const blockMeta = BLOCK_TYPES.find(b => b.type === blk.block_type) || BLOCK_TYPES[0];
                              return (
                                <div
                                  key={blk.id || blkIdx}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: 6,
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid var(--admin-border-subtle)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    fontSize: 12
                                  }}
                                >
                                  <i className={`bi ${blockMeta.icon}`} style={{ color: blockMeta.color }}></i>
                                  <span style={{ color: 'white', fontWeight: 500 }}>
                                    {blk.title || blockMeta.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL 1: ADD / EDIT MODULE (PHASE GROUP) */}
      {showModuleModal && (
        <div className="modalOverlay" onClick={() => setShowModuleModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modalHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border-subtle)', paddingBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>
                {editingModule ? 'Edit Module' : 'Create Course Module'}
              </h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowModuleModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSaveModule}>
              <div className="modalBody" style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Module Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Module 1: HTML5 & Semantic Web"
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                      Phase Number *
                    </label>
                    <select
                      value={moduleForm.phase_number}
                      onChange={(e) => setModuleForm(prev => ({ ...prev, phase_number: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                    >
                      <option value={1}>Phase 1: Frontend Foundation</option>
                      <option value={2}>Phase 2: Core Engineering & Backend</option>
                      <option value={3}>Phase 3: Integration & DevOps</option>
                      <option value={4}>Phase 4: Capstone Project</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={moduleForm.duration_days}
                      onChange={(e) => setModuleForm(prev => ({ ...prev, duration_days: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Unlocking Rule
                  </label>
                  <select
                    value={moduleForm.unlock_rule}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, unlock_rule: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                  >
                    <option value="IMMEDIATE">Immediate Unlock (Open)</option>
                    <option value="AFTER_PREVIOUS_PASSED">Unlock After Previous Module Quiz Passed</option>
                    <option value="SCHEDULED_DATE">Scheduled Calendar Date</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Module Description & Syllabus Scope
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe what competencies and topics this module covers..."
                    value={moduleForm.description}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                  />
                </div>
              </div>

              <div className="modalFooter" style={{ borderTop: '1px solid var(--admin-border-subtle)', paddingTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModuleModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingModule ? 'Update Module' : 'Create Module'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD DAY LESSON */}
      {showLessonModal && (
        <div className="modalOverlay" onClick={() => setShowLessonModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="modalHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border-subtle)', paddingBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>Add Structured Day Lesson</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowLessonModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSaveLesson}>
              <div className="modalBody" style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                      Day # *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      required
                      value={lessonForm.day_number}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, day_number: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                      Lesson Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Day 1: HTML Semantic Architecture"
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                      Estimated Time (Mins)
                    </label>
                    <input
                      type="number"
                      value={lessonForm.estimated_minutes}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, estimated_minutes: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                      Min Video Watch %
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={lessonForm.min_watch_percentage}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, min_watch_percentage: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Video URL (YouTube / Cloud Stream)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={lessonForm.video_url}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, video_url: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Learning Objectives & Takeaways
                  </label>
                  <textarea
                    rows={2}
                    placeholder="List what the student will be able to do after completing this day..."
                    value={lessonForm.learning_objectives}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, learning_objectives: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                  />
                </div>
              </div>

              <div className="modalFooter" style={{ borderTop: '1px solid var(--admin-border-subtle)', paddingTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowLessonModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Day Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ATTACH POLYMORPHIC CONTENT BLOCK */}
      {showBlockModal && (
        <div className="modalOverlay" onClick={() => setShowBlockModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="modalHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border-subtle)', paddingBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>Attach Content Block</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowBlockModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSaveBlock}>
              <div className="modalBody" style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Content Block Type *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
                    {BLOCK_TYPES.map((b) => (
                      <button
                        key={b.type}
                        type="button"
                        onClick={() => setBlockForm(prev => ({ ...prev, block_type: b.type }))}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 6,
                          background: blockForm.block_type === b.type ? 'rgba(13,110,253,0.2)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${blockForm.block_type === b.type ? '#0d6efd' : 'var(--admin-border-subtle)'}`,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 12,
                          cursor: 'pointer'
                        }}
                      >
                        <i className={`bi ${b.icon}`} style={{ color: b.color }}></i>
                        <span>{b.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {blockForm.block_type === 'MARKDOWN' && (
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                      Markdown Theory / Technical Documentation
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Write markdown content with headers, lists, code fences, etc..."
                      value={blockForm.body}
                      onChange={(e) => setBlockForm(prev => ({ ...prev, body: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white', fontFamily: 'monospace' }}
                    />
                  </div>
                )}

                {blockForm.block_type === 'CODE_PLAYGROUND' && (
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                      Starter Code Sandbox
                    </label>
                    <textarea
                      rows={5}
                      placeholder="// Write starter template code for student drill..."
                      value={blockForm.code}
                      onChange={(e) => setBlockForm(prev => ({ ...prev, code: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white', fontFamily: 'monospace' }}
                    />
                  </div>
                )}

                {blockForm.block_type === 'DAY_TASK' && (
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                      Hands-on Task Requirements
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Specify the deliverable (e.g. Build a flexbox navbar with hamburger menu and submit GitHub repo link)..."
                      value={blockForm.task_instructions}
                      onChange={(e) => setBlockForm(prev => ({ ...prev, task_instructions: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                    />
                  </div>
                )}
              </div>

              <div className="modalFooter" style={{ borderTop: '1px solid var(--admin-border-subtle)', paddingTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBlockModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Attach Block to Day
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminPage>
  );
}