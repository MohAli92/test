// Dynamic API URL detection for CodeSpaces and local development
export const getApiUrl = () => {
  // Check if we're in CodeSpaces
  if (process.env.REACT_APP_CODESPACES === 'true' || window.location.hostname.includes('github.dev')) {
    const hostname = window.location.hostname;
    return `https://${hostname}:5000`;
  }
  // Only use env variable as fallback
  return process.env.REACT_APP_API_URL;
};

// Helper function to build API endpoints
export const buildApiUrl = (endpoint: string) => {
  return `${getApiUrl()}${endpoint}`;
}; 