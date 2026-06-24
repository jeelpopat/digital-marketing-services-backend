const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Contact = require('./models/Contact');
const Service = require('./models/Service');

const app = express();

// Middleware
app.use(cors()); // Allows your React frontend to communicate with this backend
app.use(express.json()); // Parses incoming JSON requests

// Connect to MongoDB

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- API ROUTES ---

// 1. Contact Form API
app.post('/api/contact', async (req, res) => {
  try {
    const { fullName, email, companyName, message } = req.body;
    const newContact = new Contact({ fullName, email, companyName, message });
    await newContact.save();
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// 2. Service "Get Started" API
app.post('/api/service', async (req, res) => {
  try {
    const { name, email, serviceRequested, details } = req.body;
    const newService = new Service({ name, email, serviceRequested, details });
    await newService.save();
    res.status(201).json({ success: true, message: 'Service request submitted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));