import React from 'react';
import { Loader2 } from 'lucide-react';
import { usePrototyping } from '../../../context/PrototypingContext';

const LoadingIndicator = () => {
  const { isAidaThinking } = usePrototyping();

  if (!isAidaThinking) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 
      flex items-center gap-3 border border-teal/20 animate-in slide-in-from-right">
      <Loader2 className="w-5 h-5 text-teal animate-spin" />
      <span className="text-gray-700">
        AIDA is crafting your workflow...
      </span>
    </div>
  );
};

export default LoadingIndicator;
