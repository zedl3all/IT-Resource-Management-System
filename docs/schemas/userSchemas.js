module.exports = {
    User: {
        type: 'object',
        properties: {
            user_id: {
                type: 'string',
                example: '1'
            },
            fullname: {
                type: 'string',
                example: 'สมชาย ใจดี'
            },
            username: {
                type: 'string',
                example: 'somchai123'
            },
            email: {
                type: 'string',
                format: 'email',
                example: 'somchai@example.com'
            },
            role: {
                type: 'string',
                enum: ['user', 'staff', 'admin'],
                example: 'user'
            },
            created_at: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00.000Z'
            },
            is_deleted: {
                type: 'integer',
                enum: [0, 1],
                description: '0: Active, 1: Deleted',
                example: 0
            }
        }
    },
    UserInput: {
        type: 'object',
        required: ['fullname', 'username', 'email', 'password', 'role'],
        properties: {
            fullname: {
                type: 'string',
                example: 'สมชาย ใจดี'
            },
            username: {
                type: 'string',
                example: 'somchai123'
            },
            email: {
                type: 'string',
                format: 'email',
                example: 'somchai@example.com'
            },
            password: {
                type: 'string',
                format: 'password',
                example: 'password123'
            },
            role: {
                type: 'string',
                enum: ['user', 'staff', 'admin'],
                example: 'user'
            }
        }
    },
    UserUpdate: {
        type: 'object',
        properties: {
            username: {
                type: 'string',
                example: 'somchai123'
            },
            email: {
                type: 'string',
                format: 'email',
                example: 'somchai@example.com'
            },
            password: {
                type: 'string',
                format: 'password',
                example: 'newpassword123'
            },
            role: {
                type: 'string',
                enum: ['user', 'staff', 'admin'],
                example: 'user'
            }
        }
    }
};