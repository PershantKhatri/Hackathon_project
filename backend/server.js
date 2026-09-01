const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const serverless = require('serverless-http');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// CORS Configuration
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Root route taake browser mein page ghoome nahi balkay message aaye
app.get('/', (req, res) => {
  res.send('Backend API is live and running!');
});

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;

// Local development ke liye
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Vercel serverless ke liye export karein
module.exports = serverless(app);