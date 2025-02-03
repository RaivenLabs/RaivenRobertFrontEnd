import React, { useState, useEffect } from 'react';
import { UserCheck, AlertCircle, Clock, CheckCircle, Building, Calendar } from 'lucide-react';
import './ActiveReviewsTable.css';

const ActiveReviewsTable = () => {
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample data - in production, this would come from your API
  const sampleData = [
    {
      id: 1,
      candidate_name: 'Sarah Chen',
      department: 'Engineering',
      hiring_manager: 'David Wilson',
      check_type: 'Initial Verification',
      status: 'In Progress',
      priority: 'High',
      submission_date: '2024-01-28',
      target_completion: '2024-02-04',
      document_status: 'Partial'
    },
    {
      id: 2,
      candidate_name: 'Marcus Brown',
      department: 'Sales',
      hiring_manager: 'Emma Thompson',
      check_type: 'Follow-up',
      status: 'Document Review',
      priority: 'Medium',
      submission_date: '2024-01-25',
      target_completion: '2024-02-01',
      document_status: 'Complete'
    }
    // Add more sample data as needed
  ];

  const columns = [
    {
      header: 'Candidate',
      key: 'candidate_name',
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      header: 'Department',
      key: 'department'
    },
    {
      header: 'Hiring Manager',
      key: 'hiring_manager'
    },
    {
      header: 'Check Type',
      key: 'check_type',
      render: (type) => (
        <span className="text-gray-600">
          {type}
        </span>
      )
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
      header: 'Priority',
      key: 'priority',
      render: (priority) => (
        <span className={`status-indicator ${getPriorityStyles(priority)}`}>
          {priority}
        </span>
      )
    },
    {
      header: 'Submitted',
      key: 'submission_date',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      header: 'Target Date',
      key: 'target_completion',
      render: (date) => (
        <span className={getTargetDateStyles(date)}>
          {new Date(date).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Documents',
      key: 'document_status',
      render: (status) => (
        <span className={`status-indicator ${getDocumentStatusStyles(status)}`}>
          {status}
        </span>
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
            Review
          </button>
        </div>
      )
    }
  ];

  const getStatusStyles = (status) => {
    const statusStyles = {
      'Complete': 'bg-green-100 text-green-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Document Review': 'bg-yellow-100 text-yellow-800',
      'Blocked': 'bg-red-100 text-red-800',
      'Pending': 'bg-gray-100 text-gray-800'
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityStyles = (priority) => {
    const priorityStyles = {
      'High': 'bg-red-50 text-red-700',
      'Medium': 'bg-yellow-50 text-yellow-700',
      'Low': 'bg-green-50 text-green-700'
    };
    return priorityStyles[priority] || 'bg-gray-50 text-gray-700';
  };

  const getDocumentStatusStyles = (status) => {
    const docStyles = {
      'Complete': 'bg-green-100 text-green-800',
      'Partial': 'bg-yellow-100 text-yellow-800',
      'Missing': 'bg-red-100 text-red-800'
    };
    return docStyles[status] || 'bg-gray-100 text-gray-800';
  };

  const getTargetDateStyles = (date) => {
    const targetDate = new Date(date);
    const today = new Date();
    const daysUntilTarget = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilTarget < 0) return 'text-red-600 font-medium';
    if (daysUntilTarget <= 2) return 'text-orange-600 font-medium';
    return 'text-gray-600';
  };

  const handleViewDetails = (id) => {
    console.log(`Viewing details for review: ${id}`);
  };

  useEffect(() => {
    // Simulate API call
    const loadReviewsData = async () => {
      try {
        setLoading(true);
        setError(null);
        // In production, this would be an API call
        setReviewsData(sampleData);
      } catch (err) {
        setError(err.message);
        console.error('Error loading reviews data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReviewsData();
  }, []);

  if (loading) {
    return (
      <div className="table-reporting">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading active reviews...</div>
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
          <h3>Active Reviews</h3>
          <div className="text-2xl font-bold">{reviewsData.length}</div>
          <div className="text-sm text-gray-500">Total in progress</div>
        </div>
        <div className="summary-card">
          <h3>High Priority</h3>
          <div className="text-2xl font-bold">
            {reviewsData.filter(r => r.priority === 'High').length}
          </div>
          <div className="text-sm text-gray-500">Require immediate attention</div>
        </div>
        <div className="summary-card">
          <h3>Due This Week</h3>
          <div className="text-2xl font-bold">
            {reviewsData.filter(r => {
              const dueDate = new Date(r.target_completion);
              const weekFromNow = new Date();
              weekFromNow.setDate(weekFromNow.getDate() + 7);
              return dueDate <= weekFromNow;
            }).length}
          </div>
          <div className="text-sm text-gray-500">Target completion</div>
        </div>
        <div className="summary-card">
          <h3>Document Review</h3>
          <div className="text-2xl font-bold">
            {reviewsData.filter(r => r.document_status !== 'Complete').length}
          </div>
          <div className="text-sm text-gray-500">Awaiting documents</div>
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
              {reviewsData.map((review, index) => (
                <tr key={index} className="hover:bg-sky-50">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>
                      {column.render ? 
                        column.render(review[column.key], review) : 
                        review[column.key]}
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

export default ActiveReviewsTable;
