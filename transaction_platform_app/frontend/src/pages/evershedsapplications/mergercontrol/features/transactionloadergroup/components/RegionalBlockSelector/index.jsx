// src/features/transaction-loader/components/RegionalBlockSelector/index.jsx
import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { regionalBlockConfigs } from '../../utils/regionalBlockConfigs';

// Internal component for regional block button
const RegionalBlockButton = ({ blockKey, blockConfig, isSelected, onToggle, disabled }) => {
 console.log('🔘 RegionalBlockButton render:', { blockKey, isSelected, disabled });
 
 const baseStyles = "w-fit px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200";
 const selectedStyles = "bg-royalBlue text-white hover:bg-blue-700";
 const unselectedStyles = "bg-gray-100 text-gray-700 hover:bg-gray-200";
 const disabledStyles = "opacity-50 cursor-not-allowed";
 
 const buttonClass = `${baseStyles} 
   ${isSelected ? selectedStyles : unselectedStyles}
   ${disabled ? disabledStyles : ''}`;
 
 return (
   <button
     onClick={() => !disabled && onToggle(blockKey)}
     disabled={disabled}
     className={buttonClass}
   >
     <Globe className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
     <span>{blockConfig.display}</span>
   </button>
 );
};

// Internal component for member state checkboxes
const MemberStateList = ({ 
 blockKey, 
 memberStates, 
 selectedMemberStates = [], 
 onMemberStateToggle,
 requiresParent,
 disabled 
}) => (
 <div className={`mt-2 ${disabled ? 'opacity-75' : ''}`}>
   <div className="bg-white rounded-md border border-gray-300 p-2 w-fit min-w-[200px]">
     {memberStates.map(memberState => (
       <div 
         key={`${blockKey}-member-${memberState.dataKey}`}
         className={`flex items-center p-2 hover:bg-gray-50 rounded-md
           ${disabled ? 'cursor-not-allowed' : ''}`}
       >
         <input
           type="checkbox"
           id={`checkbox-${blockKey}-${memberState.dataKey}`}
           checked={selectedMemberStates.includes(memberState.dataKey)}
           onChange={(e) => !disabled && onMemberStateToggle(blockKey, memberState.dataKey, e.target.checked)}
           disabled={disabled}
           className={`rounded border-gray-300 text-royalBlue focus:ring-royalBlue mr-2
             ${disabled ? 'cursor-not-allowed bg-gray-100' : ''}`}
         />
         <label 
           htmlFor={`checkbox-${blockKey}-${memberState.dataKey}`}
           className={`cursor-pointer text-gray-700 hover:text-royalBlue flex-grow
             ${disabled ? 'cursor-not-allowed' : ''}`}
         >
           {memberState.display}
         </label>
       </div>
     ))}
   </div>
   {requiresParent && (
     <div className="text-sm text-gray-500 mt-1">
       Parent block data required for analysis
     </div>
   )}
 </div>
);

const RegionalBlockSelector = ({ onWorksheetGenerate, projectName, activeRun, disabled }) => {
 const [isLoading, setIsLoading] = useState(true);
 const [loadError, setLoadError] = useState(null);
 const [selectedBlocks, setSelectedBlocks] = useState([]);
 const [selectedMemberStates, setSelectedMemberStates] = useState({});

 // Load initial state from run data
 useEffect(() => {
   const initializeSelections = async () => {
     console.log('🚀 Starting initialization:', { projectName, runId: activeRun?.runId });
     
     setIsLoading(true);
     try {
       if (!activeRun?.targetCompanyData?.original?.regional_blocks) {
         console.log('📋 New run - starting fresh');
         setSelectedBlocks([]);
         setSelectedMemberStates({});
         setIsLoading(false);
         return;
       }

       console.log('💾 Loading saved run data');
       const runData = activeRun.targetCompanyData.original.regional_blocks;
       const activeBlocks = [];
       const activeMemberStates = {};

       Object.entries(runData).forEach(([blockKey, blockData]) => {
         if (blockKey === 'template') return;
         
         if (blockData.presence) {
           activeBlocks.push(blockKey);
           activeMemberStates[blockKey] = [];

           Object.entries(blockData.member_states || {}).forEach(([stateKey, stateData]) => {
             if (stateKey === 'template') return;
             if (stateData.presence) {
               activeMemberStates[blockKey].push(stateKey);
             }
           });
         }
       });

       console.log('✅ Loaded selections:', { activeBlocks, activeMemberStates });
       setSelectedBlocks(activeBlocks);
       setSelectedMemberStates(activeMemberStates);

     } catch (error) {
       console.error('❌ Error loading selections:', error);
       setLoadError('Failed to load regional block data');
     } finally {
       setIsLoading(false);
     }
   };

   initializeSelections();
 }, [activeRun, projectName]);

 const handleBlockToggle = (blockKey) => {
   if (disabled) return;

   console.log('🔄 Toggling block:', { blockKey });
   setSelectedBlocks(prev => {
     const isSelected = prev.includes(blockKey);
     const newBlocks = isSelected 
       ? prev.filter(b => b !== blockKey)
       : [...prev, blockKey];
     
     if (isSelected) {
       setSelectedMemberStates(prev => {
         const { [blockKey]: removed, ...rest } = prev;
         return rest;
       });
     }

     return newBlocks;
   });
 };

 const handleMemberStateToggle = (blockKey, stateKey, checked) => {
   if (disabled) return;

   console.log('🔄 Toggling member state:', { blockKey, stateKey, checked });
   setSelectedMemberStates(prev => {
     const blockStates = prev[blockKey] || [];
     const newBlockStates = checked
       ? [...blockStates, stateKey]
       : blockStates.filter(s => s !== stateKey);

     return { ...prev, [blockKey]: newBlockStates };
   });
 };

 const handleSaveAndGenerate = async () => {
   console.log('📤 Starting save and generate process');
   
   try {
     const projectId = activeRun?.project || 'hamilton';
     const changes = [];

     // Build changes array
     selectedBlocks.forEach(blockKey => {
       if (!blockKey) return;
       
       changes.push({
         run_id: activeRun.runId,
         project_name: projectName || activeRun.project,
         buying_company: activeRun.buyingCompany || 'artemis',
         block_key: blockKey,
         active: true
       });

       const blockMemberStates = selectedMemberStates[blockKey] || [];
       blockMemberStates.forEach(stateKey => {
         if (!stateKey) return;
         
         changes.push({
           run_id: activeRun.runId,
           project_name: projectName || activeRun.project,
           buying_company: activeRun.buyingCompany || 'artemis',
           block_key: blockKey,
           member_state_key: stateKey,
           active: true
         });
       });
     });

     console.log('💾 Saving changes:', changes);
     
     // Save changes
     const saveResponse = await fetch(
       `/api/projects/${projectId}/runs/${activeRun.runId}/toggle_regional_blocks`,
       {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ changes })
       }
     );

     if (!saveResponse.ok) {
       throw new Error('Failed to save regional block configuration');
     }

     // Get fresh run data
     const freshDataResponse = await fetch(
       `/api/projects/${projectId}/runs/${activeRun.runId}`
     );

     if (!freshDataResponse.ok) {
       throw new Error('Failed to fetch updated run data');
     }

     const freshRunData = await freshDataResponse.json();
     console.log('✅ Successfully saved and fetched fresh data');

     // Hand off to worksheet with fresh data
     onWorksheetGenerate({
       runId: activeRun.runId,
       projectId: projectId,
       regional_blocks: selectedBlocks,
       member_states: selectedMemberStates,
       runData: freshRunData
     });

   } catch (error) {
     console.error('❌ Error in save and generate:', error);
     setLoadError('Failed to save changes. Please try again.');
   }
 };

 if (isLoading) {
   return (
     <div className="bg-white rounded-lg shadow-sm p-6">
       <div className="flex items-center justify-center h-40">
         <div className="text-gray-600">Loading regional block data...</div>
       </div>
     </div>
   );
 }

 return (
   <div className="bg-white rounded-lg shadow-sm p-6">
     {loadError && (
       <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
         {loadError}
       </div>
     )}

     <div className="flex flex-wrap gap-6 mb-8">
       {Object.entries(regionalBlockConfigs).map(([blockKey, config]) => (
         <div key={`block-${blockKey}`} className="flex flex-col">
           <RegionalBlockButton
             blockKey={blockKey}
             blockConfig={config}
             isSelected={selectedBlocks.includes(blockKey)}
             onToggle={() => handleBlockToggle(blockKey)}
             disabled={disabled}
           />
           
           <MemberStateList
             blockKey={blockKey}
             memberStates={config.member_states}
             selectedMemberStates={selectedMemberStates[blockKey] || []}
             onMemberStateToggle={handleMemberStateToggle}
             requiresParent={config.requiresParent}
             disabled={disabled}
           />
         </div>
       ))}
     </div>

     <div className="mt-8 flex justify-between items-center">
       <div className="text-sm text-gray-600">
         {Object.values(selectedMemberStates).flat().length} member states selected
       </div>
       
       <button
         onClick={handleSaveAndGenerate}
         disabled={disabled || Object.values(selectedMemberStates).flat().length === 0}
         className="px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal/90 disabled:opacity-50"
       >
         Save and Generate Worksheet
       </button>
     </div>
   </div>
 );
};

export default RegionalBlockSelector;
