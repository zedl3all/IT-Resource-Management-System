module.exports = {
    '/images': {
        get: {
            tags: ['Images'],
            summary: 'Get an image by its path',
            description: 'ดึงไฟล์รูปภาพตาม path ที่ระบุ',
            parameters: [
                {
                    name: 'path',
                    in: 'query',
                    required: true,
                    schema: { type: 'string' },
                    example: 'maintenance/maintenance-1234567890.jpg',
                    description: 'The path to the image from the Images directory'
                }
            ],
            responses: {
                200: {
                    description: 'Image file',
                    content: {
                        'image/jpeg': {},
                        'image/png': {},
                        'image/gif': {}
                    }
                },
                400: {
                    description: 'Missing query parameter: path',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Missing query parameter: path' }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'Image not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Image not found' }
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
    '/images/list': {
        get: {
            tags: ['Images'],
            summary: 'List all images in a directory',
            description: 'แสดงรายการไฟล์รูปภาพทั้งหมดในไดเรกทอรีที่ระบุ',
            parameters: [
                {
                    name: 'directory',
                    in: 'query',
                    required: false,
                    schema: { type: 'string' },
                    example: 'maintenance',
                    description: 'The directory path within the Images folder (optional)'
                }
            ],
            responses: {
                200: {
                    description: 'List of images',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    images: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        example: [
                                            'maintenance-1234567890.jpg',
                                            'maintenance-9876543210.png'
                                        ]
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