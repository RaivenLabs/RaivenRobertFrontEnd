import React, { useState } from 'react';
import DimensionProgress from './DimensionProgress';
import './Dashboard.css';

const TransactionList = ({ transactions, onTransactionSelect }) => {
  const [expandedTransaction, setExpandedTransaction] = useState(null);

  const toggleExpand = (transactionId) => {
    if (expandedTransaction === transactionId) {
      setExpandedTransaction(null);
    } else {
      setExpandedTransaction(transactionId);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    
    // For millions, use "M" suffix
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    
    // For amounts under a million, use regular formatting
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRiskLevelClass = (score) => {
    if (score >= 85) return 'risk-level-low';
    if (score >= 70) return 'risk-level-med';
    if (score >= 50) return 'risk-level-high';
    return 'risk-level-critical';
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'Due Diligence': 'status-due-diligence',
      'Regulatory': 'status-regulatory',
      'Modeling': 'status-modeling',
      'Pending': 'status-pending',
      'Completed': 'status-completed'
    };
    
    return statusMap[status] || 'status-default';
  };

  if (!transactions || transactions.length === 0) {
    return <div className="no-transactions">No transactions found matching the criteria.</div>;
  }

  return (
    <div className="transaction-list">
      <div className="table-header">
        <div className="table-title">
          Active M&A Transactions (Showing {transactions.length} of {transactions.length})
        </div>
      </div>
      
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Target</th>
            <th>Acquirer</th>
            <th>Industry</th>
            <th>Status</th>
            <th>Timeline</th>
            <th>Deal Value</th>
            <th>Actions</th>
            <th>DD Score</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <React.Fragment key={transaction.id}>
              <tr 
                className={expandedTransaction === transaction.id ? 'expanded-row' : ''}
                onClick={() => toggleExpand(transaction.id)}
              >
                <td>{transaction.projectId}</td>
                <td>{transaction.targetName}</td>
                <td>{transaction.acquirerName}</td>
                <td>{transaction.industry}</td>
                <td>
                  <span className={`status-pill ${getStatusClass(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </td>
                <td>{transaction.timelineEstClose}</td>
                <td>{formatCurrency(transaction.dealValue)}</td>
                <td>
                  <button 
                    className="view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTransactionSelect(transaction.id);
                    }}
                  >
                    View
                  </button>
                </td>
                <td>
                  <span className={`score-pill ${getRiskLevelClass(transaction.overallDdScore)}`}>
                    {transaction.overallDdScore}%
                  </span>
                </td>
              </tr>
              
              {expandedTransaction === transaction.id && (
                <tr className="expanded-details">
                  <td colSpan="9">
                    <div className="dimension-container">
                      <h3>Due Diligence Status by Dimension</h3>
                      <div className="dimension-grid">
                        {transaction.dimensions?.map((dimension) => (
                          <DimensionProgress 
                            key={dimension.id} 
                            dimension={dimension}
                            transactionId={transaction.id}
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      
      <div className="pagination">
        <div className="showing-text">Showing 1-{transactions.length} of {transactions.length} active transactions</div>
        <div className="page-controls">
          <button className="page-button active">1</button>
          <button className="page-button">2</button>
          <button className="page-button">3</button>
          <button className="page-button">...</button>
          <button className="page-button next">Next →</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
