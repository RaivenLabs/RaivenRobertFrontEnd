import React from 'react';

const PanelHeader = ({ title, isActive, icon: Icon }) => (
  <div className={`p-6 border-b border-gray-200 transition-all duration-300
    ${isActive ? 'bg-gradient-to-r from-royalBlue to-teal' : 'bg-white'}
    rounded-t-xl`}
  >
    <h2 className={`text-xl font-semibold flex items-center gap-2
      ${isActive ? 'text-white' : 'text-gray-800'}`}
    >
      <Icon className="w-6 h-6" />
      {title}
    </h2>
  </div>
);

export default PanelHeader;
