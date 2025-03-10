import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '../../../context/SidebarContext';

const LoadingIndicator = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="ml-4 text-lg font-medium">Loading application...</p>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
    <h2 className="text-xl font-semibold text-red-700 mb-2">Application Error</h2>
    <p className="text-red-600">{message || "Failed to load the application"}</p>
  </div>
);

const MasterAppOrchestrator = () => {
  const location = useLocation();
  const { setActiveSidebar } = useSidebar();
  const appData = location.state?.appData;
  const [AppComponent, setAppComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!appData) {
      setError("No application data available. Please return to the application selection page.");
      setLoading(false);
      return;
    }

    // Set the sidebar based on the app configuration
    if (appData.sidebarroute) {
      setActiveSidebar(appData.sidebarroute);
    }

    // Dynamically import the app component based on componentPath
    const loadComponent = async () => {
      try {
        console.log(`Loading component from path: ${appData.componentPath}`);
        // Dynamic import using the componentPath from appData
        const module = await import(`../../../${appData.componentPath}`);
        setAppComponent(() => module.default);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load application component:", err);
        setError(`Could not load application: ${err.message}`);
        setLoading(false);
      }
    };

    loadComponent();
  }, [appData, setActiveSidebar]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error || !AppComponent) {
    return <ErrorDisplay message={error} />;
  }

  // Render the app component and pass the full appData as props
  return <AppComponent appData={appData} />;
};

export default MasterAppOrchestrator;
