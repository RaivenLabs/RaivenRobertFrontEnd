import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Simple AppSidebarOrchestrator that will be called when activeSidebar is 'apps'
const AppSidebarOrchestrator = ({ onSidebarChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  
  // Check if we're in the Hogwarts app
  const isHogwarts = pathname.includes('/apps/hogwarts');
  
  const handleReturn = () => {
    console.log('⬅️ Returning to main menu');
    onSidebarChange('main');
    navigate('/');
  };
  
  return (
    <div className="flex flex-col h-full bg-sidebarDark text-ivory shadow-sidebar relative">
      <div className="mb-6">
        <div className="text-2xl font-bold text-cyan mb-2 p-6">
          {isHogwarts ? 'Hogwarts School7' : 'App Sidebar'}
        </div>
        <div className="w-full h-[2px] bg-[rgb(229,241,241)] mt-[5px] mb-[15px] shadow-[0_0_8px_rgb(229,241,241)]" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {isHogwarts && (
          <>
            <div>
              <button
                onClick={() => navigate('/rapidresponse/winslowapplications/apps/hogwarts/dashboard')}
                className="w-full px-6 py-3 flex items-center gap-3 hover:bg-royalBlue-hover text-left transition-colors text-xl"
              >
                <span>Dashboard</span>
              </button>
            </div>
            <div>
              <button
                onClick={() => navigate('/rapidresponse/winslowapplications/apps/hogwarts/courses')}
                className="w-full px-6 py-3 flex items-center gap-3 hover:bg-royalBlue-hover text-left transition-colors text-xl"
              >
                <span>Courses</span>
              </button>
            </div>
            <div>
              <button
                onClick={() => navigate('/rapidresponse/winslowapplications/apps/hogwarts/students')}
                className="w-full px-6 py-3 flex items-center gap-3 hover:bg-royalBlue-hover text-left transition-colors text-xl"
              >
                <span>Students</span>
              </button>
            </div>
          </>
        )}

        {/* Main Menu button */}
        <div className="mt-4 border-t border-gray-700">
          <button
            onClick={handleReturn}
            className="w-full px-6 py-3 flex items-center gap-3 hover:bg-royalBlue-hover text-left transition-colors text-xl"
          >
            <span>Main Menu</span>
          </button>
        </div>
      </div>

      <div className="mt-auto border-t border-gray-700">
        <p className="text-cyan mb-2 p-6">Powered by Tangible Intelligence</p>
      </div>
    </div>
  );
};

export default AppSidebarOrchestrator;
