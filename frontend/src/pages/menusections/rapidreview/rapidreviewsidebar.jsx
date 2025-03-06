import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rapidreviewConfig } from '../../../config/sectionNavigation';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { MainMenuEasterEgg } from './SpeakeasyMenuAccess';
import { useSpeakeasy } from '../../../context/SpeakeasyContext';
<<<<<<< HEAD
import { useSidebar } from '../../../context/SidebarContext';  // Add this import

const RapidReviewSidebar = () => {  // Remove onSidebarChange prop
  const navigate = useNavigate();
  const { speakeasyAccess, setSpeakeasyAccess } = useSpeakeasy();
  const { setActiveSidebar } = useSidebar();  // Add this hook
  const [expandedSection, setExpandedSection] = useState(null);
  const [activeItem, setActiveItem] = useState(null); 
=======
import { useSidebar } from '../../../context/SidebarContext'; // Add this import

const RapidReviewSidebar = () => {
  // Remove onSidebarChange prop
  const navigate = useNavigate();
  const { speakeasyAccess, setSpeakeasyAccess } = useSpeakeasy();
  const { setActiveSidebar } = useSidebar(); // Add this hook
  const [expandedSection, setExpandedSection] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
>>>>>>> parent/wip/merge

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
<<<<<<< HEAD
  
=======

>>>>>>> parent/wip/merge
    console.log('🎯 Section Navigation:', {
      id: item.id,
      level: 'section',
      type: item.type,
      route: item.route,
      hasSubmenu: item.hasSubmenu,
<<<<<<< HEAD
      sidebarRoute: item.sidebarRoute  // Log the sidebar route if exists
    });
  
    if (item.hasSubmenu) {
      console.log('📂 Toggling section menu:', item.id);
      setExpandedSection(prev => prev === item.id ? null : item.id);
      return;
    }
  
    // Navigate to application
    if (item.route) {
      console.log('🚀 Navigating to application:', item.route);
      
=======
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

>>>>>>> parent/wip/merge
      // Check if this item needs a special sidebar
      if (item.sidebarRoute) {
        console.log('🎮 Setting special sidebar for:', item.sidebarRoute);
        setActiveSidebar(item.sidebarRoute);
      }
<<<<<<< HEAD
      
=======

>>>>>>> parent/wip/merge
      navigate(`/${item.route}`);
    }
  };

  const handleReturn = () => {
    // Reset Speakeasy access when returning to main menu
    setSpeakeasyAccess(false);
    sessionStorage.removeItem('speakeasyAccess');
<<<<<<< HEAD
    
    console.log('⬅️ RapidReview: Returning to main menu');
    setActiveSidebar('main');  // Use context instead of prop
=======

    console.log('⬅️ RapidReview: Returning to main menu');
    setActiveSidebar('main'); // Use context instead of prop
>>>>>>> parent/wip/merge
    navigate('/');
  };

  return (
<<<<<<< HEAD
    <div className="flex flex-col h-full bg-sidebarDark text-ivory shadow-sidebar relative">
      <div className="mb-6">
        <div className="text-2xl font-bold text-cyan mb-2 p-6">
          Application Suite
        </div>
        <div className="w-full h-[2px] bg-[rgb(229,241,241)] mt-[5px] mb-[15px] shadow-[0_0_8px_rgb(229,241,241)]" />
      </div>
=======
    <div className="flex flex-col h-full bg-sidebarDark text-gray-medium shadow-sidebar relative">
      <div className="text-2xl p-4">Application Suite</div>
>>>>>>> parent/wip/merge

      <div className="flex-1 overflow-y-auto">
        {/* Section menu items */}
        {rapidreviewConfig.sectionItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => handleSectionNavigation(item)}
<<<<<<< HEAD
              className={`w-full px-6 py-3 flex items-center gap-3 
                hover:bg-royalBlue-hover text-left transition-colors text-xl
=======
              className={`w-full px-6 py-2 flex items-center gap-3 
                hover:bg-gray-light text-left transition-colors text-lg
>>>>>>> parent/wip/merge
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
<<<<<<< HEAD
                <ChevronRight 
=======
                <ChevronRight
>>>>>>> parent/wip/merge
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
<<<<<<< HEAD
                    onClick={() => handleSectionNavigation({...subItem, level: 'section'})}
                    className="w-full pl-14 py-2 text-left hover:bg-royalBlue-hover text-sm transition-colors"
=======
                    onClick={() =>
                      handleSectionNavigation({ ...subItem, level: 'section' })
                    }
                    className="w-full pl-14 py-2 text-left hover:bg-gray-light text-sm transition-colors"
>>>>>>> parent/wip/merge
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Main Menu button */}
<<<<<<< HEAD
        <div className="mt-4 border-t border-gray-700">
          <button
            onClick={handleReturn}
            className="w-full px-6 py-3 flex items-center gap-3 hover:bg-royalBlue-hover text-left transition-colors text-xl"
          >
            <ArrowLeft className="w-5 h-5 text-ivory" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>

      {/* Footer with easter egg */}
      <div className="mt-auto border-t border-gray-700">
        <MainMenuEasterEgg>
          <div className="text-cyan mb-2 p-6 cursor-default hover:text-cyan select-none">
            Powered by Tangible Intelligence
          </div>
        </MainMenuEasterEgg>
      </div>
=======
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
>>>>>>> parent/wip/merge
    </div>
  );
};

export default RapidReviewSidebar;
