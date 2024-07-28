const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const i18next = require('./config/i18n');
const i18nextMiddleware = require('i18next-http-middleware');
const userController = require('./controllers/userController');
const fileController = require('./controllers/fileController');
const uploadRoutes = require('./Routes/uploadRoutes');
const session = require('express-session');
const passport = require('./config/passport');
const fileRoutes = require('./Routes/fileRoutes'); 
require('dotenv').config();

const app = express();
app.use(i18nextMiddleware.handle(i18next));
app.use('/locales', express.static(path.join(__dirname, 'locales')));

app.use(session({
  secret: process.env.SECRET_KEY, 
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '/files')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/files', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'files.html'));
});

app.get('/files/uploaded', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'files.html'))
})

// route to get the list of files
app.get('/api/list', fileController.getFileList);
app.get('/api/uploaded', fileController.getUploadedFiles);

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/logout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use('/files', uploadRoutes);
app.use('/api', fileRoutes);


app.post('/register', userController.register);
app.post('/login', userController.login);

app.post('/file', fileController.uploadFile);
app.get('/files/:filename', fileController.readFile);
app.put('/files/:filename', fileController.updateFile);
app.delete('/files/:filename', fileController.deleteFile);

app.get('/translate', (req, res) => {
  res.send(req.t('welcome_message'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = app;
