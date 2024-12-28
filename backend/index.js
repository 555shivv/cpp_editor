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

// Configure Multer for file uploads
const upload = multer({ dest: 'temp/' });

// Route to handle file upload and compilation
app.post('/compile', upload.single('code'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = req.file.path;

  fs.readFile(filePath, 'utf8', (err, code) => {
    if (err) {
      console.error('Error reading file:', err);
      fs.unlinkSync(filePath); // Delete file to clean up
      return res.status(500).send('Error reading file.');
    }

    const envData = { OS: 'windows', cmd: 'g++', options: { timeout: 10000 } };

    compilex.compileCPP(envData, code, (data) => {
      fs.unlinkSync(filePath); // Cleanup the temporary file
      if (data.error) {
        console.error('Compilation Error:', data.error);
        return res.status(500).send({ error: `Compilation Error: ${data.error}` });
      }
      return res.json({ output: data.output });
    });
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
