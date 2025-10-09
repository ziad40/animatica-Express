
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getQuestion } = require('../controllers/problemController');
const router = express.Router();

router.use(authMiddleware); // Apply the middleware to all routes in this router

// Define a route`
router.get('/', getQuestion);


module.exports = router;