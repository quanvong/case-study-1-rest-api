const Joi = require('joi');

//Xac thuc thong tin cac truong cua khoa hoc
exports.courseSchema = Joi.object({
    course_id: Joi.string().min(3).max(10).alphanum().required(),
    name: Joi.string().min(4).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    category: Joi.string().min(2).max(30).required(),
    duration: Joi.number().integer().min(1).max(100).required()
});