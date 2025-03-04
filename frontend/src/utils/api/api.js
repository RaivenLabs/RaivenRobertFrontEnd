export const fetchFromAPI = async (endpoint, apiUrl, options = {}) => {
  console.log('Fetching from API:', `${apiUrl}${endpoint}`);

  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Environment': process.env.NODE_ENV,  // Add environment header
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
