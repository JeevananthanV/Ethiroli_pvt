import React, { useEffect, useState } from 'react';
import { getCourse, getModules } from '../../../services/api/courseApi.js';
import { getLessons } from '../../../services/api/lessonApi.js';
import LessonViewer from './LessonViewer.jsx';
import styles from './Lms.module.css';

export default function CoursePlayer({ courseId }) {
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonContent, setLessonContent] = useState(null);
  const [lessonLoading, setLessonLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      setLoading(true);
      setError(null);
      try {
        const [courseData, modulesData] = await Promise.all([
          getCourse(courseId),
          getModules(courseId)
        ]);
        setCourse(courseData);
        setModules(modulesData || []);
        if (modulesData?.[0]?.lessons?.[0]) {
          setActiveLesson(modulesData[0].lessons[0].id);
        }
      } catch (err) {
        setError(err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!activeLesson) return;
      setLessonLoading(true);
      try {
        const lesson = await getLessons(modules[0]?.id, { lessonId: activeLesson });
        setLessonContent(lesson);
      } catch {
        setLessonContent(null);
      } finally {
        setLessonLoading(false);
      }
    };
    fetchLesson();
  }, [activeLesson, modules]);

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="skeleton" style={{width: 40, height: 40, borderRadius: '50%'}} />
          <div style={{flex: 1}}>
            <div className="skeleton" style={{width: '60%', height: 16, marginBottom: 8}} />
            <div className="skeleton" style={{width: '40%', height: 12}} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.05)'}}>
        <p style={{color: 'var(--admin-danger)', margin: 0}}>{error}</p>
        <button className="btn secondary" style={{marginTop: 12}} onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.playerLayout}>
      <div className={styles.sidebar}>
        <h4 style={{margin: '0 0 16px 0', fontFamily: "'Alice', serif"}}>Syllabus Index</h4>
        {modules.map((mod, idx) => (
          <div key={mod.id || idx} className={styles.moduleGroup}>
            <h5>{mod.title || `Module ${idx + 1}`}</h5>
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              {(mod.lessons || []).map(lesson => (
                <li
                  key={lesson.id}
                  className={activeLesson === lesson.id ? styles.activeLessonItem : ''}
                  onClick={() => setActiveLesson(lesson.id)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 13,
                    transition: 'all 0.3s ease',
                    background: activeLesson === lesson.id ? 'var(--color-primary, #819E35)' : 'transparent',
                    color: activeLesson === lesson.id ? '#fff' : 'inherit'
                  }}
                >
                  {lesson.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.playerContent}>
        {lessonLoading ? (
          <div className="loading">Loading lesson...</div>
        ) : (
          <LessonViewer lessonId={activeLesson} lesson={lessonContent} />
        )}
      </div>
    </div>
  );
}
