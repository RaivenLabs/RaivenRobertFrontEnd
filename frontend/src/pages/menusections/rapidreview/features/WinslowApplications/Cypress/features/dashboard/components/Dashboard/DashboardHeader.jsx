import React from 'react';

const DashboardHeader = ({ title }) => {
  return (
    <div className="bg-gray-200 text-gray-800 p-4 rounded-t-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{title}</h1>
        <span className="text-lg">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
};

export default DashboardHeader;
