import React from 'react';
import PropTypes from 'prop-types';

/**
 * MiniSparkline component renders small bar or line charts for metric cards
 */
const MiniSparkline = ({ data, color, height = 40, type = 'line' }) => {
  // For bar charts
  if (type === 'bar') {
    // Handle empty data
    if (!data || data.length === 0) {
      return <div style={{ height }} className="w-full bg-gray-100 rounded" />;
    }
    
    const barWidth = 100 / data.length;
    const barGap = 1;
    const effectiveBarWidth = barWidth - barGap;
    
    // Get max value for scaling
    const maxValue = Math.max(...data);
      
    return (
      <svg width="100%" height={height} className="overflow-visible">
        {data.map((value, index) => {
          // Scale the value to the height
          const barHeight = (value / maxValue) * height;
          const x = (index / data.length) * 100;
          return (
            <rect
              key={index}
              x={`${x}%`}
              y={height - barHeight}
              width={`${effectiveBarWidth}%`}
              height={barHeight}
              fill={color}
            />
          );
        })}
      </svg>
    );
  }
  
  // For line charts - simple diagonal line from bottom left to top right
  return (
    <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
      <path
        d={`M0,100 L100,0`}
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
};

MiniSparkline.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  color: PropTypes.string.isRequired,
  height: PropTypes.number,
  type: PropTypes.oneOf(['line', 'bar'])
};

MiniSparkline.defaultProps = {
  data: [],
  height: 40,
  type: 'line'
};

export default MiniSparkline;
