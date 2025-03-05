// src/context/utilities/jsonAccessor.js
export const useJsonAccess = () => {
    const accessJson = async (endpoint, action, params = {}) => {
      try {
        const response = await fetch('/api/utility/json-access', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint,  // Now using endpoint instead of file_path
            action,
            ...params
          })
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error accessing JSON:', error);
        throw error;
      }
    };
  
    // Keep all the useful utility functions
    const getValue = async (endpoint, path, defaultValue = null) => {
      const result = await accessJson(endpoint, 'get_value', {
        path,
        default: defaultValue
      });
      return result.value;
    };
  
    const getSchema = async (endpoint) => {
      const result = await accessJson(endpoint, 'get_schema');
      return result.schema;
    };
  
    const searchValues = async (endpoint, searchTerm, caseSensitive = false) => {
      const result = await accessJson(endpoint, 'search', {
        search_term: searchTerm,
        case_sensitive: caseSensitive
      });
      return result.results;
    };
  
    // Could even add some new useful functions
    const validatePath = async (endpoint, path) => {
      const result = await accessJson(endpoint, 'validate_path', {
        path
      });
      return result.validation;
    };

    const findKey = async (endpoint, key) => {
        const result = await accessJson(endpoint, 'find_key', {
            key
        });
        return result.results;
    };
// With type filtering
const findKeyWithType = async (endpoint, key, expectedType) => {
    const results = await findKey(endpoint, key);
    return results.filter(result => result.type === expectedType);
};

// With value filtering
const findKeyWithValue = async (endpoint, key, expectedValue) => {
    const results = await findKey(endpoint, key);
    return results.filter(result => result.value === expectedValue);
};

  
    return {
      getValue,
      getSchema,
      searchValues,
      validatePath,
      findKey,
      findKeyWithType,
      findKeyWithValue,
      // Include raw access for advanced use cases
      accessJson
    };




  };

