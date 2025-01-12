import React, { useState, useEffect } from 'react';
import { useConfig } from '../../../context/ConfigContext';
import { fetchFromAPI } from '../../../utils/api/api';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, BarChart2, Shield, Settings, 
  Lock, FileSearch, Activity, Gauge, Bell
} from 'lucide-react';

const ApplicationGroup = ({ apiEndpoint, onSidebarChange }) => {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);



  const { coreconfig } = useConfig();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pressTimer, setPressTimer] = useState(null);
  const [activeApp, setActiveApp] = useState(null);

  useEffect(() => {
    const loadApps = async () => {
      try {
        setLoading(true);
       const data = await fetchFromAPI(apiEndpoint, coreconfig.apiUrl);
        
        // Flatten all programs from all groups into a single array
        const allPrograms = data.program_groups.flatMap(group => group.programs);
        
        // Randomly select 9 unique programs
        const selectedApps = [];
        const usedIndices = new Set();
        
        while (selectedApps.length < 9 && usedIndices.size < allPrograms.length) {
          const randomIndex = Math.floor(Math.random() * allPrograms.length);
          if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            selectedApps.push({
              ...allPrograms[randomIndex],
              isLive: selectedApps.length < 2 // First 2 apps will be live
            });
          }
        }
        
        // Shuffle the array to randomize which apps are live
        const shuffledApps = selectedApps.sort(() => Math.random() - 0.5);
        setApps(shuffledApps);
      } catch (error) {
        console.error('Error loading apps:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, [apiEndpoint]);

  const handlePressStart = (app) => {
    if (!app.isLive) return; // Only allow press on live apps
    
    setActiveApp(app);
    const timer = setTimeout(() => {
      if (app.route) {
        navigate(`/${app.route}`);
        onSidebarChange(app.id);
      }
    }, 1000);
    setPressTimer(timer);
  };

  const handlePressEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    setActiveApp(null);
  };

  const getAppIcon = (appName) => {
    const icons = {
      'contract assembly': FileText,
      'analytics': BarChart2,
      'compliance': Shield,
      'access control': Lock,
      'document search': FileSearch,
      'workflow': Activity,
      'monitoring': Gauge,
      'notifications': Bell,
      'default': Settings
    };

    const Icon = icons[appName.toLowerCase()] || icons.default;
    return Icon;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Error Loading Apps</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {apps.map((app) => {
        const Icon = getAppIcon(app.name);
        return (
          <div
            key={app.id}
            onMouseDown={() => handlePressStart(app)}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={() => handlePressStart(app)}
            onTouchEnd={handlePressEnd}
            className={`
              relative p-6 rounded-xl text-center transition-all duration-200
              ${app.isLive ? 'bg-white shadow-lg hover:shadow-xl' : 'bg-gray-50 text-gray-600'}
              ${activeApp?.id === app.id ? 'scale-95' : 'scale-100'}
              cursor-pointer
            `}
          >
            <div className="flex flex-col items-center gap-3">
              <Icon className={`w-12 h-12 ${app.isLive ? 'text-royalBlue' : 'text-gray-400'}`} />
              <span className="font-medium">{app.name}</span>
              {!app.isLive && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Prototyping
                </span>
              )}
            </div>
            {activeApp?.id === app.id && (
              <div className="absolute inset-0 bg-royalBlue/10 rounded-xl">
                <div className="h-1 bg-royalBlue transition-all duration-1000 w-full" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ApplicationGroup;
