import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  User,
  Filter,
  Search,
  Download,
  BarChart2
} from 'lucide-react';
import './ActiveMattersTable.css';

const ActiveMattersTable = () => {
  const [mattersData, setMattersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterClient, setFilterClient] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Column definitions
  const columns = [
    {
      header: 'Matter Name',
      key: 'matter_name',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">ID: {row.matter_id}</div>
        </div>
      )
    },
    {
      header: 'Client',
      key: 'client_name'
    },
    {
      header: 'Type',
      key: 'taxonomy_type',
      render: (value) => (
        <span className="taxonomy-badge">
          {value}
        </span>
      )
    },
    {
      header: 'Supervising Lawyer',
      key: 'supervisor',
      render: (value) => (
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-gray-500" />
          {value}
        </div>
      )
    },
    {
      header: 'Fees',
      key: 'fees',
      render: (_, row) => (
        <div>
          <div className="text-green-600">
            Billed: ${row.billed_fees.toLocaleString()}
          </div>
          <div className="text-blue-600">
            Unbilled: ${row.unbilled_fees.toLocaleString()}
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (status) => (
        <span className={`status-indicator ${
          status === 'Active' ? 'bg-green-100 text-green-800' :
          status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      )
    },
    {
      header: 'Last Activity',
      key: 'last_activity',
      render: (date) => new Date(date).toLocaleDateString()
    }
  ];

  // Mock data - replace with API call
  useEffect(() => {
    const fetchMatters = async () => {
      try {
        setLoading(true);
        // Mock API call
        const response = await fetch('/api/matters/active');
        const data = await response.json();
        setMattersData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Simulating data for development
    const mockData = [
      {
        matter_id: 'M-2024-001',
        matter_name: 'Oracle License Amendment',
        client_name: 'Fortune 500 Corp',
        taxonomy_type: 'SaaS Agreement',
        supervisor: 'Jane Smith',
        billed_fees: 45000,
        unbilled_fees: 12500,
        status: 'Active',
        last_activity: '2024-02-05'
      },
      {
        matter_id: 'M-2024-002',
        matter_name: 'AWS Enterprise Agreement',
        client_name: 'Tech Startup Inc',
        taxonomy_type: 'Cloud Services',
        supervisor: 'John Doe',
        billed_fees: 28000,
        unbilled_fees: 8500,
        status: 'Active',
        last_activity: '2024-02-06'
      }
      // Add more mock data as needed
    ];

    setMattersData(mockData);
    setLoading(false);
  }, []);

  // Calculate summary metrics
  const summaryMetrics = {
    totalMatters: mattersData.length,
    totalBilled: mattersData.reduce((sum, matter) => sum + matter.billed_fees, 0),
    totalUnbilled: mattersData.reduce((sum, matter) => sum + matter.unbilled_fees, 0),
    activeClients: new Set(mattersData.map(matter => matter.client_name)).size
  };

  if (loading) {
    return (
      <div className="table-reporting">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading matters...</div>
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
          <h3>Active Matters</h3>
          <div className="text-2xl font-bold">{summaryMetrics.totalMatters}</div>
          <div className="text-sm text-gray-500">Total Matters</div>
        </div>
        <div className="summary-card">
          <h3>Billed Fees</h3>
          <div className="text-2xl font-bold">
            ${summaryMetrics.totalBilled.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total Billed</div>
        </div>
        <div className="summary-card">
          <h3>Unbilled Fees</h3>
          <div className="text-2xl font-bold">
            ${summaryMetrics.totalUnbilled.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Work in Progress</div>
        </div>
        <div className="summary-card">
          <h3>Active Clients</h3>
          <div className="text-2xl font-bold">{summaryMetrics.activeClients}</div>
          <div className="text-sm text-gray-500">Unique Clients</div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search matters..."
              className="form-select"
            />
          </div>
          <select 
            className="form-select"
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
          >
            <option value="all">All Clients</option>
            {/* Add client options */}
          </select>
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            {/* Add taxonomy type options */}
          </select>
        </div>
        
        <button className="import-button">
          <Download className="w-4 h-4" />
          Export Report
        </button>
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
              {mattersData.map((matter, index) => (
                <tr key={index} className="hover:bg-sky-50">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>
                      {column.render ? 
                        column.render(matter[column.key], matter) : 
                        matter[column.key]}
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

export default ActiveMattersTable;
