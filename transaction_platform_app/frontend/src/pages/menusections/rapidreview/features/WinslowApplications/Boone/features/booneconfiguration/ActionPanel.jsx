// src/components/platform/BooneConfiguration/ActionPanel.jsx
import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import ActionButton from '../shared/ActionButton';

const ActionPanel = ({ activeSection }) => {
  const getSectionDescription = () => {
    switch (activeSection) {
      case 'api':
        return 'Configure API endpoints and authentication settings';
      case 'rag':
        return 'Set up and manage Retrieval-Augmented Generation for documents';
      case 'prompts':
        return 'Select and configure prompt packages for extraction';
      case 'schema':
        return 'Define data schema for extracted information';
      case 'projects':
        return 'Manage project settings and team access';
      case 'etl':
        return 'Configure document processing and ETL workflow';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {getSectionDescription()}
        </p>
        
        <div className="flex space-x-4">
          <ActionButton 
            onClick={() => console.log('Save changes')} 
            label="Save Changes" 
            icon={CheckCircle} 
          />
          <ActionButton 
            onClick={() => console.log('Continue to next section')} 
            label="Continue" 
            icon={ArrowRight} 
          />
        </div>
      </div>
    </div>
  );
};

export default ActionPanel;
