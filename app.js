const express = require("express");
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const authRoutes = require('./routes/auth.routes'); 
const courseRoutes = require('./routes/course.routes'); // Sửa lại dòng này
const enrollmentRoutes = require('./routes/enrollment.routes'); // Sửa lại dòng này
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); 

const limiter = rateLimit({
  windowMs: 1 *60 * 1000, //1 phut
  max: 50, //Toi da 50 request/phut cho moi IP
  message: 'Ban da gui qua nhieu yeu cau, vui long thu lai sau'
});

const app = express();
app.use(express.json()); // Khai báo middleware để phân tích dữ liệu JSON từ request body
app.use(compression()); // Khai báo middleware nén dữ liệu
app.use(limiter); // Khai báo middleware giới hạn tần suất yêu cầu


//Su dung cac routes
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
