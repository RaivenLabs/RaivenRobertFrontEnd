import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';


// Help Tip with Lightbulb - Now with 400px width
const HelpTip = ({ title, children }) => {
    const [showHelp, setShowHelp] = useState(false);
    
    return (
      <div className="relative">
        <Lightbulb 
          className="w-5 h-5 text-gray-400 hover:text-teal cursor-help"
          onClick={() => setShowHelp(!showHelp)}
        />
        {showHelp && (
          <div className="absolute z-20 left-0 top-full mt-2 bg-blue-50 border-l-4 
            border-blue-500 p-4 rounded-r-lg shadow-lg w-[400px]">
            <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
              {title}
            </div>
            <p className="text-blue-600 text-sm">{children}</p>
          </div>
        )}
      </div>
    );
  };
  export default HelpTip;
