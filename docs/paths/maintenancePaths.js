module.exports = {
    '/maintenances': {
        get: {
            tags: ['Maintenances'],
            summary: 'Get all maintenance requests',
            description: 'ดึงข้อมูลรายการแจ้งซ่อมทั้งหมด (ยกเว้นที่ถูกลบ)',
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    Maintenances: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Maintenance' }
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
        },
        post: {
            tags: ['Maintenances'],
            summary: 'Create maintenance request',
            description: 'สร้างรายการแจ้งซ่อมใหม่ (รองรับการอัพโหลดรูปภาพ)',
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            required: ['equipment', 'problem_description', 'user_id', 'location'],
                            properties: {
                                equipment: {
                                    type: 'string',
                                    example: 'โน้ตบุ๊ก Dell XPS 15'
                                },
                                problem_description: {
                                    type: 'string',
                                    example: 'หน้าจอแตก'
                                },
                                user_id: {
                                    type: 'string',
                                    example: '1'
                                },
                                location: {
                                    type: 'string',
                                    example: 'ห้อง 301 อาคาร 2'
                                },
                                image: {
                                    type: 'string',
                                    format: 'binary',
                                    description: 'รูปภาพปัญหา (optional)'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Maintenance request created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    maintenanceId: { type: 'string', example: '12345678' }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'File upload error'
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    },
    '/maintenances/{id}': {
        get: {
            tags: ['Maintenances'],
            summary: 'Get maintenance by ID',
            description: 'ดึงข้อมูลรายการแจ้งซ่อมตาม ID',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: '12345678'
                }
            ],
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Maintenance' }
                        }
                    }
                },
                404: {
                    description: 'Maintenance not found'
                },
                500: {
                    description: 'Internal server error'
                }
            }
        },
        put: {
            tags: ['Maintenances'],
            summary: 'Update maintenance request',
            description: 'อัปเดตข้อมูลรายการแจ้งซ่อม',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: '12345678'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/MaintenanceInput' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Maintenance updated successfully'
                },
                500: {
                    description: 'Internal server error'
                }
            }
        },
        delete: {
            tags: ['Maintenances'],
            summary: 'Soft delete maintenance request',
            description: 'ลบรายการแจ้งซ่อมแบบ soft delete (ตั้งค่า is_deleted = 1)',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: '12345678'
                }
            ],
            responses: {
                200: {
                    description: 'Maintenance deleted successfully'
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    },
    '/maintenances/{id}/restore': {
        post: {
            tags: ['Maintenances'],
            summary: 'Restore deleted maintenance request',
            description: 'กู้คืนรายการแจ้งซ่อมที่ถูกลบ (ตั้งค่า is_deleted = 0)',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: '12345678'
                }
            ],
            responses: {
                200: {
                    description: 'Maintenance restored successfully'
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    },
    '/maintenances/search/{keyword}': {
        get: {
            tags: ['Maintenances'],
            summary: 'Search maintenance requests by keyword',
            description: 'ค้นหารายการแจ้งซ่อมจากคำอธิบายปัญหา',
            parameters: [
                {
                    name: 'keyword',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'หน้าจอ'
                }
            ],
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Maintenance' }
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
    '/maintenances/user/{userId}': {
        get: {
            tags: ['Maintenances'],
            summary: 'Get maintenance requests by user ID',
            description: 'ดึงข้อมูลรายการแจ้งซ่อมของผู้ใช้ตาม user ID',
            parameters: [
                {
                    name: 'userId',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: '1'
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
                                    maintenances: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Maintenance' }
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
    '/maintenances/{id}/updateStaffAndStatus': {
        patch: {
            tags: ['Maintenances'],
            summary: 'Update staff and status',
            description: 'อัปเดตเจ้าหน้าที่และสถานะการซ่อม',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: '12345678'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/MaintenanceUpdate' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Staff and status updated successfully'
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    }
};