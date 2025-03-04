// src/components/platform/BooneConfiguration/BooneConfiguration.jsx
import React, { useState } from 'react';
import Banner from './Banner';
import OpeningDashboardPanel from '../sections/OpeningDashboardPanel';
import DataSchemaControls from '../sections/DataSchemaControlsPanel';
import ProjectSelectionPanel from '../sections/ProjectSelectionPanel';
import RegistryEnhancementRecommendation from '../sections/DimensionEnhancementPanel';
// Import other section components as needed

const BooneConfiguration = () => {
  const [activeSection, setActiveSection] = useState('schema');
  const [projectType, setProjectType] = useState('M&A Due Diligence');
  const [selectedProject, setSelectedProject] = useState(null);
  const [schemaAnalyticsData, setSchemaAnalyticsData] = useState(null);
  const [schemaStage, setSchemaStage] = useState('upload'); // 'upload', 'enhancement', 'generation'
  const [currentDimensions, setCurrentDimensions] = useState([]);
  const [suggestedEnhancements, setSuggestedEnhancements] = useState([]);
  
  // Handle project selection
  const handleProjectSelected = (programId, project) => {
    setProjectType(programId === 'ma' ? 'M&A Due Diligence' : 
                  programId === 'torts' ? 'Toxic Tort Litigation' : 
                  programId === 'sourcing' ? 'Sourcing' : 'Custom');
    setSelectedProject(project);
    
    // Reset the schema stage when selecting a new project
    setSchemaStage('upload');
    setSchemaAnalyticsData(null);
  };
  
  // Handle schema analytics completion - now directly fetches enhancement recommendations
  const handleSchemaAnalyticsComplete = (analysisResults) => {
    console.log('Schema analytics completed:', analysisResults);
    setSchemaAnalyticsData(analysisResults);
    
    // Directly fetch enhancement recommendations based on the uploaded documents and analysis
    fetchDimensionEnhancements(analysisResults);
  };
  
  // Fetch dimension enhancement recommendations
  const fetchDimensionEnhancements = async (analysisResults) => {
    try {
      // This would be your actual API call
      const response = await fetch('/api/schema/enhancement-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: selectedProject.id,
          analysisResults: analysisResults
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update state with current dimensions and suggested enhancements
        setCurrentDimensions(data.currentDimensions);
        setSuggestedEnhancements(data.suggestedEnhancements);
        
        // Move to enhancement stage if there are suggested enhancements
        if (data.suggestedEnhancements && data.suggestedEnhancements.length > 0) {
          setSchemaStage('enhancement');
        } else {
          // If no enhancements, go directly to generation completion
          setSchemaStage('generation');
        }
      } else {
        console.error('Error fetching enhancement recommendations:', data.error);
        // Fall back to generation stage
        setSchemaStage('generation');
      }
    } catch (error) {
      console.error('Error fetching enhancement recommendations:', error);
      setSchemaStage('generation');
    }
  };
  
  // Handle applying enhancements
  const handleApplyEnhancements = async (selectedEnhancements) => {
    try {
      // This would be your actual API call to apply the enhancements
      const response = await fetch('/api/schema/apply-enhancements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: selectedProject.id,
          enhancements: selectedEnhancements
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update our schema data with the applied enhancements
        setSchemaAnalyticsData(prevData => ({
          ...prevData,
          dimensions: data.updatedDimensions,
          attributes: data.updatedAttributes
        }));
        
        // Move to generation stage to show final schema
        setSchemaStage('generation');
      } else {
        console.error('Error applying enhancements:', data.error);
      }
    } catch (error) {
      console.error('Error applying enhancements:', error);
    }
  };
  
  // Handle canceling enhancements
  const handleCancelEnhancements = () => {
    // Skip enhancements and move directly to generation stage
    setSchemaStage('generation');
  };
  
  // Component for section container with visual cue
  const SectionContainer = ({ title, icon: Icon, children }) => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 overflow-hidden">
        {/* Header/Title area */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
          {Icon && <Icon className="w-5 h-5 text-royalBlue mr-2" />}
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        
        {/* Interior action area */}
        <div className="p-5">
          {children}
        </div>
      </div>
    );
  };
  
  // Render the appropriate section content based on activeSection
  const renderSectionContent = () => {
    switch(activeSection) {
      case 'schema':
        return (
          <>
            {selectedProject && <OpeningDashboardPanel projectType={projectType} />}
            
            {selectedProject && (
              <SectionContainer title="Schema Definition" icon={() => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>}>
                {schemaStage === 'upload' && (
                  <DataSchemaControls 
                    projectInfo={selectedProject} 
                    onSchemaAnalyticsComplete={handleSchemaAnalyticsComplete} 
                  />
                )}
                
                {schemaStage === 'enhancement' && (
                  <RegistryEnhancementRecommendation
                    projectName={selectedProject.name}
                    currentDimensions={currentDimensions}
                    suggestedEnhancements={suggestedEnhancements}
                    onApplyChanges={handleApplyEnhancements}
                    onCancel={handleCancelEnhancements}
                  />
                )}
                
                {schemaStage === 'generation' && (
                  <div>
                    <div className="bg-green-50 p-4 rounded-md border border-green-100 flex items-start mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <div>
                        <h3 className="font-semibold text-green-800">Schema Generated Successfully</h3>
                        <p className="text-green-700 text-sm mt-1">
                          Your schema has been generated based on the analysis. You can now proceed to field mappings.
                        </p>
                      </div>
                    </div>
                    
                    {/* Schema visualization would go here */}
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-medium mb-2">Generated Schema</h3>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-96 text-sm">
                        {JSON.stringify(schemaAnalyticsData, null, 2)}
                      </pre>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button className="px-4 py-2 bg-royalBlue text-white rounded-md hover:bg-blue-700 transition-colors">
                        Proceed to Field Mappings
                      </button>
                    </div>
                  </div>
                )}
              </SectionContainer>
            )}
          </>
        );
        
      case 'api':
        return (
          <SectionContainer title="API Configuration" icon={() => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>}>
            <div>API Configuration Content</div>
          </SectionContainer>
        );
        
      case 'rag':
        return (
          <SectionContainer title="RAG Configuration" icon={() => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>}>
            <div>RAG Configuration Content</div>
          </SectionContainer>
        );
        
      case 'prompts':
        return (
          <SectionContainer title="Prompt Packages" icon={() => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>}>
            <div>Prompt Packages Content</div>
          </SectionContainer>
        );
        
      case 'projects':
        return (
          <SectionContainer title="Projects" icon={() => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>}>
            <div>Projects Content</div>
          </SectionContainer>
        );
        
      case 'etl':
        return (
          <SectionContainer title="ETL Workflow" icon={() => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>}>
            <div>ETL Workflow Content</div>
          </SectionContainer>
        );
        
      default:
        return <div>Select a section to configure</div>;
    }
  };
  
  return (
    <div className="w-full px-4 py-6">
      {/* Banner with navigation */}
      <Banner activeSection={activeSection} setActiveSection={setActiveSection} />
      
      {/* Project Selection Panel */}
      <div className="w-full mt-6">
        {!selectedProject ? (
          <ProjectSelectionPanel onProjectSelected={handleProjectSelected} />
        ) : (
          <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-royalBlue mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              <div>
                <div className="text-sm text-gray-500">Current Project</div>
                <div className="font-medium">{selectedProject.name}</div>
              </div>
            </div>
            <button 
              onClick={() => {
                setSelectedProject(null);
                setSchemaStage('upload');
                setSchemaAnalyticsData(null);
                setCurrentDimensions([]);
                setSuggestedEnhancements([]);
              }}
              className="px-3 py-1 text-sm text-royalBlue border border-royalBlue rounded hover:bg-royalBlue/10 transition-colors"
            >
              Change Project
            </button>
          </div>
        )}
      </div>
      
      {/* Content for the active section */}
      <div className="w-full">
        {renderSectionContent()}
      </div>
    </div>
  );
};

export default BooneConfiguration;
