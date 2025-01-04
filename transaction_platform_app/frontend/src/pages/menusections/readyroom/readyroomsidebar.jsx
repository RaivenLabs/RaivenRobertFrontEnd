import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readyroomConfig } from '../../../config/sectionNavigation';
import { ArrowLeft } from 'lucide-react';
import ApplicationPanel from '../../../components/shared/ApplicationPanel';
import { loadProgramData } from '../../../utils/programLoader';

// Try to import applications config if it exists
let readyroomApplicationsConfig;
try {
  readyroomApplicationsConfig = require('../../../config/applicationNavigation/readyroomApplications/config');
} catch {
  console.log('📝 No applications config found for this section');
}

const ReadyRoomSidebar = ({ onSidebarChange }) => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [currentProgramData, setCurrentProgramData] = useState(null);

  const handleNavigation = async (item) => {
    console.log('🎯 ReadyRoom Navigation:', {
      id: item.id,
      level: item.level,
      type: item.type,
      route: item.route
    });

    // Check if we should toggle section expansion
    if (item.id === 'readyroom-applications') {
      console.log('🔄 Toggling applications section');
      setExpandedSection(prev => prev === item.id ? null : item.id);
    }

    // Handle navigation based on level
    switch(item.level) {
      case 'section':
        console.log('🔷 Section Navigation Starting');
        if (item.route) {
          console.log('🚀 Navigating to section route:', item.route);
          navigate(`/${item.route}`);
        }
        
        if (item.type === 'applications-package') {
          console.log('📦 Loading program data for:', item.id);
          const programData = await loadProgramData(item.id);
          setCurrentProgramData(programData);
          setIsConsoleOpen(!!programData);
        }
        break;
        
      case 'application':
        console.log('💠 Application Navigation');
        if (item.route) {
          console.log('🚀 Navigating to application route:', item.route);
          navigate(`/${item.route}`);
        }
        break;

      default:
        console.warn('⚠️ Unknown navigation level:', item.level);
        break;
    }
  };

  const handleReturn = () => {
    console.log('⬅️ Returning to main menu');
    onSidebarChange('main');
  };

  // Helper function to check if we have application items for a section
  const hasApplicationItems = (sectionId) => {
    return readyroomApplicationsConfig?.applicationItems?.length > 0 && 
           sectionId === 'readyroom-applications';
  };

  return (
    <>
      <div className="flex flex-col h-full bg-sidebarDark text-ivory shadow-sidebar relative">
        <div className="mb-6">
          <div className="text-2xl font-bold text-cyan mb-2 p-6">
            The Ready Room
          </div>
          <div className="w-full h-[2px] bg-[rgb(229,241,241)] mt-[5px] mb-[15px] shadow-[0_0_8px_rgb(229,241,241)]" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Section menu items */}
          {readyroomConfig.sectionItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  console.log('👆 Section item clicked:', item.id);
                  handleNavigation(item);
                }}
                className="w-full px-6 py-3 flex items-center gap-3 hover:bg-royalBlue-hover text-left transition-colors text-xl"
              >
                {item.icon && (
                  <svg className="w-5 h-5 text-ivory fill-current">
                    <use href={`#icon-${item.icon}`} />
                  </svg>
                )}
                <span>{item.label}</span>
              </button>

              {/* Application Items - only render if we have them */}
              {hasApplicationItems(item.id) && expandedSection === item.id && 
                readyroomApplicationsConfig.applicationItems.map((appItem) => {
                  console.log('📱 Rendering application item:', {
                    id: appItem.id,
                    level: appItem.level,
                    type: appItem.type
                  });
                  
                  return (
                    <button
                      key={appItem.id}
                      onClick={() => {
                        console.log('👆 Application item clicked:', appItem.id);
                        handleNavigation(appItem);
                      }}
                      className="w-full px-6 py-2 pl-8 text-left hover:bg-royalBlue-hover text-xs transition-colors"
                    >
                      {appItem.icon && (
                        <svg className="w-4 h-4 text-ivory fill-current">
                          <use href={`#icon-${appItem.icon}`} />
                        </svg>
                      )}
                      <span>{appItem.label}</span>
                    </button>
                  );
                })}
            </div>
          ))}

          {/* Return to Main Menu button */}
          <div className="mt-4 border-t border-gray-700">
            <button
              onClick={handleReturn}
              className="w-full px-6 py-3 flex items-center gap-3 hover:bg-royalBlue-hover text-left transition-colors text-xl"
            >
              <ArrowLeft className="w-5 h-5 text-ivory" />
              <span>Return to Main Menu</span>
            </button>
          </div>
        </div>

        <div className="mt-auto border-t border-gray-700">
          <p className="text-2xl text-cyan mb-2 p-6">Powered by Tangible Intelligence</p>
        </div>
      </div>

      {/* Application Console */}
      {isConsoleOpen && currentProgramData && (
        <ApplicationPanel
          isOpen={isConsoleOpen}
          onClose={() => setIsConsoleOpen(false)}
          data={currentProgramData}
        />
      )}
    </>
  );
};

export default ReadyRoomSidebar;
