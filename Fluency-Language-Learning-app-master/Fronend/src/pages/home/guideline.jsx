import React, { useState } from "react";
import { Link } from "react-router-dom";

const Uploadbox = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log("Selected file:", file);
  };

  const handleProcess = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("video", selectedFile);

      try {
        const response = await fetch('http://127.0.0.1:8000/upload-video/', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          setApiResponse(data); // Set the API response in state
          console.log("Vehicle Count:", data);
        } else {
          setError(`Failed to upload. Status: ${response.status}`);
          console.log("Failed to upload. Status:", response.status);
        }
      } catch (error) {
        setError('Error fetching data:', error.message);
        console.error('Error fetching data:', error);
        console.error('Full response:', response);
      }
    } else {
      console.log("Please select a file to upload.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white rounded-lg overflow-hidden w-3/4 md:w-2/4 lg:w-2/5 p-6 mt-20 relative">
        <h1 className="text-3xl font-bold mb-4 md:text-center text-blue-600">
          Upload your video file here
        </h1>
        <div className="flex flex-col items-center mb-6">
          <label htmlFor="fileUpload" className="block mb-2">
            Select a video file:
          </label>
          <input
            type="file"
            id="fileUpload"
            accept="video/*"
            onChange={handleFileUpload}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex items-center justify-end">
          <button
            onClick={handleProcess}
            className={`bg-blue-600 text-white px-4 py-2 rounded mr-2 ${!selectedFile ? "pointer-events-none opacity-50" : ""}`}
          >
            Process
          </button>
        </div>

        {/* Display API response or error */}
        {apiResponse && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Vehicle Count:</h2>
            <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
          </div>
        )}
        {error && (
          <div className="mt-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Uploadbox;
