import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { usePrototyping } from '../../../../context/PrototypingContext';
import HelpTip from '../../../../components/shared/common/HelpTip';  // Assuming we also moved HelpTip

const CanvasPanel = () => {
  const [tooljetUrl, setTooljetUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeVisible, setIframeVisible] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end p-2">
        <HelpTip title="Working with Canvas">
          Your workflow has been converted to a canvas. You can now customize and configure 
          your application using Tooljet's visual editor.
        </HelpTip>
      </div>
      
      <div className="flex-1 bg-gray-50 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500
            transition-opacity duration-300 ease-in-out"
            style={{ opacity: iframeVisible ? 0 : 1 }}
          >
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Tooljet Canvas Loading...
          </div>
        )}
        
        {tooljetUrl && (
          <div 
            className="transition-opacity duration-300 ease-in-out h-full"
            style={{ opacity: iframeVisible ? 1 : 0 }}
          >
            <iframe
              title="Tooljet Workflow Canvas"
              src={tooljetUrl}
              className="w-full h-full border-0 bg-white"
              onLoad={() => {
                setIsLoading(false);
                setTimeout(() => setIframeVisible(true), 100);
              }}
              style={{ minHeight: 'calc(100vh - 240px)' }}
              allow="accelerometer; camera; encrypted-media; geolocation; microphone"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasPanel;
