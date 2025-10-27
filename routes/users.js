// routes/users.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware); // Apply the middleware to all routes in this router
// Define a route
router.get('/', (req, res) => {
    res.send(`this is user route ${req.user.id}`);// this gets executed when user visit http://localhost:3000/user
});

router.get('/101', (req, res) => {
    res.send('this is user 101 route');// this gets executed when user visit http://localhost:3000/user/101
});

router.get('/102', (req, res) => {
    res.send('this is user 102 route');// this gets executed when user visit http://localhost:3000/user/102
});

// export the router module so that server.js file can use it
module.exports = router;