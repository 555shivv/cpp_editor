const express = require("express");
const fileUpload = require("express-fileupload");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const cors= require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(fileUpload());

// Endpoint to upload and compile C++ files
app.post("/compile", async (req, res) => {
  if (!req.files || !req.files.code) {
    return res.status(400).send("No file uploaded.");
  }

  const codeFile = req.files.code;

  // Save the uploaded file
  const uploadPath = path.join(__dirname, "uploads", codeFile.name);
  const outputPath = path.join(__dirname, "outputs", "output");

  try {
    // Ensure directories exist
    fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Save file to disk
    await codeFile.mv(uploadPath);

    // Compile the C++ file
    const compileCommand = `g++ "${uploadPath}" -o "${outputPath}"`;
    exec(compileCommand, (compileErr, stdout, stderr) => {
      if (compileErr) {
        return res.status(500).json({ error: "Compilation error", details: stderr });
      }

      // Execute the compiled file
      exec(outputPath, (execErr, execStdout, execStderr) => {
        if (execErr) {
          return res.status(500).json({ error: "Execution error", details: execStderr });
        }

        res.json({ output: execStdout });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while processing your file.");
  } finally {
    // Clean up uploaded and output files (optional)
    setTimeout(() => {
      fs.unlink(uploadPath, () => {});
      fs.unlink(outputPath, () => {});
    }, 5000);
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/*const express = require('express');
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
});*/
