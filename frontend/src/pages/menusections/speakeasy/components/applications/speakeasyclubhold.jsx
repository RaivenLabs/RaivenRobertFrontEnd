import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SpeakeasyClub = () => {
  const [programData, setProgramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const loadProgramData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual program loading
        // Simulating program data load for testing
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgramData({
          sections: [
            {
              title: "Life & Leisure",
              applications: [
                { name: "Florence Food Guide", status: "active" },
                { name: "10K Trainer", status: "pending" }
              ]
            },
            {
              title: "Culture & Arts",
              applications: [
                { name: "London Theater Guide", status: "active" },
                { name: "Museum Navigator", status: "active" }
              ]
            }
          ]
        });
      } catch (err) {
        setError("Error loading program data");
        console.error("Program loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProgramData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h2 className="text-red-800 text-lg font-semibold">Error Loading Applications</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Debug section - will remove later */}
      <div className="mb-6 p-4 bg-cyan-50 border border-cyan-200 rounded-md">
        <h2 className="text-cyan-800 font-semibold">Debug Information</h2>
        <p className="text-cyan-600">Current Path: {location.pathname}</p>
        <p className="text-cyan-600">Component: SpeakeasyClub</p>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Speakeasy Club Applications</h1>
        <p className="text-gray-600">Discover and manage your Speakeasy applications.</p>
      </div>

      {programData && programData.sections.map((section, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{section.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.applications.map((app, appIndex) => (
              <div 
                key={appIndex}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
              >
                <h3 className="font-medium text-gray-900">{app.name}</h3>
                <span className={`
                  inline-block px-2 py-1 text-sm rounded-full mt-2
                  ${app.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                `}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpeakeasyClub;
