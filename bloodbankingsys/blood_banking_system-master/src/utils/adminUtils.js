import { API_BASE_URL } from './api';

/**
 * Gets the authentication token from localStorage
 * @returns {string|null} The authentication token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Make an authenticated API request specifically for admin endpoints
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {object} body - Request body for POST/PUT requests
 * @returns {Promise} Response promise
 */
export const adminApiRequest = async (endpoint, method = 'GET', body = null) => {
  console.log(`Making ADMIN ${method} request to: ${API_BASE_URL}${endpoint}`);
  
  try {
    // Get token
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token available');
      throw new Error('Authentication required: Please log in as admin');
    }
    
    // Get user role for validation
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'ADMIN') {
      console.error('User does not have admin role:', userRole);
      throw new Error('Access denied: Admin privileges required');
    }
    
    // Clean token
    let cleanToken = token.trim();
    if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
      cleanToken = cleanToken.slice(1, -1).trim();
    }
    
    // Request options
    const options = {
      method: method,
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        // Removed custom X-Admin-Access header that was causing CORS issues
      },
      credentials: 'include'
    };
    
    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }
    
    // Make request with custom timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    options.signal = controller.signal;
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      clearTimeout(timeoutId);
      
      console.log(`ADMIN API Response for ${endpoint}: Status ${response.status}`);
      
      if (response.status === 401) {
        console.error('Admin authentication failed: 401 Unauthorized');
        // Try to get error details
        const errorText = await response.text();
        console.error(`API 401 error details: ${errorText || 'No details available'}`);
        throw new Error('Admin authentication failed: Please log in again');
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error response: ${errorText}`);
        throw new Error(`API error: ${response.status} - ${response.statusText}`);
      }
      
      if (response.headers.get('content-length') === '0') {
        return null;  // Empty response
      }
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error('Request timeout: Server took too long to respond');
      }
      throw err;
    }
  } catch (err) {
    console.error(`ADMIN API request failed for ${endpoint}:`, err);
    throw err;
  }
};

/**
 * Make an admin GET request
 * @param {string} endpoint - API endpoint
 * @returns {Promise} Response promise
 */
export const adminGet = async (endpoint) => {
  return adminApiRequest(endpoint, 'GET');
};

/**
 * Make an admin POST request
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body
 * @returns {Promise} Response promise
 */
export const adminPost = async (endpoint, data) => {
  return adminApiRequest(endpoint, 'POST', data);
};

/**
 * Make an admin PUT request
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body
 * @returns {Promise} Response promise
 */
export const adminPut = async (endpoint, data) => {
  return adminApiRequest(endpoint, 'PUT', data);
};

/**
 * Make an admin DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise} Response promise
 */
export const adminDelete = async (endpoint) => {
  return adminApiRequest(endpoint, 'DELETE');
};

// List of admin-only endpoints that need special handling
export const ADMIN_ENDPOINTS = {
  PENDING_DONATIONS: '/blood-donations/pending',
  PENDING_REQUESTS: '/blood-requests/pending',
  APPROVE_DONATION: '/blood-donations',  // Append /{id}/approve for use
  REJECT_DONATION: '/blood-donations',   // Append /{id}/reject for use
  APPROVE_REQUEST: '/blood-requests',    // Append /{id}/approve for use
  REJECT_REQUEST: '/blood-requests',     // Append /{id}/reject for use
  ADMIN_STATS: '/stats/admin'
};