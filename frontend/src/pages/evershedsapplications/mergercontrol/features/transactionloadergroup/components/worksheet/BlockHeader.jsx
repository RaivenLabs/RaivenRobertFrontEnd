// src/features/transaction-loader/components/Worksheet/BlockHeader.jsx
import React from 'react';

const BlockHeader = ({ title, totalEntities }) => (
  <div className="bg-gray-50 px-6 py-4 border-t border-b border-gray-200">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {totalEntities > 0 && (
        <span className="text-sm text-gray-500">
          {totalEntities} {totalEntities === 1 ? 'member state' : 'member states'}
        </span>
      )}
    </div>
  </div>
);

export default BlockHeader;
