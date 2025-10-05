module.exports = {
    '/rooms': {
        get: {
            tags: ['Rooms'],
            summary: 'Get all rooms',
            description: 'ดึงข้อมูลห้องทั้งหมด (ยกเว้นที่ถูกลบ)',
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    rooms: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Room' }
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
            tags: ['Rooms'],
            summary: 'Create a new room',
            description: 'สร้างห้องใหม่ในระบบ',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/RoomInput' }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Room created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    roomId: { type: 'string', example: 'R001' }
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
    '/rooms/{id}': {
        get: {
            tags: ['Rooms'],
            summary: 'Get room by ID',
            description: 'ดึงข้อมูลห้องตาม ID',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'R001'
                }
            ],
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Room' }
                        }
                    }
                },
                404: {
                    description: 'Room not found'
                },
                500: {
                    description: 'Internal server error'
                }
            }
        },
        put: {
            tags: ['Rooms'],
            summary: 'Update room',
            description: 'อัปเดตข้อมูลห้อง',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'R001'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/RoomInput' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Room updated successfully'
                },
                500: {
                    description: 'Internal server error'
                }
            }
        },
        delete: {
            tags: ['Rooms'],
            summary: 'Soft delete room',
            description: 'ลบห้องแบบ soft delete (ตั้งค่า is_deleted = 1)',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'R001'
                }
            ],
            responses: {
                200: {
                    description: 'Room deleted successfully'
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    },
    '/rooms/{id}/restore': {
        post: {
            tags: ['Rooms'],
            summary: 'Restore deleted room',
            description: 'กู้คืนห้องที่ถูกลบ (ตั้งค่า is_deleted = 0)',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'R001'
                }
            ],
            responses: {
                200: {
                    description: 'Room restored successfully'
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    },
    '/rooms/search/{keyword}': {
        get: {
            tags: ['Rooms'],
            summary: 'Search rooms by keyword',
            description: 'ค้นหาห้องจากชื่อห้อง',
            parameters: [
                {
                    name: 'keyword',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'ประชุม'
                }
            ],
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Room' }
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
    '/rooms/user/{userId}/bookings': {
        get: {
            tags: ['Room Bookings'],
            summary: 'Get bookings by user ID',
            description: 'ดึงข้อมูลการจองห้องของผู้ใช้ตาม user ID',
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
                                items: { $ref: '#/components/schemas/Booking' }
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
    '/rooms/{id}/bookings/month': {
        get: {
            tags: ['Room Bookings'],
            summary: 'Get room bookings by month',
            description: 'ดึงข้อมูลการจองห้องตามเดือน',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'R001'
                },
                {
                    name: 'month',
                    in: 'query',
                    required: true,
                    schema: { type: 'integer', minimum: 1, maximum: 12 },
                    example: 1
                },
                {
                    name: 'year',
                    in: 'query',
                    required: true,
                    schema: { type: 'integer' },
                    example: 2024
                }
            ],
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Booking' }
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
    '/rooms/{id}/bookings': {
        get: {
            tags: ['Room Bookings'],
            summary: 'Get bookings for a specific room',
            description: 'ดึงข้อมูลการจองทั้งหมดของห้อง',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'R001'
                }
            ],
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Booking' }
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
            tags: ['Room Bookings'],
            summary: 'Create a new booking',
            description: 'สร้างการจองห้องใหม่',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'R001'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/BookingInput' }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Booking created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string', example: 'success' },
                                    message: { type: 'string', example: 'จองห้องสำเร็จ' }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Bad request - ห้องไม่ว่างหรือข้อมูลไม่ถูกต้อง'
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    },
    '/rooms/{id}/availability': {
        get: {
            tags: ['Room Bookings'],
            summary: 'Check room availability',
            description: 'ตรวจสอบความพร้อมใช้งานของห้องในช่วงเวลาที่ระบุ',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'R001'
                },
                {
                    name: 'startTime',
                    in: 'query',
                    required: true,
                    schema: { type: 'string', format: 'date-time' },
                    example: '2024-01-15T09:00:00'
                },
                {
                    name: 'endTime',
                    in: 'query',
                    required: true,
                    schema: { type: 'string', format: 'date-time' },
                    example: '2024-01-15T11:00:00'
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
                                    isAvailable: { type: 'boolean', example: true },
                                    roomId: { type: 'string', example: 'R001' },
                                    startTime: { type: 'string', example: '2024-01-15T09:00:00' },
                                    endTime: { type: 'string', example: '2024-01-15T11:00:00' }
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
    '/rooms/cancel-booking/{id}': {
        delete: {
            tags: ['Room Bookings'],
            summary: 'Cancel a booking',
            description: 'ยกเลิกการจองห้อง',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    example: 'B001',
                    description: 'Booking ID'
                }
            ],
            responses: {
                200: {
                    description: 'Booking cancelled successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string', example: 'success' },
                                    message: { type: 'string', example: 'ยกเลิกการจองสำเร็จ' }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'Booking not found'
                },
                500: {
                    description: 'Internal server error'
                }
            }
        }
    }
};