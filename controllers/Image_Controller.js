const path = require('path');
const ImageModel = require('../models/Image_Model');

class ImageController {
    async getImage(req, res) {
        try {
            const imagePath = req.query.path;
            if (!imagePath) {
                return res.status(400).json({ success: false, message: 'Missing query parameter: path' });
            }

            // ตรวจสอบว่าเป็น URL เต็มหรือไม่
            if (imagePath.startsWith('http')) {
                // ถ้าใช่ให้ redirect ไปยัง URL นั้น
                return res.redirect(imagePath);
            }

            // Sanitize path
            const sanitizedPath = path.normalize(imagePath)
                .replace(/^(\.\.(\/|\\|$))+/, '')
                .replace(/^[/\\]+/, '');

            const exists = await ImageModel.imageExists(sanitizedPath);
            if (!exists) {
                return res.status(404).json({ success: false, message: 'Image not found' });
            }

            const obj = await ImageModel.getImageObject(sanitizedPath);
            
            // ถ้าเป็นประเภท redirect
            if (obj.type === 'redirect') {
                return res.redirect(obj.url);
            }
            
            // ถ้าเป็นไฟล์ปกติ
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

            // เพิ่ม prefix สำหรับ S3
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