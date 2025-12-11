
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { studentAnalysis, studentQuestionAnalysis } = require('../controllers/studentController');
const router = express.Router();

router.use(authMiddleware); // Apply the middleware to all routes in this router

// Define a route
router.get('/:username', studentAnalysis);
router.get('/:username/:questionId', studentQuestionAnalysis);



module.exports = router;