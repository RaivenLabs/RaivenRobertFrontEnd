// src/components/common/Tooltip.jsx
import React, { useState } from 'react';

const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div className="absolute z-50 w-64 p-2 mt-2 text-sm text-white bg-gray-800 
          rounded-lg shadow-lg -translate-x-1/2 left-1/2">
          {content}
          <div className="absolute w-2 h-2 bg-gray-800 rotate-45 -top-1 left-1/2 
            -translate-x-1/2" />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
