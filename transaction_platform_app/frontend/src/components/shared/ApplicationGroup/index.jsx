import React, { useState, useEffect } from 'react';
import { useConfig } from '../../../context/ConfigContext';
import { fetchFromAPI } from '../../../utils/api/api';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../../../context/SidebarContext';
import { 
  FileText, BarChart2, Shield, Settings, 
  Lock, FileSearch, Activity, Gauge, Bell
} from 'lucide-react';

const ApplicationGroup = ({ apiEndpoint }) => {  // No longer needs setActiveSidebar prop
  const navigate = useNavigate();
  const { setActiveSidebar } = useSidebar();  // Get setActiveSidebar from context
  const [apps, setApps] = useState([]);
  const { config, coreconfig, isAuthenticated } = useConfig();
  const actuallyAuthenticated = config?.datapath && !config.datapath.includes('hawkeye');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pressTimer, setPressTimer] = useState(null);
  const [activeApp, setActiveApp] = useState(null);
  const [hoveredApp, setHoveredApp] = useState(null);

  useEffect(() => {
    const loadApps = async () => {
      try {
        setLoading(true);
        const data = await fetchFromAPI(apiEndpoint, coreconfig.apiUrl, {
          headers: {
            'X-Customer-Path': config?.datapath || 'hawkeye'
          }
        });
        
        if (!isAuthenticated && !actuallyAuthenticated) {
          const allPrograms = data.program_groups.flatMap(group => group.programs);
          const selectedApps = [];
          const usedIndices = new Set();
          
          while (selectedApps.length < 9 && usedIndices.size < allPrograms.length) {
            const randomIndex = Math.floor(Math.random() * allPrograms.length);
            if (!usedIndices.has(randomIndex)) {
              usedIndices.add(randomIndex);
              selectedApps.push({
                ...allPrograms[randomIndex],
                isLive: selectedApps.length < 2
              });
            }
          }
          
          setApps(selectedApps.sort(() => Math.random() - 0.5));
        } else {
          const customerApps = data.program_groups.flatMap(group => group.programs);
          setApps(customerApps);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, [apiEndpoint, config?.datapath, coreconfig.apiUrl, isAuthenticated, actuallyAuthenticated]);

  const handlePressStart = (app) => {
    if (!app.isLive) return;
    
    setActiveApp(app);
    const timer = setTimeout(() => {
      if (app.outletroute && app.sidebarroute) {
        console.log('🚀 Application transition:', {
          from: 'ApplicationGroup',
          app: app.name,
          route: app.outletroute,
          sidebar: app.sidebarroute,
          timestamp: new Date().toISOString()
        });

        // First navigate to ensure the route is ready
        navigate(app.outletroute);
        
        // Set the sidebar route using context
        console.log('🎮 ApplicationGroup: Taking control of sidebar, setting to:', app.sidebarroute);
        setActiveSidebar(app.sidebarroute);
      }
    },200);
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

  const getGradient = (appName) => {
    const gradients = {
      'contract assembly': 'from-blue-500 to-indigo-600',
      'analytics': 'from-emerald-500 to-teal-600',
      'compliance': 'from-orange-500 to-red-600',
      'access control': 'from-purple-500 to-pink-600',
      'document search': 'from-cyan-500 to-blue-600',
      'workflow': 'from-rose-500 to-pink-600',
      'monitoring': 'from-amber-500 to-orange-600',
      'notifications': 'from-lime-500 to-green-600',
      'default': 'from-gray-500 to-slate-600'
    };

    return gradients[appName.toLowerCase()] || gradients.default;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
        <h3 className="text-lg font-semibold mb-2">Error Loading Apps</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={`
      ${isAuthenticated || actuallyAuthenticated
        ? 'grid grid-cols-3 gap-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-4' 
        : 'grid grid-cols-3 gap-6'}
    `}>
      {apps.map((app) => {
        const Icon = getAppIcon(app.name);
        const gradientColors = getGradient(app.name);
        const isHovered = hoveredApp === app.id;
        
        return (
          <div
            key={app.id}
            onMouseEnter={() => setHoveredApp(app.id)}
            onMouseLeave={() => {
              setHoveredApp(null);
              handlePressEnd();
            }}
            onMouseDown={() => handlePressStart(app)}
            onMouseUp={handlePressEnd}
            onTouchStart={() => handlePressStart(app)}
            onTouchEnd={handlePressEnd}
            className={`
              relative p-6 rounded-xl text-center transition-all duration-300
              ${app.isLive ? 'border-4 border-royalBlue' : 'border-2 border-gray-300'}
              ${app.isLive 
                ? `bg-gradient-to-br ${gradientColors} hover:shadow-2xl hover:-translate-y-1` 
                : 'bg-gradient-to-br from-gray-200 to-gray-300'}
              ${activeApp?.id === app.id ? 'scale-95' : 'scale-100'}
              cursor-pointer transform
              group
            `}
          >
            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-[1px]" />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className={`
                p-3 rounded-full bg-white/90 backdrop-blur-sm
                transform transition-all duration-300
                ${isHovered ? 'scale-110 rotate-6' : ''}
              `}>
                <Icon className={`w-8 h-8 ${app.isLive ? 'text-royalBlue' : 'text-gray-400'}`} />
              </div>
              
              <span className={`
                font-medium text-lg transition-colors duration-300
                ${app.isLive ? 'text-white' : 'text-gray-600'}
              `}>
                {app.name}
              </span>
              
              {!app.isLive && (
                <span className="
                  text-xs bg-white/20 backdrop-blur-sm
                  px-3 py-1 rounded-full text-gray-600
                  border border-gray-300/50
                ">
                  Prototyping
                </span>
              )}
            </div>

            {/* Press animation */}
            {activeApp?.id === app.id && (
              <div className="absolute inset-0 bg-black/10 rounded-xl overflow-hidden">
                <div className="h-1 bg-white/40 transition-all duration-1000 w-full" />
              </div>
            )}

            {/* Hover glow effect */}
            <div className={`
              absolute inset-0 rounded-xl transition-opacity duration-300
              bg-gradient-to-br ${gradientColors} blur-xl -z-10
              ${isHovered && app.isLive ? 'opacity-60' : 'opacity-0'}
            `} />
          </div>
        );
      })}
    </div>
  );
};

export default ApplicationGroup;
