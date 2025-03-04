import React from 'react';

const TableHeader = ({ 
  totalOrders, 
  onRefreshData, 
  onNewOrder
}) => {
  return (
    <div className="bg-gray-50 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-royalBlue">
          Service Order Count: {totalOrders}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={onRefreshData}
            className="border border-royalBlue text-royalBlue px-4 py-2 rounded hover:bg-blue-50"
          >
            Refresh Data
          </button>
          <button 
            onClick={onNewOrder}
            className="bg-royalBlue text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Service Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
