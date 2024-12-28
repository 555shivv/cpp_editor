import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import CSS file for styling

function App() {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please upload a file.');
      return;
    }
    setError('');
    const formData = new FormData();
    formData.append('code', file);

    try {
      const response = await axios.post('http://localhost:5000/compile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      /*const response = await axios.post('https://cpp-editor-mcb7.onrender.com/compile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        });*/

      if (response.data.output) {
        setOutput(response.data.output);
      } else {
        setError('No output received.');
      }
    } catch (err) {
      setOutput('');
      setError(err.response?.data?.error || 'Error occurred during file execution.');
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
        <button type="submit" className="submit-button">
          Upload and Run
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
