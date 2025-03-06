import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rapidreviewConfig } from '../../../config/sectionNavigation';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { MainMenuEasterEgg } from './SpeakeasyMenuAccess';
import { useSpeakeasy } from '../../../context/SpeakeasyContext';
import { useSidebar } from '../../../context/SidebarContext'; // Add this import

const RapidReviewSidebar = () => {
  // Remove onSidebarChange prop
  const navigate = useNavigate();
  const { speakeasyAccess, setSpeakeasyAccess } = useSpeakeasy();
  const { setActiveSidebar } = useSidebar(); // Add this hook
  const [expandedSection, setExpandedSection] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  // Add back the effect to handle navigation to Speakeasy
  React.useEffect(() => {
    if (speakeasyAccess) {
      navigate('/speakeasy');
    }
  }, [speakeasyAccess, navigate]);

  const handleSectionNavigation = (item) => {
    // Keep existing reset logic
    setSpeakeasyAccess(false);
    sessionStorage.removeItem('speakeasyAccess');
    setActiveItem(item.id);
    console.log('🎯 Section Navigation:', {
      id: item.id,
      level: 'section',
      type: item.type,
      route: item.route,
      hasSubmenu: item.hasSubmenu,
      sidebarRoute: item.sidebarRoute, // Log the sidebar route if exists
    });

    if (item.hasSubmenu) {
      console.log('📂 Toggling section menu:', item.id);
      setExpandedSection((prev) => (prev === item.id ? null : item.id));
      return;
    }

    // Navigate to application
    if (item.route) {
      console.log('🚀 Navigating to application:', item.route);

      // Check if this item needs a special sidebar
      if (item.sidebarRoute) {
        console.log('🎮 Setting special sidebar for:', item.sidebarRoute);
        setActiveSidebar(item.sidebarRoute);
      }
      navigate(`/${item.route}`);
    }
  };

  const handleReturn = () => {
    // Reset Speakeasy access when returning to main menu
    setSpeakeasyAccess(false);
    sessionStorage.removeItem('speakeasyAccess');

    console.log('⬅️ RapidReview: Returning to main menu');
    setActiveSidebar('main'); // Use context instead of prop
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full bg-sidebarDark text-gray-medium shadow-sidebar relative">
      <div className="text-2xl p-4">Application Suite</div>

      <div className="flex-1 overflow-y-auto">
        {/* Section menu items */}
        {rapidreviewConfig.sectionItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => handleSectionNavigation(item)}
              className={`w-full px-6 py-2 flex items-center gap-3 
                hover:bg-gray-light text-left transition-colors text-lg
                ${activeItem === item.id ? 'bg-[var(--sidebar-active)]' : ''}`}
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <svg className="w-5 h-5 text-ivory fill-current">
                    <use href={`#icon-${item.icon}`} />
                  </svg>
                )}
                <span>{item.label}</span>
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
                    onClick={() =>
                      handleSectionNavigation({ ...subItem, level: 'section' })
                    }
                    className="w-full pl-14 py-2 text-left hover:bg-gray-light text-sm transition-colors"
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Main Menu button */}
        <button
          onClick={handleReturn}
          className="mt-4 border-t border-gray-light w-full px-6 py-3 flex items-center gap-3 hover:bg-gray-light text-left transition-colors text-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Main Menu</span>
        </button>
      </div>

      {/* Footer with easter egg */}
      <MainMenuEasterEgg>
        <div className="text-gray-light mb-2 p-6 cursor-default hover:text-gray-dark select-none">
          Powered by Tangible Intelligence
        </div>
      </MainMenuEasterEgg>
    </div>
  );
};

export default RapidReviewSidebar;
