const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';

function authenToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Thiếu token xác thực' });
  }
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token không hợp lệ' });
    req.user = user;
    next();
  });
}

module.exports = authenToken;