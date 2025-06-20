const Joi =  require('joi');

//Xac thuc thong tin cho dang ky khoa hoc
exports.enrollSchema = Joi.object({
    user_id: Joi.string().alphanum().min(3).max(10).required(),
    course_id: Joi.string().alphanum().min(3).max(10).required(),
    enroll_date: Joi.date().iso().required(),
    status: Joi.string().valid('active', 'cancelled').required()
});