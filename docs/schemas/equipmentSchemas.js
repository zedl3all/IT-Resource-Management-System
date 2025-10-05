module.exports = {
    Equipment: {
        type: 'object',
        properties: {
            e_id: {
                type: 'string',
                example: 'E001'
            },
            name: {
                type: 'string',
                example: 'โน้ตบุ๊ก Dell XPS 15'
            },
            type_name: {
                type: 'string',
                example: 'คอมพิวเตอร์'
            },
            status: {
                type: 'integer',
                enum: [-1, 0, 1],
                description: '-1: ซ่อมบำรุง, 0: ถูกจอง, 1: ว่าง'
            }
        }
    },
    EquipmentInput: {
        type: 'object',
        required: ['name'],
        properties: {
            e_id: {
                type: 'string',
                example: 'E001'
            },
            name: {
                type: 'string',
                example: 'โน้ตบุ๊ก Dell XPS 15'
            },
            type: {
                type: 'array',
                items: {
                    type: 'string'
                },
                example: ['1', '2']
            },
            status: {
                type: 'integer',
                example: 1
            }
        }
    },
    Loan: {
        type: 'object',
        properties: {
            loan_id: {
                type: 'integer',
                example: 1
            },
            e_id: {
                type: 'string',
                example: 'E001'
            },
            user_id: {
                type: 'string',
                example: '1'
            },
            borrow_DT: {
                type: 'string',
                format: 'date-time'
            },
            return_DT: {
                type: 'string',
                format: 'date-time'
            },
            purpose: {
                type: 'string',
                example: 'ใช้งานโครงการ'
            },
            status: {
                type: 'integer',
                example: 0
            }
        }
    },
    LoanInput: {
        type: 'object',
        required: ['user_id', 'equipment_id', 'booking_date', 'booking_time', 'return_date', 'return_time'],
        properties: {
            user_id: {
                type: 'string',
                example: '1'
            },
            equipment_id: {
                type: 'string',
                example: 'E001'
            },
            booking_date: {
                type: 'string',
                format: 'date',
                example: '2024-01-15'
            },
            booking_time: {
                type: 'string',
                example: '09:00'
            },
            return_date: {
                type: 'string',
                format: 'date',
                example: '2024-01-20'
            },
            return_time: {
                type: 'string',
                example: '17:00'
            },
            purpose: {
                type: 'string',
                example: 'ใช้งานโครงการ'
            }
        }
    }
};