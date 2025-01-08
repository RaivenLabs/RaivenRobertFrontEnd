// src/components/shared/ApplicationPanel/index.jsx
import { fetchFromAPI } from '../../../utils/api/api'; 
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ApplicationPanel.css';
import IconComponent from './IconComponent';

const ApplicationPanel = ({ apiEndpoint, onSidebarChange }) => {
  const navigate = useNavigate();
  const [programData, setProgramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(null);

  useEffect(() => {
    const loadProgramData = async () => {
      console.log('🎯 Starting API call with endpoint:', apiEndpoint);  // Log the received endpoint
      try {
        setLoading(true);
        const data = await fetchFromAPI(apiEndpoint);
        console.log('📦 Loaded program data:', data);
        setProgramData(data);
      } catch (error) {
        console.error('❌ Error details:', error);  // Enhanced error logging
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    loadProgramData();
  }, [apiEndpoint]); 

  const handleProgramSelect = (program, groupIndex) => {
    console.log('🎯 Program selected:', program);
    setSelectedProgram(program);
    setSelectedGroupIndex(groupIndex);
  };

  const handleLaunchProgram = async () => {
    if (!selectedProgram) return;

    console.log('🚀 Launching program:', selectedProgram);
    try {
      if (selectedProgram.route) {
        navigate(`/${selectedProgram.route}`);
        onSidebarChange(selectedProgram.id);
      }
    } catch (error) {
      console.error('❌ Launch failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="application-panel p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((group) => (
              <div key={group} className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((tile) => (
                    <div key={tile} className="h-32 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="application-panel p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Error Loading Programs</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!programData) {
    return (
      <div className="application-panel p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">No Programs Available</h3>
          <p>There are currently no programs to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="application-panel">
      <h2>{programData.title}</h2>
      
      <div className="program-groups">
        {programData.program_groups.map((group, groupIndex) => (
          <div key={groupIndex} className="program-group">
            <div className="group-header">
              <div className="group-header-left">
                <IconComponent 
                  iconName={group.name} 
                  className="text-royalBlue"
                />
                <h3>{group.name}</h3>
              </div>
              <button 
                className={`launch-button ${selectedGroupIndex === groupIndex ? 'active' : 'inactive'}`}
                onClick={handleLaunchProgram}
                disabled={selectedGroupIndex !== groupIndex}
              >
                Launch Program
              </button>
            </div>

            <div className="program-grid">
              {group.programs.map((program, programIndex) => (
                <div 
                  key={programIndex} 
                  className={`program-tile ${selectedProgram?.id === program.id ? 'selected' : ''}`}
                  onClick={() => handleProgramSelect(program, groupIndex)}
                >
                  <div className="tile-content">
                    <IconComponent 
                      iconName={program.name} 
                      className="text-royalBlue"
                    />
                    <span>{program.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationPanel;
