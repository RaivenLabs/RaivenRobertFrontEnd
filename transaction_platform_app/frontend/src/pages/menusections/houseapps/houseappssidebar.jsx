import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../../../context/ConfigContext';
import { houseappsConfig } from '../../../config/sectionNavigation';
import { ArrowLeft } from 'lucide-react';

const HouseAppsSidebar = ({ onSidebarChange }) => {
  const navigate = useNavigate();
  const { config } = useConfig();
  const [sectionItems, setSectionItems] = useState([]);

  useEffect(() => {
    console.log('Initial houseappsConfig:', houseappsConfig);
    
    // Safely set section items
    if (houseappsConfig?.sectionItems) {
      console.log('Setting section items:', houseappsConfig.sectionItems);
      setSectionItems(houseappsConfig.sectionItems);
    } else {
      console.warn('No section items found in houseappsConfig');
    }
  }, []);

  const handleSectionNavigation = (item) => {
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
  };

  // Get the customer name, defaulting to empty string if not available
  const customerName = config?.company_name || '';
  const sidebarTitle = customerName ? `${customerName} Applications Group` : 'Applications Group';

  return (
    <div className="flex flex-col h-full bg-sidebarDark text-ivory shadow-sidebar relative">
      <div className="mb-6">
        <div className="text-2xl font-bold text-cyan mb-2 p-6">
          {sidebarTitle}
        </div>
        <div className="w-full h-[2px] bg-[rgb(229,241,241)] mt-[5px] mb-[15px] shadow-[0_0_8px_rgb(229,241,241)]" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Section menu items */}
        {sectionItems.map((item) => (
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
        <p className="text-2xl text-cyan mb-2 p-6">Powered by Tangible Intelligence</p>
      </div>
    </div>
  );
};

export default HouseAppsSidebar;
