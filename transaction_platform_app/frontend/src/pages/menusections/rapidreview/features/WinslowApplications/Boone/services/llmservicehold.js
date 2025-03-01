// src/services/llmService.js
import axios from 'axios';

/**
 * Analyzes sample data files to extract key information about their structure
 * @param {File[]} files - Uploaded document files
 * @param {Object} context - Analysis context with document type and extraction goals
 * @param {string} apiKey - API key for LLM service
 * @returns {Promise<Object>} Analysis results
 */









export const analyzeSampleData = async (files, context, apiKey) => {
  try {
    // Create a form data object to send the files
    const formData = new FormData();
    
    // Add files to the form data
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });
    
    // Add context information
    formData.append('context', JSON.stringify({
      documentType: context.documentType,
      extractionGoals: context.extractionGoals,
      userNotes: context.userNotes
    }));
    
    // Send the request to your backend API
    const response = await axios.post('/api/analyze-documents', formData, {
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error analyzing documents:', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

/**
 * Generates a schema proposal based on document analysis results
 * @param {Object} analysisResults - Results from document analysis
 * @param {Object} context - Analysis context
 * @param {Object} modelSettings - LLM model settings
 * @param {string} apiKey - API key for LLM service
 * @returns {Promise<Object>} Proposed schema
 */
export const generateSchemaProposal = async (analysisResults, context, modelSettings, apiKey) => {
  try {
    const response = await axios.post('/api/generate-schema', {
      analysisResults,
      context,
      modelSettings: {
        temperature: modelSettings?.temperature || 0.2,
        maxTokens: modelSettings?.maxTokens || 4000,
        model: modelSettings?.model || 'claude-3-7-sonnet-20250219'
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error generating schema:', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

/**
 * Generates export code in SQL or JSON format based on the schema
 * @param {Object} schema - The finalized schema
 * @param {string} format - Export format ('sql' or 'json')
 * @param {string} apiKey - API key for LLM service
 * @returns {Promise<string>} Generated code
 */
export const generateExportCode = async (schema, format, apiKey) => {
  try {
    const response = await axios.post('/api/generate-export-code', {
      schema,
      format,
      options: {
        // SQL-specific options
        sqlOptions: format === 'sql' ? {
          dialect: 'postgresql',
          includeIndexes: true,
          includeTimestamps: true
        } : undefined,
        
        // JSON Schema options
        jsonOptions: format === 'json' ? {
          draft: 'draft-07',
          includeExamples: true
        } : undefined
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      }
    });
    
    return response.data.code;
  } catch (error) {
    console.error('Error generating export code:', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

/**
 * Refines an existing schema based on user feedback
 * @param {Object} schema - Current schema
 * @param {Object} feedback - User feedback and adjustments
 * @param {string} apiKey - API key for LLM service
 * @returns {Promise<Object>} Refined schema
 */
export const refineSchema = async (schema, feedback, apiKey) => {
  try {
    const response = await axios.post('/api/refine-schema', {
      schema,
      feedback
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error refining schema:', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

/**
 * Validates a schema for consistency and completeness
 * @param {Object} schema - Schema to validate
 * @param {string} apiKey - API key for LLM service
 * @returns {Promise<Object>} Validation results
 */
export const validateSchema = async (schema, apiKey) => {
  try {
    const response = await axios.post('/api/validate-schema', {
      schema
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error validating schema:', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

/**
 * Loads the briefing context for a project
 * @param {string} projectId - ID of the project
 * @returns {Promise<Object>} Briefing context
 */
export const loadBriefingContext = async (projectId) => {
  try {
    const response = await axios.get(`/api/briefing/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error loading briefing context:', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

/**
 * Generates sample data based on the schema
 * @param {Object} schema - Schema to generate sample data for
 * @param {number} count - Number of sample records to generate
 * @param {string} apiKey - API key for LLM service
 * @returns {Promise<Array>} Sample data records
 */
export const generateSampleData = async (schema, count = 5, apiKey) => {
  try {
    const response = await axios.post('/api/generate-sample-data', {
      schema,
      count
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error generating sample data:', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

/**
 * Saves a schema for later use in document processing
 * @param {string} projectId - ID of the project
 * @param {Object} schema - The schema to save
 * @returns {Promise<Object>} Response from the server
 */

export const saveSchema = async (projectId, schema) => {
    try {
      const response = await axios.post(`/api/save-schema/${projectId}`, schema, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error saving schema:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  };
