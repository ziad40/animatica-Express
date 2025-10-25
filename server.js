const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
// Whitelist for production. In development we'll allow the LAN origins so mobile devices
// on the same network can access the API. Keep production strict.
const allowedOrigins = ["http://localhost:5173", "https://myapp.com"];

require('dotenv').config();
const app = express();
app.use(express.json());

// Allow CORS differently depending on environment:
// - production: restrict to allowedOrigins
// - development: allow any origin coming from the LAN (so mobile/dev can connect)
if (process.env.NODE_ENV === 'PRO') {
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    })
  );
} else {
  // Development: reflect the request origin (allows mobile devices on same network).
  // This sets Access-Control-Allow-Origin to the request Origin.
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

// Use routes
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);
app.use('/api/problem', problemRoute)

app.get('/', (req, res) => {
    res.send('<h1>Hello, Express.js Server!</h1>');
});

connectDB();

const PORT = process.env.PORT || 3000;
// Bind to 0.0.0.0 so the server accepts requests from other devices on the LAN.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running and listening on 0.0.0.0:${PORT}`);
  console.log('On your mobile device use http://<your-pc-local-ip>:' + PORT);
});