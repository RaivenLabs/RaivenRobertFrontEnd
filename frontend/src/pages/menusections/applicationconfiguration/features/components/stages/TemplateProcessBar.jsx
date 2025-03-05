import React from 'react';
import { 
  LayoutGrid,
  FileText,
  Edit,
  Database,
  HelpCircle,
  CheckCircle,
  ArrowUpCircle
} from 'lucide-react';
import Tooltip from '../../../../../../components/shared/common/Tooltip';
import { TEMPLATE_STAGES } from '../constants/index';

const TemplateProcessBar = ({ currentStage, showConversionStage = false }) => {
  const baseStages = [
    {
      id: TEMPLATE_STAGES.PROGRAM_SELECTION,
      label: 'Select Program',
      icon: LayoutGrid,
      tooltip: 'Choose program type and template'
    },
    {
      id: TEMPLATE_STAGES.TEMPLATE_CONVERSION,
      label: 'Convert Template',
      icon: ArrowUpCircle,
      tooltip: 'Convert source template to Jinja2 format'
    },
    {
      id: TEMPLATE_STAGES.TEMPLATE_SETUP,
      label: 'Setup Template',
      icon: FileText,
      tooltip: 'Configure base template settings'
    },
    {
      id: TEMPLATE_STAGES.VARIABLE_CONFIG,
      label: 'Configure Variables',
      icon: Edit,
      tooltip: 'Define template variables and constants'
    },
    {
      id: TEMPLATE_STAGES.LOGIC_CONFIG,
      label: 'Configure Logic',
      icon: Database,
      tooltip: 'Set up template logic and flows'
    },
    {
      id: TEMPLATE_STAGES.PREVIEW_VALIDATE,
      label: 'Preview & Validate',
      icon: HelpCircle,
      tooltip: 'Review and validate template configuration'
    },
    {
      id: TEMPLATE_STAGES.PRODUCTION_READY,
      label: 'Production Ready',
      icon: CheckCircle,
      tooltip: 'Template ready for production use'
    }
  ];

  // Filter out conversion stage if not needed
  const stages = showConversionStage 
    ? baseStages 
    : baseStages.filter(stage => stage.id !== TEMPLATE_STAGES.TEMPLATE_CONVERSION);
  
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

export default TemplateProcessBar;
