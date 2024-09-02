//Image upload 
// Project
    // |-backend
    //     |-imageserver.js
    //     |-upload folder
    // |- public
    // |- src
    //     |-app.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState('Choose File');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showImages, setShowImages] = useState(false);

  // Fetch images when the component mounts
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get('http://localhost:5000/images'); // Fetch image metadata from the backend
        setUploadedImages(res.data);
      } catch (err) {
        console.error('Error fetching images:', err);
      }
    };

    fetchImages();
  }, []);

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedImages([...uploadedImages, res.data.image]); // Update images state
      console.log('File uploaded successfully:', res.data.image);
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  // Toggle image visibility on button click
  const handleShowImages = () => {
    setShowImages(!showImages);
  };

  return (
    <div className="App">
      <h2>Upload an Image</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input type="file" onChange={onChange} />
          <label htmlFor="file">{filename}</label>
        </div>
        <button type="submit">Upload</button>
      </form>

      <button onClick={handleShowImages}>
        {showImages ? 'Hide Images' : 'Show Images'}
      </button>

      {showImages && (
        <div>
          <h3>Uploaded Images</h3>
          <div>
            {uploadedImages.map((image) => (
              <div key={image._id}>
                <h4>{image.filename}</h4>
                <img
                  src={`http://localhost:5000/${image.filePath}`} // Ensure correct path for backend-served images
                  alt={image.filename}
                  style={{ width: '200px' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
