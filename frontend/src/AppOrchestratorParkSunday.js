import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

// Hogwarts components
const Hogwarts = () => (
  <div>
    <h1>Hogwarts School of Witchcraft and Wizardry</h1>
    <p>Welcome to Hogwarts! You can visit 7:</p>
    <ul>
      <li><a href="/rapidresponse/winslowapplications/apps/hogwarts/dashboard">Dashboard</a></li>
      <li><a href="/rapidresponse/winslowapplications/apps/hogwarts/courses">Courses</a></li>
      <li><a href="/rapidresponse/winslowapplications/apps/hogwarts/students">Students</a></li>
    </ul>
  </div>
);

const HogwartsDashboard = () => (
  <div>
    <h1>Hogwarts Dashboard</h1>
    <p>House points, upcoming events, announcements, etc.</p>
    <a href="/rapidresponse/winslowapplications/apps/hogwarts">Back to Hogwarts</a>
  </div>
);

const HogwartsCourses = () => (
  <div>
    <h1>Hogwarts Courses</h1>
    <ul>
      <li>Potions</li>
      <li>Defense Against the Dark Arts</li>
      <li>Transfiguration</li>
    </ul>
    <a href="/rapidresponse/winslowapplications/apps/hogwarts">Back to Hogwarts</a>
  </div>
);

const HogwartsStudents = () => (
  <div>
    <h1>Hogwarts Students</h1>
    <ul>
      <li>Harry Potter - Gryffindor</li>
      <li>Hermione Granger - Gryffindor</li>
      <li>Draco Malfoy - Slytherin</li>
    </ul>
    <a href="/rapidresponse/winslowapplications/apps/hogwarts">Back to Hogwarts</a>
  </div>
);

// Master orchestrator that's aware of your config structure
const MasterAppOrchestrator = () => {
  const location = useLocation();
  const [appConfig, setAppConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentApp, setCurrentApp] = useState(null);
  
  // In a real implementation, you would fetch this from your API or import it
  useEffect(() => {
    // Simulating loading the config
    const loadConfig = async () => {
      // This would be your actual config loading logic
      // For now, we'll hardcode it based on your pasted config
      const config = {
        rapidResponse: {
          applications: {
            hogwarts: {
              id: "hogwartslearning",
              name: "Hogwarts Prototype",
              outletroute: "apps/hogwarts",
              sidebarroute: "apps/hogwartssidebar",
              features: {
                dashboard: { path: "dashboard" },
                courses: { path: "courses" },
                students: { path: "students" }
              }
            }
            // You would add more applications here from your config
          }
        }
      };
      
      setAppConfig(config);
      setIsLoading(false);
    };
    
    loadConfig();
  }, []);
  
  useEffect(() => {
    if (!appConfig) return;
    
    // Parse the current path to identify which app we're in
    const path = location.pathname;
    const pathParts = path.split('/').filter(Boolean);
    
    // Find the "apps" part of the path
    const appsIndex = pathParts.findIndex(part => part === 'apps');
    if (appsIndex !== -1 && appsIndex < pathParts.length - 1) {
      const appName = pathParts[appsIndex + 1];
      // Find the matching app in our config
      for (const [key, app] of Object.entries(appConfig.rapidResponse.applications)) {
        if (key === appName) {
          setCurrentApp({
            ...app,
            feature: pathParts[appsIndex + 2] || null
          });
          return;
        }
      }
    }
    
    setCurrentApp(null);
  }, [location, appConfig]);
  
  if (isLoading) {
    return <div>Loading application configuration...</div>;
  }
  
  // If no app is found, show the directory
  if (!currentApp) {
    return (
      <div>
        <h1>Application Directory</h1>
        <p>Available applications:</p>
        <ul>
          {appConfig && Object.entries(appConfig.rapidResponse.applications).map(([key, app]) => (
            <li key={app.id}>
              <a href={`/rapidresponse/winslowapplications/${app.outletroute}`}>
                {app.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  // Render the appropriate component based on the current app and feature
  if (currentApp.id === "hogwartslearning") {
    if (!currentApp.feature) {
      return <Hogwarts />;
    }
    
    switch (currentApp.feature) {
      case "dashboard":
        return <HogwartsDashboard />;
      case "courses":
        return <HogwartsCourses />;
      case "students":
        return <HogwartsStudents />;
      default:
        return <Navigate to={`/rapidresponse/winslowapplications/apps/hogwarts`} replace />;
    }
  }
  
  // Handle other applications as they are added
  
  // Default fallback if no matching application is found
  return <Navigate to="/rapidresponse/winslowapplications/apps" replace />;
};

export default MasterAppOrchestrator;
