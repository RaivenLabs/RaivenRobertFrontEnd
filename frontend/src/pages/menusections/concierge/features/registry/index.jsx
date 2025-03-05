import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Filter,
  User,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  Archive
} from 'lucide-react';
import './registry.css';

const RegistryTable = () => {
  const [mattersData, setMattersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClientLawyer, setFilterClientLawyer] = useState('all');
  const [filterProviderLawyer, setFilterProviderLawyer] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - would come from your API
  const sampleData = [
    {
      id: 'M-2024-001',
      matter_name: 'Oracle License Amendment',
      client_name: 'Fortune 500 Corp',
      status: 'Active',
      total_fees: 145000,
      client_lawyer: 'John Smith',
      provider_lawyer: 'Jane Wilson',
      date_opened: '2024-01-15',
      date_closed: null,
      taxonomy: 'SaaS Agreement',
      hours_billed: 245,
      last_activity: '2024-02-06'
    },
    {
      id: 'M-2023-089',
      matter_name: 'AWS Enterprise Agreement',
      client_name: 'Tech Startup Inc',
      status: 'Closed',
      total_fees: 85000,
      client_lawyer: 'Sarah Chen',
      provider_lawyer: 'David Kumar',
      date_opened: '2023-08-15',
      date_closed: '2023-12-20',
      taxonomy: 'Cloud Services',
      hours_billed: 168,
      last_activity: '2023-12-20'
    }
  ];

  const columns = [
    {
      header: 'Matter Details',
      key: 'matter_name',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{row.id}</div>
          <div className="text-sm text-gray-500">{row.taxonomy}</div>
        </div>
      )
    },
    {
      header: 'Client',
      key: 'client_name',
      render: (value, row) => (
        <div>
          <div>{value}</div>
          <div className="text-sm text-gray-500 mt-1">
            <User className="w-4 h-4 inline mr-1" />
            {row.client_lawyer}
          </div>
        </div>
      )
    },
    {
      header: 'Provider Lawyer',
      key: 'provider_lawyer',
      render: (value) => (
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-gray-500" />
          {value}
        </div>
      )
    },
    {
      header: 'Dates',
      key: 'date_opened',
      render: (_, row) => (
        <div className="space-y-1">
          <div className="text-sm">
            <Calendar className="w-4 h-4 inline mr-1 text-green-600" />
            Opened: {new Date(row.date_opened).toLocaleDateString()}
          </div>
          {row.date_closed && (
            <div className="text-sm">
              <Calendar className="w-4 h-4 inline mr-1 text-gray-500" />
              Closed: {new Date(row.date_closed).toLocaleDateString()}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Financials',
      key: 'total_fees',
      render: (value, row) => (
        <div>
          <div className="text-green-600 font-medium">
            ${value.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            {row.hours_billed} hours billed
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (status, row) => (
        <div>
          <span className={`status-indicator ${
            status === 'Active' 
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {status}
          </span>
          <div className="text-sm text-gray-500 mt-1">
            <Clock className="w-4 h-4 inline mr-1" />
            {new Date(row.last_activity).toLocaleDateString()}
          </div>
        </div>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleViewDetails(row.id)}
            className="action-button"
          >
            View Details
          </button>
        </div>
      )
    }
  ];

  useEffect(() => {
    const loadMattersData = async () => {
      try {
        setLoading(true);
        setError(null);
        // In production, this would be an API call
        setMattersData(sampleData);
      } catch (err) {
        setError(err.message);
        console.error('Error loading matters data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMattersData();
  }, []);

  const getFilteredData = () => {
    return mattersData.filter(matter => {
      const statusMatch = filterStatus === 'all' || matter.status === filterStatus;
      const clientLawyerMatch = filterClientLawyer === 'all' || matter.client_lawyer === filterClientLawyer;
      const providerLawyerMatch = filterProviderLawyer === 'all' || matter.provider_lawyer === filterProviderLawyer;
      const searchMatch = !searchTerm || 
        matter.matter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matter.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matter.client_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      return statusMatch && clientLawyerMatch && providerLawyerMatch && searchMatch;
    });
  };

  const handleViewDetails = (id) => {
    console.log(`Viewing matter details for: ${id}`);
  };

  // Calculate summary metrics
  const summaryMetrics = {
    totalMatters: mattersData.length,
    activeMatters: mattersData.filter(m => m.status === 'Active').length,
    totalFees: mattersData.reduce((sum, m) => sum + m.total_fees, 0),
    totalHours: mattersData.reduce((sum, m) => sum + m.hours_billed, 0)
  };

  if (loading) return <div className="table-reporting">Loading matters...</div>;
  if (error) return <div className="table-reporting">Error: {error}</div>;

  return (
    <div className="table-reporting">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="summary-card">
          <h3>Total Matters</h3>
          <div className="text-2xl font-bold">{summaryMetrics.totalMatters}</div>
          <div className="text-sm text-gray-500">All time</div>
        </div>
        <div className="summary-card">
          <h3>Active Matters</h3>
          <div className="text-2xl font-bold text-green-600">
            {summaryMetrics.activeMatters}
          </div>
          <div className="text-sm text-gray-500">Currently open</div>
        </div>
        <div className="summary-card">
          <h3>Total Fees</h3>
          <div className="text-2xl font-bold">
            ${summaryMetrics.totalFees.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">All time</div>
        </div>
        <div className="summary-card">
          <h3>Total Hours</h3>
          <div className="text-2xl font-bold">
            {summaryMetrics.totalHours.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Hours billed</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            className="form-select"
            value={filterClientLawyer}
            onChange={(e) => setFilterClientLawyer(e.target.value)}
          >
            <option value="all">All Client Lawyers</option>
            {Array.from(new Set(mattersData.map(m => m.client_lawyer))).map(lawyer => (
              <option key={lawyer} value={lawyer}>{lawyer}</option>
            ))}
          </select>

          <select
            className="form-select"
            value={filterProviderLawyer}
            onChange={(e) => setFilterProviderLawyer(e.target.value)}
          >
            <option value="all">All Provider Lawyers</option>
            {Array.from(new Set(mattersData.map(m => m.provider_lawyer))).map(lawyer => (
              <option key={lawyer} value={lawyer}>{lawyer}</option>
            ))}
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search matters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <button className="import-button">
          <Download className="h-4 w-4" />
          Export Registry
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
              {getFilteredData().map((matter, index) => (
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

export default RegistryTable;
