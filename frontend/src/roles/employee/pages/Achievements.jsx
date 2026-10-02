import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';
import { EmptyState } from '../components/StatCard.jsx';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAchievements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getAchievements();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setAchievements(list);
    } catch (err) {
      setError(err.message || 'Failed to load achievements');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  return (
    <AdminPage
      title="Achievements & Honors"
      subtitle="Celebrate your organizational milestones, professional badges, and peer recognitions"
      loading={loading}
      error={error}
      onRetry={loadAchievements}
    >
      {achievements.length === 0 ? (
        <div className="col-12"><EmptyState icon="bi-trophy" text="No achievements yet. Your badges will appear here once earned." /></div>
      ) : (
      <div className="row g-4">
        {achievements.map((badge) => (
          <div key={badge.id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0 text-center p-3">
              <div className="d-inline-flex justify-content-center mb-3">
                <div
                  className="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center"
                  style={{ width: '72px', height: '72px' }}
                >
                  <i className={`bi ${badge.icon || 'bi-trophy'} fs-1`}></i>
                </div>
              </div>

              <h5 className="card-title fw-bold text-dark mb-1">{badge.name}</h5>
              <span className="badge bg-warning text-dark align-self-center px-3 py-1 mb-3">
                {badge.tier || 'HONOR'}
              </span>

              <p className="card-text text-muted small mb-2 flex-grow-1">
                {badge.description}
              </p>

              <div className="border-top pt-3 text-muted small">
                Earned on {badge.earned_at ? new Date(badge.earned_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </AdminPage>
  );
}
