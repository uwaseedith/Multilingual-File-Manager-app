const fileController = require('../controllers/filecontroller');
const isAuthenticated = require('../middleware/authmiddleware');

app.post('/files', filecontroller.createFile);
app.get('/files/:filename', filecontroller.readFile);
app.put('/files', filecontroller.updateFile);
app.delete('/files/:filename', filecontroller.deleteFile);

// Fetch file list
router.get('/list', isAuthenticated, filecontroller.getFileList);

module.exports = router;