const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollment.controller');
const authenToken = require('../middleware/auth'); // Sửa lại dòng này

// Định nghĩa các route cho đăng ký
router.post('/', authenToken, enrollmentController.createEnrollment);
router.get('/', authenToken, enrollmentController.getEnrollments);
router.get('/:id', authenToken, enrollmentController.getEnrollmentById);
router.put('/:id', authenToken, enrollmentController.updateEnrollment);
router.delete('/:id', authenToken, enrollmentController.deleteEnrollment);

module.exports = router;
