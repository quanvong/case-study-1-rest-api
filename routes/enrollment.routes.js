const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollment.controller');
const authenToken = require('../middleware/auth');
const validate = require('../middleware/validate');
const { enrollSchema } = require('../validator/enrollment.validator');
const authorize = require('../middleware/authorize');


//Sinh vien dang ky khoa hoc
router.post('/',  authenToken, authorize(['user']), validate(enrollSchema), enrollmentController.createEnrollment);

//Admin hoac instructor quan ly dang ky
router.get('/', authenToken, authorize(['admin', 'instructor']) ,enrollmentController.getEnrollments);

//Admin hoac instructor xem chi tiet dang ky
router.get('/:id', authenToken, authorize(['admin', 'instructor', 'user']) ,enrollmentController.getEnrollmentById);

//Admin hoac instructor cap nhat tiet dang ky
router.put('/:id', authenToken, authorize(['admin', 'instructor', 'user']) ,enrollmentController.updateEnrollment);

//Admin hoac instructor xoa dang ky
router.delete('/:id', authenToken, authorize(['admin', 'instructor', 'user']) ,enrollmentController.deleteEnrollment);

module.exports = router;
