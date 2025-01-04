// src/pages/menusections/speakeasy/applications/speakeasyclub/sidebar.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import speakeasyApplicationsConfig from '../../../../../config/applicationNavigation/speakeasyApplications/config';
import { ArrowLeft } from 'lucide-react';

const SpeakeasyClubSidebar = () => {
  console.log('🏗️ SpeakeasyClubSidebar Rendering');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🎯 SpeakeasyClubSidebar Mounted');
    return () => console.log('🎯 SpeakeasyClubSidebar Unmounted');
  }, []);

  const handleNavigation = (item) => {
    console.log('🚀 Club Navigation:', {
      id: item.id,
      level: item.level,
      route: item.route
    });

    if (item.route) {
      const fullPath = `/speakeasy/applications/speakeasyclub/${item.route}`;
      console.log(`📍 Navigating to: ${fullPath}`);
      navigate(fullPath);
    }
  };

  const handleReturn = () => {
    console.log('⬅️ Returning to Speakeasy section');
    navigate('/speakeasy');
  };

  // Log what we're about to render
  console.log('📊 Rendering with config:', {
    hasConfig: !!speakeasyApplicationsConfig,
    items: speakeasyApplicationsConfig?.applicationItems?.length ?? 0
  });

  return (
    <div className="flex flex-col h-full bg-sidebarDark text-ivory shadow-sidebar relative">
      <div className="mb-6">
        <div className="text-2xl font-bold text-cyan mb-2 p-6">
          Speakeasy Club
        </div>
        <div className="w-full h-[2px] bg-[rgb(229,241,241)] mt-[5px] mb-[15px] shadow-[0_0_8px_rgb(229,241,241)]" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Application menu items */}
        {speakeasyApplicationsConfig?.applicationItems?.map((item) => {
          console.log('🔘 Rendering menu item:', item);
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className="w-full px-6 py-3 flex items-center gap-3 hover:bg-royalBlue-hover text-left transition-colors text-xl"
            >
              {item.icon && (
                <svg className="w-5 h-5 text-ivory fill-current">
                  <use href={`#icon-${item.icon}`} />
                </svg>
              )}
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Return to Speakeasy button */}
        <div className="mt-4 border-t border-gray-700">
          <button
            onClick={handleReturn}
            className="w-full px-6 py-3 flex items-center gap-3 hover:bg-royalBlue-hover text-left transition-colors text-xl"
          >
            <ArrowLeft className="w-5 h-5 text-ivory" />
            <span>Return to Speakeasy</span>
          </button>
        </div>
      </div>

      <div className="mt-auto border-t border-gray-700">
        <p className="text-2xl text-cyan mb-2 p-6">Powered by Tangible Intelligence</p>
      </div>
    </div>
  );
};

export default SpeakeasyClubSidebar;
