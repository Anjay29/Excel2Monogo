import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios'

const LandingPage = () => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [jsonData, setJsonData] = useState(null);
  const [userData, setUserData] = useState([]);

  // Log jsonData whenever it's updated
  const excelSerialToDate = (serial) => {
    const excelEpoch = new Date(1899, 11, 30); // Excel's base date is 30th Dec 1899
    const convertedDate = new Date(excelEpoch.getTime() + serial * 86400000); // Add serial days
    return convertedDate;
  };
  

  useEffect(() => {
    if (jsonData) {
      const updatedUserData = jsonData.map((item) => ({
        Name: item["Name of the Candidate"],
        Email: item["Email"],
        Mobile_Number: item["Mobile No."],
        Date_of_Birth: excelSerialToDate(item["Date of Birth"]).toLocaleDateString('en-GB'),
        Work_Experience: item["Work Experience"],
        Resume_Title: item["Resume Title"],
        Current_Location: item["Current Location"],
        Postal_Address: item["Postal Address"],
        Current_Employer: item["Current Employer"],
        Current_Designation: item["Current Designation"]
      }));

      setUserData(updatedUserData);
    }
  }, [jsonData]);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  // Handle Excel File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet);

        // Store the parsed data in state
        setJsonData(parsedData);
        setMessage('Excel file uploaded successfully!');
        setMessageType('success');
      };

      reader.onerror = () => {
        setMessage('Failed to upload the file. Please try again.');
        setMessageType('error');
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const uploadOnMongo = async () => {
    try {
      setMessageType("success")
      setMessage("Loading...")
      for (const user of userData) {
        const response = await axios.post('http://localhost:8000/api/v1/addNewUser', user, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 200) {
          console.log('Data uploaded to MongoDB successfully:', user);
        } else {
          console.error('Failed to upload data to MongoDB:', user);
        }
      }
      setMessage('Data uploaded to MongoDB successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Error uploading data:', error);
      setMessage('An error occurred while uploading.');
      setMessageType('error');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen justify-between font-sans">
      <header className="bg-green-500 w-full p-5 text-white text-center">
        <h1>Welcome to the Landing Page</h1>
      </header>

      <main className="flex flex-col items-center justify-center flex-1">
        <h2 className="text-2xl font-bold mb-4">Upload Your Excel File</h2>

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="m-5 p-2 text-lg border border-gray-300 rounded"
        />

        {message && (
          <p className={`mt-4 ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <div className='mt-4'>
          <button
            className='bg-blue-500 p-2 rounded-md px-8 hover:bg-blue-400 active:translate-y-px'
            onClick={uploadOnMongo}
            disabled={!jsonData} // Disable button if no data is uploaded
          >
            Upload
          </button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
