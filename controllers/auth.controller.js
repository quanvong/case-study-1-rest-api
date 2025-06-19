const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Replace with your actual secret key

exports.register = async (req, res) => {
    // Nhận dữ liệu từ request body
  const { username, email, password, full_name } = req.body;

  // Kiểm tra dữ liệu
  if (!username || !email || !password || !full_name) {
    return res.status(400).json({ message: 'Thiếu các trường dữ liệu cần thiết' });
  }

  try {
    // Kiểm tra trùng lặp
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    if (users.length > 0) {
      return res.status(409).json({ message: 'Email hoặc username đã tồn tại trong CSDL' });
    }

    // Hash mật khẩu
    const hashPassword = await bcrypt.hash(password, 10);

    // Lưu user vào database
    await db.execute(
      'INSERT INTO users (email, username, password, full_name) VALUES (?, ?, ?, ?)',
      [email, username, hashPassword, full_name]
    );

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Đăng ký thất bại', error: error.message });
  }
};

exports.login = async (req, res) => {
    //Nhan du lieu tu client
  const {username, password} = req.body;

  try {
    //Tim user theo username/email
    const [users] = await db.execute('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
    if(users.length === 0) {
      return res.status(401).json({message:'Sai username hoặc email'}); // Sửa lỗi chính tả key
    }

    //So sanh password da nhap va password hash trong database
    const user = users[0];

    // Kiểm tra tài khoản có active không
    if (user.is_active === 0) {
      return res.status(403).json({ message: 'Tài khoản của bạn chưa được kích hoạt hoặc đã bị khóa' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    //Neu sai hien thi thong bao
    if(!isMatch) {
      return res.status(401).json({message: 'Sai username/email hoặc password'});
    }

    //Neu dung tao token + tra ve token cho client
    const token = jwt.sign(
      {id: user.id, username: user.username, role: user.role}, 
      SECRET_KEY, 
      {expiresIn: '1h'}
    );
    // Trả về thông tin user (ẩn password)
    const { password: pw, ...userInfo } = user;
    res.status(200).json({message: 'Đăng nhập thành công', token, user: userInfo});
  } catch (error) {
    res.status(500).json({message: 'Lỗi đăng nhập', error: error.message});
  }
};