module.exports = {
    RegisterInput: {
        type: 'object',
        required: ['fullname', 'email', 'username', 'password', 'confirmPassword'],
        properties: {
            fullname: {
                type: 'string',
                example: 'สมชาย ใจดี'
            },
            email: {
                type: 'string',
                format: 'email',
                example: 'somchai@example.com'
            },
            username: {
                type: 'string',
                example: 'somchai123'
            },
            password: {
                type: 'string',
                format: 'password',
                example: 'password123'
            },
            confirmPassword: {
                type: 'string',
                format: 'password',
                example: 'password123'
            }
        }
    },
    LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: {
                type: 'string',
                format: 'email',
                example: 'somchai@example.com'
            },
            password: {
                type: 'string',
                format: 'password',
                example: 'password123'
            }
        }
    },
    AuthResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true
            },
            message: {
                type: 'string',
                example: 'Login successful'
            },
            user: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        example: '1'
                    },
                    name: {
                        type: 'string',
                        example: 'สมชาย ใจดี'
                    },
                    role: {
                        type: 'string',
                        example: 'user'
                    }
                }
            }
        }
    }
};