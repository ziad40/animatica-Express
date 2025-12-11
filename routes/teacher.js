
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { studentAnalysis, studentQuestionAnalysis } = require('../controllers/studentController');
const { getAllStudents, getAllStudentsStatistics } = require('../controllers/teacherController');
const router = express.Router();

router.use(authMiddleware); // Apply the middleware to all routes in this router

// Define a route
router.get('/statistics', getAllStudentsStatistics);
router.get('/', getAllStudents);
router.get('/:username/:questionId', studentQuestionAnalysis);
router.get('/:username', studentAnalysis);




module.exports = router;