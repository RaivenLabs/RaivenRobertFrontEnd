import React, { useState, useEffect } from 'react';
import './archivedcasestable.css';
import { 
  FileText, 
  RefreshCw, 
  AlertCircle,
  XCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

const ArchivedCasesTable = () => {
  const [archivedData, setArchivedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertInfo, setAlertInfo] = useState(null);

  useEffect(() => {
    fetchArchivedData();
  }, []);

  const fetchArchivedData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/litigation/archived-queue');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setArchivedData(data.cases || []);
    } catch (err) {
      setError('Failed to load archived data');
      showAlert('error', 'Failed to load archived data');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlertInfo({ type, message });
    setTimeout(() => setAlertInfo(null), 5000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const getConfidenceColor = (score) => {
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <RefreshCw className="animate-spin h-5 w-5 mr-2" />
        Loading archived cases...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      {alertInfo && (
        <div className={`mb-4 p-4 rounded-lg flex items-center
          ${alertInfo.type === 'error' ? 'bg-red-50 text-red-800' : 
            alertInfo.type === 'warning' ? 'bg-yellow-50 text-yellow-800' : 
            'bg-blue-50 text-blue-800'}`}>
          <AlertTriangle className="h-5 w-5 mr-2" />
          {alertInfo.message}
          <button 
            onClick={() => setAlertInfo(null)}
            className="ml-auto"
          >
            <XCircle className="h-5 w-5 opacity-50 hover:opacity-100" />
          </button>
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">
          Archived Cases
          <span className="text-sm text-gray-500 ml-2">
            Total: {archivedData.length}
          </span>
        </h2>

        <button
          onClick={fetchArchivedData}
          className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Log Number
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case Caption
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Confidence
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Archive Date
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jurisdiction
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {archivedData.map((item) => (
              <tr key={item.case_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {item.log_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-md truncate">
                  {item.case_caption}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`font-medium ${getConfidenceColor(item.confidence_score)}`}>
                    {item.confidence_score}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(item.archive_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-2 text-gray-400" />
                    {item.archive_reason}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.jurisdiction}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {archivedData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No archived cases found
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivedCasesTable;
