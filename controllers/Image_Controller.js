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
    getImage(req, res) {
        try {
            const imagePath = req.query.path;
            if (!imagePath) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing query parameter: path'
                });
            }

            // Sanitize and validate path to prevent directory traversal
            const sanitizedPath = path.normalize(imagePath).replace(/^(\.\.(\/|\\|$))+/, '');

            // Get full path to image
            const fullPath = ImageModel.getImagePath(sanitizedPath);

            if (!fullPath) {
                return res.status(404).json({
                    success: false,
                    message: 'Image not found'
                });
            }

            // Send the image
            return res.sendFile(fullPath);
        } catch (error) {
            console.error('Error retrieving image:', error);
            return res.status(500).json({
                success: false,
                message: 'Error retrieving image'
            });
        }
    }

    /**
     * List all images in a directory
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     */
    listImages(req, res) {
        try {
            const dirPath = req.query.directory || '';

            // Sanitize and validate path to prevent directory traversal
            const sanitizedDir = path.normalize(dirPath).replace(/^(\.\.(\/|\\|$))+/, '');

            const images = ImageModel.listImages(sanitizedDir);

            return res.status(200).json({
                success: true,
                directory: sanitizedDir,
                count: images.length,
                images
            });
        } catch (error) {
            console.error('Error listing images:', error);
            return res.status(500).json({
                success: false,
                message: 'Error listing images'
            });
        }
    }
}

module.exports = new ImageController();