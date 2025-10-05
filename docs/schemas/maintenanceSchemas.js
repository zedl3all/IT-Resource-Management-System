module.exports = {
    Maintenance: {
        type: 'object',
        properties: {
            request_id: {
                type: 'string',
                example: '12345678'
            },
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
                example: '/Images/maintenance/maintenance-1234567890.jpg'
            },
            DT_report: {
                type: 'string',
                format: 'date-time'
            },
            staff_id: {
                type: 'string',
                nullable: true,
                example: 'staff1'
            },
            status: {
                type: 'integer',
                enum: [-1, 0, 1],
                description: '-1: กำลังดำเนินการ, 0: รอดำเนินการ, 1: เสร็จสิ้น'
            }
        }
    },
    MaintenanceInput: {
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
                format: 'binary'
            }
        }
    },
    MaintenanceUpdate: {
        type: 'object',
        properties: {
            staff_id: {
                type: 'string',
                example: 'staff1'
            },
            status: {
                type: 'integer',
                enum: [-1, 0, 1],
                example: -1
            }
        }
    }
};