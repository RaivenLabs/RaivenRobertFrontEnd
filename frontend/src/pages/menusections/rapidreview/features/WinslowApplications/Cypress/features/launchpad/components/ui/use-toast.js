import React from "react";

// Simple toast context
const ToastContext = React.createContext({
  toast: () => {},
});

// Toast provider component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  // Add a new toast to the array
  const toast = React.useCallback(({ title, description, variant = "default", duration = 5000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setToasts((prev) => [...prev, { id, title, description, variant, duration }]);
    
    // Auto-dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
    
    return id;
  }, []);

  // Remove a toast by ID
  const dismissToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Render the toasts and provider
  return (
    <ToastContext.Provider value={{ toast, dismissToast }}>
      {children}
      
      {/* Toast container */}
      {toasts.length > 0 && (
        <div className="fixed bottom-0 right-0 z-50 m-6 flex flex-col items-end gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`flex w-full max-w-sm overflow-hidden rounded-lg border shadow-lg ${
                t.variant === "destructive" 
                  ? "border-red-200 bg-red-50 text-red-900" 
                  : "border-gray-200 bg-white text-gray-900"
              }`}
              role="alert"
            >
              <div className="flex-1 p-4">
                {t.title && <p className="font-medium">{t.title}</p>}
                {t.description && <p className="text-sm text-gray-700">{t.description}</p>}
              </div>
              <button
                onClick={() => dismissToast(t.id)}
                className="flex-none border-l border-gray-200 p-2 text-gray-500 hover:bg-gray-100"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

// Hook to use toast functionality
export function useToast() {
  const context = React.useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
}

// Simple function to show toasts - for compatibility with the component in the review order component
export const toast = ({ title, description, variant }) => {
  // This is a fallback for when the hook isn't available
  console.log("[Toast]", variant, title, description);
  
  // In a real app, you would handle this differently, possibly with a singleton or global event
  // For this demo, we'll just show an alert if it's an error
  if (variant === "destructive") {
    alert(`${title}\n${description}`);
  }
};
