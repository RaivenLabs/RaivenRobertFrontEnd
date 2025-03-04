import React from 'react';
import PropTypes from 'prop-types';

/**
 * LoadingIndicator component displays a loading spinner or message
 * with different variations for different contexts
 */
const LoadingIndicator = ({ 
  type = 'spinner',
  size = 'medium',
  color = 'royalBlue',
  text = 'Loading...',
  fullScreen = false,
  overlay = false
}) => {
  // Determine color class
  const getColorClass = (color) => {
    switch (color) {
      case 'royalBlue':
        return 'text-royalBlue border-royalBlue';
      case 'white':
        return 'text-white border-white';
      case 'gray':
        return 'text-gray-500 border-gray-500';
      default:
        return 'text-royalBlue border-royalBlue';
    }
  };

  // Determine size class for spinner
  const getSpinnerSize = (size) => {
    switch (size) {
      case 'small':
        return 'h-6 w-6 border-2';
      case 'large':
        return 'h-16 w-16 border-4';
      case 'medium':
      default:
        return 'h-12 w-12 border-b-2';
    }
  };

  // Determine text size
  const getTextSize = (size) => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-xl';
      case 'medium':
      default:
        return 'text-base';
    }
  };

  // Get container classes
  const getContainerClasses = () => {
    let classes = 'flex items-center justify-center';
    
    if (fullScreen) {
      classes += ' fixed inset-0 z-50';
      
      if (overlay) {
        classes += ' bg-black bg-opacity-50';
      }
    } else {
      classes += ' h-64';
    }
    
    return classes;
  };

  const colorClass = getColorClass(color);
  const spinnerSize = getSpinnerSize(size);
  const textSize = getTextSize(size);
  const containerClasses = getContainerClasses();

  // Pulse animation for loading text
  if (type === 'text') {
    return (
      <div className={containerClasses}>
        <div className={`${textSize} ${colorClass.split(' ')[0]} animate-pulse font-medium`}>
          {text}
        </div>
      </div>
    );
  }

  // Inline text with spinner (for notifications)
  if (type === 'inline') {
    return (
      <div className="bg-blue-50 p-2 text-center text-royalBlue">
        <span className="inline-block animate-spin mr-2">⟳</span> {text}
      </div>
    );
  }

  // Standard spinner (default)
  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center">
        <div className={`${spinnerSize} ${colorClass} rounded-full animate-spin`}></div>
        {text && (
          <p className={`${textSize} ${colorClass.split(' ')[0]} mt-4`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

LoadingIndicator.propTypes = {
  type: PropTypes.oneOf(['spinner', 'text', 'inline']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['royalBlue', 'white', 'gray']),
  text: PropTypes.string,
  fullScreen: PropTypes.bool,
  overlay: PropTypes.bool
};

export default LoadingIndicator;
