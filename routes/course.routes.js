const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const authenToken = require('../middleware/auth');
const { courseSchema } = require('../validator/course.validator');
const validate = require('../middleware/validate');
const authorize = require('../middleware/authorize');

//Ai cung co quyen xem danh sach khoa hoc
/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Lấy danh sách khóa học
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách khóa học
 */
router.get('/', authenToken, authorize(['admin', 'instructor', 'user']) ,courseController.getCourses);
/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Lấy chi tiết khóa học
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin khóa học
 */
router.get('/:id', authenToken, authorize(['admin', 'instructor', 'user']) ,courseController.getCourseById);

//Admin hoac instructor duoc phep tao khoa hoc
/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Tạo khóa học mới
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Tạo khóa học thành công
 */
router.post('/', authenToken, authorize(['admin', 'instructor']), validate(courseSchema), courseController.createCourse);

//instructor duoc phep cap nhat khoa hoc
/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Cập nhật khóa học
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của khóa học
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Cập nhật khóa học thành công
 */
router.put('/:id', authenToken, authorize(['instructor']), validate(courseSchema), courseController.updateCourse);

//Admin hoac instructor duoc phep xoa khoa hoc
/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Xóa khóa học
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của khóa học
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Xóa khóa học thành công
 */
router.delete('/:id', authenToken, authorize(['admin', 'instructor']), courseController.deleteCourse);



module.exports = router;