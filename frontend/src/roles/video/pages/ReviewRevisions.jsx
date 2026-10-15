import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReviews, getRevisions, createReview, createRevision } from '../../../services/api/videoApi.js';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { Button, Table, TableRow, TableCell, TableHead, TableBody, Alert, Select, Paper, Box } from '@mui-material';
import { useParams, useState } from 'react-router-dom';

export default function ReviewRevisions({ match }) {
  const { taskId } = match.params;
  const dispatch = useDispatch();
  const { id: userId, role } = useSelector(selectUser);

  const [reviews, setReviews] = useState([]);
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReviewComments, setNewReviewComments] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newRevisionVideoUrl, setNewRevisionVideoUrl] = useState('');
  const [newRevisionNotes, setNewRevisionNotes] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [awaitingRevisions, setAwaitingRevisions] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reviewsResult, revisionsResult] = await Promise.all([
          getReviews({ task_id: taskId }),
          getRevisions({ task_id: taskId }),
        ]);
        setReviews(reviewsResult.items || []);
        setRevisions(revisionsResult.items || []);
      } catch (err) {
        console.error('Failed to load reviews/revisions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [taskId]);

  // Calculate approval/rejection counts
  const approvedCount = reviews.filter(r => r.approve).length;
  const rejectedCount = reviews.filter(r => r.reject).length;
  const pendingCount = reviews.filter(r => !r.approve && !r.reject).length;

  return (
    <AdminPage
      title="Review & Revisions"
      subtitle="Video task review cycle and revision history"
    >
      <Paper sx={{ p: 2, mb: 2 }}>
        <h3>Task {taskId} - Review Cycle</h3>

        <div sx={{ mb: 16 }}>
          <Box sx={{ border: '1px dashed', borderColor: 'primary', px: 1, my: 1 }}>
            <strong>Review Status:</strong> <span style={{ color: 'primary' }}>
              {approvedCount} Approved · {rejectedCount} Rejected · {pendingCount} Pending
            </span>
          </Box>

          <Box sx={{ border: '1px dashed', borderColor: 'info', px: 1, my: 1 }}>
            <strong>Revisions:</strong> <span style={{ color: 'info' }}>
              {revisions.length} revision(s) submitted
            </span>
          </Box>
        </div>
      </Paper>

      <Paper sx={{ my: 2 }}>
        <h4>Submitted Reviews</h4>

        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet for this task.</p>
        ) : (
          <Table sx={{ minWidth: 600 }} aria-label="task reviews">
            <TableHead>
              <TableRow>
                <TableColumn>Reviewer</TableCell>
                <TableColumn>Rating</TableCell>
                <TableColumn>Status</TableCell>
                <TableColumn>Comments</TableCell>
                <TableColumn>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.reviewer_name || 'Unknown'}</TableCell>
                  <TableCell>
                    <span style={{ color: 'primary' }}>{review.overall_rating || 0}</span>
                  </TableCell>
                  <TableCell>
                    {review.approve ? 'Approved' : review.reject ? 'Rejected' : 'Pending'}
                  </TableCell>
                  <TableCell>{review.comments || 'No comments'}</TableCell>
                  <TableCell>
                    {review.review_date ? new Date(review.review_date).toLocaleString() : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
        : (!awaitingRevisions && (
          <Button
            variant="outlined"
            size="small"
            sx={{ mb: 8 }}
            onClick={() => setShowReviewForm(true)}
          >
            Write Review
          </Button>
        ))}
      </Paper>

      {awaitingRevisions && (
        <Paper sx={{ p: 1, bgcolor: 'info', color: 'white' }}>
          <span>Submitted revision request. Editor is making changes...</span>
        </Paper>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <Paper sx={{ p: 1, bgcolor: 'white', border: '1px dashed', borderColor: 'primary' }}>
          <h4>Write Review for Task {taskId}</h4>
          <form
            sx={{ mb: 16 }}
            onSubmit=(e) => {
              e.preventDefault();
              createReview({
                task_id: taskId,
                reviewer: userId,
                comments: newReviewComments,
                overall_rating: parseInt(newReviewRating),
                approve: newReviewRating >= 3 ? 1 : 0,
                reject: newReviewRating < 3 ? 1 : 0,
                required_revisions: parseInt(newReviewRating) < 3 ? 1 : 0,
              });
              setShowReviewForm(false);
              setNewReviewComments('');
              setNewReviewRating(0);
              // Refresh reviews
            }
          )
          <FormControlLabel
            component="legend"
            label="Overall Rating (1-5 stars)"
          )
          <Select
            value={newReviewRating}
            onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
          >
            <MenuItem value="1">1 - Poor</MenuItem>
            <MenuItem value="2">2 - Needs Improvement</MenuItem>
            <MenuItem value="3">3 - Acceptable</MenuItem>
            <MenuItem value="4">4 - Good</MenuItem>
            <MenuItem value="5">5 - Excellent</MenuItem>
          </Select>

          <FormControlLabel
            component="legend"
            label="Comments"
          )
          <TextInput
            placeholder="Enter review comments..."
            value={newReviewComments}
            onChange={(e) => setNewReviewComments(e.target.value)}
            multiline={true}
            rows={3}
          />

          <Box>
            <Button variant="outlined" onClick={() => setShowReviewForm(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Review
            </Button>
          </Box>
        </Paper>
      )}

      {/* Revisions Section */}
      <Paper sx={{ my: 2 }}>
        <h4>Revision History</h4>

        {loading ? (
          <p>Loading revisions...</p>
        ) : revisions.length === 0 ? (
          <p>No revisions yet. Be the first to submit a revision.</p>
        ) : (
          <Table sx={{ minWidth: 600 }} aria-label="revision history">
            <TableHead>
              <TableRow>
                <TableColumn>Version</TableCell>
                <TableColumn>Revised By</TableCell>
                <TableColumn>Revised At</TableCell>
                <TableColumn>Video URL</TableCell>
                <TableColumn>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {revisions.map((revision) => (
                <TableRow key={revision.id}>
                  <TableCell>{revision.version_number}</TableCell>
                  <TableCell>{revision.revised_by || 'Unknown'}</TableCell>
                  <TableCell>
                    {revision.revised_at ? new Date(revision.revised_at).toLocaleString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <a href={revision.video_url || '#'} target="_blank">
                      View Video
                    </a>
                  </TableCell>
                  <TableCell>
                    <span className={`badge ${revision.status === 'Approved' ? 'bg-success' : revision.status === 'Rejected' ? 'bg-danger' : 'bg-warning'}`}>
                      {revision.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            </TableBody>
          </Table>
        )
        }
      </Paper>

      {/* Submit Revision Form */}
      {showRevisionForm && (
        <Paper sx={{ p: 1, bgcolor: 'white', border: '1px dashed', borderColor: 'primary' }}>
          <h4>Submit Revision for Task {taskId}</h4>
          <form
            sx={{ mb: 16 }}
            onSubmit=(e) => {
              e.preventDefault();
              createRevision({
                task_id: taskId,
                version_number: revisions.length + 1,
                previous_version: revisions.length,
                video_url: newRevisionVideoUrl,
                revision_notes: newRevisionNotes,
                revised_by: userId,
              });
              setShowRevisionForm(false);
              setNewRevisionVideoUrl('');
              setNewRevisionNotes('');
              // Refresh revisions
            }
          )
          <FormControlLabel
            component="legend"
            label="Video URL (link to uploaded preview/final video)"
          )
          <TextInput
            placeholder="Enter video URL..."
            value={newRevisionVideoUrl}
            onChange={(e) => setNewRevisionVideoUrl(e.target.value)}
            multiline={false}
            rows={1}
          />

          <FormControlLabel
            component="legend"
            label="Revision Notes"
          )
          <TextInput
            placeholder="Enter revision notes..."
            value={newRevisionNotes}
            onChange={(e) => setNewRevisionNotes(e.target.value)}
            multiline={true}
            rows={3}
          />

          <Box>
            <Button variant="outlined" onClick={() => setShowRevisionForm(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Revision
            </Button>
          </Box>
        </Paper>
      )}
    </AdminPage>
  );
}