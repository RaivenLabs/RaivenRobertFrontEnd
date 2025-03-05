import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSectionConfig } from '../../../config/sectionNavigation';

const SectionMenuSidebar = ({ 
  section,        // Current section id (e.g., 'speakeasy')
  onNavigate      // Callback to parent for navigation events
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sectionConfig = getSectionConfig(section);
  const menuItems = sectionConfig?.menuItems || [];

  const handleMenuItemClick = (item) => {
    // Notify parent of navigation
    onNavigate(item);

    // Navigate to the appropriate route
    const path = `/${section}/${item.route}`;
    navigate(path);
  };

  return (
    <div className="flex flex-col h-full bg-sidebarDark text-ivory shadow-sidebar">
      <div className="mb-6">
        <div className="text-2xl font-bold text-cyan mb-2 p-6">
          {sectionConfig?.label || ''}
        </div>
        <div className="w-full h-[2px] bg-[rgb(229,241,241)] mt-[5px] mb-[15px] shadow-[0_0_8px_rgb(229,241,241)]">
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuItemClick(item)}
            className={`
              w-full px-6 py-3 flex items-center gap-3 
              hover:bg-royalBlue-hover text-left transition-colors text-xl
              ${location.pathname === `/${section}/${item.route}` ? 'bg-royalBlue-hover' : ''}
            `}
          >
            {item.icon && (
              <svg className="w-5 h-5 text-ivory fill-current">
                <use href={`#icon-${item.icon}`} />
              </svg>
            )}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="absolute bottom-0 w-full text-left border-t border-gray-700">
        <p className="text-2xl text-cyan mb-2 p-6">Powered by Tangible Intelligence</p>
      </div>
    </div>
  );
};

export default SectionMenuSidebar;
