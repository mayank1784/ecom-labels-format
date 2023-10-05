import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function FileUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [uploadedPdfName, setUploadedPdfName] = useState('');
  
  // Replace 'yourSessionToken' with the actual session token
  const sessionToken = Cookies.get('sessionToken');

  const handleFileChange = (event) => {
    const files = event.target.files;
  console.log('Selected files:', files);

  // Update the selectedFiles state
  setSelectedFiles(files);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('pdfFiles', selectedFiles[i]);
    }

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          'Content-Type': 'multipart/form-data', // Set the correct content type
        },
      });
      setMessage(response.data.message);
      setUploadedPdfName(response.data.pdfName);
    //   console.log('uploaded pdfs: ', response.data.pdf)
    } catch (error) {
      // Handle the error response from the server
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || 'Upload failed. Please try again.');
      } else {
        setMessage('Upload failed. Please try again.');
      }
      console.error('Upload failed:', error);
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
      {uploadedPdfName && <h4>{uploadedPdfName}</h4>}
    </div>
  );
}

export default FileUpload;
