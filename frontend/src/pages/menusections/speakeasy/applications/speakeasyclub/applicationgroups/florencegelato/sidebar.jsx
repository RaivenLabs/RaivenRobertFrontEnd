// src/pages/menusections/speakeasy/applications/speakeasyclub/applicationgroups/florencegelato/sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Play, Plane, Briefcase } from 'lucide-react';

const FlorenceGelatoSidebar = ({ onSidebarChange }) => {
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      route: 'florencegelato'
    },
    {
      id: 'launch',
      label: 'Launch',
      icon: Play,
      route: 'florencegelato/launch'
    },
    {
      id: 'inflight',
      label: 'Inflight',
      icon: Plane,
      route: 'florencegelato/inflight'
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: Briefcase,
      route: 'florencegelato/portfolio'
    }
  ];

  const handleNavigation = (route) => {
    console.log('🎯 Navigating to:', route);
    navigate(`/${route}`);
  };

  const handleReturn = () => {
    console.log('⬅️ Returning to Speakeasy Club');
    navigate('/speakeasyclub');
    onSidebarChange('speakeasyclub');
  };

  return (
    <div className="flex flex-col h-full bg-sidebarDark text-ivory shadow-sidebar relative">
      <div className="mb-6">
        <div className="text-2xl font-bold text-cyan mb-2 p-6">
          Florence Gelato Guide
        </div>
        <div className="w-full h-[2px] bg-[rgb(229,241,241)] mt-[5px] mb-[15px] shadow-[0_0_8px_rgb(229,241,241)]" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Navigation items */}
        {navigationItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => handleNavigation(item.route)}
              className="w-full px-6 py-3 flex items-center gap-3 hover:bg-royalBlue-hover text-left transition-colors text-xl"
            >
              <item.icon className="w-5 h-5 text-ivory" />
              <span>{item.label}</span>
            </button>
          </div>
        ))}

        {/* Return button */}
        <div className="mt-4 border-t border-gray-700">
          <button
            onClick={handleReturn}
            className="w-full px-6 py-3 flex items-center gap-3 hover:bg-royalBlue-hover text-left transition-colors text-xl"
          >
            <ArrowLeft className="w-5 h-5 text-ivory" />
            <span>Return to Speakeasy Club</span>
          </button>
        </div>
      </div>

      <div className="mt-auto border-t border-gray-700">
        <p className="text-2xl text-cyan mb-2 p-6">Powered by Tangible Intelligence</p>
      </div>
    </div>
  );
};

export default FlorenceGelatoSidebar;
