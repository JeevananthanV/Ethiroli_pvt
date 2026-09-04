import Course from '../models/Course.js';

export const listCourses = async (req, res) => {
  try {
    const list = await Course.list({ tutor_id: req.query.tutor_id });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const id = await Course.create(req.body);
    res.status(201).json({ message: 'Course created successfully.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found.' });
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    await Course.update(req.params.id, req.body);
    res.status(200).json({ message: 'Course updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await Course.delete(req.params.id);
    res.status(200).json({ message: 'Course deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
