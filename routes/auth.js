const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Render halaman register
router.get('/register', (req, res) => {
  res.render('register');
});

// Proses register user
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  
  db.query(query, [username, email, hashedPassword], (err, result) => {
    if (err) throw err;
    res.redirect('/auth/login');
  });
});

// Render halaman login
router.get('/login', (req, res) => {
  res.render('login', { video: '<video autoplay muted loop id="background-video"><source src="video-indonesia.mp4" type="video/mp4"></video>' });
});

// Proses login user
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ?";

  // Query ke database untuk menemukan user berdasarkan username
  db.query(query, [username], (err, result) => {
    if (err) throw err;
    
    if (result.length > 0) {
      const user = result[0];

      // Cek apakah password sesuai dengan hash yang ada di database
      if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user; // Set sesi user
        res.redirect('/auth/profile'); // Redirect ke profil jika login berhasil
      } else {
        res.send('Incorrect password');
      }
    } else {
      res.send('User not found');
    }
  });
});

// Render halaman profil user
router.get('/profile', (req, res) => {
  if (req.session.user) {
    res.render('profile', { user: req.session.user });
  } else {
    res.redirect('/auth/login');
  }
});

// Proses logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});

// render halaman index
router.get('/index', (req, res) => {
  res.render('index');
})

// render halaman data
router.get('/data', (req, res) => {
  res.render('data');
})



module.exports = router;

