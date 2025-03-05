// src/components/FundDashboard/index.jsx
import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import './FundDashboard.css';

const FundDashboard = () => {
  const [fundData, setFundData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    fundFamily: '',
    fundType: ''
  });

  // Table columns focused on fund compliance needs
  const columns = [
    { header: 'Fund Name', key: 'fund_name' },
    { header: 'FCA Number', key: 'frn' },
    { header: 'Fund Family', key: 'fund_family' },
    { header: 'Fund Type', key: 'fund_type' },
    { header: 'Last Review', key: 'last_review_date' },
    { header: 'Next Filing', key: 'next_filing_date' },
    { header: 'Regulatory Status', key: 'regulatory_status' },
    { header: 'Compliance Alerts', key: 'alerts' },
    { header: 'Actions', key: 'actions', type: 'action' }
  ];

  // Get status indicator styles
  const getStatusStyles = (status) => {
    const statusStyles = {
      'Compliant': 'bg-green-100 text-green-800',
      'Review Required': 'bg-yellow-100 text-yellow-800',
      'Action Required': 'bg-red-100 text-red-800',
      'Filing Due': 'bg-blue-100 text-blue-800',
      'Non-Compliant': 'bg-red-200 text-red-900'
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-800';
  };

  // Mock data for illustration - would be replaced with actual API data
  const mockFundData = [
    {
      fund_name: "Global Growth Fund",
      frn: "615820",
      fund_family: "Atlas Investment Group",
      fund_type: "UCITS",
      last_review_date: "2024-01-15",
      next_filing_date: "2024-03-30",
      regulatory_status: "Compliant",
      alerts: 0,
      details: {
        sub_funds: 3,
        total_aum: "£1.2B",
        jurisdiction: "UK"
      }
    },
    // ... more mock data
  ];

  useEffect(() => {
    // Simulating API call
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Replace with actual API call to FCA
        setFundData(mockFundData);
      } catch (err) {
        setError(err.message);
        console.error('Error loading fund data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

  // Loading and Error states remain the same...

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };


  return (
    <div className="table-reporting">
      {/* Summary Cards Section */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="summary-card">
          <h3>Total Funds</h3>
          <div className="text-2xl font-bold">42</div>
          <div className="text-sm text-gray-500">Across 8 Fund Families</div>
        </div>
        <div className="summary-card">
          <h3>Compliance Status</h3>
          <div className="text-2xl font-bold text-green-600">38</div>
          <div className="text-sm text-gray-500">Fully Compliant</div>
        </div>
        <div className="summary-card">
          <h3>Pending Reviews</h3>
          <div className="text-2xl font-bold text-yellow-600">3</div>
          <div className="text-sm text-gray-500">Due within 30 days</div>
        </div>
        <div className="summary-card">
          <h3>Critical Alerts</h3>
          <div className="text-2xl font-bold text-red-600">1</div>
          <div className="text-sm text-gray-500">Require Immediate Action</div>
        </div>
      </div>

      {/* Header Section with Filters */}
      <div className="panel-title flex justify-between items-center">
        <div>
          Fund Compliance Dashboard
          <span className="text-sm text-gray-500 ml-2">
            Last Updated: {new Date().toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex gap-4">
          <select 
            className="form-select"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Compliant">Compliant</option>
            <option value="Review Required">Review Required</option>
            <option value="Action Required">Action Required</option>
            <option value="Filing Due">Filing Due</option>
          </select>
          
          <select 
            className="form-select"
            value={filters.fundFamily}
            onChange={(e) => handleFilterChange('fundFamily', e.target.value)}
          >
            <option value="">All Fund Families</option>
            <option value="Atlas">Atlas Investment Group</option>
            <option value="Meridian">Meridian Capital</option>
          </select>

          <select 
            className="form-select"
            value={filters.fundType}
            onChange={(e) => handleFilterChange('fundType', e.target.value)}
          >
            <option value="">All Fund Types</option>
            <option value="UCITS">UCITS</option>
            <option value="AIF">AIF</option>
            <option value="Investment Trust">Investment Trust</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
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
              {fundData.map((fund, index) => (
                <tr key={index} className="hover:bg-sky-50 cursor-pointer">
                  <td className="font-medium">{fund.fund_name}</td>
                  <td>{fund.frn}</td>
                  <td>{fund.fund_family}</td>
                  <td>{fund.fund_type}</td>
                  <td>{new Date(fund.last_review_date).toLocaleDateString()}</td>
                  <td>{new Date(fund.next_filing_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-indicator ${getStatusStyles(fund.regulatory_status)}`}>
                      {fund.regulatory_status}
                    </span>
                  </td>
                  <td>
                    {fund.alerts > 0 ? (
                      <div className="flex items-center text-red-600">
                        <AlertCircle size={16} className="mr-1" />
                        {fund.alerts}
                      </div>
                    ) : (
                      <CheckCircle size={16} className="text-green-600" />
                    )}
                  </td>
                  <td>
                    <button className="action-button">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="dashboard-actions">
        <button className="import-button">
          <FileText size={20} />
          Export Report
        </button>
      </div>
    </div>
  );
};

export default FundDashboard;
