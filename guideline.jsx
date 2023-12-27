import React, { useState } from "react";
import { Link } from "react-router-dom";

const Uploadbox = () => {
  const [language, setLanguage] = useState("english");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setSelectedFile(file); // Set the selected file in state
    console.log("Selected file:", file);
    // Perform operations with the selected file if needed
  };

  const handleProcess = () => {
    if (!selectedFile) {
      // If no file is selected, prevent redirection
      console.log("Please select a file before proceeding.");
      // Show an alert or perform any action to inform the user
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
            accept="video/*" // Specify accepted file types (all video formats in this case)
            onChange={handleFileUpload}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex items-center justify-end">
          <Link
            to={selectedFile ? { pathname: "/quiz", state: { language } } : "#"}
            onClick={handleProcess}
            className={`bg-blue-600 text-white px-4 py-2 rounded mr-2 ${!selectedFile ? "pointer-events-none opacity-50" : ""}`}
          >
            Process
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Uploadbox;


