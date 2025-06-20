const db = require("../db/db");

exports.createEnrollment = async (req, res) => {
  //Nhan du lieu tu request body
  const { user_id, course_id } = req.body;

  //Kiem tra du lieu dau vao
  if (!user_id || !course_id) {
    return res.status(400).json({ message: "Thieu user_id hoac course_id" });
  }
  try {
    //Kiem tra khoa hoc ton tai hay khong
    const [courses] = await db.execute(
      "SELECT * FROM courses WHERE course_id = ?",
      [course_id]
    );
    if (courses.length === 0) {
      return res
        .status(404)
        .json({ message: "Khoa hoc khong ton tai trong CSDL" });
    }

    //Kiem tra trung lap dang ky
    const [rows] = await db.execute(
      "SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?",
      [user_id, course_id]
    );
    if (rows.length > 0) {
      return res.status(409).json({ message: "Ban da dang ky khoa hoc nay" });
    }

    //Them ban ghi moi vs status = 'active'
    await db.execute(
      "INSERT INTO enrollments (user_id, course_id, status) VALUES (?, ?, ?)",
      [user_id, course_id, "active"]
    );
    res.status(201).json({ message: "Dang ky khoa hoc thanh cong" });
  } catch (err) {
    res.status(500).json({ message: "Loi dang ky", error: err.message });
  }
};

exports.getEnrollments = async (req, res) => {
  const { user_id, course_id } = req.query;
  let query = "SELECT * FROM enrollments";
  let params = [];
  if (user_id && course_id) {
    query += " WHERE user_id = ? AND course_id = ?";
    params.push(user_id, course_id);
  } else if (user_id) {
    query += " WHERE user_id = ?";
    params.push(user_id);
  } else if (course_id) {
    query += " WHERE course_id = ?";
    params.push(course_id);
  }
  try {
    const [enrollments] = await db.execute(query, params);
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: "Loi truy van", error: err.message });
  }
};

exports.getEnrollmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute("SELECT * FROM enrollments WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Ban ghi tren khong ton tai trong CSDL" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Loi truy xuat id", error: error.message });
  }
};

exports.updateEnrollment = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ message: "Thieu truong status" });
  }
  try {
    const [rows] = await db.execute("SELECT * FROM enrollments WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Ban ghi tren khong ton tai" });
    }
    await db.execute("UPDATE enrollments SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
    res.json({ message: "Cap nhat thong tin dang ky thanh cong" });
  } catch (error) {
    res.status(500).json({ message: "Loi cap nhat", error: error.message });
  }
};

exports.deleteEnrollment = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute("SELECT * FROM enrollments WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đăng ký với id này!" });
    }
    await db.execute("DELETE FROM enrollments WHERE id = ?", [id]);
    res.json({ message: "Xóa đăng ký thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa đăng ký", error: error.message });
  }
};

