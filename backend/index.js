const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios'); // Import axios for making HTTP requests
const os = require('os');

const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// JDoodle API credentials
const clientID = "2b0787407c38d1cee104a2f799e7450c";
const clientSecret = 'fab1272fddd3a7ac26f7a13155f5f1e3c21e3852094ebc749914de189e7cac86';

// Configure Multer for in-memory file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Route to handle file upload and JDoodle API call
app.post('/compile', upload.single('code'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const code = req.file.buffer.toString('utf-8'); // Convert buffer to string

  // Prepare the payload for JDoodle API
  const payload = {
    script: code,
    language: 'cpp', // or 'c' depending on the file you upload
    clientId: clientID,
    clientSecret: clientSecret,
  };

  try {
    // Call the JDoodle API
    const response = await axios.post('https://api.jdoodle.com/v1/execute', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Return the output from JDoodle
    if (response.data.output) {
      return res.json({ output: response.data.output });
    } else {
      return res.status(500).json({ error: 'No output received from JDoodle API' });
    }
  } catch (err) {
    console.error('Error occurred during JDoodle API call:', err);
    return res.status(500).json({ error: 'Error occurred during file execution.' });
  }
});

// Start the server
const PORT = 5000;
const hostname = '0.0.0.0';
app.listen(PORT, hostname, () => {
  console.log(`Server running on http://${hostname}:${PORT}`);
});
