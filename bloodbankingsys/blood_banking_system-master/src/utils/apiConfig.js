/**
 * API Configuration for the entire application
 * This centralizes all API URL settings
 */

// Base URL for the backend API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

/**
 * Creates a full API URL by appending an endpoint to the base URL
 * @param {string} endpoint - API endpoint without leading slash
 * @returns {string} - Full API URL
 */
export const getApiUrl = (endpoint) => {
  // Remove any leading slashes from the endpoint to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Export functions for common API operations
export const apiGet = async (endpoint, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(getApiUrl(endpoint), {
    method: 'GET',
    headers
  });
  
  return response;
};

export const apiPost = async (endpoint, data, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(getApiUrl(endpoint), {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  
  return response;
};

export const apiPut = async (endpoint, data, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(getApiUrl(endpoint), {
    method: 'PUT',
    headers,
    body: JSON.stringify(data)
  });
  
  return response;
};

export const apiDelete = async (endpoint, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(getApiUrl(endpoint), {
    method: 'DELETE',
    headers
  });
  
  return response;
};