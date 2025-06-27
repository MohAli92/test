// Dynamic API URL detection for CodeSpaces and local development
export const getApiUrl = () => {
  // Check if we're in CodeSpaces
  if (process.env.REACT_APP_CODESPACES === 'true' || window.location.hostname.includes('github.dev')) {
    // Use the current hostname with port 5000 for the API
    const hostname = window.location.hostname;
    return `https://${hostname}:5000`;
  }
  
  // Default to localhost for local development
  return process.env.REACT_APP_API_URL || 'http://localhost:5000';
};

// Helper function to build API endpoints
export const buildApiUrl = (endpoint: string) => {
  return `${getApiUrl()}${endpoint}`;
}; 