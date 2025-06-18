const express = require("express");
const db = require("./db/db"); // Giả sử bạn đã tạo file db.js để kết nối cơ sở dữ liệu

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// POST /courses
app.post("/courses", async (req, res) => {
  const { course_id, name, description, category, duration } = req.body;
  if (!course_id || !name || !category || !duration) {
    return res.status(400).json({ message: "Thieu cac truong du lieu can thiet" });
  }
  try {
    const [courses] = await db.execute('SELECT * FROM courses WHERE course_id = ?', [course_id]);
    if (courses.length > 0) {
      return res.status(409).json({ message: "Khoa hoc da ton tai!" });
    }
    await db.execute(
      'INSERT INTO courses (course_id, name, description, category, duration) VALUES (?, ?, ?, ?, ?)',
      [course_id, name, description, category, duration]
    );
    res.status(201).json({ message: "Tao khoa hoc thanh cong" });
  } catch (err) {
    res.status(500).json({ message: "Loi tao khoa hoc", error: err.message });
  }
});

// GET /courses
app.get('/courses', async (req, res) => {
  try {
    const category = req.query.category;
    let query = 'SELECT * FROM courses';
    let params = [];
    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }
    const [courses] = await db.execute(query, params);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Loi truy van', error: err.message });
  }
});

// GET /courses/:id
app.get("/courses/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute("SELECT * FROM courses WHERE course_id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Khong tim thay khoa hoc trong CSDL" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Loi lay khoa hoc", error: error.message });
  }
});

// POST /enroll
app.post("/enroll", async (req, res) => {
  const { user_id, course_id } = req.body;
  if (!user_id || !course_id) {
    return res.status(400).json({ message: "Thieu user_id hoac course_id" });
  }
  try {
    const [courses] = await db.execute('SELECT * FROM courses WHERE course_id = ?', [course_id]);
    if (courses.length === 0) {
      return res.status(404).json({ message: "Khoa hoc khong ton tai trong CSDL" });
    }
    await db.execute(
      'INSERT INTO enrollments (user_id, course_id, status) VALUES (?, ?, ?)',
      [user_id, course_id, 'active']
    );
    res.status(201).json({ message: "Dang ky khoa hoc thanh cong" });
  } catch (err) {
    res.status(500).json({ message: "Loi dang ky", error: err.message });
  }
});

// GET /enrollments
app.get('/enrollments', async (req, res) => {
  const { user_id, course_id } = req.query;
  let query = 'SELECT * FROM enrollments';
  let params = [];
  if (user_id && course_id) {
    query += ' WHERE user_id = ? AND course_id = ?';
    params.push(user_id, course_id);
  } else if (user_id) {
    query += ' WHERE user_id = ?';
    params.push(user_id);
  } else if (course_id) {
    query += ' WHERE course_id = ?';
    params.push(course_id);
  }
  try {
    const [enrollments] = await db.execute(query, params);
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: 'Loi truy van', error: err.message });
  }
});

// GET /enrollments/:id
app.get('/enrollments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM enrollments WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Ban ghi tren khong ton tai trong CSDL" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Loi truy xuat id", error: error.message });
  }
});

// PUT /enrollments/:id
app.put('/enrollments/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ message: 'Thieu truong status' });
  }
  try {
    const [rows] = await db.execute('SELECT * FROM enrollments WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Ban ghi tren khong ton tai' });
    }
    await db.execute('UPDATE enrollments SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Cap nhat thong tin dang ky thanh cong' });
  } catch (error) {
    res.status(500).json({ message: 'Loi cap nhat', error: error.message });
  }
});

// DELETE /enrollments/:id
app.delete('/enrollments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM enrollments WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đăng ký với id này!" });
    }
    await db.execute('DELETE FROM enrollments WHERE id = ?', [id]);
    res.json({ message: "Xóa đăng ký thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa đăng ký", error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
