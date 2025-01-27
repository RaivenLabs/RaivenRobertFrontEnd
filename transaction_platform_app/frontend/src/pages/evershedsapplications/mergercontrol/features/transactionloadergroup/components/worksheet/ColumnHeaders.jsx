// src/features/transaction-loader/components/Worksheet/ColumnHeaders.jsx
import React from 'react';

const ColumnHeaders = ({ headers }) => (
  <div className="bg-white border-b border-gray-200">
    <table className="min-w-full">
      <thead>
        <tr>
          {/* First column is always member state name */}
          <th className="pl-6 pr-4 py-3 text-left text-sm font-semibold text-gray-900 w-48">
            Member State
          </th>
          
          {/* Render remaining headers */}
          {Object.entries(headers).map(([key, label]) => (
            <th
              key={key}
              className="pl-6 pr-4 py-3 text-left text-sm font-semibold text-gray-900 w-48"
            >
              {label}
            </th>
          ))}
        </tr>
      </thead>
    </table>
  </div>
);

export default ColumnHeaders;
