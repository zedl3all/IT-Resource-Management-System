const fs = require('fs');
const path = require('path');

class ImageModel {
    constructor() {
        // Base directory for all images
        this.baseDir = path.join(__dirname, '..', 'Images');
    }

    /**
     * Check if an image exists at the specified path
     * @param {string} imagePath - Relative path to the image from Images directory
     * @returns {boolean} - Whether the image exists
     */
    imageExists(imagePath) {
        const fullPath = path.join(this.baseDir, imagePath);
        try {
            const stat = fs.statSync(fullPath);
            return stat.isFile();
        } catch {
            return false;
        }
    }

    /**
     * Get the full path to an image
     * @param {string} imagePath - Relative path to the image from Images directory
     * @returns {string|null} - Full path to the image or null if not found
     */
    getImagePath(imagePath) {
        const fullPath = path.join(this.baseDir, imagePath);
        return this.imageExists(imagePath) ? fullPath : null;
    }

    /**
     * List all images in a directory
     * @param {string} dirPath - Relative directory path from Images directory
     * @returns {Array} - Array of image paths in the directory
     */
    listImages(dirPath = '') {
        const fullPath = path.join(this.baseDir, dirPath);
        try {
            if (!fs.existsSync(fullPath)) return [];
            const files = fs.readdirSync(fullPath, { withFileTypes: true });
            const exts = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i;
            return files
                .filter(d => d.isFile() && exts.test(d.name))
                .map(d => path.join(dirPath, d.name).replace(/\\/g, '/'));
        } catch (error) {
            console.error('Error listing images:', error);
            return [];
        }
    }
}

module.exports = new ImageModel();