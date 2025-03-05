import React from 'react';
import { 
    Layout, 
    MessageSquare, 
    GitBranch, 
    Boxes,
    LayoutGrid,
    Database, 
    CheckCircle 
} from 'lucide-react';
import { STAGES } from '../../../../types';
import Tooltip from '../../../../components/shared/common/Tooltip';

const ProcessBar = ({ currentStage }) => {
    
    const stages = [
        {
          id: STAGES.PATTERN_SELECTION,
          label: 'Select Pattern',
          icon: Layout,
          tooltip: 'Choose from proven enterprise architectural patterns'
        },
        {
          id: STAGES.INTENT_ANALYSIS,
          label: 'Analyze Intent',
          icon: MessageSquare,
          tooltip: 'Validate pattern choice and clarify requirements with AIDA'
        },
        {
          id: STAGES.SPECIFICATION,
          label: 'Specify Workflow',
          icon: MessageSquare,
          tooltip: 'Detail your workflow requirements within the chosen pattern'
        },
        {
          id: STAGES.LOGIC_STRUCTURE,
          label: 'Structure Logic',
          icon: GitBranch,
          tooltip: 'Visualize workflow logic and decision flows'
        },
        {
          id: STAGES.COMPONENT_LAYOUT,
          label: 'Layout Components',
          icon: Boxes,        // Changed this line
          tooltip: 'See your workflow as interactive components'
        },
        {
          id: STAGES.INTEGRATION_CONFIG,
          label: 'Configure Integration',
          icon: Database,
          tooltip: 'Set up data sources and system connections'
        },
        {
          id: STAGES.DEPLOYMENT_READY,
          label: 'Ready to Deploy',
          icon: CheckCircle,
          tooltip: 'Final validation and deployment preparation'
        }
    ];

  const currentIndex = stages.findIndex(stage => stage.id === currentStage);
  const progress = ((currentIndex + 1) / stages.length) * 100;

  return (
    <div className="w-full space-y-4">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-teal to-cyan transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between">
        {stages.map((stage, index) => {
          const StageIcon = stage.icon;
          const isActive = index <= currentIndex;
          const isCompleted = index < currentIndex;
          
          return (
            <Tooltip key={stage.id} content={stage.tooltip}>
              <div className={`flex flex-col items-center transition-colors duration-300
                ${isActive ? 'text-teal' : 'text-gray-400'}
                ${isCompleted ? 'text-teal' : ''}`}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${isActive ? 'bg-teal/10' : 'bg-gray-100'}
                  ${isCompleted ? 'bg-teal text-white' : ''}
                  transition-colors duration-300
                `}>
                  <StageIcon className="w-5 h-5" />
                </div>
                <span className="text-sm mt-2">{stage.label}</span>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessBar;
