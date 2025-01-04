// src/pages/menusections/mainsidebar/MainSidebar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigationConfig } from '../../../config/navigation';
import { useConfig } from '../../../context/ConfigContext';
import { useAuth } from '../../../context/AuthContext';
import { ChevronRight, LogIn, LogOut, X } from 'lucide-react';
import Authentication from '../../../components/shared/Authentication';

const MainSidebar = ({ onSidebarChange }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { customerType, config } = useConfig();

  const getItemLabel = (item) => {
    console.log('Getting label for item:', item);
    console.log('Customer type:', customerType);
    console.log('Current config:', config);
    
    if (item.useConfigLabel) {
      if (config?.menu_config) {
        if (item.id === 'companyreport') {
          return config.menu_config.briefing_room_text;
        }
        if (item.id === 'houseapps') {
          return config.menu_config.applications_dock_text;
        }
      }
      
      const companyName = config?.company_name || 'Hawkeye';
      if (item.id === 'companyreport') {
        return `${companyName} Briefing Room`;
      }
      if (item.id === 'houseapps') {
        return `${companyName} Applications Dock`;
      }
    }
    return item.label;
  };

  const handleMainNavigation = (item) => {
    console.log('🎯 Main Navigation:', {
      id: item.id,
      level: 'main',
      type: item.type,
      route: item.route
    });

    if (item.hasSubmenu) {
      console.log('📂 Toggling main menu section:', item.id);
      setExpandedSection(prev => prev === item.id ? null : item.id);
      return;
    }

    console.log('🚀 Transitioning to section:', item.id);
    
    if (item.route) {
      console.log('📍 Navigating to route:', item.route);
      navigate(`/${item.route}`);
    }
    
    onSidebarChange(item.id);
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      setShowLoginModal(true);
    }
  };

  if (!navigationConfig.mainItems) {
    console.warn('⚠️ No navigation config found');
    return null;
  }

  return (
    <>
      <div className="flex flex-col h-full bg-sidebarDark text-ivory shadow-sidebar relative">
        <div className="mb-6">
          <div className="text-2xl font-bold text-cyan mb-2 p-6">
            Tangible Intelligence Platform
          </div>
          <div className="w-full h-[2px] bg-[rgb(229,241,241)] mt-[5px] mb-[15px] shadow-[0_0_8px_rgb(229,241,241)]" />
        </div>

        <nav className="flex-1 overflow-y-auto">
          {navigationConfig.mainItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleMainNavigation(item)}
                className="w-full px-6 py-3 flex items-center justify-between hover:bg-royalBlue-hover text-left transition-colors text-xl group"
              >
                <div className="flex items-center gap-3">
                  {item.icon && (
                    <svg className="w-5 h-5 text-ivory fill-current">
                      <use href={`#icon-${item.icon}`} />
                    </svg>
                  )}
                  <span>{getItemLabel(item)}</span>
                </div>
                {item.hasSubmenu && (
                  <ChevronRight 
                    className={`w-5 h-5 transition-transform duration-200 ${
                      expandedSection === item.id ? 'rotate-90' : ''
                    }`}
                  />
                )}
              </button>

              {item.hasSubmenu && expandedSection === item.id && (
                <div className="bg-navyBlue">
                  {item.submenuItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleMainNavigation({...subItem, level: 'main'})}
                      className="w-full pl-14 py-2 text-left hover:bg-royalBlue-hover text-sm transition-colors"
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Auth Button */}
        <div className="px-6 py-4 border-t border-gray-700">
          <button 
            onClick={handleAuthClick}
            className="w-full px-4 py-3 bg-stone-50 hover:bg-stone-100 text-royalBlue rounded-md 
                     flex items-center justify-center gap-2 transition-colors duration-200
                     shadow-sm hover:shadow-md"
          >
            {isAuthenticated ? (
              <>
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span className="font-medium">Login for More Features</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-auto border-t border-gray-700">
          <p className="text-1xl text-cyan mb-2 p-3">Powered by Tangible Intelligence</p>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg w-full max-w-md m-4">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <Authentication onSuccess={() => {
              setShowLoginModal(false);
            }} />
          </div>
        </div>
      )}
    </>
  );
};

export default MainSidebar;
