const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const compilex = require('compilex');

const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Initialize Compilex
compilex.init({
  stats: true,
  options: { timeout: 10000 }, // Add timeout for compilation
});

// Configure Multer to store files in memory (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle file upload and compilation
app.post('/compile', upload.single('code'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const code = req.file.buffer.toString('utf8');  // Get the file content as string

  const envData = { OS: 'windows', cmd: 'g++', options: { timeout: 10000 } };

  compilex.compileCPP(envData, code, (data) => {
    if (data.error) {
      console.error('Compilation Error:', data.error);
      return res.status(500).send({ error: `Compilation Error: ${data.error}` });
    }
    return res.json({ output: data.output });
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
