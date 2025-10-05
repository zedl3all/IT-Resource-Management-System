module.exports = {
    '/users': {
        get: {
            tags: ['Users'],
            summary: 'Get all users',
            description: 'ดึงข้อมูลผู้ใช้ทั้งหมดในระบบ (ยกเว้นที่ถูกลบ)',
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    users: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/User' }
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: { type: 'string' },
                                    details: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        },
        post: {
            tags: ['Users'],
            summary: 'Create new user',
            description: 'สร้างผู้ใช้ใหม่ในระบบ',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UserInput' }
                    }
                }
            },
            responses: {
                201: {
                    description: 'User created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    result: { $ref: '#/components/schemas/User' }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    },
    '/users/{id}': {
        get: {
            tags: ['Users'],
            summary: 'Get user by ID',
            description: 'ดึงข้อมูลผู้ใช้ตาม ID',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: '1',
                    description: 'User ID'
                }
            ],
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/User' }
                        }
                    }
                },
                404: {
                    description: 'User not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: { type: 'string', example: 'User not found' },
                                    details: { type: 'string', example: 'No user found with ID 1' }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: 'Internal server error'
                }
            }
        },
        put: {
            tags: ['Users'],
            summary: 'Update user',
            description: 'อัปเดตข้อมูลผู้ใช้',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: '1'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UserUpdate' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'User updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string', example: 'User updated successfully' },
                                    details: { type: 'object' }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: 'Internal server error'
                }
            }
        },
        delete: {
            tags: ['Users'],
            summary: 'Soft delete user',
            description: 'ลบผู้ใช้แบบ soft delete (ตั้งค่า is_deleted = 1)',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: '1'
                }
            ],
            responses: {
                200: {
                    description: 'User soft deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string', example: 'User soft deleted successfully' },
                                    details: { type: 'object' }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    },
    '/users/{id}/restore': {
        post: {
            tags: ['Users'],
            summary: 'Restore deleted user',
            description: 'กู้คืนผู้ใช้ที่ถูกลบ (ตั้งค่า is_deleted = 0)',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: '1'
                }
            ],
            responses: {
                200: {
                    description: 'User restored successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string', example: 'User restored successfully' },
                                    details: { type: 'object' }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    },
    '/users/search/{keyword}': {
        get: {
            tags: ['Users'],
            summary: 'Search users by keyword',
            description: 'ค้นหาผู้ใช้จาก username',
            parameters: [
                {
                    name: 'keyword',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'somchai',
                    description: 'Search keyword for username'
                }
            ],
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    users: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/User' }
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    },
    '/users/findByEmail/{email}': {
        get: {
            tags: ['Users'],
            summary: 'Find user by email',
            description: 'ค้นหาผู้ใช้ด้วยอีเมล',
            parameters: [
                {
                    name: 'email',
                    in: 'path',
                    required: true,
                    schema: { 
                        type: 'string',
                        format: 'email'
                    },
                    example: 'somchai@example.com'
                }
            ],
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/User' }
                        }
                    }
                },
                404: {
                    description: 'User not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: { type: 'string', example: 'User not found' },
                                    details: { type: 'string', example: 'No user found with email somchai@example.com' }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    },
    '/users/findByUsername/{username}': {
        get: {
            tags: ['Users'],
            summary: 'Find user by username',
            description: 'ค้นหาผู้ใช้ด้วย username',
            parameters: [
                {
                    name: 'username',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'somchai123'
                }
            ],
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/User' }
                        }
                    }
                },
                404: {
                    description: 'User not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: { type: 'string', example: 'User not found' },
                                    details: { type: 'string', example: 'No user found with username somchai123' }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    },
    '/users/staff/all': {
        get: {
            tags: ['Users'],
            summary: 'Get all staff users',
            description: 'ดึงข้อมูลผู้ใช้ที่มีบทบาทเป็น staff ทั้งหมด',
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    users: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/User' }
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    }
};