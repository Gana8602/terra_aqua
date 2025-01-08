const express = require('express');
const { connectDB } = require('./db');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require('./router/router');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all domains


// Connect to the database
connectDB();

// Use the user routes
app.use('/api', userRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://192.168.0.105:${PORT}`);
});