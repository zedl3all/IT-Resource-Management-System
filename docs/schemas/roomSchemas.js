module.exports = {
    Room: {
        type: 'object',
        properties: {
            room_id: {
                type: 'string',
                example: 'R001'
            },
            room_name: {
                type: 'string',
                example: 'ห้องประชุมใหญ่'
            },
            description: {
                type: 'string',
                example: 'ห้องประชุมขนาดใหญ่ สำหรับการประชุมทั่วไป'
            },
            capacity: {
                type: 'integer',
                example: 50
            },
            status: {
                type: 'integer',
                enum: [-1, 0, 1],
                description: '-1: ซ่อมบำรุง, 0: ถูกใช้งาน, 1: ว่าง'
            }
        }
    },
    RoomInput: {
        type: 'object',
        required: ['room_name', 'capacity'],
        properties: {
            id: {
                type: 'string',
                example: 'R001'
            },
            name: {
                type: 'string',
                example: 'ห้องประชุมใหญ่'
            },
            description: {
                type: 'string',
                example: 'ห้องประชุมขนาดใหญ่'
            },
            capacity: {
                type: 'integer',
                example: 50
            },
            status: {
                type: 'integer',
                example: 1
            }
        }
    },
    Booking: {
        type: 'object',
        properties: {
            booking_id: {
                type: 'string',
                example: 'B001'
            },
            room_id: {
                type: 'string',
                example: 'R001'
            },
            user_id: {
                type: 'string',
                example: '1'
            },
            start_time: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T09:00:00'
            },
            end_time: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T11:00:00'
            },
            purpose: {
                type: 'string',
                example: 'ประชุมทีม'
            }
        }
    },
    BookingInput: {
        type: 'object',
        required: ['room_id', 'user_id', 'start_time', 'end_time'],
        properties: {
            room_id: {
                type: 'string',
                example: 'R001'
            },
            user_id: {
                type: 'string',
                example: '1'
            },
            start_time: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T09:00:00'
            },
            end_time: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T11:00:00'
            },
            purpose: {
                type: 'string',
                example: 'ประชุมทีม'
            }
        }
    }
};