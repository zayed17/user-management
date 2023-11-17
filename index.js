// Import necessary libraries
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const nocache = require('nocache');

// Define the MongoDB connection URL
const dbUrl = 'mongodb://127.0.0.1:27017/users';

// Connect to MongoDB with the specified options
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Use the 'nocache' middleware to prevent caching
app.use(nocache());

// Listen for the 'connected' event when MongoDB connection is established
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Listen for the 'error' event in case of MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/asset', express.static(path.join(__dirname, 'public/asset')));

// User_Routes
const userRoute = require("./routes/userroute");
app.use('/',userRoute);
 
// Admin_Routes
const adminRoute = require("./routes/adminroute");
app.use('/admin',adminRoute);
 


// Start the server and listen on port 3001
app.listen(3001, () => {
  console.log('Server is running at http://localhost:3001');
});
