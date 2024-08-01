const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const fileController = require('../controllers/fileController');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../files'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
  res.json({ success: true, message: 'File uploaded successfully!' });
});

// Route to get list of files
router.get('/', (req, res) => {
  const directoryPath = path.join(__dirname, '../files');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Unable to scan files:', err);
      return res.status(500).json({ success: false, message: 'Unable to scan files' });
    }
    const fileInfos = files.map(file => ({
      filename: file,
      url: `/files/${file}` 
    }));
    res.status(200).json(fileInfos);
  });
});

// Fetch uploaded files
router.get('/uploaded', fileController.getUploadedFiles);

module.exports = router;
