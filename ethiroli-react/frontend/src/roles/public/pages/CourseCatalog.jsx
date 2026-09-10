import React, { useEffect, useState, useCallback } from 'react';
import { listCourses } from '../../../services/api/courseApi.js';

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (levelFilter) params.level = levelFilter;
      const data = await listCourses(params);
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [search, levelFilter]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--admin-bg-dark)', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div className="pageHeader">
          <div>
            <h1 className="pageTitle">Course Marketplace</h1>
            <p className="pageSubtitle">Browse certified industrial bootcamps and learning paths curated for career growth.</p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            className="inputField"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '200px' }}
          />
          <select
            className="select"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '160px' }}
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          {search || levelFilter ? (
            <button className="btn secondary btnSm" onClick={() => { setSearch(''); setLevelFilter(''); }}>
              Clear Filters
            </button>
          ) : null}
        </div>

        {error && (
          <div className="card" style={{ marginBottom: '24px', borderColor: 'rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: 'var(--admin-danger)', fontSize: '20px' }}>⚠️</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, color: 'var(--admin-text-primary)', fontWeight: '500' }}>Failed to load courses</p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--admin-text-muted)' }}>{error}</p>
              </div>
              <button onClick={fetchCourses} className="btn secondary btnSm">Retry</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading course catalog...</div>
        ) : courses.length === 0 ? (
          <div className="emptyState">
            <h3>No courses found</h3>
            <p>Try adjusting your search or filters, or check back later for new courses.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {courses.map((course) => (
              <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer' }}
                onClick={() => (window.location.href = `/marketplace/course/${course.id}`)}>
                <div
                  style={{
                    height: '140px',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '48px',
                  }}
                >
                  {course.icon || '📚'}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 6px' }}>{course.title}</h4>
                  <p style={{ color: 'var(--admin-text-secondary)', fontSize: '13px', margin: 0 }}>
                    {course.description || 'No description available.'}
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span className={`statusTag ${course.is_active ? 'active' : 'inactive'}`}>
                    {course.level || 'All Levels'}
                  </span>
                  <span style={{ fontWeight: '600', color: 'var(--admin-primary)', fontSize: '16px' }}>
                    {course.price ? `₹${Number(course.price).toLocaleString()}` : 'Free'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
