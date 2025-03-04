import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const DimensionProgress = ({ dimension, transactionId }) => {
  const navigate = useNavigate();
  
  const getProgressColorClass = (percentage) => {
    if (percentage >= 80) return 'progress-high';
    if (percentage >= 60) return 'progress-medium';
    if (percentage >= 30) return 'progress-low';
    return 'progress-critical';
  };
  
  const handleDimensionClick = () => {
    if (dimension.status === 'Not Started') {
      // Modal to confirm starting this dimension
      if (window.confirm(`Do you want to begin the ${dimension.displayName} dimension for this transaction?`)) {
        // Navigate to the dimension detail view with a special flag to initialize it
        navigate(`/transactions/${transactionId}/dimensions/${dimension.id}?initialize=true`);
      }
    } else {
      // Navigate to the dimension detail view
      navigate(`/transactions/${transactionId}/dimensions/${dimension.id}`);
    }
  };
  
  // For dimensions that haven't been started yet
  if (dimension.status === 'Not Started') {
    return (
      <div className="dimension-card not-started" onClick={handleDimensionClick}>
        <div className="dimension-title">{dimension.displayName}</div>
        <div className="not-started-message">Not started - Click to initiate</div>
      </div>
    );
  }
  
  return (
    <div className="dimension-card" onClick={handleDimensionClick}>
      <div className="dimension-title">{dimension.displayName}</div>
      <div className="progress-container">
        <div className="progress-bar-bg">
          <div 
            className={`progress-bar-fill ${getProgressColorClass(dimension.completionPercentage)}`}
            style={{ width: `${dimension.completionPercentage}%` }}
          />
        </div>
        <div className={`progress-percentage ${getProgressColorClass(dimension.completionPercentage)}`}>
          {dimension.completionPercentage}%
        </div>
      </div>
    </div>
  );
};

export default DimensionProgress;
