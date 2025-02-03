import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, Clock, CheckCircle, Building } from 'lucide-react';
import { useFundContext } from '../../../../../context/FundContext';
import './FundFamiliesTable.css';



// Move the mapping function definition to the top level, outside the component
const mapApiToTableData = (fundData) => {
  const data = fundData.Data[0]; // Since the relevant data is in Data[0]
  return {
    family_name: data['Organisation Name'],
    parent_company: "TBD", // We might need to get this from another API call
    total_funds: "N/A", // Could be calculated if we track related funds
    jurisdiction: "United Kingdom", // This is implicit since it's FCA data
    aum: "TBD", // Might need separate API call
    fund_types: [data['Business Type']],
    status: data['Status'],
    last_review: data['Status Effective Date'],
    compliance_status: data['Client Money Permission'],
    frn: data['FRN']
  };
};



const FundFamiliesTable = () => {
  const [familiesData, setFamiliesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedFunds } = useFundContext();

  // Modified columns based on available data
  const columns = [
    { 
      header: 'Organisation Name', 
      key: 'family_name',
      render: (value) => <span className="font-medium">{value}</span>
    },
    { 
      header: 'FRN', 
      key: 'frn' 
    },
    { 
      header: 'Business Type', 
      key: 'fund_types',
      render: (types) => types.join(", ")
    },
    { 
      header: 'Status', 
      key: 'status',
      render: (status) => (
        <span className={`status-indicator ${getStatusStyles(status)}`}>
          {status}
        </span>
      )
    },
    { 
      header: 'Client Money Permission', 
      key: 'compliance_status' 
    },
    { 
      header: 'Status Effective Date', 
      key: 'last_review',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleViewDetails(row.frn)}
            className="action-button"
          >
            View Details
          </button>
        </div>
      )
    }
  ];

  // Get status indicator styles
  const getStatusStyles = (status) => {
    const statusStyles = {
      'Authorised': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Suspended': 'bg-red-100 text-red-800',
      'Cancelled': 'bg-gray-100 text-gray-800'
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-800';
  };

  const handleViewDetails = (frn) => {
    // Implement navigation to detail view
    console.log(`Viewing details for FRN: ${frn}`);
  };

  useEffect(() => {
    const loadFundData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load data from FundDetails directory for each selected fund
        const fundDataPromises = selectedFunds.map(fund => 
          fetch(`/api/funds/${fund.frn}`).then(res => res.json())
        );

        const fundsData = await Promise.all(fundDataPromises);
        const mappedData = fundsData.map(data => mapApiToTableData(data));
        
        setFamiliesData(mappedData);
      } catch (err) {
        setError(err.message);
        console.error('Error loading fund data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedFunds?.length) {
      loadFundData();
    }
  }, [selectedFunds]);

  if (loading) {
    return (
      <div className="table-reporting">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading fund data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-reporting">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="table-reporting">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="summary-card">
          <h3>Total Funds</h3>
          <div className="text-2xl font-bold">{familiesData.length}</div>
          <div className="text-sm text-gray-500">Selected Funds</div>
        </div>
        <div className="summary-card">
          <h3>Authorised Funds</h3>
          <div className="text-2xl font-bold">
            {familiesData.filter(f => f.status === 'Authorised').length}
          </div>
          <div className="text-sm text-gray-500">Active Status</div>
        </div>
        <div className="summary-card">
          <h3>Client Money Handlers</h3>
          <div className="text-2xl font-bold">
            {familiesData.filter(f => f.compliance_status.includes('client money')).length}
          </div>
          <div className="text-sm text-gray-500">Permission Status</div>
        </div>
        <div className="summary-card">
          <h3>Average Age</h3>
          <div className="text-2xl font-bold">
            {calculateAverageAge(familiesData)} years
          </div>
          <div className="text-sm text-gray-500">Since Authorization</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="panel-content">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>{column.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {familiesData.map((fund, index) => (
                <tr key={index} className="hover:bg-sky-50">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>
                      {column.render ? 
                        column.render(fund[column.key], fund) : 
                        fund[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate average age of funds
const calculateAverageAge = (funds) => {
  if (!funds.length) return 0;
  const now = new Date();
  const ages = funds.map(fund => {
    const effectiveDate = new Date(fund.last_review);
    return Math.floor((now - effectiveDate) / (1000 * 60 * 60 * 24 * 365));
  });
  return Math.round(ages.reduce((a, b) => a + b, 0) / ages.length);
};

export default FundFamiliesTable;
