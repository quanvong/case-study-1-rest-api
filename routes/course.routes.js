const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const authenToken = require('../middleware/auth');

// Định nghĩa các route cho khóa học
router.get('/', authenToken, courseController.getCourses);
router.get('/:id', authenToken, courseController.getCourseById);
router.post('/', authenToken, courseController.createCourse);
router.put('/:id', authenToken, courseController.updateCourse);
router.delete('/:id', authenToken, courseController.deleteCourse);

module.exports = router;