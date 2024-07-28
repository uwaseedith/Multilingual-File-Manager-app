const express = require('express');
const fileController = require('../controllers/fileController');
const isAuthenticated = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:filename', fileController.readFile);
router.put('/update', fileController.updateFile);
router.delete('/:filename', fileController.deleteFile);
router.get('/list', isAuthenticated, fileController.getFileList);

router.get('/uploaded', fileController.getUploadedFiles);

module.exports = router;