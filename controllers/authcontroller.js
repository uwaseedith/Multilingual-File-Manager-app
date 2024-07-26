const bcrypt = require('bcrypt');
const db = require('../config/db');

// User registration
exports.register = (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
    if (err) throw err;
    res.send('User registered successfully');
  });
};

// User login
exports.login = (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) throw err;

    if (results.length > 0 && bcrypt.compareSync(password, results[0].password)) {
      res.send('Login successful');
    } else {
      res.send('Invalid username or password');
    }
  });
};