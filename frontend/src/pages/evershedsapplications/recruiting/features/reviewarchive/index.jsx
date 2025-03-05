import React, { useState, useEffect } from 'react';
import { 
  UserCheck, Calendar, AlertCircle, Clock, 
  FileText, Filter, Download, Search,
  ChevronDown
} from 'lucide-react';
import './ReviewArchiveTable.css';

const ReviewArchiveTable = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - would come from your API
  const sampleData = [
    {
      id: 1,
      employee_name: 'James Wilson',
      employee_id: 'EMP001',
      department: 'Marketing',
      manager: 'Sarah Chen',
      hire_date: '2023-06-15',
      rtw_status: 'Valid',
      rtw_type: 'Permanent',
      last_verified: '2023-06-15',
      next_review: null,
      documents: ['Passport', 'NI Number'],
      nationality: 'British',
      notes: 'Complete verification on file'
    },
    {
      id: 2,
      employee_name: 'Maria Garcia',
      employee_id: 'EMP002',
      department: 'Engineering',
      manager: 'David Kumar',
      hire_date: '2023-09-01',
      rtw_status: 'Valid',
      rtw_type: 'Limited',
      last_verified: '2023-09-01',
      next_review: '2024-08-31',
      documents: ['BRP', 'Share Code Verification'],
      nationality: 'Spanish',
      notes: 'Visa expiry tracking enabled'
    }
    // Add more sample data
  ];

  const columns = [
    {
      header: 'Employee',
      key: 'employee_name',
      render: (value, row) => (
        <div>
          <span className="font-medium block">{value}</span>
          <span className="text-sm text-gray-500">{row.employee_id}</span>
        </div>
      )
    },
    {
      header: 'Department',
      key: 'department',
      render: (value, row) => (
        <div>
          <span className="block">{value}</span>
          <span className="text-sm text-gray-500">Manager: {row.manager}</span>
        </div>
      )
    },
    {
      header: 'RTW Status',
      key: 'rtw_status',
      render: (status, row) => (
        <div>
          <span className={`status-indicator ${getRTWStatusStyles(status)}`}>
            {status}
          </span>
          <span className="text-sm text-gray-500 block mt-1">{row.rtw_type}</span>
        </div>
      )
    },
    {
      header: 'Verification Details',
      key: 'last_verified',
      render: (date, row) => (
        <div>
          <div className="text-sm">
            <span className="text-gray-600">Last Verified: </span>
            {new Date(date).toLocaleDateString()}
          </div>
          {row.next_review && (
            <div className="text-sm">
              <span className={`${getNextReviewStyles(row.next_review)}`}>
                Next Review: {new Date(row.next_review).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Documents',
      key: 'documents',
      render: (docs) => (
        <div className="space-y-1">
          {docs.map((doc, idx) => (
            <span 
              key={idx}
              className="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded mr-1"
            >
              {doc}
            </span>
          ))}
        </div>
      )
    },
    {
      header: 'Notes',
      key: 'notes',
      render: (notes) => (
        <div className="max-w-xs truncate text-sm text-gray-600">
          {notes}
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
            View File
          </button>
        </div>
      )
    }
  ];

  const getRTWStatusStyles = (status) => {
    const statusStyles = {
      'Valid': 'bg-green-100 text-green-800',
      'Expiring Soon': 'bg-yellow-100 text-yellow-800',
      'Expired': 'bg-red-100 text-red-800',
      'Review Required': 'bg-orange-100 text-orange-800'
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-800';
  };

  const getNextReviewStyles = (date) => {
    const reviewDate = new Date(date);
    const today = new Date();
    const monthsUntilReview = (reviewDate - today) / (1000 * 60 * 60 * 24 * 30);
    
    if (monthsUntilReview <= 1) return 'text-red-600 font-medium';
    if (monthsUntilReview <= 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  const handleViewDetails = (id) => {
    console.log(`Viewing RTW details for employee: ${id}`);
  };

  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        setLoading(true);
        setError(null);
        // In production, this would be an API call
        setEmployeeData(sampleData);
      } catch (err) {
        setError(err.message);
        console.error('Error loading employee data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEmployeeData();
  }, []);

  const getFilteredData = () => {
    return employeeData.filter(employee => {
      const departmentMatch = filterDepartment === 'all' || employee.department === filterDepartment;
      const searchMatch = !searchTerm || 
        employee.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
      return departmentMatch && searchMatch;
    });
  };

  if (loading) {
    return (
      <div className="table-reporting">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading employee records...</div>
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
          <h3>Total Employees</h3>
          <div className="text-2xl font-bold">{employeeData.length}</div>
          <div className="text-sm text-gray-500">Active records</div>
        </div>
        <div className="summary-card">
          <h3>Valid RTW</h3>
          <div className="text-2xl font-bold">
            {employeeData.filter(e => e.rtw_status === 'Valid').length}
          </div>
          <div className="text-sm text-gray-500">Current permissions</div>
        </div>
        <div className="summary-card">
          <h3>Reviews Needed</h3>
          <div className="text-2xl font-bold text-orange-600">
            {employeeData.filter(e => e.rtw_status === 'Review Required').length}
          </div>
          <div className="text-sm text-gray-500">Require attention</div>
        </div>
        <div className="summary-card">
          <h3>Expiring Soon</h3>
          <div className="text-2xl font-bold text-yellow-600">
            {employeeData.filter(e => e.rtw_status === 'Expiring Soon').length}
          </div>
          <div className="text-sm text-gray-500">Next 3 months</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <select
            className="form-select"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="Marketing">Marketing</option>
            <option value="Engineering">Engineering</option>
            {/* Add other departments */}
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <button className="import-button">
          <Download className="h-4 w-4" />
          Export Records
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
              {getFilteredData().map((employee, index) => (
                <tr key={index} className="hover:bg-sky-50">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>
                      {column.render ? 
                        column.render(employee[column.key], employee) : 
                        employee[column.key]}
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

export default ReviewArchiveTable;
