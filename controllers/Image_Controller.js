const path = require('path');
const fs = require('fs');
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
            // Get image path from query parameter
            const imagePath = req.query.path;
            
            if (!imagePath) {
                return res.status(400).json({
                    success: false,
                    message: 'Image path is required'
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
            // Get directory path from query parameter (optional)
            const dirPath = req.query.directory || '';
            
            // Sanitize and validate path to prevent directory traversal
            const sanitizedPath = path.normalize(dirPath).replace(/^(\.\.(\/|\\|$))+/, '');
            
            // Get list of images in the directory
            const images = ImageModel.listImages(sanitizedPath);
            
            return res.status(200).json({
                success: true,
                data: images,
                count: images.length
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