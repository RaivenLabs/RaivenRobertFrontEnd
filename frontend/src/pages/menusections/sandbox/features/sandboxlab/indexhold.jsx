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
  ArrowUpRight
} from 'lucide-react';

// Stage definitions
const STAGES = {
  NARRATIVE: 'narrative',
  APPLICATION: 'application'
};

// Custom Tooltip Component
const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div className="absolute z-50 w-64 p-2 mt-2 text-sm text-white bg-gray-800 
          rounded-lg shadow-lg -translate-x-1/2 left-1/2">
          {content}
          <div className="absolute w-2 h-2 bg-gray-800 rotate-45 -top-1 left-1/2 
            -translate-x-1/2" />
        </div>
      )}
    </div>
  );
};

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

const AidaLoadingIndicator = () => {
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



// SwapPanelsButton Component
const SwapPanelsButton = ({ onSwap }) => (
  <button
    onClick={onSwap}
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10
      bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
    title="Swap panels"
  >
    <ArrowLeftRight className="w-5 h-5 text-gray-600" />
  </button>
);



const ProcessBar = ({ currentStage }) => {
  const stages = [
    { 
      id: STAGES.NARRATIVE, 
      label: 'Describe Workflow', 
      icon: MessageSquare,
      tooltip: 'Work with AIDA to describe your workflow needs in everyday language'
    },
    { 
      id: STAGES.BPMN, 
      label: 'Process Steps', 
      icon: Layout,
      tooltip: 'Visualize and refine your workflow as clear business process steps'
    },
    { 
      id: STAGES.APPLICATION, 
      label: 'Application Diagram', 
      icon: Beaker,
      tooltip: 'Convert your process into a working application diagram'
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

// First define the PromoteButton component within the same file
const PromoteButton = ({ onClick, label, tooltip }) => (
  <Tooltip content={tooltip}>
    <button
      onClick={onClick}
      className="mt-4 px-6 py-3 bg-teal text-white rounded-xl hover:bg-teal/90 
        transition-colors flex items-center justify-center gap-2 w-full"
    >
      <ArrowUpRight className="w-5 h-5" />
      {label}
    </button>
  </Tooltip>
);



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








const ChatMessage = ({ message, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  // Helper function to format the message content
  const formatContent = (content) => {
    return (
      <div className="prose prose-sm max-w-none">
        {content.split('\n').map((line, index) => (
          <p key={index} className="mb-2 last:mb-0">
            {line}
          </p>
        ))}
      </div>
    );
  };

  if (message.type === 'user' || !isEditing) {
    return (
      <div 
        className={`p-6 rounded-lg mb-4 shadow-sm ${
          message.type === 'user' 
            ? 'bg-gray-50 border border-gray-100' 
            : 'bg-blue-50 border border-blue-100'
        }`}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            {formatContent(message.content)}
          </div>
          {message.type === 'assistant' && (
            <button 
              onClick={() => setIsEditing(true)}
              className="shrink-0 text-sm text-blue-600 hover:text-blue-800 
                transition-colors px-2 py-1 rounded hover:bg-blue-50"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-teal 
          focus:border-transparent resize-vertical min-h-[100px]"
        rows={4}
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() => setIsEditing(false)}
          className="px-3 py-1.5 text-gray-600 hover:text-gray-800 
            hover:bg-gray-50 rounded transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onEdit(editedContent);
            setIsEditing(false);
          }}
          className="px-3 py-1.5 bg-teal text-white rounded-md 
            hover:bg-teal/90 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
};










// Then the WorkspacePanel component
const WorkspacePanel = () => {
  const {
    conversationHistory = [],
    currentStage,
    updateConversation,
    handlePromoteToCanvas,
    isAidaThinking
  } = usePrototyping();

  const onPromoteToCanvas = async () => {
    try {
      const lastAidaResponse = conversationHistory
        .filter(entry => entry.type === 'assistant')
        .pop();

      if (!lastAidaResponse) {
        throw new Error('No workflow description found');
      }

      await handlePromoteToCanvas(lastAidaResponse.content);
      
    } catch (error) {
      console.error('Error promoting to canvas:', error);
      // You might want to show an error notification here
    }
  };

  const getPromoteButton = () => {
    if (currentStage === STAGES.NARRATIVE) {
      return (
        <PromoteButton
          onClick={onPromoteToCanvas}
          label="Promote to Canvas"
          tooltip="Convert your workflow description into a Tooljet canvas"
        />
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end p-2">
        <HelpTip title="Working with AIDA">
          AIDA will help refine your workflow. Feel free to edit responses or ask questions.
          Click Promote when you're ready to convert your workflow to a canvas.
        </HelpTip>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {currentStage === STAGES.NARRATIVE && Array.isArray(conversationHistory) &&
          conversationHistory.map((entry, index) => (
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
        
        {currentStage === STAGES.APPLICATION && (
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Canvas Generation Complete
            </h3>
            <p className="text-gray-600 mb-4">
              Your workflow has been converted into a Tooljet canvas.
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>View and edit your canvas in Tooljet</li>
              <li>Customize components and layouts</li>
              <li>Configure data sources and actions</li>
            </ul>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        {getPromoteButton()}
      </div>
    </div>
  );
};





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
            title="Tooljet Workflow Canvas"  // Add this line
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





const PrototypingLab = () => {
  const [activePanel, setActivePanel] = useState('input');
  const [activeHeader, setActiveHeader] = useState('input');
  const [panelsReversed, setPanelsReversed] = useState(false);
  const { currentStage, initializeProgress } = usePrototyping();

  useEffect(() => {
    initializeProgress();
  }, [initializeProgress]);

  const PanelHeader = ({ title, isActive, icon: Icon }) => (
    <div className={`p-6 border-b border-gray-200 transition-all duration-300
      ${isActive ? 'bg-gradient-to-r from-royalBlue to-teal' : 'bg-white'}
      rounded-t-xl`}
    >
      <h2 className={`text-xl font-semibold flex items-center gap-2
        ${isActive ? 'text-white' : 'text-gray-800'}`}
      >
        <Icon className="w-6 h-6" />
        {title}
      </h2>
    </div>
  );

  // Helper to render the appropriate panel content
  const getPanelContent = () => {
    if (currentStage === STAGES.APPLICATION) {
      // Single panel layout for canvas
      return (
        <div className="pl-9 pr-25 w-full"> {/* 9px from left, 25px from right */}
          <div className={`flex flex-col h-full bg-white rounded-xl shadow-lg border
            border-teal transition-all duration-300`}
          >
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

    // Original split panel layout for other stages
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
                <WorkspacePanel />
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

      {/* Loading Indicator */}
      <AidaLoadingIndicator />
    </div>
  );
};

export default PrototypingLab;
