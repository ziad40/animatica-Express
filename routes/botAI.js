const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {showHint, askAnyThing} = require("../controllers/botController");
const router = express.Router();

router.use(authMiddleware); // Apply the middleware to all routes in this router

// Define a route`
router.post('/hint', showHint);
router.post('/ask', askAnyThing);
router.post('/generateAudio', showHint);

module.exports = router;