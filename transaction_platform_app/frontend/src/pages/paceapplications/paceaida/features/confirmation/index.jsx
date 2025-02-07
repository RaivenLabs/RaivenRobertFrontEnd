import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

const ConfirmationTable = () => {
  const [litigationData, setLitigationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCases, setSelectedCases] = useState([]);
  const [alertInfo, setAlertInfo] = useState(null);

  useEffect(() => {
    fetchConfirmationData();
  }, []);

  const fetchConfirmationData = async () => {
    console.log("Starting fetchConfirmationData");
    setLoading(true);
    try {
        const response = await fetch('/api/litigation/confirmation');
        console.log("Response status:", response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log("API Response:", responseData);

        // Get cases from the response structure
        const cases = responseData.success ? responseData.cases : [];
        console.log("Cases to display:", cases);
        
        setLitigationData(cases);
    } catch (err) {
        console.error('Error fetching confirmation data:', err);
        setError('Failed to load confirmation data');
        showAlert('error', 'Failed to load confirmation data');
    } finally {
        setLoading(false);
    }
  };

  const handleCheckboxChange = (uniqueId) => {
    setSelectedCases(prev => {
      if (prev.includes(uniqueId)) {
        return prev.filter(id => id !== uniqueId);
      } else {
        return [...prev, uniqueId];
      }
    });
  };

  const handlePromoteToClient = async () => {
    if (selectedCases.length === 0) {
      showAlert('warning', 'Please select cases to promote');
      return;
    }

    try {
      // Make POST request to promote
      const response = await fetch('/api/litigation/promote-to-client', {
        method: 'POST',  // Explicitly POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cases: selectedCases })
      });

      if (!response.ok) {
        throw new Error('Failed to promote cases');
      }

      // After successful promotion, refresh confirmation data
      await fetchConfirmationData();  // This makes a separate GET request to /confirmation endpoint

      setSelectedCases([]);
      showAlert('success', `Successfully promoted ${selectedCases.length} cases to client table`);

    } catch (err) {
      console.error('Error promoting cases:', err);
      showAlert('error', 'Failed to promote cases to client table');
    }
  };

  const showAlert = (type, message) => {
    setAlertInfo({ type, message });
    setTimeout(() => setAlertInfo(null), 5000);
  };

  if (loading) {
    return <div className="p-4">Loading confirmation data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  const getConfidenceColor = (confidence) => {
    if (!confidence) return 'text-gray-500';
    const score = parseFloat(confidence.replace('%', ''));
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">
          Confirmation Queue
          <span className="text-sm text-gray-500 ml-2">
            Cases: {litigationData.length}
          </span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedCases.length === litigationData.length}
                  onChange={() => {
                    if (selectedCases.length === litigationData.length) {
                      setSelectedCases([]);
                    } else {
                      setSelectedCases(
                        litigationData.map(item => `${item.log_number}|||${item.matched_defendant}`)
                      );
                    }
                  }}
                  className="h-4 w-4 text-blue-600"
                />
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Log Number
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case Caption
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Match Confidence
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Matched Client
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Matched Defendant
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {litigationData.map((item) => {
              // Create a unique ID for each row that combines log number and defendant
              const uniqueId = `${item.log_number}|||${item.matched_defendant}`;
              
              return (
                <tr key={uniqueId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedCases.includes(uniqueId)}
                      onChange={() => handleCheckboxChange(uniqueId)}
                      className="h-4 w-4 text-blue-600"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {item.log_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-md truncate">
                    {item.case_caption}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap font-medium ${getConfidenceColor(item.confidence_score)}`}>
                    {item.confidence_score || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.matched_client || 'No Match'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.matched_defendant || 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          onClick={handlePromoteToClient}
          disabled={selectedCases.length === 0}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Promote to Client Table ({selectedCases.length} selected)
        </button>
      </div>

      {alertInfo && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
          alertInfo.type === 'success' ? 'bg-green-50 text-green-800' :
          alertInfo.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
          'bg-red-50 text-red-800'
        }`}>
          {alertInfo.message}
        </div>
      )}
    </div>
  );
};

export default ConfirmationTable;
