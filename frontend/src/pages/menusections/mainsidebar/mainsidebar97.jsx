import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigationConfig } from '../../../config/navigation';
import speakeasyConfig from '../../../config/sectionNavigation/speakeasy';
import speakeasyApplicationsConfig from '../../../config/applicationNavigation/speakeasypplications/config';
import ApplicationConsole from '../../../components/shared/ApplicationConsole';
import { loadProgramData } from '../../../utils/programLoader';
import { useConfig } from '../../../context/ConfigContext';

const MainSidebar = ({ onSidebarChange }) => {
  console.log('🏗️ MainSidebar Rendering');

  // Initialize all necessary hooks and state
  const navigate = useNavigate();
  const config = useConfig();
  const [expandedSection, setExpandedSection] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [currentProgramData, setCurrentProgramData] = useState(null);

  // Log state changes
  useEffect(() => {
    console.log('📊 State Update:', {
      expandedSection,
      currentSection,
      isConsoleOpen: isConsoleOpen,
      hasProgramData: !!currentProgramData
    });
  }, [expandedSection, currentSection, isConsoleOpen, currentProgramData]);

  const getItemLabel = (item) => {
    if (item.useConfigLabel) {
      return config?.menu_config?.applications_dock_text || item.label;
    }
    return item.label;
  };

  const handleNavigation = async (item) => {
    console.log('🎯 Navigation Started:', {
      id: item.id,
      level: item.level,
      type: item.type,
      route: item.route,
      hasSubmenu: item.hasSubmenu
    });
  
    // Handle navigation based on level
    switch(item.level) {
      case 'main':
        console.log('🏠 Main Menu Navigation');
        if (item.hasSubmenu) {
          console.log('📂 Toggling submenu for:', item.id);
          setExpandedSection(prev => prev === item.id ? null : item.id);
          return;
        }
        console.log('🔄 Setting current section to:', item.id);
        setCurrentSection(item.id);
        
        // Handle controlpanelmenu type AFTER setting current section
        if (item.type === 'controlpanelmenu' && onSidebarChange) {
          console.log('🔄 Triggering sidebar change for:', item.id);
          await onSidebarChange(item.id);
          console.log('✅ Sidebar change complete, ready for section navigation');
        }
  
        if (item.route) {
          console.log('🚀 Navigating to route:', item.route);
          navigate(`/${item.route}`);
        }
        break;
        
      case 'section':
        console.log('🔷 Section Navigation Starting');
        if (item.route) {
          console.log('🚀 Navigating to section route:', item.route);
          navigate(`/${item.route}`);
        }
        
        // Handle applications-package type
        if (item.type === 'applications-package') {
          console.log('📦 Loading program data for:', item.id);
          const programData = await loadProgramData(item.id);
          console.log('📬 Program data loaded:', !!programData);
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
        if (item.route) {
          console.log('🚀 Fallback navigation to route:', item.route);
          navigate(`/${item.route}`);
        }
        break;
    }
  };

  // Guard against missing config
  if (!navigationConfig.mainItems) {
    console.warn('⚠️ No navigation config found');
    return null;
  }

  return (
    <>
      <div className="flex flex-col h-full bg-sidebarDark text-ivory shadow-sidebar relative">
        {/* Header */}
        <div className="mb-6">
          <div className="text-2xl font-bold text-cyan mb-2 p-6">
            Tangible Intelligence Platform
          </div>
          <div className="w-full h-[2px] bg-[rgb(229,241,241)] mt-[5px] mb-[15px] shadow-[0_0_8px_rgb(229,241,241)]" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          {navigationConfig.mainItems.map((item) => (
            <div key={item.id}>
              {/* Main Menu Button */}
              <button
                onClick={() => {
                  console.log('👆 Main menu clicked:', item.id);
                  handleNavigation(item);
                }}
                className="w-full px-6 py-3 flex items-center gap-3 hover:bg-royalBlue-hover text-left transition-colors text-xl"
              >
                {item.icon && (
                  <svg className="w-5 h-5 text-ivory fill-current">
                    <use href={`#icon-${item.icon}`} />
                  </svg>
                )}
                <span>{getItemLabel(item)}</span>
              </button>

              {/* Headquarters Submenu */}
              {item.hasSubmenu && expandedSection === item.id && (
                <div className="bg-navyBlue pl-6">
                  {item.submenuItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => {
                        console.log('👆 Submenu item clicked:', subItem.id);
                        handleNavigation({...subItem, level: 'main'});
                      }}
                      className="w-full px-6 py-2 text-left hover:bg-royalBlue-hover text-sm transition-colors"
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Section Menu with Applications */}
              {currentSection === item.id && !item.hasSubmenu && (
                <div className="bg-navyBlue">
                  {item.id === 'speakeasy' && speakeasyConfig.sectionItems.map((sectionItem) => {
                    console.log('🎨 Rendering section item:', {
                      id: sectionItem.id,
                      level: sectionItem.level,
                      type: sectionItem.type
                    });
                    
                    return (
                      <div key={sectionItem.id}>
                        <button
                          onClick={() => {
                            console.log('👆 Section item clicked:', sectionItem.id);
                            handleNavigation(sectionItem);
                          }}
                          className="w-full px-6 py-2 text-left hover:bg-royalBlue-hover text-sm transition-colors"
                        >
                          {sectionItem.icon && (
                            <svg className="w-5 h-5 text-ivory fill-current">
                              <use href={`#icon-${sectionItem.icon}`} />
                            </svg>
                          )}
                          <span>{sectionItem.label}</span>
                        </button>

                        {/* Application Items */}
                        {sectionItem.id === 'speakeasy-applications' && 
                          speakeasyApplicationsConfig.applicationItems.map((appItem) => {
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
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full text-left border-t border-gray-700">
          <p className="text-2xl text-cyan mb-2 p-6">Powered by Tangible Intelligence</p>
        </div>
      </div>

      {/* Application Console */}
      {isConsoleOpen && currentProgramData && (
        <ApplicationConsole
          isOpen={isConsoleOpen}
          onClose={() => {
            console.log('🚪 Closing application console');
            setIsConsoleOpen(false);
          }}
          data={currentProgramData}
        />
      )}
    </>
  );
};

export default MainSidebar;
