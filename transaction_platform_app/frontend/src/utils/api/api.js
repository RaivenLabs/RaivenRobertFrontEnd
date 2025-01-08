import { API_URL } from './config';  

export const fetchFromAPI = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  // Check the content type of the response
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else if (contentType && contentType.includes('text/')) {
    return response.text();
  } else if (contentType && contentType.includes('application/octet-stream')) {
    return response.blob();
  } else {
    console.warn(`Unknown content type: ${contentType}, attempting to parse as JSON`);
    return response.json();
  }
};
