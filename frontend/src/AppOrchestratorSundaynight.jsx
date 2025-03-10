import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LoadingIndicator = () => (
  <div className="text-center p-10">
    <p>Loading application...</p>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
    <h2 className="font-semibold text-red-700 mb-2">Application Error</h2>
    <p className="text-red-600">{message || "Failed to load the application"}</p>
  </div>
);

const MasterAppOrchestrator = () => {
  const location = useLocation();
  const appData = location.state?.appData;
  const [AppComponent, setAppComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!appData) {
      setError("No application data available.");
      setLoading(false);
      return;
    }

    // Map app IDs to their components instead of using dynamic imports
    const loadComponent = async () => {
      try {
        let module;
        
        // Use a switch statement or object mapping based on app ID
        // This avoids Webpack's context module issues
        switch(appData.id) {
          case 'hogwartslearning':
            module = await import('./pages/applications/hogwarts');
            break;
          case 'winslowcypress':
            module = await import('./pages/applications/cypress');
            break;
          case 'esrecruiting':
            module = await import('./pages/applications/recruiting');
            break;
          // Add more cases as needed
          default:
            throw new Error(`Unknown app ID: ${appData.id}`);
        }
        
        setAppComponent(() => module.default);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load application component:", err);
        setError(`Could not load application: ${err.message}`);
        setLoading(false);
      }
    };

    loadComponent();
  }, [appData]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error || !AppComponent) {
    return <ErrorDisplay message={error} />;
  }

  return <AppComponent appData={appData} />;
};

export default MasterAppOrchestrator;
