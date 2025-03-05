import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import './payloadtable.css';

// Custom Alert Component
const CustomAlert = ({ type, message, onClose }) => {
  const alertStyles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-500" />
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />
    }
  };

  const style = alertStyles[type] || alertStyles.warning;

  return (
    <div className={`flex items-center p-4 mb-4 border rounded-lg ${style.bg}`}>
      <div className="mr-2">
        {style.icon}
      </div>
      <div className={`flex-1 text-sm ${style.text}`}>
        {message}
      </div>
      <button 
        onClick={onClose}
        className="ml-auto"
      >
        <XCircle className="w-5 h-5 opacity-50 hover:opacity-100" />
      </button>
    </div>
  );
};

const FullPayload = () => {
  const [litigationData, setLitigationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
 
  const [alertInfo, setAlertInfo] = useState(null);
  const [isPromoting, setIsPromoting] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    disease: '',
    jurisdiction: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

 // In FullPayload.jsx - modify the fetchInitialData function
// Add this useEffect after your data fetching useEffect
useEffect(() => {
    console.log('litigationData state changed:', {
        hasData: litigationData.length > 0,
        recordCount: litigationData.length,
        firstRecord: litigationData[0],
        loading,
        error
    });
}, [litigationData, loading, error]);
const fetchInitialData = async () => {
    console.log('Starting initial data fetch...');
    setLoading(true);
    try {
        // MongoDB fetch call simulation
        console.log('Making API request to /api/litigation/current');
        const response = await fetch('/api/litigation/current');
        console.log('Response received:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data received:', data);
        console.log('Number of records:', data.length);
        
        setLitigationData(data);
        console.log('State updated with new data');
    } catch (err) {
        console.error('Error in fetchInitialData:', err);
        showAlert('error', 'Failed to load initial litigation data');
    } finally {
        setLoading(false);
        console.log('Loading state set to false');
    }
};

  const showAlert = (type, message) => {
    setAlertInfo({ type, message });
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setAlertInfo(null);
    }, 5000);
  };

  const handleRefresh = async () => {
    console.log('Starting refresh from production...');
    setRefreshing(true);
    try {
        const response = await fetch('/api/litigation/production');
        console.log('Production API response received');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newCases = await response.json();
        console.log(`Received ${newCases.length} new cases from production`);
        
        // Replace existing data with production data
        setLitigationData(newCases);
        showAlert('success', `Successfully loaded ${newCases.length} cases from production`);
    } catch (err) {
        console.error('Error refreshing production data:', err);
        showAlert('error', 'Failed to refresh litigation data');
    } finally {
        setRefreshing(false);
    }
};

const handlePromoteToConfirmation = async () => {
  setIsPromoting(true);

  try {
      // Send all cases to the promotion endpoint
      const response = await fetch('/api/litigation/promote', {
          method: 'POST',
          headers: { 
              'Content-Type': 'application/json'
          },
          // Send all log numbers
          body: JSON.stringify({ 
              cases: litigationData.map(item => item.log_number) 
          })
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to promote cases');
      }

      const result = await response.json();

      // Clear the litigation data after successful promotion
      setLitigationData([]);
      
      // Show success message
      showAlert('success', `Successfully promoted all cases to confirmation queue`);

      // Optional: Refresh the data to ensure sync
      if (result.shouldRefresh) {
          await fetchInitialData();
      }

  } catch (err) {
      console.error('Promotion error:', err);
      showAlert('error', err.message || 'Failed to promote cases');
      await fetchInitialData();
  } finally {
      setIsPromoting(false);
  }
};

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  if (loading) {
    return (
      <div className="table-reporting">
        <div className="loading-state">
          Loading litigation data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-reporting">
        <div className="error-state">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="table-reporting">
      {alertInfo && (
        <CustomAlert
          type={alertInfo.type}
          message={alertInfo.message}
          onClose={() => setAlertInfo(null)}
        />
      )}

      <div className="panel-title">
        <div>
          All Litigation
          <span className="text-sm text-gray-500 ml-2">
            Active Cases: {litigationData.length}
          </span>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <select 
            className="form-select"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="PENDING">Pending</option>
            <option value="URGENT">Urgent</option>
          </select>

          <select 
            className="form-select"
            value={filters.disease}
            onChange={(e) => handleFilterChange('disease', e.target.value)}
          >
            <option value="">All Diseases</option>
            <option value="MESOTHELIOMA">Mesothelioma</option>
            <option value="LUNG_CANCER">Lung Cancer</option>
            <option value="ASBESTOSIS">Asbestosis</option>
          </select>

          <select 
            className="form-select"
            value={filters.jurisdiction}
            onChange={(e) => handleFilterChange('jurisdiction', e.target.value)}
          >
            <option value="">All Jurisdictions</option>
            <option value="NY">New York</option>
            <option value="CA">California</option>
            <option value="IL">Illinois</option>
          </select>
        </div>
      </div>

    

<div className="panel-content">
  <div className="table-container">
    <table className="data-table">
      <thead>
        <tr>
          <th>
           
          </th>
          <th>Log Number</th>
          <th>Case Caption</th>
          <th>Defendants</th>
          <th>Jurisdiction</th>
          <th>Disease</th>
          <th>Filed Date</th>
          <th>Due Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {litigationData.map((item, index) => (
          <tr key={index}>
            <td>
              
            </td>
            <td className="font-medium">{item.log_number}</td>
            <td className="max-w-md truncate">{item.case_caption}</td>
            <td className="max-w-md truncate">
              {item.defendants ? item.defendants.slice(0, 3).join(', ') + 
               (item.defendants.length > 3 ? ` +${item.defendants.length - 3} more` : '') : ''}
            </td>
            <td>{item.jurisdiction}</td>
            <td>{item.disease_name}</td>
            <td>{item.file_date ? new Date(item.file_date).toLocaleDateString() : ''}</td>
            <td>{item.answer_due_date ? new Date(item.answer_due_date).toLocaleDateString() : ''}</td>
            <td>
              <span className={`status-indicator ${
                item.status === 'NEW' ? 'status-active' :
                item.status === 'PENDING' ? 'status-pending' :
                'status-completed'
              }`}>
                {item.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      <div className="dashboard-actions">
        <button
          className="import-button"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
        <button
    className="action-button"
    onClick={handlePromoteToConfirmation}
    disabled={isPromoting || litigationData.length === 0}
>
    {isPromoting ? (
        <>
            <RefreshCw className="animate-spin" />
            Processing...
        </>
    ) : (
        <>
            <CheckCircle2 />
            Promote All to Confirmation
        </>
    )}
</button>
        
      </div>
    </div>
  );
};

export default FullPayload;
