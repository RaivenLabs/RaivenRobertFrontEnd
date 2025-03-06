// src/pages/menusections/mainsidebar/MainSidebar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigationConfig } from '../../../config/navigation';
import { useConfig } from '../../../context/ConfigContext';
import { useAuth } from '../../../context/AuthContext';
import { ChevronRight, LogIn, LogOut, X } from 'lucide-react';
import { authService } from '../../../services/authService';
import { useSidebar } from '../../../context/SidebarContext';  // Add this
import Authentication from '../../../components/shared/Authentication';

const MainSidebar = () => {  // Remove onSidebarChange prop
  const [expandedSection, setExpandedSection] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(null);
  const { isAuthenticated, logout } = useAuth();
  const { customerType, config, isLoading } = useConfig();
  const { setActiveSidebar } = useSidebar();  // Add this

  // Safe sidebar text getter
  const getSidebarText = () => {
    if (isLoading || !config || !config.menu_config) {
      return 'Tangible Intelligence Platform';
    }
    return `${config.menu_config.side_bar_text}`;
  };

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
    setActiveItem(item.id);

    console.log('🎯 Main Navigation:', {
      id: item.id,
      level: 'main',
      type: item.type,
      route: item.route,
      hasSubmenu: item.hasSubmenu,
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
    // Use context instead of prop
    console.log('🔄 MainSidebar: Setting sidebar to:', item.id);
    setActiveSidebar(item.id);
  };

  const handleAuthClick = async () => {
    if (isAuthenticated) {
      try {
        console.log('👤 Current auth state before logout:', authService.checkAuthState());
        await authService.initiateLogout();
        await logout();
        console.log('👤 Auth state after logout:', authService.checkAuthState());
      } catch (error) {
        console.error('Logout process failed:', error);
      }
    } else {
      console.log('👤 Opening login modal, current auth state:', authService.checkAuthState());
      setShowLoginModal(true);
    }
  };

  if (!navigationConfig.mainItems) {
    console.warn('⚠️ No navigation config found');
    return null;
  }

  return (
    <>
      <div className="flex flex-col justify-between h-full bg-sidebarDark text-ivory shadow-sidebar relative">
        <div className="mb-6">
          <div className="text-2xl font-bold text-cyan mb-2 p-6">
            {getSidebarText()}
          </div>
          <div className="w-full h-[2px] bg-[rgb(229,241,241)] mt-[5px] mb-[15px] shadow-[0_0_8px_rgb(229,241,241)]" />
        </div>

        <nav className="overflow-y-auto mt-[24px]">
          {navigationConfig.mainItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleMainNavigation(item)}
                className={`w-full px-6 py-2 flex items-center justify-between 
                  hover:bg-gray-light transition-colors text-lg group
                  ${activeItem === item.id ? 'bg-[var(--sidebar-active)]' : ''}`}
              >
                <div className="flex items-center gap-3 text-gray-medium">
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
                      className="w-full pl-14 py-2 text-left hover:bg-gray-light text-sm transition-colors"
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
                <span className="font-medium">Login</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-auto border-t border-gray-700">
          <p className="mb-2 p-6 text-gray-500">Powered by Tangible CoIntelligence</p>
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
