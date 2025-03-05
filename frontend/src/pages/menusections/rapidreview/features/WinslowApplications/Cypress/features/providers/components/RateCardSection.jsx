import React, { useState } from 'react';

const RateCardSection = ({ documents, goToUploadStep }) => {
  // State for rate editing mode
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock rate data - in a real implementation this would come from props
  const [rateData, setRateData] = useState([
    {
      role: 'Project Manager',
      level: 'Senior',
      hourlyRate: 150.00,
      dailyRate: 1200.00
    },
    {
      role: 'Developer',
      level: 'Mid-level',
      hourlyRate: 125.00,
      dailyRate: 1000.00
    }
  ]);
  
  // Handle rate card editing
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  // Handle rate change
  const handleRateChange = (index, field, value) => {
    const updatedRates = [...rateData];
    updatedRates[index][field] = value;
    
    // If changing hourly rate, update daily rate (assuming 8-hour day)
    if (field === 'hourlyRate') {
      updatedRates[index].dailyRate = value * 8;
    }
    
    setRateData(updatedRates);
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Rate Card Information</h3>
      <p className="text-gray-600">Review and confirm the rate card information extracted from the documents.</p>
      
      {documents.rateCard ? (
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-green-50">
            <p className="font-medium">Rate Card Uploaded</p>
            <p className="text-sm text-gray-600">The system will process the rate information for this supplier.</p>
          </div>
          
          {/* Rate Card Preview */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Rate Card Preview</h4>
            <p className="text-sm text-gray-500 mb-4">
              {isEditing 
                ? "Edit rate information below. Click Save when finished."
                : "This is a preview of the extracted rate information. You can make adjustments if needed."}
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hourly Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rateData.map((rate, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={rate.role}
                            onChange={(e) => handleRateChange(index, 'role', e.target.value)}
                            className="border rounded p-1 w-full"
                          />
                        ) : rate.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={rate.level}
                            onChange={(e) => handleRateChange(index, 'level', e.target.value)}
                            className="border rounded p-1 w-full"
                          />
                        ) : rate.level}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {isEditing ? (
                          <input 
                            type="number" 
                            value={rate.hourlyRate}
                            onChange={(e) => handleRateChange(index, 'hourlyRate', parseFloat(e.target.value))}
                            step="0.01"
                            className="border rounded p-1 w-full"
                          />
                        ) : `$${rate.hourlyRate.toFixed(2)}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {isEditing ? (
                          <input 
                            type="number" 
                            value={rate.dailyRate}
                            onChange={(e) => handleRateChange(index, 'dailyRate', parseFloat(e.target.value))}
                            step="0.01"
                            className="border rounded p-1 w-full"
                          />
                        ) : `$${rate.dailyRate.toFixed(2)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-between">
              {isEditing ? (
                <>
                  <button 
                    onClick={toggleEditMode} 
                    className="text-blue-600 text-sm border border-blue-600 px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={toggleEditMode}
                    className="bg-blue-600 text-white text-sm px-3 py-1 rounded"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button 
                  onClick={toggleEditMode} 
                  className="text-blue-600 text-sm"
                >
                  Edit Rate Information
                </button>
              )}
              {!isEditing && (
                <button 
                  className="text-blue-600 text-sm border border-blue-600 px-3 py-1 rounded"
                  onClick={() => {
                    setRateData([...rateData, {
                      role: '',
                      level: '',
                      hourlyRate: 0,
                      dailyRate: 0
                    }]);
                    setIsEditing(true);
                  }}
                >
                  Add New Rate
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 border rounded-lg bg-yellow-50">
          <p className="font-medium">No Rate Card Uploaded</p>
          <p className="text-sm text-gray-600 mt-1">You can proceed without a rate card, but it's recommended to provide one for complete supplier configuration.</p>
          <button 
            className="mt-3 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            onClick={goToUploadStep}
          >
            Go Back to Upload
          </button>
        </div>
      )}
      
      {/* Rate Card Amendment Information */}
      {documents.amendments && documents.amendments.length > 0 && (
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Rate Card Amendments</h4>
          <p className="text-sm text-gray-500">The system will process any rate changes from the uploaded amendments.</p>
          {documents.amendments.map((amendment, index) => (
            <div key={index} className="mt-2 text-sm text-gray-600">
              • Amendment: {amendment.name || `Amendment ${index + 1}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RateCardSection;
