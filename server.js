const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const allowedOrigins = ["http://localhost:5173", "https://myapp.com"];

require('dotenv').config();
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
// Include route files
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const problemRoute = require('./routes/problem');

// Use routes
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);
app.use('/api/problem', problemRoute)

app.get('/', (req, res) => {
    res.send('<h1>Hello, Express.js Server!</h1>');
});

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});