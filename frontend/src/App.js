import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import CSS file for styling

function App() {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading indicator

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setOutput('');  // Clear output and error when file is changed
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('code', file); // Add file to form data

    setLoading(true);  // Start loading
    setError('');  // Reset error message
    setOutput('');  // Reset output

    try {
      // Make the POST request to your backend (running on localhost:5000)
      const response = await axios.post('https://cpp-editor-mcb7.onrender.com/compile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Handle the response data from the backend (which is the JDoodle output)
      if (response.data.output) {
        setOutput(response.data.output);
      } else {
        setError('No output received from the server.');
      }
    } catch (err) {
      console.error("Error occurred during API call:", err); // Log error
      setError(err.response?.data?.error || 'Error occurred during file execution.');
    } finally {
      setLoading(false);  // Stop loading once the request completes
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Online C/C++ Compiler</h1>
      <form className="compiler-form" onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".c,.cpp"  // Only accept C and C++ files
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
