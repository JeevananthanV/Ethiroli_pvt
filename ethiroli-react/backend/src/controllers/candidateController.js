import Candidate from '../models/Candidate.js';
import Job from '../models/Job.js';
import pool from '../config/database.js';
import { broadcastToRole } from '../services/socketService.js';

export const listCandidates = async (req, res) => {
  try {
    const list = await Candidate.list({ job_id: req.query.job_id, status: req.query.status });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCandidate = async (req, res) => {
  try {
    let jobId = req.body.job_id;

    if (!jobId) {
      // Find the first open job in the database
      const [rows] = await pool.execute("SELECT id FROM jobs ORDER BY created_at DESC LIMIT 1");
      if (rows.length > 0) {
        jobId = rows[0].id;
      } else {
        // Create a default placeholder job
        jobId = await Job.create({
          title: req.body.role || 'General Application',
          description: 'Automatically created job for public applications.',
          created_by: '368f5c88-12cd-11ed-861d-0242ac120002' // Default Super Admin ID
        });
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
    res.status(201).json({ message: 'Candidate added.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

