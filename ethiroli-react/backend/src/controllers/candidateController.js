import Candidate from '../models/Candidate.js';
import Job from '../models/Job.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listCandidates = asyncHandler(async (req, res) => {
  const { job_id, status, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Candidate.list({ job_id, status, limit: parseInt(limit), offset }),
    Candidate.count({ job_id, status })
  ]);

  return success(res, 200, items, 'Candidates retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createCandidate = asyncHandler(async (req, res) => {
  let jobId = req.body.job_id;

  if (!jobId) {
    const rows = await Job.list({ limit: 1 });
    if (rows.length > 0) {
      jobId = rows[0].id;
    }
  }

  const name = req.body.name || req.body.fullName;
  const email = req.body.email;
  const phone = req.body.phone;
  const resume_url = req.body.resume_url || req.body.portfolioUrl;
  const source = req.body.source || 'WEBSITE';

  const id = await Candidate.create({
    job_id: jobId,
    name,
    email,
    phone,
    resume_url,
    source
  });

  broadcastToRole('HR', 'candidate_created', { id, name });

  return success(res, 201, { id }, 'Candidate added successfully');
});

export const getCandidate = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findById(req.params.id);
  if (!candidate) throw new NotFoundError('Candidate not found');
  return success(res, 200, candidate, 'Candidate retrieved');
});

export const updateCandidate = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findById(req.params.id);
  if (!candidate) throw new NotFoundError('Candidate not found');
  await Candidate.update(req.params.id, req.body);
  return success(res, 200, null, 'Candidate updated successfully');
});

export const deleteCandidate = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findById(req.params.id);
  if (!candidate) throw new NotFoundError('Candidate not found');
  await Candidate.delete(req.params.id);
  return success(res, 200, null, 'Candidate deleted successfully');
});
