// Template configuration stages
const TEMPLATE_STAGES = {
    PROGRAM_SELECTION: 'PROGRAM_SELECTION',
    TEMPLATE_CONVERSION: 'TEMPLATE_CONVERSION', // New stage for converting templates
    TEMPLATE_SETUP: 'TEMPLATE_SETUP',
    VARIABLE_CONFIG: 'VARIABLE_CONFIG',
    LOGIC_CONFIG: 'LOGIC_CONFIG',
    PREVIEW_VALIDATE: 'PREVIEW_VALIDATE',
    PRODUCTION_READY: 'PRODUCTION_READY'
  };
  
  // Conversion states
  const DEFAULT_CONVERSION_STATES = {
    "SOURCE": {
      "label": "Source Template",
      "description": "Original template with standard variables, not yet converted",
      "displayClass": "bg-amber-100 text-amber-800 border-amber-300"
    },
    "CONVERTED": {
      "label": "Converted Template",
      "description": "Template with double curly bracket syntax, ready for use",
      "displayClass": "bg-green-100 text-green-800 border-green-300"
    },
    "IN_PROGRESS": {
      "label": "Conversion In Progress",
      "description": "Template is currently being processed",
      "displayClass": "bg-blue-100 text-blue-800 border-blue-300"
    },
    "ERROR": {
      "label": "Conversion Error",
      "description": "Error occurred during template conversion",
      "displayClass": "bg-red-100 text-red-800 border-red-300"
    }
  };


export { TEMPLATE_STAGES, DEFAULT_CONVERSION_STATES };
