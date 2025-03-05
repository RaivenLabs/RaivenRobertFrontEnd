// types.js

/**
 * @typedef {'narrative' | 'application'} Stage
 */

/**
 * @typedef {'input' | 'workspace'} PanelType
 */

/**
 * Workflow stages definitions
 * @readonly
 * @enum {Stage}
 */
export const STAGES = {
    PATTERN_SELECTION: 'pattern_selection',    // Choose from core enterprise patterns
    INTENT_ANALYSIS: 'intent_analysis',        // Describe purpose, get AI validation/guidance
    SPECIFICATION: 'specification',            // Detailed workflow requirements within pattern
    LOGIC_STRUCTURE: 'logic_structure',        // BPMN/decision flows/validation rules
    COMPONENT_LAYOUT: 'component_layout',      // Visual representation with our widgets
    INTEGRATION_CONFIG: 'integration_config',  // Data sources, APIs, system connections
    DEPLOYMENT_READY: 'deployment_ready'       // Final validation and deployment package
};

/**
 * Panel types definitions
 * @readonly
 * @enum {PanelType}
 */
export const PANEL_TYPES = {
    INPUT: 'input',
    WORKSPACE: 'workspace'
};

/**
 * @typedef {Object} WorkflowMessage
 * @property {'user' | 'assistant'} type - The type of message
 * @property {string} content - The message content
 */

/**
 * @typedef {Object} PanelProps
 * @property {string} title - Panel title
 * @property {boolean} isActive - Whether panel is active
 * @property {Function} icon - Lucide icon component
 * @property {PanelType} type - Type of panel
 */

/**
 * @typedef {Object} WorkflowState
 * @property {Stage} currentStage - Current workflow stage
 * @property {WorkflowMessage[]} conversationHistory - Chat history
 * @property {boolean} isAidaThinking - Loading state
 * @property {PanelType} activePanel - Currently active panel
 */

// ... rest of your existing types and helpers ...

/**
 * @typedef {Object} ComponentMapping
 * @property {string} width - Panel width class
 * @property {React.ReactNode} component - Panel component
 */

export const DEFAULT_PANEL = PANEL_TYPES.INPUT;

/**
 * Get panel configuration
 * @param {PanelType} type - Panel type
 * @returns {PanelProps} Panel configuration
 */
export const getPanelConfig = (type) => {
    const configs = {
        [PANEL_TYPES.INPUT]: {
            title: 'Design Specification',
            type: PANEL_TYPES.INPUT
        },
        [PANEL_TYPES.WORKSPACE]: {
            title: 'Design Workspace',
            type: PANEL_TYPES.WORKSPACE
        }
    };
    return configs[type];
};
