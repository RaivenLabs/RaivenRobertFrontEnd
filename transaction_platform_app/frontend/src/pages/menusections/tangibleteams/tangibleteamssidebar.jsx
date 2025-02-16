import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tangibleteamsConfig } from '../../../config/sectionNavigation';
import { ArrowLeft } from 'lucide-react';

const TangibleTeamsSidebar = ({ onSidebarChange }) => {
  const navigate = useNavigate();
  const [sectionItems, setSectionItems] = useState([]);
  const [activeItem, setActiveItem] = useState(null);  // If you want active state

  useEffect(() => {
    console.log('Initial tangibleteamsConfig:', tangibleteamsConfig);
    
    // Safely set section items
    if (tangibleteamsConfig?.sectionItems) {
      console.log('Setting section items:', tangibleteamsConfig.sectionItems);
      setSectionItems(tangibleteamsConfig.sectionItems);
    } else {
      console.warn('No section items found in tangibleteamsConfig');
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
    <div className="flex flex-col h-full bg-sidebarDark text-gray-medium shadow-sidebar relative">
        <div className="text-2xl font-boldmb-2 px-6 py-3">
          Strike Teams
        </div>

      <div className="flex-1 overflow-y-auto">
        {/* Section menu items */}
        {sectionItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => handleSectionNavigation(item)}
              className={`w-full px-6 py-2 flex items-center gap-3 
                hover:bg-gray-light text-left transition-colors text-lg
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
          <button
            onClick={handleReturn}
            className="mt-4 border-t border-gray-light w-full px-6 py-3 flex items-center gap-3 hover:bg-gray-light text-left transition-colors text-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Main Menu</span>
          </button>
      </div>

        <p className=" mb-2 p-6">Powered by Tangible Intelligence</p>
    </div>
  );
};

export default TangibleTeamsSidebar;
