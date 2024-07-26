const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const fileQueue = require('../config/queue');

// Create a new file
exports.createFile = (req, res) => {
  const { filename, content } = req.body;
  const filePath = path.join(__dirname, 'files', filename);

  fs.writeFile(filePath, content, (err) => {
    if (err) throw err;

    db.query('INSERT INTO files (filename, path) VALUES (?, ?)', [filename, filePath], (err, result) => {
      if (err) throw err;
      res.send('File created successfully');
    });
  });
};

// Read a file
exports.readFile = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'files', filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    res.send(data);
  });
};

// Update a file
exports.updateFile = (req, res) => {
  const { filename, content } = req.body;
  const filePath = path.join(__dirname, 'files', filename);

  fs.writeFile(filePath, content, (err) => {
    if (err) throw err;
    res.send('File updated successfully');
  });
};

// Delete a file
exports.deleteFile = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'files', filename);

  fs.unlink(filePath, (err) => {
    if (err) throw err;

    db.query('DELETE FROM files WHERE filename = ?', [filename], (err, result) => {
      if (err) throw err;
      res.send('File deleted successfully');
    });
  });
};

// Fetch file list
exports.getFileList = (req, res) => {
    const directoryPath = path.join(__dirname, 'files');
  
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return res.status(500).send('Server error while fetching file list');
      }
  
      const fileDetails = files.map(filename => {
        const filePath = path.join(directoryPath, filename);
        return { filename, path: filePath };
      });
  
      res.json(fileDetails);
    });
  };