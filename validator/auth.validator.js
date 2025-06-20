const Joi  = require('joi');

//Xac thuc thong tin dang ky
exports.registerSchema = Joi.object({
    username: Joi.string().alphanum().min(4).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])'))
        .required()
        .messages({
            'string.pattern.base': 'Password phải có chữ hoa, chữ thường, số và ký tự đặc biệt',
        }),
    full_name: Joi.string().min(2).max(50).required(),
});

//Xac thuc thong tin dang nhap
exports.loginSchema = Joi.object({
    username: Joi.string().alphanum().min(4).max(30).required(),
    password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])')).required()
});