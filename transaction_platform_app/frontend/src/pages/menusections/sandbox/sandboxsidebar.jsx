import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sandboxConfig } from '../../../config/sectionNavigation';
import { ArrowLeft } from 'lucide-react';

const SandboxSidebar = ({ onSidebarChange }) => {
  const navigate = useNavigate();
  const [sectionItems, setSectionItems] = useState([]);
  const [activeItem, setActiveItem] = useState(null);  // If you want active state

  useEffect(() => {
    console.log('Initial sandboxConfig:', sandboxConfig);
    
    // Safely set section items
    if (sandboxConfig?.sectionItems) {
      console.log('Setting section items:', sandboxConfig.sectionItems);
      setSectionItems(sandboxConfig.sectionItems);
    } else {
      console.warn('No section items found in sandboxConfig');
    }
  }, []);

  const handleSectionNavigation = (item) => {
    
    setActiveItem(item.id);  // Add this if you want active state
    console.log('🎯 Section Navigation:', {
      id: item.id,
      level: 'section',
      type: item.type,
      route: item.route
    });

    // Navigate to application
    if (item.route) {
      console.log('🚀 Navigating to application:', item.route);
      navigate(`/${item.route}`);
    }
  };

  const handleReturn = () => {
    console.log('⬅️ Returning to main menu');
    onSidebarChange('main');
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full bg-sidebarDark text-ivory shadow-sidebar relative">
      <div className="mb-6">
        <div className="text-2xl font-bold text-cyan mb-2 p-6">
        <h1>AIDA<sup style={{ fontSize: '0.6em' }}>™</sup> Design Center</h1>
        </div>
        <div className="w-full h-[2px] bg-[rgb(229,241,241)] mt-[5px] mb-[15px] shadow-[0_0_8px_rgb(229,241,241)]" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Section menu items */}
        {sectionItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => handleSectionNavigation(item)}
              className={`w-full px-6 py-3 flex items-center gap-3 
                hover:bg-royalBlue-hover text-left transition-colors text-xl
                ${activeItem === item.id ? 'bg-[var(--sidebar-active)]' : ''}`}
            >
              {item.icon && (
                <svg className="w-5 h-5 text-ivory fill-current">
                  <use href={`#icon-${item.icon}`} />
                </svg>
              )}
              <span>{item.label}</span>
            </button>
          </div>
        ))}

        {/* Main Menu button */}
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

      <div className="mt-auto border-t border-gray-700">
        <p className=" text-cyan mb-2 p-6">Powered by Tangible Intelligence</p>
      </div>
    </div>
  );
};

export default SandboxSidebar;


