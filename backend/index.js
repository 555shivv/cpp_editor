const express = require('express');
const multer = require('multer');
const cors = require('cors');
const compilex = require('compilex');
const os = require('os');

const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Initialize Compilex
compilex.init({
  stats: true,
  options: { timeout: 10000 }, // Add timeout for compilation
});

// Detect OS Type
const isWindows = os.platform() === 'win32';
console.log(`Server running on ${isWindows ? 'Windows' : 'Linux'}`);

// Configure Multer for in-memory file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Route to handle file upload and compilation
app.post('/compile', upload.single('code'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const code = req.file.buffer.toString('utf-8'); // Convert buffer to string

  // Environment data for Compilex
  const envData = isWindows
    ? { OS: 'windows', cmd: 'g++', options: { timeout: 10000 } }
    : { OS: 'linux', cmd: 'g++', options: { timeout: 10000 } };

  compilex.compileCPP(envData, code, (data) => {
    if (data.error) {
      console.error('Compilation Error:', data.error);
      return res.status(500).json({ error: `Compilation Error: ${data.error}` });
    }
    return res.json({ output: data.output });
  });
});

// Start the server
const PORT = 5000;
const hostname= '0.0.0.0';
app.listen( PORT, hostname, () => {
  console.log(`Server running on http://${hostname}:${PORT}`);
});
