//Image upload 
// Project
    // |-backend
    //     |-imageserver.js
    //     |-upload folder
    // |- public
    // |- src
    //     |-app.js

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB URI
const mongoURI = 'mongodb://127.0.0.1:27017/imagedata'; // Replace with your actual MongoDB URI


// Create MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for storing images
const imageSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  filePath: String, // Path to the file stored in the 'uploads' folder
});

// Create a model
const Image = mongoose.model('Image', imageSchema);

// Configure multer to store files in the 'uploads' directory inside backend
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads')); // Save to the 'uploads' directory within backend
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Rename the file with a timestamp
  },
});

const upload = multer({ storage });

// Serve static files from the 'uploads' directory within backend
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// @route POST /upload
// @desc Upload image to 'uploads' folder
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { filename, mimetype } = req.file;
    const filePath = `uploads/${filename}`; // Construct the file path

    const newImage = new Image({
      filename,
      contentType: mimetype,
      filePath, // Save relative path to image
    });

    await newImage.save();
    res.json({ message: 'Image uploaded successfully', image: newImage });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload image', details: err.message });
  }
});

// @route GET /images
// @desc Fetch all images
app.get('/images', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch images', details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
