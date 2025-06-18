const mysql = require('mysql2/promise');

//Ket noi toi co so du lieu MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'learnsphere'
});

module.exports = pool;
