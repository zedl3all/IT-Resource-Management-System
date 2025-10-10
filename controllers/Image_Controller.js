const path = require('path');
const ImageModel = require('../models/Image_Model');

/**
 * Controller for handling image-related operations
 */
class ImageController {
    /**
     * Get an image by its path
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     */
    async getImage(req, res) {
        try {
            const imagePath = req.query.path;
            if (!imagePath) {
                return res.status(400).json({ success: false, message: 'Missing query parameter: path' });
            }

            // sanitize
            const sanitizedPath = path.normalize(imagePath).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');

            // check and stream
            const exists = await ImageModel.imageExists(sanitizedPath);
            if (!exists) {
                return res.status(404).json({ success: false, message: 'Image not found' });
            }

            const obj = await ImageModel.getImageObject(sanitizedPath);
            // ContentType may exist in metadata
            if (obj.ContentType) res.set('Content-Type', obj.ContentType);

            // stream body
            obj.Body.pipe(res);
        } catch (error) {
            console.error('Error retrieving image:', error);
            return res.status(500).json({ success: false, message: 'Error retrieving image' });
        }
    }

    /**
     * List all images in a directory
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     */
    async listImages(req, res) {
        try {
            const dirPath = req.query.directory || '';
            const sanitizedDir = path.normalize(dirPath).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');

            const images = await ImageModel.listImages(sanitizedDir ? `${sanitizedDir}/` : '');
            return res.status(200).json({
                success: true,
                directory: sanitizedDir,
                count: images.length,
                images
            });
        } catch (error) {
            console.error('Error listing images:', error);
            return res.status(500).json({ success: false, message: 'Error listing images' });
        }
    }
}

module.exports = new ImageController();