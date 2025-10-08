// routes/users.js
const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// Define a route
router.post('/register', register);
router.post('/login', login);

// export the router module so that server.js file can use it
module.exports = router;