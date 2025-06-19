const db = require("../db/db");

// Model chỉ thao tác DB, không nhận req, res

// Lấy tất cả khóa học (có thể thêm tham số lọc nếu muốn)
exports.findAll = async (category) => {
  let query = "SELECT course_id, name, category FROM courses";
  let params = [];
  if (category && category !== "ALL") {
    query += " WHERE category = ?";
    params.push(category);
  }
  const [courses] = await db.execute(query, params);
  return courses;
};

exports.findById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM courses WHERE course_id = ?", [
    id,
  ]);
  return rows[0];
};

exports.create = async (course) => {
  return db.execute(
    "INSERT INTO courses (course_id, name, category, description, duration) VALUES (?, ?, ?, ?, ?)",
    [
      course.course_id,
      course.name,
      course.category,
      course.description,
      course.duration,
    ]
  );
};

exports.update = async (id, fields) => {
  // fields là object: { name, category, description }
  let setStr = [];
  let params = [];
  for (let key in fields) {
    if (fields[key] !== undefined) {
      setStr.push(`${key} = ?`);
      params.push(fields[key]);
    }
  }
  params.push(id);
  const sql = `UPDATE courses SET ${setStr.join(", ")} WHERE course_id = ?`;
  return db.execute(sql, params);
};

exports.delete = async (id) => {
  return db.execute("DELETE FROM courses WHERE course_id = ?", [id]);
};

