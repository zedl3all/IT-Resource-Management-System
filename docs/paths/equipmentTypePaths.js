module.exports = {
    '/equipment-types': {
        get: {
            tags: ['Equipment Types'],
            summary: 'Get all equipment types',
            description: 'ดึงข้อมูลประเภทอุปกรณ์ทั้งหมด',
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/EquipmentType' }
                            }
                        }
                    }
                },
                500: {
                    description: 'Database error'
                }
            }
        }
    }
};