import React from 'react';
import PropTypes from 'prop-types';

/**
 * ProgressDimensions component displays project progress metrics
 * as a grid of progress bars
 */
const ProgressDimensions = ({ dimensions }) => {
  return (
    <div>
      <h3 className="font-bold text-gray-800 mb-3">Project Progress</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dimensions.map((dimension, idx) => (
          <div 
            key={idx} 
            className="bg-white p-3 rounded border border-gray-200 shadow-sm"
          >
            <p className="font-medium text-gray-800 mb-2">{dimension.name}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
              <div 
                className="h-2.5 rounded-full" 
                style={{
                  width: `${dimension.progress}%`, 
                  backgroundColor: dimension.color
                }}
              ></div>
            </div>
            <div className="text-right text-sm font-medium" style={{ color: dimension.color }}>
              {dimension.progress}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ProgressDimensions.propTypes = {
  dimensions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      progress: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired
    })
  ).isRequired
};

export default ProgressDimensions;
