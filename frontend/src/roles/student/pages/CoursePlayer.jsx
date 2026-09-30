import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getMyEnrollments } from '../../../services/api/enrollmentApi.js';
import { listModules } from '../../../services/api/moduleApi.js';
import { listLessons, getLesson, completeLesson } from '../../../services/api/lessonApi.js';
import { useSocket } from '../../../common/contexts/SocketContext.jsx';
import lmsApi from '../../../services/api/lmsApi.js';
import axios from '../../../services/axios.js';

export default function StudentCoursePlayer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawSocket = useSocket();
  const socket = rawSocket?.socket || rawSocket;

  const [enrollments, setEnrollments] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(searchParams.get('courseId') || '');
  const [courseDetails, setCourseDetails] = useState(null);
  const [modules, setModules] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeLessonBlocks, setActiveLessonBlocks] = useState([]);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showDoubtModal, setShowDoubtModal] = useState(false);
  const [doubtForm, setDoubtForm] = useState({ title: '', description: '', code_snippet: '' });
  const [submittingDoubt, setSubmittingDoubt] = useState(false);
  const [doubtSuccess, setDoubtSuccess] = useState('');
  const [celebration, setCelebration] = useState(null);

  const hasAutoSelectedRef = useRef(false);

  // 1. Fetch Student Enrollments
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const enrs = await getMyEnrollments().catch(() => []);
        if (isMounted) {
          setEnrollments(enrs);
          if (!selectedCourseId && enrs.length > 0) {
            const firstId = enrs[0].course_id || enrs[0].courseId;
            setSelectedCourseId(firstId);
            setSearchParams({ courseId: firstId });
          }
        }
      } catch (err) {
        console.error('Failed to load student enrollments', err);
      }
    })();
    return () => { isMounted = false; };
  }, [selectedCourseId, setSearchParams]);

  // Update progress percentage when enrollments change
  useEffect(() => {
    if (!selectedCourseId || !enrollments.length) return;
    const enr = enrollments.find(e => (e.course_id || e.courseId) === selectedCourseId);
    if (enr) {
      setProgressPercentage(Number(enr.progress_percentage || enr.progress || 0));
    }
  }, [selectedCourseId, enrollments]);

  // 2. Fetch Course Structure (Modules & Lessons)
  const fetchCourseStructure = useCallback(async (courseId) => {
    if (!courseId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Get course details
      const courseRes = await axios.get(`/courses/${courseId}`);
      const courseData = courseRes.data?.data || courseRes.data;
      setCourseDetails(courseData);

      // Get modules
      const mods = await listModules(courseId);
      const sortedModules = Array.isArray(mods) ? mods.sort((a, b) => a.module_order - b.module_order) : [];

      // Fetch lessons for each module in parallel
      const enrichedModules = await Promise.all(
        sortedModules.map(async (mod) => {
          const lsns = await listLessons(mod.id);
          const sortedLessons = Array.isArray(lsns) ? lsns.sort((a, b) => a.lesson_order - b.lesson_order) : [];
          return { ...mod, lessons: sortedLessons };
        })
      );
      setModules(enrichedModules);

      // Seed completion state from the server so ticks survive a reload.
      const flatLessons = enrichedModules.flatMap((mod) => mod.lessons);
      const serverCompleted = flatLessons.filter((lsn) => lsn.is_completed).map((lsn) => lsn.id);
      if (serverCompleted.length > 0) {
        setCompletedLessonIds((prev) => [...new Set([...prev, ...serverCompleted])]);
      }

      // Resume support: honour ?lessonId=, otherwise open the first lesson
      // that has not been completed yet (falling back to lesson one).
      if (!hasAutoSelectedRef.current && flatLessons.length > 0) {
        hasAutoSelectedRef.current = true;
        const requestedLessonId = new URLSearchParams(window.location.search).get('lessonId');
        const target =
          (requestedLessonId && flatLessons.find((lsn) => lsn.id === requestedLessonId)) ||
          flatLessons.find((lsn) => !lsn.is_completed && !serverCompleted.includes(lsn.id)) ||
          flatLessons[0];
        loadLessonDetails(target.id);
      }
    } catch (err) {
      console.error('Failed to fetch course curriculum', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      hasAutoSelectedRef.current = false;
      fetchCourseStructure(selectedCourseId);
    }
  }, [selectedCourseId, fetchCourseStructure]);

  // 3. Real-time WebSocket room synchronization
  useEffect(() => {
    if (!socket || !selectedCourseId) return;

    socket.emit('join_room', `course:${selectedCourseId}`);

    const handleCurriculumUpdate = () => {
      fetchCourseStructure(selectedCourseId);
    };

    socket.on('course_curriculum_updated', handleCurriculumUpdate);

    return () => {
      socket.emit('leave_room', `course:${selectedCourseId}`);
      socket.off('course_curriculum_updated', handleCurriculumUpdate);
    };
  }, [socket, selectedCourseId, fetchCourseStructure]);

  // 4. Load Single Lesson Details & Blocks
  const loadLessonDetails = async (lessonId) => {
    setLessonLoading(true);
    try {
      const lessonData = await getLesson(lessonId);
      setActiveLesson(lessonData);
      setActiveLessonBlocks(lessonData.blocks || []);
    } catch (err) {
      console.error('Failed to load lesson details', err);
    } finally {
      setLessonLoading(false);
    }
  };

  // 5. Complete Current Lesson & Advance
  const handleCompleteAndNext = async () => {
    if (!activeLesson) return;
    setCompleting(true);
    try {
      const res = await completeLesson(activeLesson.id);
      setCompletedLessonIds(prev => [...new Set([...prev, activeLesson.id])]);
      if (res?.percentage !== undefined) {
        setProgressPercentage(res.percentage);
      }

      // Gamification feedback: badges earned or a certificate issued.
      if (res?.certificate) {
        setCelebration({
          kind: 'certificate',
          text: `🎉 Course complete! Certificate ${res.certificate.certificate_number || ''} issued.`
        });
      } else if (Array.isArray(res?.badges_awarded) && res.badges_awarded.length > 0) {
        setCelebration({ kind: 'badge', text: `🏅 Badge earned: ${res.badges_awarded.join(', ')}` });
      }

      // Auto-advance to next lesson
      let nextLesson = null;
      let foundCurrent = false;

      for (const mod of modules) {
        for (const lsn of mod.lessons) {
          if (foundCurrent) {
            nextLesson = lsn;
            break;
          }
          if (lsn.id === activeLesson.id) {
            foundCurrent = true;
          }
        }
        if (nextLesson) break;
      }

      if (nextLesson) {
        loadLessonDetails(nextLesson.id);
      }
    } catch (err) {
      alert('Failed to update lesson progress: ' + (err.response?.data?.message || err.message));
    } finally {
      setCompleting(false);
    }
  };

  // 6. Submit In-Lesson Doubt to Tutor
  const handleSubmitDoubt = async (e) => {
    e.preventDefault();
    if (!doubtForm.title || !doubtForm.description) return;
    if (!selectedCourseId) {
      alert('Open a course before raising a doubt.');
      return;
    }
    setSubmittingDoubt(true);
    try {
      // POST /api/doubts has no backend handler; doubts live at /v1/lms/doubts.
      await lmsApi.submitDoubt({
        course_id: selectedCourseId,
        lesson_id: activeLesson?.id || null,
        title: doubtForm.title,
        description: doubtForm.description,
        code_snippet: doubtForm.code_snippet || null
      });
      setDoubtSuccess('Doubt submitted directly to course tutor!');
      setDoubtForm({ title: '', description: '', code_snippet: '' });
      setTimeout(() => {
        setShowDoubtModal(false);
        setDoubtSuccess('');
      }, 1500);
    } catch (err) {
      alert('Failed to submit doubt: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmittingDoubt(false);
    }
  };

  // Helper to extract video embed URL
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'www.youtube.com/embed/');
    }
    if (url.includes('vimeo.com/')) {
      const parts = url.split('/');
      const id = parts[parts.length - 1];
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  };

  return (
    <AdminPage
      title={courseDetails?.name || 'Dynamic Course Player'}
      subtitle={courseDetails?.description || 'Interactive LMS Learning Workstation'}
      loading={loading}
      onRetry={() => fetchCourseStructure(selectedCourseId)}
    >
      {/* Gamification banner: certificate / badge earned */}
      {celebration && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            marginBottom: 18,
            borderRadius: 8,
            background: celebration.kind === 'certificate'
              ? 'linear-gradient(135deg, rgba(129,158,53,0.18), rgba(26,75,72,0.18))'
              : 'linear-gradient(135deg, rgba(175,67,30,0.16), rgba(129,158,53,0.16))',
            border: '1px solid rgba(129,158,53,0.45)',
            fontSize: 14,
            animation: 'fadeIn 0.3s ease-in'
          }}
        >
          <span>{celebration.text}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {celebration.kind === 'certificate' && (
              <button className="btn primary" style={{ padding: '6px 12px', fontSize: 12 }}
                onClick={() => navigate('/app/student/certificates')}>
                View Certificate
              </button>
            )}
            <button className="btn secondary" style={{ padding: '6px 12px', fontSize: 12 }}
              onClick={() => setCelebration(null)}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Course Switcher & Header Bar */}
      <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Active Course:</span>
          <select
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setSearchParams({ courseId: e.target.value });
              setActiveLesson(null);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: 'var(--admin-card-bg)',
              color: 'var(--admin-text-primary)',
              border: '1px solid var(--admin-border-subtle)',
              fontSize: 14,
              minWidth: 240
            }}
          >
            {enrollments.map((enr) => (
              <option key={enr.id} value={enr.course_id || enr.courseId}>
                {enr.course_name || enr.name || enr.course_title || 'Enrolled Course'}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>Course Completion</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--admin-primary)' }}>{progressPercentage}%</div>
          </div>
          <div style={{ width: 140, height: 8, background: 'var(--admin-border-subtle)', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.min(progressPercentage, 100)}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--admin-primary), #00e676)',
                borderRadius: 4,
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Workstation Layout: Player (Left 70%) & Syllabus Tree (Right 30%) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2.2fr) minmax(0, 1fr)', gap: 24, alignItems: 'start' }}>
        
        {/* Left Pane: Interactive Lesson Viewer */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {lessonLoading ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              Loading interactive lesson content...
            </div>
          ) : activeLesson ? (
            <div>
              {/* Media / Video Display */}
              {activeLesson.video_url ? (
                <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', background: '#000' }}>
                  <iframe
                    src={getEmbedUrl(activeLesson.video_url)}
                    title={activeLesson.title}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div style={{ padding: '36px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--admin-border-subtle)', textAlign: 'center' }}>
                  <span style={{ fontSize: 48 }}>📖</span>
                  <h3 style={{ margin: '8px 0 0 0' }}>Interactive Reading & Conceptual Module</h3>
                </div>
              )}

              {/* Lesson Body & Actions Bar */}
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                  <div>
                    <h2 style={{ margin: '0 0 4px 0', fontSize: 22 }}>{activeLesson.title}</h2>
                    <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
                      Order #{activeLesson.lesson_order} • Real-time Sync Active
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    {(() => {
                      const allLessons = modules.flatMap(m => m.lessons || []);
                      const currentIdx = allLessons.findIndex(l => l.id === activeLesson?.id);
                      const prevLsn = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
                      const nextLsn = currentIdx >= 0 && currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;
                      return (
                        <>
                          <button
                            onClick={() => prevLsn && loadLessonDetails(prevLsn.id)}
                            disabled={!prevLsn}
                            className="btn secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, opacity: prevLsn ? 1 : 0.5 }}
                          >
                            <span>◀</span> Prev Lesson
                          </button>

                          <button
                            onClick={() => setShowDoubtModal(true)}
                            className="btn secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
                          >
                            <span>💬</span> Ask Doubt
                          </button>

                          <button
                            onClick={handleCompleteAndNext}
                            disabled={completing}
                            className="btn primary"
                            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
                          >
                            <span>✓</span> {completing ? 'Updating...' : nextLsn ? 'Complete & Next ▶' : 'Complete Course 🎉'}
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Lesson Description / Content Text */}
                {activeLesson.content && (
                  <div style={{ lineHeight: 1.7, fontSize: 15, color: 'var(--admin-text-primary)', marginBottom: 24, whiteSpace: 'pre-wrap' }}>
                    {activeLesson.content}
                  </div>
                )}

                {/* Dynamic Content Blocks Section */}
                {activeLessonBlocks.length > 0 && (
                  <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h4 style={{ margin: 0, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--admin-text-muted)' }}>
                      Interactive Elements & Supplementary Materials
                    </h4>

                    {activeLessonBlocks.map((block) => (
                      <div
                        key={block.id}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--admin-border-subtle)',
                          borderRadius: 8,
                          padding: 16
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                          <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, background: 'var(--admin-primary)', color: '#fff', fontWeight: 600 }}>
                            {block.block_type}
                          </span>
                          {block.is_interactive && (
                            <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: '#00e676', color: '#000', fontWeight: 700 }}>
                              ⚡ Interactive
                            </span>
                          )}
                        </div>

                        {block.block_type === 'CODE_PLAYGROUND' ? (
                          <div style={{ background: '#1e1e1e', borderRadius: 6, padding: 12, fontFamily: 'monospace', fontSize: 13, color: '#4fc3f7', overflowX: 'auto' }}>
                            <pre style={{ margin: 0 }}>{block.content_payload?.code || block.content_payload?.body || '// Code challenge block'}</pre>
                          </div>
                        ) : block.block_type === 'RESOURCE_DOWNLOAD' ? (
                          <a
                            href={block.content_payload?.url || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="btn secondary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                          >
                            <span>📥</span> Download {block.content_payload?.title || 'Resource'}
                          </a>
                        ) : (
                          <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                            {block.content_payload?.body || JSON.stringify(block.content_payload)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom Navigation Bar */}
                <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--admin-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  {(() => {
                    const allLessons = modules.flatMap(m => m.lessons || []);
                    const currentIdx = allLessons.findIndex(l => l.id === activeLesson?.id);
                    const prevLsn = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
                    const nextLsn = currentIdx >= 0 && currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;
                    return (
                      <>
                        <button
                          onClick={() => prevLsn && loadLessonDetails(prevLsn.id)}
                          disabled={!prevLsn}
                          className="btn secondary"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, opacity: prevLsn ? 1 : 0.4 }}
                        >
                          <i className="bi bi-arrow-left"></i>
                          <span>Previous Lesson</span>
                        </button>

                        <button
                          onClick={handleCompleteAndNext}
                          disabled={completing}
                          className="btn primary"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                        >
                          <span>{completing ? 'Saving Progress...' : nextLsn ? 'Complete & Proceed to Next Lesson' : 'Complete Entire Course 🎉'}</span>
                          <i className="bi bi-arrow-right"></i>
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              <h3>No lesson selected</h3>
              <p>Choose a lesson from the course index on the right to start learning.</p>
            </div>
          )}
        </div>

        {/* Right Pane: Dynamic Syllabus Tree */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--admin-border-subtle)' }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Curriculum Syllabus</h3>
            <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
              {modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} lessons across {modules.length} modules
            </span>
          </div>

          <div style={{ maxHeight: 600, overflowY: 'auto', padding: 12 }}>
            {modules.length === 0 ? (
              <p style={{ padding: 20, textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: 13 }}>
                No modules published for this course yet.
              </p>
            ) : (
              modules.map((mod, modIdx) => (
                <div key={mod.id} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-text-secondary)', padding: '6px 8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Module {modIdx + 1}: {mod.title}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                    {mod.lessons?.map((lsn, lsnIdx) => {
                      const isSelected = activeLesson?.id === lsn.id;
                      const isDone = completedLessonIds.includes(lsn.id) || Boolean(lsn.is_completed);

                      return (
                        <button
                          key={lsn.id}
                          onClick={() => loadLessonDetails(lsn.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '10px 12px',
                            borderRadius: 6,
                            textAlign: 'left',
                            background: isSelected ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
                            border: isSelected ? '1px solid var(--admin-primary)' : '1px solid transparent',
                            color: isSelected ? 'var(--admin-primary)' : 'var(--admin-text-primary)',
                            cursor: 'pointer',
                            fontSize: 13,
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <span style={{ fontSize: 14 }}>
                            {isDone ? '✅' : isSelected ? '▶️' : '⚪'}
                          </span>
                          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {lsnIdx + 1}. {lsn.title}
                          </span>
                          {lsn.video_url && (
                            <span style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>📹</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Ask Doubt Modal */}
      {showDoubtModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card" style={{ width: '90%', maxWidth: 500, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Ask a Doubt</h3>
              <button onClick={() => setShowDoubtModal(false)} style={{ background: 'transparent', border: 0, color: 'white', fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>

            {doubtSuccess ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#00e676', fontWeight: 600 }}>
                {doubtSuccess}
              </div>
            ) : (
              <form onSubmit={handleSubmitDoubt}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Subject / Question</label>
                  <input
                    type="text"
                    required
                    value={doubtForm.title}
                    onChange={(e) => setDoubtForm({ ...doubtForm, title: e.target.value })}
                    placeholder="e.g., Why does state not update immediately?"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                  />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Detailed Explanation</label>
                  <textarea
                    required
                    rows={4}
                    value={doubtForm.description}
                    onChange={(e) => setDoubtForm({ ...doubtForm, description: e.target.value })}
                    placeholder="Describe what you tried and where you got stuck..."
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Code Snippet (Optional)</label>
                  <textarea
                    rows={3}
                    value={doubtForm.code_snippet}
                    onChange={(e) => setDoubtForm({ ...doubtForm, code_snippet: e.target.value })}
                    placeholder="Paste relevant code here..."
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white', fontFamily: 'monospace', fontSize: 12 }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowDoubtModal(false)} className="btn secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={submittingDoubt} className="btn primary">
                    {submittingDoubt ? 'Submitting...' : 'Send to Instructor'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AdminPage>
  );
}