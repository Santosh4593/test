import React, { useState } from "react";

const Quiz = () => {
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [outputCSV, setOutputCSV] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0]; // Get the uploaded file
    console.log("Selected file:", file);
    // Perform operations with the uploaded file if needed

    // Simulating the process to generate CSV output
    // Replace this section with actual logic to generate CSV
    const output = "Header1,Header2,Header3\nData1,Data2,Data3";
    setOutputCSV(output);
    setVideoUploaded(true);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white rounded-lg overflow-hidden w-4/5 md:w-3/5 lg:w-2/5 p-6 relative">
        { (
          <>
            <h1 className="text-3xl font-bold mb-4 md:text-center text-blue-600">
              Video uploaded successfully
            </h1>
            <p className="text-center">CSV file generated:</p>
            <div className="flex justify-center mt-2"> {/* Centering div */}
              <textarea
                value={outputCSV}
                readOnly
                rows={6}
                className="border border-gray-300 rounded-md p-2 text-center"
                style={{ textAlign: "center" }}
              ></textarea>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
