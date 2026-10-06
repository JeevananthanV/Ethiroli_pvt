import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';
import { EmptyState } from '../components/StatCard.jsx';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnnouncements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getAnnouncements();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setAnnouncements(list);
    } catch (err) {
      setError(err.message || 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  return (
    <AdminPage
      title="Company Announcements"
      subtitle="Stay updated with official bulletins, organizational updates, and company news"
      loading={loading}
      error={error}
      onRetry={loadAnnouncements}
    >
      <div className="row g-4">
        {announcements.length === 0 ? (
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <i className="bi bi-megaphone fs-1 text-muted d-block mb-3"></i>
                <h6 className="fw-bold text-dark">No announcements published yet</h6>
                <p className="text-muted small mb-0 mx-auto" style={{ maxWidth: '520px' }}>
                  This page is connected and reads company notices published by HR. Nothing
                  has been published at the moment - any new notice will appear here
                  automatically.
                </p>
              </div>
            </div>
          </div>
        ) : (
          announcements.map((item) => (
            <div key={item.id} className="col-12">
              <div className="card shadow-sm border-0 border-start border-primary border-4">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-primary bg-opacity-10 text-primary">OFFICIAL NOTICE</span>
                      <small className="text-muted">
                        From: {item.sender || <span className="text-muted">Sender not recorded</span>}
                      </small>
                    </div>
                    <small className="text-muted">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : <span className="text-muted">Date not recorded</span>}
                    </small>
                  </div>

                  <h5 className="card-title fw-bold text-dark mt-2 mb-2">
                    {item.subject || <span className="text-muted">Untitled notice</span>}
                  </h5>
                  <p className="card-text text-secondary mb-0" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminPage>
  );
}
