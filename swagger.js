const swaggerJSDoc = require('swagger-jsdoc'); 
/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         course_id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         duration:
 *           type: integer
 *     Register:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         full_name:
 *           type: string
 *     Login:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 */

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'RESTful API - Advanced Security',
        version: '1.0.0',
        description: 'API documentation with JWT authentication, role-based access control, and input validation',
    },
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            BearerAuth: [],
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js', './controllers/*.js', './validator/*.js'], // Đường dẫn đến các file chứa định nghĩa API
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
