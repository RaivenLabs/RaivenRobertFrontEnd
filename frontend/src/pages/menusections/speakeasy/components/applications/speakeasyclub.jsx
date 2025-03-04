// src/pages/menusections/speakeasy/components/applications/speakeasyclub.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SpeakeasyClub = () => {
  const navigate = useNavigate();

  const handleBackToMain = () => {
    navigate('/speakeasy/applications');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <button 
          onClick={handleBackToMain}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          Back to Applications
        </button>
        <h1 className="text-2xl font-bold mb-2">Speakeasy Club</h1>
        <p className="text-gray-600">Welcome to the Speakeasy Club application</p>
      </div>
      
      <div className="space-y-4">
        {/* Add your main content here */}
      </div>
    </div>
  );
};

export default SpeakeasyClub;
