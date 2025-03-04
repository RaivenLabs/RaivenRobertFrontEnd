import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { usePrototyping } from '../../../../context/PrototypingContext';
import HelpTip from '../../../../components/shared/common/HelpTip';  // Assuming we also moved HelpTip







const NLPInputPanel = ({ setActivePanel, setActiveHeader }) => {  // Both props defined
  const { addConversationEntry, currentStage } = usePrototyping();
  const [userInput, setUserInput] = useState('');

  const handleSubmit = () => {
   console.log("Here!");
    if (!userInput.trim()) return;
    addConversationEntry({
      type: 'user',
      content: userInput
    });
    console.log("And here!");
    setUserInput('');
    setActivePanel('workspace');    // Set active panel to workspace
    setActiveHeader('workspace');   // Set active header to workspace
    console.log("Header set to workspace");
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end p-2">
        <HelpTip title="Describing Your Workflow">
          Start with the big picture, then add details. For example:
          "I need a workflow to handle new client onboarding, starting with collecting basic information and ending with account setup."
        </HelpTip>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <textarea
          value={userInput}
          onChange={handleInputChange}
          className="w-full h-full p-4 border rounded-xl resize-none 
            focus:ring-2 focus:ring-teal focus:border-transparent"
          placeholder="Describe your workflow here... Click the lightbulb for guidance."
        />
      </div>
      
      <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <button
          onClick={handleSubmit}
          className="w-full px-6 py-3 text-white bg-teal rounded-xl 
            hover:bg-teal/90 transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          Send to AIDA
        </button>
      </div>
    </div>
  );
};


export default NLPInputPanel;
