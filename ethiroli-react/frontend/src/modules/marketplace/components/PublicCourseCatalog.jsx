import React, { useEffect, useState } from 'react';
import { getCourses } from '../../../services/api/courseApi.js';

export default function PublicCourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const data = await getCourses();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  if (loading) return <div className="loading">Loading course catalog...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Course Marketplace</h2>
          <p className="pageSubtitle">Available courses and learning paths</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {courses.length === 0 ? (
          <div className="card"><div className="cardBody"><p style={{ color: 'var(--admin-text-secondary)' }}>No courses available.</p></div></div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ height: '140px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '48px' }}>
                {course.icon || '📚'}
              </div>
              <div>
                <h4 style={{ margin: '0 0 6px' }}>{course.title}</h4>
                <p style={{ color: 'var(--admin-text-secondary)', fontSize: '13px', margin: 0 }}>{course.description || 'No description'}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span className="statusTag active">{course.level || 'All Levels'}</span>
                <span style={{ fontWeight: '600', color: 'var(--admin-primary)' }}>{course.price ? `$${course.price}` : 'Free'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
