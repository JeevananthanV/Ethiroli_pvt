import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listReviews } from '../../../services/api/performanceApi.js';
import { EmptyState } from '../components/StatCard.jsx';
import DetailModal, { DetailRow, DetailSection, DetailBadge } from '../components/DetailModal.jsx';

/**
 * My Performance.
 *
 * Real review records from the shared performance API (`listReviews()`), which
 * is scoped server-side to the signed-in employee. No sample reviews.
 *
 * The table summarises each scorecard; clicking a row opens the full review with
 * its competency breakdown and the reviewer's overall comment.
 */

const STATUS_TONE = {
  ACKNOWLEDGED: 'success',
  ARCHIVED: 'secondary',
  SUBMITTED: 'warning',
  DRAFT: 'secondary'
};

const humanise = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
};

const ratingOf = (review) => {
  if (review?.rating === null || review?.rating === undefined || review?.rating === '') return null;
  const n = Number(review.rating);
  return Number.isFinite(n) ? n : null;
};

const ratingTone = (rating) => {
  if (rating === null) return 'secondary';
  if (rating >= 4) return 'success';
  if (rating >= 3) return 'warning';
  return 'danger';
};

/**
 * `competencies` / `ratings` may be a JSON column, an array, or absent
 * depending on how the review was written. Normalised here so the dialog can
 * render a competency table when the data exists and say nothing when it does
 * not - rather than dumping raw JSON at the employee.
 */
const parseBreakdown = (review) => {
  const source = review?.competencies ?? review?.ratings ?? review?.breakdown;
  if (!source) return null;

  let value = source;
  if (typeof source === 'string') {
    try {
      value = JSON.parse(source);
    } catch {
      return null;
    }
  }

  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (entry && typeof entry === 'object') {
          return {
            name: entry.name || entry.competency || entry.title || 'Competency',
            score: entry.score ?? entry.rating ?? entry.value ?? null,
            comment: entry.comment || entry.note || null
          };
        }
        return { name: String(entry), score: null, comment: null };
      })
      .filter((entry) => entry.name);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).map(([name, val]) => ({
      name,
      score: typeof val === 'object' ? (val?.score ?? val?.rating ?? null) : val,
      comment: typeof val === 'object' ? (val?.comment || val?.note || null) : null
    }));
  }

  return null;
};

export default function EmployeePerformance() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listReviews();
      setReviews(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load performance reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const withRatings = useMemo(
    () => reviews.filter((r) => ratingOf(r) !== null),
    [reviews]
  );

  const averageRating = useMemo(() => {
    if (withRatings.length === 0) return null;
    const sum = withRatings.reduce((s, r) => s + ratingOf(r), 0);
    return Math.round((sum / withRatings.length) * 10) / 10;
  }, [withRatings]);

  const latestReview = useMemo(() => {
    const dated = reviews
      .filter((r) => r.review_date)
      .slice()
      .sort((a, b) => new Date(b.review_date) - new Date(a.review_date));
    return dated[0] || null;
  }, [reviews]);

  const FILTERS = [
    { key: 'ALL', label: 'All' },
    { key: 'ACKNOWLEDGED', label: 'Acknowledged' },
    { key: 'SUBMITTED', label: 'Submitted' },
    { key: 'ARCHIVED', label: 'Archived' }
  ];

  const countFor = (key) => (key === 'ALL' ? reviews.length : reviews.filter((r) => r.status === key).length);

  const visible = useMemo(
    () => (filter === 'ALL' ? reviews : reviews.filter((r) => r.status === filter)),
    [reviews, filter]
  );

  const breakdown = useMemo(() => parseBreakdown(selected), [selected]);

  return (
    <AdminPage
      title="My Performance"
      subtitle="Review your performance scorecards and evaluations"
      loading={loading}
      error={error}
      onRetry={fetchReviews}
    >
      {reviews.length === 0 ? (
        <div className="card shadow-sm border-0">
          <EmptyState
            icon="bi-clipboard2-data"
            title="No performance reviews yet"
            text="When your manager completes a performance review it will appear here with your score and their feedback."
          />
        </div>
      ) : (
        <>
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <div className="text-muted small text-uppercase fw-semibold mb-1">Latest score</div>
                  <div className="fs-3 fw-bold text-dark">
                    {latestReview && ratingOf(latestReview) !== null
                      ? `${ratingOf(latestReview)} / 5`
                      : '—'}
                  </div>
                  <div className="text-muted small">
                    {latestReview ? formatDate(latestReview.review_date) : 'No review recorded'}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <div className="text-muted small text-uppercase fw-semibold mb-1">Average rating</div>
                  <div className="fs-3 fw-bold text-dark">
                    {averageRating !== null ? `${averageRating} / 5` : '—'}
                  </div>
                  <div className="text-muted small">
                    Across {withRatings.length} scored review{withRatings.length === 1 ? '' : 's'}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <div className="text-muted small text-uppercase fw-semibold mb-1">Total reviews</div>
                  <div className="fs-3 fw-bold text-dark">{reviews.length}</div>
                  <div className="text-muted small">On record</div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
            <div className="btn-group flex-wrap" role="group">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`btn btn-sm ${filter === f.key ? 'btn-dark' : 'btn-outline-secondary'}`}
                  onClick={() => setFilter(f.key)}
                  aria-pressed={filter === f.key}
                >
                  {f.label} ({countFor(f.key)})
                </button>
              ))}
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th>Review Period</th>
                    <th>Reviewer</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Comments</th>
                    <th className="text-end">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.length === 0 ? (
                    <tr>
                      <td colSpan="6">
                        <EmptyState icon="bi-funnel" text="No reviews match this filter." compact />
                      </td>
                    </tr>
                  ) : (
                    visible.map((review) => {
                      const rating = ratingOf(review);
                      return (
                        <tr
                          key={review.id}
                          className="emp-row-clickable"
                          onClick={() => setSelected(review)}
                          tabIndex={0}
                          role="button"
                          aria-label={`View details for review dated ${formatDate(review.review_date) || 'unknown'}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelected(review);
                            }
                          }}
                        >
                          <td className="fw-medium text-dark">{formatDate(review.review_date) || 'N/A'}</td>
                          <td className="text-muted">{review.reviewer_name || 'N/A'}</td>
                          <td>
                            {rating !== null ? (
                              <DetailBadge tone={ratingTone(rating)}>{rating} / 5</DetailBadge>
                            ) : (
                              <span className="text-muted small">Not scored</span>
                            )}
                          </td>
                          <td>
                            <DetailBadge tone={STATUS_TONE[review.status] || 'secondary'}>
                              {humanise(review.status) || 'N/A'}
                            </DetailBadge>
                          </td>
                          <td className="text-muted small emp-clamp-cell">{review.overall_comment || '—'}</td>
                          <td className="text-end">
                            <i className="bi bi-chevron-right text-muted" aria-hidden="true"></i>
                            <span className="visually-hidden">View details</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <DetailModal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        icon="bi-clipboard2-data"
        accent={selected ? ratingTone(ratingOf(selected)) : 'primary'}
        title={selected?.review_period || (selected?.review_date ? `Review · ${formatDate(selected.review_date)}` : 'Performance review')}
        subtitle={selected?.reviewer_name ? `Reviewed by ${selected.reviewer_name}` : ''}
        badge={
          selected && (
            <DetailBadge tone={ratingTone(ratingOf(selected))}>
              {ratingOf(selected) !== null ? `${ratingOf(selected)} / 5` : 'Not scored'}
            </DetailBadge>
          )
        }
        footer={
          selected && (
            <button type="button" className="btn btn-light" onClick={() => setSelected(null)}>
              Close
            </button>
          )
        }
      >
        {selected && (
          <>
            <DetailSection title="Review summary" icon="bi-person-check">
              <dl className="emp-detail__row-list mb-0">
                <DetailRow label="Review period" value={selected.review_period} />
                <DetailRow label="Review date" value={formatDate(selected.review_date)} />
                <DetailRow label="Reviewer" value={selected.reviewer_name} />
                <DetailRow label="Overall rating" value={ratingOf(selected) !== null ? `${ratingOf(selected)} / 5` : null} />
                <DetailRow label="Status" value={humanise(selected.status)} />
              </dl>
            </DetailSection>

            {breakdown && breakdown.length > 0 && (
              <DetailSection title="Competency breakdown" icon="bi-bar-chart">
                <dl className="emp-detail__row-list mb-0">
                  {breakdown.map((entry, i) => (
                    <DetailRow
                      key={`${entry.name}-${i}`}
                      label={entry.name}
                      value={
                        entry.score !== null && entry.score !== undefined && entry.score !== ''
                          ? `${entry.score}${entry.comment ? ` — ${entry.comment}` : ''}`
                          : entry.comment
                      }
                    />
                  ))}
                </dl>
              </DetailSection>
            )}

            <DetailSection title="Reviewer's comments" icon="bi-chat-quote">
              <p className="emp-detail__prose mb-0">
                {selected.overall_comment || 'No overall comment was recorded for this review.'}
              </p>
            </DetailSection>
          </>
        )}
      </DetailModal>
    </AdminPage>
  );
}
