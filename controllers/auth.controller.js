const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Replace with your actual secret key

exports.register = async (req, res) => {
  const { username, email, password, full_name } = req.body;

  if (!username || !email || !password || !full_name) {
    return res.status(400).json({ message: 'Thiếu các trường dữ liệu cần thiết' });
  }

  try {
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    if (users.length > 0) {
      return res.status(400).json({ message: 'Username hoặc email đã tồn tại' });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO users (email, username, password, full_name, is_active) VALUES (?, ?, ?, ?, ?)',
      [email, username, hashPassword, full_name, 1]
    );

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Đăng ký thất bại', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    if (users.length === 0) {
      return res.status(401).json({ message: 'Sai username hoặc password' });
    }

    const user = users[0];

    if (user.is_active === 0) {
      return res.status(403).json({ message: 'Tài khoản chưa được kích hoạt' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Sai username hoặc password' });
    }

    const token = jwt.sign(
      { user_id: user.id, role: user.role },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    // Trả về token + thông tin user (trừ password)
    res.status(200).json({
      token,
      user: {
        id: user.id,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Đăng nhập thất bại', error: error.message });
  }
};
