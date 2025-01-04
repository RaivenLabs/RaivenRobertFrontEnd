// src/components/MainSidebar.jsx
import React, { useState} from 'react';
import { useSidebarNavigation } from '../../../hooks/useSidebarNavigation';
import ApplicationConsole from '../../../components/shared/ApplicationConsole';
import { navigationConfig } from '../../../config/navigation';
import { loadProgramData } from '../../../utils/programLoader';

const MainSidebar = ({ onSidebarChange }) => {
  const [currentProgramData, setCurrentProgramData] = useState(null);
  const {
    expandedSection,
    isConsoleOpen,
    setIsConsoleOpen,
    handleNavigation,
    getItemLabel
  } = useSidebarNavigation(onSidebarChange);

  const handleSectionNavigation = async (item) => {
    // First handle the navigation
    handleNavigation(item);
    
    // Then try to load program data if it exists
    const programData = await loadProgramData(item.id);
    setCurrentProgramData(programData);
    
    // Only open console if we have program data
    if (programData) {
      setIsConsoleOpen(true);
    } else {
      setIsConsoleOpen(false);
    }
  };

  // Handle submenu navigation
  const handleSubmenuNavigation = async (subItem) => {
    handleNavigation(subItem);
    const programData = await loadProgramData(subItem.id);
    setCurrentProgramData(programData);
    if (programData) {
      setIsConsoleOpen(true);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-sidebarDark text-ivory shadow-sidebar relative">
        <div className="mb-6">
          <div className="text-2xl font-bold text-cyan mb-2 p-6">
            Tangible Intelligence Platform
          </div>
          <div className="w-full h-[2px] bg-[rgb(229,241,241)] mt-[5px] mb-[15px] shadow-[0_0_8px_rgb(229,241,241)]">
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {navigationConfig.mainItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleSectionNavigation(item)}
                className="w-full px-6 py-3 flex items-center gap-3 hover:bg-royalBlue-hover text-left transition-colors text-xl"
              >
                {item.icon && (
                  <svg className="w-5 h-5 text-ivory fill-current">
                    <use href={`#icon-${item.icon}`} />
                  </svg>
                )}
                <span>{getItemLabel(item)}</span>
              </button>

              {item.hasSubmenu && expandedSection === item.id && (
              <div className="bg-navyBlue pl-6">
                {item.submenuItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => handleSubmenuNavigation(subItem)}
                    className="w-full px-6 py-2 text-left hover:bg-royalBlue-hover text-sm transition-colors"
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
                          )}
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 w-full text-left border-t border-gray-700">
          <p className="text-2xl text-cyan mb-2 p-6">Powered by Tangible Intelligence</p>
        </div>
      </div>

      {isConsoleOpen && currentProgramData && (
        <ApplicationConsole
          isOpen={isConsoleOpen}
          onClose={() => setIsConsoleOpen(false)}
          data={currentProgramData}
        />
      )}
    </>
  );
};

export default MainSidebar;
