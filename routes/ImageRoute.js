const express = require('express');
const router = express.Router();
const ImageController = require('../controllers/Image_Controller');

/**
 * @route   GET /api/images
 * @desc    Get an image by its path
 * @access  Public
 * @query   path - The path to the image from the Images directory
 * @example /api/images?path=maintenance/1.jpg
 */
router.get('/', ImageController.getImage); //?use

/**
 * @route   GET /api/images/list
 * @desc    List all images in a directory
 * @access  Public
 * @query   directory - The directory path within the Images folder (optional)
 * @example /api/images/list?directory=maintenance
 */
router.get('/list', ImageController.listImages); //!unuse

module.exports = router;
