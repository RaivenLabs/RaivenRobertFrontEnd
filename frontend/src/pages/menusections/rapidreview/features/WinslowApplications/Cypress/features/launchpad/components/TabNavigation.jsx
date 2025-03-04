import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="flex border-b border-gray-200 px-4 bg-gray-50">
      {tabs.map((tab) => (
        <button 
          key={tab.id}
          className={`py-2 px-4 font-medium ${
            activeTab === tab.id 
              ? 'text-royalBlue border-b-2 border-royalBlue' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
