const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const app = express();
app.use(express.json());

// Include route files
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');

// Use routes
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);

app.get('/', (req, res) => {
    res.send('<h1>Hello, Express.js Server!</h1>');
});

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});