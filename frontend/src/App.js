import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import CSS file for styling

function App() {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New: Loading indicator

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setOutput('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('code', file);

    setLoading(true); // Start loading
    setError('');
    setOutput('');
    //const host= '13.60.94.122';
    const URL= process.env.BACKEND_URL;
    console.log('File uploaded:', file);
console.log('Form submitted:', e);
console.log('Response received:', response);
console.log('Error occurred:', err);;
    console.log(URL,"hiii");
    try {
      const response = await axios.post(
        "https://cpp-editor-mcb7.onrender.com/compile", // Ensure this matches your backend endpoint
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      /*const response = await axios.post('http://host.docker.internal:5000/compile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });*/
      
      //console.log("hiiiiiiii")
      if (response.data.output) {
        setOutput(response.data.output);
      } else {
        setError('No output received from server.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error occurred during file execution.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Online C/C++ Compiler</h1>
      <form className="compiler-form" onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".c,.cpp"
          onChange={handleFileChange}
          required
          className="file-input"
        />
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Running...' : 'Upload and Run'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {output && (
        <div className="output-section">
          <h2>Output</h2>
          <pre className="output-box">{output}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
