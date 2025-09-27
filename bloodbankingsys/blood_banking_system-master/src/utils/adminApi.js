/**
 * AdminDashboardFix.js - Helper file to properly handle API calls in AdminDashboard
 */

import { API_BASE_URL, getHeaders } from './api';

/**
 * Makes an authenticated API request to the backend with proper credentials
 * 
 * This function ensures all options are consistently applied including:
 * - Authorization header with token
 * - Content-Type and Accept headers
 * - CORS mode and credentials
 * 
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Additional fetch options
 * @returns {Promise<Response>} - Fetch response
 */
export async function adminApiRequest(endpoint, options = {}) {
  console.log(`AdminDashboard API request to: ${endpoint}`);

  // Get authentication headers
  const headers = getHeaders(true);
  
  // Merge with any headers provided in options
  const mergedHeaders = {
    ...headers,
    ...(options.headers || {})
  };

  // Apply consistent options
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: mergedHeaders,
    mode: 'cors',
    credentials: 'include',
    cache: 'no-cache'
  });

  // Log response status
  console.log(`API response status for ${endpoint}: ${response.status}`);

  // Handle error cases
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'No error details');
    console.error(`API error for ${endpoint}:`, errorText);
    
    if (response.status === 401) {
      throw new Error('Authentication failed: Please log in again');
    }
    
    throw new Error(`API error (${response.status}): ${errorText}`);
  }

  // Parse and return JSON response
  const data = await response.json();
  console.log(`Successfully received data from ${endpoint}: ${data.length} items`);
  return data;
}

/**
 * Helper for API GET requests
 * @param {string} endpoint - API endpoint
 * @returns {Promise<any>} - Response data
 */
export async function adminApiGet(endpoint) {
  return adminApiRequest(endpoint, { method: 'GET' });
}

/**
 * Helper for API POST requests
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body data
 * @returns {Promise<any>} - Response data
 */
export async function adminApiPost(endpoint, data) {
  return adminApiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * Helper for API PUT requests
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body data
 * @returns {Promise<any>} - Response data
 */
export async function adminApiPut(endpoint, data) {
  return adminApiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

/**
 * Helper for API DELETE requests
 * @param {string} endpoint - API endpoint
 * @returns {Promise<any>} - Response data
 */
export async function adminApiDelete(endpoint) {
  return adminApiRequest(endpoint, { method: 'DELETE' });
}