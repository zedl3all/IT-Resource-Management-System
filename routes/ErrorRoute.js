const express = require('express');
const router = express.Router();
const ErrorController = require('../controllers/Error_Controller');

// 401 Error Page
router.get('/401', ErrorController.unauthorized); //?use

// 403 Error Page
router.get('/403', ErrorController.forbidden); //?use

// 404 Error Page
router.get('/404', ErrorController.notFound); //?use

// 500 Error Page
router.get('/500', ErrorController.serverError); //?use

module.exports = router;