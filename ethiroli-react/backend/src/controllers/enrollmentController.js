import Enrollment from '../models/Enrollment.js';

export const listEnrollments = async (req, res) => {
  try {
    const list = await Enrollment.listByCourseId(req.params.courseId);
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const enrollStudent = async (req, res) => {
  try {
    const student_id = req.user.role === 'STUDENT' ? req.user.id : req.body.student_id;
    await Enrollment.enroll({ student_id, course_id: req.params.courseId });
    res.status(201).json({ message: 'Enrolled successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyEnrollments = async (req, res) => {
  try {
    const list = await Enrollment.listByStudentId(req.user.id);
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    await Enrollment.updateProgress(req.params.id, req.body.progress);
    res.status(200).json({ message: 'Progress updated.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
