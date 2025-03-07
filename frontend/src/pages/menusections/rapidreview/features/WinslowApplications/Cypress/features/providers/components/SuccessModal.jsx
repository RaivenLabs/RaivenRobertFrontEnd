import React from 'react';

const SuccessModal = ({ isOpen, onClose, supplierName, rateCardCount, saveResult }) => {
  if (!isOpen) return null;
  
  // Check if save is in progress
  const isInProgress = saveResult?.inProgress;
  const hasError = saveResult?.error;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto shadow-xl">
        <div className="text-center mb-4">
          {isInProgress ? (
            // Loading spinner while saving
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
              <svg className="w-6 h-6 text-blue-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : hasError ? (
            // Error icon if there was an error
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          ) : (
            // Success checkmark
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          )}
          
          <h3 className="text-lg font-semibold text-gray-900">
            {isInProgress ? "Saving Configuration..." : 
             hasError ? "Configuration Error" : 
             "Configuration Successful!"}
          </h3>
        </div>
        
        <div className="mb-6">
          {isInProgress ? (
            <p className="text-center text-gray-600 mb-3">
              Please wait while we save your configuration. This may take a moment...
            </p>
          ) : hasError ? (
            <>
              <p className="text-center text-red-600 mb-3">
                There was an error saving the configuration:
              </p>
              <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800">
                {saveResult.error}
              </div>
            </>
          ) : (
            <>
              <p className="text-center text-gray-600 mb-3">
                The supplier <span className="font-medium">{supplierName || "Unnamed Supplier"}</span> has been successfully configured.
              </p>
              
              <div className="bg-gray-50 rounded p-3 text-sm">
                <p className="font-medium mb-1">Summary:</p>
                <ul className="ml-4 list-disc text-gray-600">
                  <li>{saveResult?.totalProcessed || rateCardCount || 0} rate items have been saved to the database</li>
                  <li>Supplier information has been recorded</li>
                  <li>Contract details have been stored</li>
                </ul>
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-center gap-3">
          {isInProgress ? (
            <button
              disabled
              className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
            >
              Processing...
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {hasError ? "Close" : "Done"}
              </button>
              
              {!hasError && (
                <button
                  onClick={() => {
                    onClose();
                    // Navigate to supplier list or dashboard
                    window.location.href = '/suppliers';
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  View All Suppliers
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
