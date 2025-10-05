module.exports = {
    '/equipments': {
        get: {
            tags: ['Equipments'],
            summary: 'Get all equipments',
            description: 'ดึงข้อมูลอุปกรณ์ทั้งหมด (ยกเว้นที่ถูกลบ)',
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    equipments: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Equipment' }
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
            tags: ['Equipments'],
            summary: 'Create new equipment',
            description: 'สร้างอุปกรณ์ใหม่ในระบบ',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/EquipmentInput' }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Equipment created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    equipmentId: { type: 'string', example: 'E001' }
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
    '/equipments/{id}': {
        get: {
            tags: ['Equipments'],
            summary: 'Get equipment by ID',
            description: 'ดึงข้อมูลอุปกรณ์ตาม ID',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'E001'
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
                                    equipment: { $ref: '#/components/schemas/Equipment' }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'Equipment not found'
                },
                500: {
                    description: 'Internal server error'
                }
            }
        },
        put: {
            tags: ['Equipments'],
            summary: 'Update equipment',
            description: 'อัปเดตข้อมูลอุปกรณ์',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'E001'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/EquipmentInput' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Equipment updated successfully'
                },
                500: {
                    description: 'Internal server error'
                }
            }
        },
        delete: {
            tags: ['Equipments'],
            summary: 'Soft delete equipment',
            description: 'ลบอุปกรณ์แบบ soft delete (ตั้งค่า is_deleted = 1)',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'E001'
                }
            ],
            responses: {
                200: {
                    description: 'Equipment deleted successfully'
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    },
    '/equipments/{id}/restore': {
        post: {
            tags: ['Equipments'],
            summary: 'Restore deleted equipment',
            description: 'กู้คืนอุปกรณ์ที่ถูกลบ (ตั้งค่า is_deleted = 0)',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'E001'
                }
            ],
            responses: {
                200: {
                    description: 'Equipment restored successfully'
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    },
    '/equipments/search/{keyword}': {
        get: {
            tags: ['Equipments'],
            summary: 'Search equipments by keyword',
            description: 'ค้นหาอุปกรณ์จากชื่ออุปกรณ์',
            parameters: [
                {
                    name: 'keyword',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'โน้ตบุ๊ก'
                }
            ],
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Equipment' }
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
    '/equipments/{equipmentId}/loans': {
        get: {
            tags: ['Equipment Loans'],
            summary: 'Get loans by equipment ID',
            description: 'ดึงข้อมูลการยืมของอุปกรณ์ตาม equipment ID',
            parameters: [
                {
                    name: 'equipmentId',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'E001'
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
                                    loans: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Loan' }
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
    '/equipments/user/{userId}/loans': {
        get: {
            tags: ['Equipment Loans'],
            summary: 'Get loans by user ID',
            description: 'ดึงข้อมูลการยืมอุปกรณ์ของผู้ใช้ตาม user ID',
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
                                type: 'array',
                                items: { $ref: '#/components/schemas/Loan' }
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
    '/equipments/{id}/loans': {
        post: {
            tags: ['Equipment Loans'],
            summary: 'Create equipment loan',
            description: 'สร้างการยืมอุปกรณ์',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'E001'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/LoanInput' }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Loan created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string', example: 'Loan created successfully' },
                                    loanId: { type: 'integer', example: 1 }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Bad request - อุปกรณ์ไม่พร้อมให้ยืมหรือถูกจองแล้ว'
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    },
    '/equipments/{loanId}/return': {
        patch: {
            tags: ['Equipment Loans'],
            summary: 'Return equipment loan',
            description: 'คืนอุปกรณ์ที่ยืม',
            parameters: [
                {
                    name: 'loanId',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' },
                    example: 1
                }
            ],
            responses: {
                200: {
                    description: 'Equipment returned successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string', example: 'success' },
                                    message: { type: 'string', example: 'คืนอุปกรณ์สำเร็จ' }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'Loan not found'
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    }
};