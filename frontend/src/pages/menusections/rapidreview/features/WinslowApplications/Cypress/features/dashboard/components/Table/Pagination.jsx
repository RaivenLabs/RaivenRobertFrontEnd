import React from 'react';

const Pagination = ({ 
  totalItems, 
  currentPage = 1, 
  itemsPerPage = 10,
  onPageChange 
}) => {
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Calculate displayed range
  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };
  
  return (
    <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center rounded-b-lg">
      <div>
        Showing {startItem}-{endItem} of {totalItems} service orders
      </div>
      <div className="flex">
        {Array.from({ length: Math.min(totalPages, 3) }, (_, index) => (
          <button 
            key={index + 1}
            className={`${
              currentPage === index + 1 
                ? 'bg-gray-100' 
                : 'bg-white'
            } border border-gray-300 px-3 py-1 rounded-md mr-2 hover:bg-gray-200`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        
        {totalPages > 3 && (
          <>
            <button 
              className="bg-white border border-gray-300 px-3 py-1 rounded-md mr-2 hover:bg-gray-200"
            >
              ...
            </button>
            
            <button 
              className="bg-white border border-gray-300 px-4 py-1 rounded-md hover:bg-gray-200"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Pagination;
