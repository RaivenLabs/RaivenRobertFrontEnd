// Step 1: Create the component file with proper imports
import React, {useState, useEffect} from 'react';
// Import any required icons, components, constants, etc.
import { TEMPLATE_STAGES } from '../constants/index.jsx';

// Step 2: Define the component with its props interface


const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      console.error('Form Selection Error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) return fallback;
  return children;
};





// Step 6: Export the component
export default ErrorBoundary;


