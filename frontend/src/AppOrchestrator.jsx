import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Add this console log at the top level for immediate logging
console.log("MasterAppOrchestrator loaded");

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

  // Add detailed logging of the state object
  useEffect(() => {
    console.log("MasterAppOrchestrator: Full location object:", {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      key: location.key,
      state: location.state
    });
    
    console.log("MasterAppOrchestrator: App data from state:", appData);
    
    // Log a more detailed view if appData exists
    if (appData) {
      console.log("MasterAppOrchestrator: App data properties:");
      Object.keys(appData).forEach(key => {
        console.log(`  - ${key}:`, appData[key]);
      });
    }
  }, [location, appData]);

  useEffect(() => {
    if (!appData) {
      setError("No application data available.");
      setLoading(false);
      return;
    }
    
    console.log("Attempting to import component from path:", appData.componentPath);

    
    
    // Create a mapping of component paths to their import functions
    const componentPathMapping = {
      'applications/hogwarts': () => import('./pages/applications/hogwarts'),
     
      // Add more mappings as needed
    };
    
    const loadComponent = async () => {
      try {
        if (!componentPathMapping[appData.componentPath]) {
          throw new Error(`Unknown component path: ${appData.componentPath}`);
        }
        
        console.log("Using mapped import for:", appData.componentPath);
        const module = await componentPathMapping[appData.componentPath]();
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
