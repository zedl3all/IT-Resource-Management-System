module.exports = {
    ImageQuery: {
        type: 'object',
        required: ['path'],
        properties: {
            path: {
                type: 'string',
                example: 'maintenance/maintenance-1234567890.jpg',
                description: 'Path to the image from the Images directory'
            }
        }
    },
    ImageListQuery: {
        type: 'object',
        properties: {
            directory: {
                type: 'string',
                example: 'maintenance',
                description: 'The directory path within the Images folder (optional)'
            }
        }
    }
};