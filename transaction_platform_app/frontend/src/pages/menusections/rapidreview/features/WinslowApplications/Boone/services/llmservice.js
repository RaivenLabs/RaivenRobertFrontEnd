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
    console.log("analyzeSampleData called with context:", context);
    
    // Create a form data object to send the files
    const formData = new FormData();
    
    // Add files to the form data
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });
    
    // Add context information including briefingContext
    formData.append('context', JSON.stringify({
      documentType: context.documentType,
      extractionGoals: context.extractionGoals,
      userNotes: context.userNotes,
      briefingContext: context.briefingContext // Include briefing context
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
    throw new Error(error.response?.data?.error || error.message);
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
    console.log("generateSchemaProposal called with context:", context);
    
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
    throw new Error(error.response?.data?.error || error.message);
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
    throw new Error(error.response?.data?.error || error.message);
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
    throw new Error(error.response?.data?.error || error.message);
  }


  
};
