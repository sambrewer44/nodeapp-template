const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI; // Access MongoDB URI from environment variables

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB with authentication
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware to serve static files (CSS, JS, images)
app.use(express.static('public', { strict: false }));

// Define schema and model for MongoDB collection
const DataSchema = new mongoose.Schema({
  name: String,
  email: String
});

const DataModel = mongoose.model('Data', DataSchema);

// Route to handle form submission
app.post('/submit', async (req, res) => {
  try {
    const { name, email } = req.body; // Extract name and email from req.body
    const newData = new DataModel({ name, email }); // Create a new document with name and email
    await newData.save(); // Save the new document to MongoDB
    res.redirect('/'); // Redirect to the homepage
  } catch (err) {
    console.error('Error saving data to MongoDB:', err);
    res.status(500).json({ error: 'Internal Server Error' }); // Send internal server error response
  }
});

// Route to serve HTML file as homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); // Path to your HTML file
});

// Route to serve HTML file for wizexercise
app.get('/page_name', (req, res) => {
  res.sendFile(__dirname + '/public/replace_with_your_second_page_name.html'); // Path to your documentation HTML file
});

// Route to serve CSS file
app.get('/styles.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(__dirname + '/public/styles.css'); // Path to your CSS file
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
