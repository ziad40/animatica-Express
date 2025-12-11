const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const cors = require('cors');

require('dotenv').config();
const app = express();
app.use(express.json());

// Allow CORS differently depending on environment:
// - production: restrict to allowedOrigins
// - development: allow any origin coming from the LAN (so mobile/dev can connect)
if (process.env.NODE_ENV !== 'PRO') {
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
}

// Include route files
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const problemRoute = require('./routes/problem');
const botRoute = require('./routes/botAI');
const studentHistoryRoute = require('./routes/student')
const teacherRoute = require('./routes/teacher')


// Use routes
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);
app.use('/api/problem', problemRoute)
app.use('/api/bot', botRoute);
app.use('/api/students', studentHistoryRoute);
app.use('/api/teacher/students', teacherRoute);

app.use(express.static(path.join(__dirname, 'client', 'dist')));
app.get(/.*/, (req, res) =>
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
);

connectDB();

const PORT = process.env.PORT || 3000;
// Bind to 0.0.0.0 so the server accepts requests from other devices on the LAN.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running and listening on 0.0.0.0:${PORT}`);
  console.log('On your mobile device use http://<your-pc-local-ip>:' + PORT);
});