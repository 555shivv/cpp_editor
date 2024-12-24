const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const compilex = require('compilex');

const app = express();
//app.use(cors()); // Add this line to enable CORS
app.use(express.json());
app.use(cors({ origin: 'https://helpful-dusk-1267f0.netlify.app/' }));


// Compilex initialization

compilex.init({
    stats: true,
    options: {timeout: 5000},
});

// Multer configuration for file uploads
const upload = multer({ dest: 'temp/' });

app.post('/compile', upload.single('code'), (req, res) => {
    const filePath = req.file.path;
    if(!req.file){
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const envData = { OS: 'windows', cmd: 'g++',options: {timeout: 5000} };

    fs.readFile(filePath, 'utf8', (err, code) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Error reading file.');
            return;
        }

        compilex.compileCPP(envData, code, (data) => {
            if (data.error) {
                res.status(500).send(`Compilation Error: ${data.error}`);
            } else {
                res.send({ output: data.output });
            }
        });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
