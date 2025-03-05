// src/components/panels/WorkspacePanel.jsx
import React from 'react';
import { usePrototyping } from '../../../../context/PrototypingContext';
import HelpTip from '../../../../components/shared/common/HelpTip';
import ChatMessage from '../components/ChatMessage';

const WorkspacePanel = () => {
  const {
    conversationHistory = [],
    updateConversation,
    isAidaThinking
  } = usePrototyping();

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end p-2">
        <HelpTip title="Working with AIDA">
          AIDA will help refine your workflow. Feel free to edit responses or ask questions.
        </HelpTip>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          {Array.isArray(conversationHistory) && conversationHistory.map((entry, index) => (
            <ChatMessage
              key={index}
              message={entry}
              onEdit={(newContent) => {
                const updatedHistory = [...conversationHistory];
                updatedHistory[index].content = newContent;
                updateConversation(updatedHistory);
              }}
            />
          ))}
        </div>
      </div>

      {isAidaThinking && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal"></div>
            <span className="text-gray-700">AIDA is processing your workflow...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspacePanel;
