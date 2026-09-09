import React from 'react';
import styles from './Lms.module.css';

export default function LessonViewer({ lesson }) {
  const lessonData = lesson || {
    title: 'Select a lesson',
    duration: '—',
    description: 'Choose a lesson from the syllabus to begin learning.'
  };

  return (
    <div className={styles.lessonViewer}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12}}>
        <div>
          <h3 style={{margin: '0 0 8px 0', fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 700}}>
            {lessonData.title}
          </h3>
          <span className={styles.badge}>Duration: {lessonData.duration}</span>
        </div>
        <span className="statusTag active">In Progress</span>
      </div>

      <div className={styles.videoPlayerPlaceholder}>
        <div className={styles.playIcon} style={{fontSize: 48, cursor: 'pointer', transition: 'transform 0.2s ease'}}>▶</div>
        <p style={{margin: '12px 0 0', fontSize: 14, opacity: 0.9}}>Premium Interactive Video Player</p>
      </div>

      <div className="lessonDescription">
        <h4 style={{margin: '0 0 10px 0', fontSize: 16, fontWeight: 600}}>Lesson Overview</h4>
        <p style={{margin: 0, lineHeight: 1.7, color: 'var(--admin-text-secondary)'}}>
          {lessonData.description}
        </p>
      </div>

      <div className={styles.navigationRow}>
        <button className="btn secondary">Previous</button>
        <button className="btn primary">Next Lesson</button>
        <button className="btn success" style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff'}}>Mark as Completed</button>
      </div>
    </div>
  );
}
