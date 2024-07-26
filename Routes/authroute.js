const userController = require('./controllers/authcontroller');

app.post('/register', authcontroller.register);
app.post('/login', authcontroller.login);