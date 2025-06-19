const courseModel = require('../models/course.model');

exports.getCourses = async (req, res) => {
  try {
    const courses = await courseModel.findAll(req.query.category);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Lỗi truy vấn", error: err.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await courseModel.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Không tìm thấy khóa học" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Lỗi truy vấn", error: err.message });
  }
};

exports.createCourse = async (req, res) => {
  const { course_id, name, category, description, duration } = req.body;
  if (!course_id || !name || !category || !description || !duration) {
    return res.status(400).json({ message: "Thiếu các trường dữ liệu cần thiết" });
  }
  try {
    const existed = await courseModel.findById(course_id);
    if (existed) return res.status(409).json({ message: "Khóa học đã tồn tại" });
    await courseModel.create({ course_id, name, category, description, duration });
    res.status(201).json({ message: "Tạo khóa học thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo khóa học", error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, category, description } = req.body;
  if (!name && !category && !description) {
    return res.status(400).json({ message: "Phải có ít nhất một trường để cập nhật" });
  }
  try {
    const existed = await courseModel.findById(id);
    if (!existed) return res.status(404).json({ message: "Không tìm thấy khóa học" });
    await courseModel.update(id, { name, category, description });
    res.json({ message: "Cập nhật khóa học thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật khóa học", error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const existed = await courseModel.findById(id);
    if (!existed) return res.status(404).json({ message: "Không tìm thấy khóa học" });
    await courseModel.delete(id);
    res.json({ message: "Xóa khóa học thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa khóa học", error: err.message });
  }
};
