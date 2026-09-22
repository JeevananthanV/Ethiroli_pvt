import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourse } from '../../../services/api/courseApi.js';

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  const fetchCourse = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCourse(id);
      setCourse(data);
    } catch (err) {
      setError(err.message || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const checkoutUrl = `/marketplace/checkout/${id}`;
      window.location.href = checkoutUrl;
    } catch {
      alert('Could not start checkout. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--admin-bg-dark)' }}>
        <div className="loading">Loading course details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--admin-bg-dark)', padding: '40px 20px' }}>
        <div className="card" style={{ maxWidth: '900px', margin: '0 auto', borderColor: 'rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: 'var(--admin-danger)', fontSize: '20px' }}>⚠️</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, color: 'var(--admin-text-primary)', fontWeight: '500' }}>Failed to load course</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--admin-text-muted)' }}>{error}</p>
            </div>
            <button onClick={fetchCourse} className="btn secondary btnSm">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--admin-bg-dark)', padding: '40px 20px' }}>
        <div className="emptyState">
          <h3>Course not found</h3>
          <p>The course you're looking for doesn't exist or has been removed.</p>
          <Link to="/marketplace/catalog" className="btn primary" style={{ marginTop: '16px', display: 'inline-flex' }}>
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--admin-bg-dark)', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        <div className="card" style={{ marginBottom: '24px' }}>
          <div
            style={{
              height: '200px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '72px',
              marginBottom: '20px',
            }}
          >
            {course.icon || '📚'}
          </div>
          <h1 style={{ color: 'var(--admin-text-primary)', margin: '0 0 8px' }}>{course.title}</h1>
          <p style={{ color: 'var(--admin-text-secondary)', margin: '0 0 20px', fontSize: '15px', lineHeight: 1.7 }}>
            {course.description || 'No description available.'}
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span className={`statusTag ${course.is_active ? 'active' : 'inactive'}`}>
              {course.is_active ? 'Published' : 'Draft'}
            </span>
            <span className="statusTag pending">{course.level || 'All Levels'}</span>
            {course.price ? (
              <span className="roleTag">₹{Number(course.price).toLocaleString()}</span>
            ) : (
              <span className="roleTag">Free</span>
            )}
          </div>

          <h3 style={{ color: 'var(--admin-text-primary)', margin: '0 0 12px' }}>What you'll master:</h3>
          <ul style={{ color: 'var(--admin-text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', margin: '0 0 24px 20px' }}>
            <li>Comprehensive course curriculum with hands-on projects</li>
            <li>Industry-recognized certification upon completion</li>
            <li>Access to exclusive student community and mentorship</li>
            <li>Lifetime access to course materials and updates</li>
          </ul>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={handleEnroll} className="btn primary" disabled={enrolling}>
              {enrolling ? 'Processing...' : 'Enroll and Purchase Course'}
            </button>
            <Link to="/marketplace/catalog" className="btn secondary">
              Back to Marketplace Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
