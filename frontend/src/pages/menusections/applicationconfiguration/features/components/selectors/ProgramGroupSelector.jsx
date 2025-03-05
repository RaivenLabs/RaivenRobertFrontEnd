import React from 'react';
import { ArrowRight } from 'lucide-react';
import PanelHeader from '../../../../../../components/shared/common/PanelHeader';
import { FileText } from 'lucide-react';

const ProgramGroupSelector = ({ 
  programGroups,
  selectedGroup,
  onSelectGroup
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100">
      <PanelHeader 
        title="Select Program Group" 
        isActive={true}
        icon={FileText}
      />
      <div className="p-6 space-y-4">
        {programGroups.map((group) => {
          const Icon = group.icon;
          return (
            <button
              key={group.id}
              onClick={() => onSelectGroup(group.id)}
              className={`w-full p-4 rounded-lg border transition-all
                ${selectedGroup === group.id 
                  ? 'border-teal bg-teal/5' 
                  : 'border-gray-200 hover:border-teal/50'
                }
                flex items-center gap-3`}
            >
              <Icon className="w-6 h-6" />
              <div className="text-left">
                <h3 className="font-medium text-gray-800">{group.name}</h3>
                <p className="text-sm text-gray-600">{group.description}</p>
              </div>
              <ArrowRight className={`w-5 h-5 ml-auto transition-opacity
                ${selectedGroup === group.id ? 'opacity-100' : 'opacity-0'}`} 
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProgramGroupSelector;
