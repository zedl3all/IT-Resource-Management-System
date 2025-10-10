const path = require('path');
const ImageModel = require('../models/Image_Model');

class ImageController {
    async getImage(req, res) {
        try {
            const imagePath = req.query.path;
            if (!imagePath) {
                return res.status(400).json({ success: false, message: 'Missing query parameter: path' });
            }

            // ถ้า path เป็น URL เต็มของ S3 ให้ redirect ไปที่ URL นั้น
            if (imagePath.startsWith('https://') || imagePath.startsWith('http://')) {
                return res.redirect(imagePath);
            }

            // sanitize path
            const sanitizedPath = path.normalize(imagePath)
                .replace(/^(\.\.(\/|\\|$))+/, '')
                .replace(/^[/\\]+/, '');

            // เพิ่ม prefix image/ ถ้ายังไม่มี
            const finalPath = sanitizedPath.startsWith('image/') ? sanitizedPath : `image/${sanitizedPath}`;

            const exists = await ImageModel.imageExists(finalPath);
            if (!exists) {
                return res.status(404).json({ success: false, message: 'Image not found' });
            }

            const obj = await ImageModel.getImageObject(finalPath);
            if (obj.ContentType) res.set('Content-Type', obj.ContentType);
            
            obj.Body.pipe(res);
        } catch (error) {
            console.error('Error retrieving image:', error);
            return res.status(500).json({ success: false, message: 'Error retrieving image' });
        }
    }

    async listImages(req, res) {
        try {
            const dirPath = req.query.directory || '';
            const sanitizedDir = path.normalize(dirPath)
                .replace(/^(\.\.(\/|\\|$))+/, '')
                .replace(/^[/\\]+/, '');

            // เพิ่ม prefix image/
            const prefix = sanitizedDir ? `image/${sanitizedDir}/` : 'image/';
            
            const images = await ImageModel.listImages(prefix);
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