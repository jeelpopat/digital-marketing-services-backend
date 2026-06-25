// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const Contact = require('./models/Contact');
// const Service = require('./models/Service');

// const app = express();

// // Middleware
// app.use(cors()); // Allows your React frontend to communicate with this backend
// app.use(express.json()); // Parses incoming JSON requests

// // Connect to MongoDB

// // Validate Mongo config (do not crash app)
// if (!process.env.MONGO_URI || typeof process.env.MONGO_URI !== 'string') {
//   console.error('MONGO_URI is missing/invalid. Backend will run but database writes will fail.');
// }

// // Track DB connectivity for nicer API errors
// let isMongoConnected = false;

// if (process.env.MONGO_URI && typeof process.env.MONGO_URI === 'string') {
//   mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('Connected to DB'))
//   .catch(err => console.error(err));
// }


// // --- API ROUTES ---

// // 1. Contact Form API
// app.post('/api/contact', async (req, res) => {
//   try {
//     const newContact = new Contact(req.body);
//     await newContact.save();
//     res.status(201).json({ message: "Form submitted successfully!" });
//   } catch (error) {
//     res.status(500).json({ message: "An error occurred." });
//   }
// });

// // 2. Service "Get Started" API
// // In server.js
// app.post('/api/service', async (req, res) => {
//   try {
//     const { name, email, serviceRequested, details } = req.body;
    
//     // Check if required data exists
//     if (!name || !email || !serviceRequested) {
//         return res.status(400).json({ message: "Missing required fields" });
//     }

//     const newService = new Service({ name, email, serviceRequested, details });
//     await newService.save();
//     res.status(201).json({ success: true, message: "Service request submitted!" });
//   } catch (error) {
//     console.error("Backend Error:", error); // <-- THIS IS KEY
//     res.status(400).json({ message: "An error occurred.", error: error.message });
//   }
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(5000, () => console.log("Server running on port 5000"));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Contact = require('./models/Contact');
const Service = require('./models/Service');

const app = express();

// 1. Update CORS to allow requests from your live frontend AND local frontend
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://digital-marketing-services.onrender.com'
  ]
}));
app.use(express.json());

// 2. Dynamically connect to the Database
// If MONGO_URI exists (like on Render), it uses that. Otherwise, it uses your local DB.
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/digital_marketing_db';

mongoose.connect(dbURI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));


// --- API ROUTES ---

app.post('/api/contact', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({ message: "An error occurred." });
  }
});

app.post('/api/service', async (req, res) => {
  try {
    const { name, email, serviceRequested, details } = req.body;
    
    if (!name || !email || !serviceRequested) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const newService = new Service({ name, email, serviceRequested, details });
    await newService.save();
    res.status(201).json({ success: true, message: "Service request submitted!" });
  } catch (error) {
    console.error("Service Error:", error);
    res.status(400).json({ message: "An error occurred.", error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));