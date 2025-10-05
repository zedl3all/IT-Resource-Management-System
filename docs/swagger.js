const swaggerJsdoc = require('swagger-jsdoc');
const userSchemas = require('./schemas/userSchemas');
const roomSchemas = require('./schemas/roomSchemas');
const equipmentSchemas = require('./schemas/equipmentSchemas');
const maintenanceSchemas = require('./schemas/maintenanceSchemas');
const authSchemas = require('./schemas/authSchemas');
const equipmentTypeSchemas = require('./schemas/equipmentTypeSchemas');
const imageSchemas = require('./schemas/imageSchemas');

const userPaths = require('./paths/userPaths');
const roomPaths = require('./paths/roomPaths');
const equipmentPaths = require('./paths/equipmentPaths');
const maintenancePaths = require('./paths/maintenancePaths');
const authPaths = require('./paths/authPaths');
const equipmentTypePaths = require('./paths/equipmentTypePaths');
const imagePaths = require('./paths/imagePaths');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'IT Resource Management System API',
            version: '1.0.0',
            description: 'API Documentation for IT Resource Management System - ระบบจัดการทรัพยากร IT\n\n' +
                         '## คุณสมบัติหลัก\n' +
                         '- 🏢 **จัดการห้อง** - จองและจัดการห้องประชุม\n' +
                         '- 💻 **จัดการอุปกรณ์** - ยืม-คืนอุปกรณ์ IT\n' +
                         '- 🔧 **แจ้งซ่อม** - แจ้งและติดตามสถานะการซ่อม\n' +
                         '- 👥 **จัดการผู้ใช้** - บริหารจัดการผู้ใช้และสิทธิ์\n' +
                         '- 🔐 **ความปลอดภัย** - JWT Authentication & Role-based Access Control',
            contact: {
                name: 'IT Resource Management Team',
                email: 'webadmin@it.kmitl.ac.th'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Development server'
            },
        ],
        components: {
            schemas: {
                ...userSchemas,
                ...roomSchemas,
                ...equipmentSchemas,
                ...maintenanceSchemas,
                ...authSchemas,
                ...equipmentTypeSchemas,
                ...imageSchemas
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token สำหรับ authentication'
                },
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'token',
                    description: 'JWT token ใน HttpOnly cookie'
                }
            },
        },
        security: [
            {
                cookieAuth: []
            }
        ],
        tags: [
            {
                name: 'Authentication',
                description: 'การลงทะเบียนและเข้าสู่ระบบ'
            },
            {
                name: 'Users',
                description: 'จัดการข้อมูลผู้ใช้งาน'
            },
            {
                name: 'Rooms',
                description: 'จัดการห้องประชุมและห้องทำงาน'
            },
            {
                name: 'Room Bookings',
                description: 'จองและจัดการการจองห้อง'
            },
            {
                name: 'Equipments',
                description: 'จัดการอุปกรณ์ IT'
            },
            {
                name: 'Equipment Loans',
                description: 'ยืม-คืนอุปกรณ์'
            },
            {
                name: 'Equipment Types',
                description: 'ประเภทของอุปกรณ์'
            },
            {
                name: 'Maintenances',
                description: 'แจ้งซ่อมและติดตามสถานะ'
            },
            {
                name: 'Images',
                description: 'จัดการไฟล์รูปภาพ'
            }
        ],
        paths: {
            ...authPaths,
            ...userPaths,
            ...roomPaths,
            ...equipmentPaths,
            ...maintenancePaths,
            ...equipmentTypePaths,
            ...imagePaths
        },
    },
    apis: [], // ใช้แบบ manual แทนการ scan
};

module.exports = swaggerJsdoc(options);