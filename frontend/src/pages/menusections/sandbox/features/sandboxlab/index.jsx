import React, { useState, useEffect } from 'react';
import { usePrototyping } from '../../../../../context/PrototypingContext';
import { 
  Beaker, 
  Send, 
  ArrowRight, 
  MessageSquare, 
  Loader2,
  Layout, 
  HelpCircle, 
  Lightbulb, 
  ArrowLeftRight,
  ArrowUpRight,
  Save,
  XCircle,
  CheckCircle
} from 'lucide-react';

import Tooltip from '../../../../../components/shared/common/Tooltip';
import NLPInputPanel from '../../panels/NLPInputPanel';
import WorkspacePanel from '../../panels/WorkspacePanel';
import ApplicationArchitecturePanel from '../../panels/ApplicationArchitecturePanel';
import CanvasPanel from '../../panels/CanvasPanel';
import SwapPanelsButton from '../../../../../components/shared/common/SwapPanelsButton';
import PanelHeader from '../../../../../components/shared/common/PanelHeader';
import LoadingIndicator from '../../../../../components/shared/common/LoadingIndicator';
import ProcessBar from '../../components/ProcessBar';
import { STAGES } from '../../../../../types';

const PrototypingLab = () => {
  const [activePanel, setActivePanel] = useState('input');
  const [activeHeader, setActiveHeader] = useState('input');
  const [panelsReversed, setPanelsReversed] = useState(false);
  const { currentStage, setCurrentStage, initializeProgress, saveProgress } = usePrototyping();
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeProgress();
  }, [initializeProgress]);

  // Stage transition helpers
  const completeStageAndAdvance = async (completed, nextStage, data = {}) => {
    try {
      setIsLoading(true);
      console.log('🔄 Stage Transition Data:', {
        completed,
        nextStage,
        data
      });
      
      // Save progress before advancing
      if (saveProgress) {
        console.log('💾 Saving progress with data:', data);
        await saveProgress(completed, data);
      }

      setCompletedSteps(prev => new Set([...prev, completed]));
      setCurrentStage(nextStage);
    } catch (error) {
      console.error('❌ Error during stage transition:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Stage-specific handlers
  const handlePatternSelectionComplete = (patternData) => {
    console.log('📋 Pattern Selection Complete:', patternData);
    completeStageAndAdvance(
      STAGES.PATTERN_SELECTION, 
      STAGES.INTENT_ANALYSIS,
      patternData
    );
  };

  const handleIntentValidated = (intentData) => {
    console.log('🎯 Intent Validation Complete:', intentData);
    completeStageAndAdvance(
      STAGES.INTENT_ANALYSIS,
      STAGES.SPECIFICATION,
      intentData
    );
  };

  const handleSpecificationComplete = (specData) => {
    console.log('📝 Specification Complete:', specData);
    completeStageAndAdvance(
      STAGES.SPECIFICATION,
      STAGES.LOGIC_STRUCTURE,
      specData
    );
  };

  // Visibility control
  const shouldShowStage = (stage) => {
    if (currentStage === stage) return true;
    if (!completedSteps.has(stage)) return false;
    return true;
  };

  // Panel content renderer
  const getPanelContent = () => {
    if (currentStage === STAGES.PATTERN_SELECTION) {
      return (
        <div className="pl-9 pr-25 w-full">
          <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border
            border-teal transition-all duration-300">
            <PanelHeader 
              title="Application Architecture" 
              isActive={true}
              icon={Layout}
            />
            <ApplicationArchitecturePanel 
              onSubmit={handlePatternSelectionComplete}
            />
          </div>
        </div>
      );
    }
  
    if (currentStage === STAGES.COMPONENT_LAYOUT) {
      return (
        <div className="pl-9 pr-25 w-full">
          <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border
            border-teal transition-all duration-300">
            <PanelHeader 
              title="Design Canvas" 
              isActive={true}
              icon={Beaker}
            />
            <CanvasPanel />
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex gap-6 relative">
        <SwapPanelsButton onSwap={() => setPanelsReversed(!panelsReversed)} />
        
        {[
          {
            width: panelsReversed ? "w-2/3" : "w-1/3",
            component: (
              <div 
                onClick={() => {
                  setActivePanel('input');
                  setActiveHeader('input');
                }}
                className={`flex flex-col h-full bg-white rounded-xl shadow-lg border 
                  ${activePanel === 'input' ? 'border-teal' : 'border-gray-100'}
                  transition-all duration-300`}
              >
                <PanelHeader 
                  title="Design Specification" 
                  isActive={activeHeader === 'input'}
                  icon={MessageSquare}
                />
                <NLPInputPanel 
                  setActivePanel={setActivePanel}
                  setActiveHeader={setActiveHeader}
                />
              </div>
            )
          },
          {
            width: panelsReversed ? "w-1/3" : "w-2/3",
            component: (
              <div
                onClick={() => {
                  setActivePanel('workspace');
                  setActiveHeader('workspace');
                }}
                className={`flex flex-col h-full bg-white rounded-xl shadow-lg border
                  ${activePanel === 'workspace' ? 'border-teal' : 'border-gray-100'}
                  transition-all duration-300`}
              >
                <PanelHeader 
                  title="Design Workspace" 
                  isActive={activeHeader === 'workspace'}
                  icon={Layout}
                />
                <WorkspacePanel onComplete={handleSpecificationComplete} />
              </div>
            )
          }
        ].map((panel, index) => (
          <div key={index} className={`${panel.width} transition-all duration-300`}>
            {panel.component}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-ivory p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <Beaker className="w-8 h-8 text-teal" />
          <h1 className="text-2xl font-bold text-gray-800">Prototyping Lab</h1>
          <Tooltip content="Need help? Click any lightbulb for guidance">
            <HelpCircle className="w-6 h-6 text-gray-400 ml-auto cursor-help" />
          </Tooltip>
        </div>
        
        <p className="text-gray-600 mb-8">
          Welcome to the Prototyping Lab! Work with AIDA to transform your ideas into 
          working application workflows.
        </p>
        
        <ProcessBar currentStage={currentStage} />
      </div>

      {/* Dynamic Panel Section */}
      {getPanelContent()}

      {/* Action Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 
              rounded-lg transition-colors flex items-center space-x-2">
              <XCircle className="w-5 h-5" />
              <span>Discard Work</span>
            </button>
            <button className="px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 
              rounded-lg transition-colors flex items-center space-x-2">
              <Save className="w-5 h-5" />
              <span>Save Progress</span>
            </button>
          </div>

          {currentStage === STAGES.DEPLOYMENT_READY && (
            <button 
              className="px-6 py-2 bg-teal text-white rounded-lg 
                hover:bg-teal/90 transition-colors
                flex items-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Deploy Application</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading Indicator */}
      <LoadingIndicator />
    </div>
  );
};

export default PrototypingLab;
