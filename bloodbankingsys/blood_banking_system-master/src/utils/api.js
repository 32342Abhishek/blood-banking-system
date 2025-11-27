/**
 * API utility functions for making authenticated requests
 */

// Base URL for the backend API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

// API endpoint constants
export const ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  ADMIN_LOGIN: '/auth/admin/login',
  REGISTER: '/auth/register',
  VERIFY_TOKEN: '/auth/verify',
  
  // Blood donations
  BLOOD_DONATIONS: '/blood-donations',
  DONOR_DONATIONS: '/blood-donations/donor',
  
  // Blood inventory
  BLOOD_INVENTORY: '/blood-inventory',
  INVENTORY_STOCK: '/blood-inventory/stock',
  
  // Donors
  DONORS: '/donors',
  DONOR_BY_ID: '/donors',
  
  // Blood requests
  BLOOD_REQUESTS: '/blood-requests',
  
  // Appointments
  APPOINTMENTS: '/donation-appointments',
  
  // Emergency notifications
  EMERGENCY_NOTIFICATIONS: '/emergency-notifications',
  ACTIVE_NOTIFICATIONS: '/emergency-notifications/active',
  NOTIFICATIONS: '/notifications',
  
  // Hospitals
  HOSPITALS: '/hospitals',
  
  // Analytics
  DONOR_ANALYTICS: '/analytics/donors',
  DONATION_ANALYTICS: '/analytics/donations',
  
  // Statistics
  STATS: '/stats',
  STATS_SYSTEM: '/stats/system',
  
  // Data Management
  DATA_IMPORT: '/data/import',
  DATA_EXPORT: '/data/export',
  DATA_GENERATE: '/data/generate',
  
  // System
  HEALTH: '/health',
  TEST: '/test/ping'
};

// Default request options for fetch calls
const DEFAULT_OPTIONS = {
  mode: 'cors',
  credentials: 'omit', // Changed from 'include' to 'omit' to avoid cookie-based auth conflict
  cache: 'no-cache' // Avoid caching issues with authentication
};

/**
 * Check if the API server is reachable
 * @returns {Promise<boolean>} True if server is reachable, false otherwise
 */
export const checkServerStatus = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal
    }).catch(() => null);
    
    clearTimeout(timeoutId);
    return response && response.ok;
  } catch (error) {
    console.error("Server check failed:", error);
    return false;
  }
};

/**
 * Get auth token from local storage
 * @returns {string|null} The JWT token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token, false otherwise
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Get common headers for API requests including auth token if available
 * @param {boolean} includeContent - Whether to include Content-Type header
 * @returns {object} Headers object
 */
export const getHeaders = (includeContent = true) => {
  const headers = {};
  
  if (includeContent) {
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
  }
  
  const token = getAuthToken();
  if (token) {
    // Ensure token is trimmed and properly formatted
    const cleanToken = token.trim();
    headers['Authorization'] = `Bearer ${cleanToken}`;
    console.log("Adding auth header:", `Bearer ${cleanToken.substring(0, 10)}...`);
  } else {
    console.warn("No authentication token found in localStorage");
  }
  
  return headers;
};

/**
 * Make an authenticated GET request
 * @param {string} endpoint - API endpoint
 * @returns {Promise} Response promise
 */
export const apiGet = async (endpoint) => {
  console.log(`Making GET request to: ${API_BASE_URL}${endpoint}`);
  
  try {
    // Get token directly each time to ensure fresh token
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token available');
      throw new Error('Authentication required: Please log in');
    }
    
    // Get user role for debugging
    const userRole = localStorage.getItem('userRole');
    console.log(`Current user role: ${userRole || 'unknown'}`);
    
    // Clean and format token properly - handle possible quotation marks and whitespace
    let cleanToken = token.trim();
    if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
      cleanToken = cleanToken.slice(1, -1).trim();
      console.log("Removed quotes from token");
    }
    
    // Additional token checks
    if (cleanToken.indexOf(' ') !== -1) {
      console.warn("WARNING: Token contains spaces which may cause issues");
      cleanToken = cleanToken.split(' ').join('');
    }
    
    // Try to decode the token to check its validity
    try {
      const parts = cleanToken.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        console.log("Token payload:", payload);
        
        // Check if token has the right permissions/roles
        if (payload.exp) {
          const expTime = new Date(payload.exp * 1000);
          const now = new Date();
          console.log(`Token expiration: ${expTime.toLocaleString()}, Current time: ${now.toLocaleString()}`);
          
          if (expTime < now) {
            console.error("TOKEN EXPIRED!");
            localStorage.removeItem('token');
            throw new Error('Authentication failed: Token expired, please log in again');
          }
        }
      } else {
        console.warn("Token does not have a valid JWT format (3 parts separated by periods)");
      }
    } catch (decodeError) {
      console.warn("Could not decode token:", decodeError);
    }
    
    // Build headers manually to ensure correct format
    const headers = {
      'Authorization': `Bearer ${cleanToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    console.log(`Request headers for ${endpoint}: Authorization: Bearer ${cleanToken.substring(0, Math.min(10, cleanToken.length))}...`);
    console.log(`Token length: ${cleanToken.length} characters`);
    
    // Make request with explicit options
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: headers,
      mode: 'cors',
      cache: 'no-cache'
    });
    
    console.log(`API Response for ${endpoint}: Status ${response.status}`);
    
    if (response.status === 401) {
      console.error('Authentication failed: 401 Unauthorized');
      // Try to get error response body for more details
      try {
        const errorText = await response.text();
        console.error(`API 401 error details: ${errorText}`);
      } catch (e) {
        console.error("Could not read error response body");
      }
      
      // Check if this is a protected admin endpoint
      if (endpoint.includes('/pending') && userRole !== 'ADMIN') {
        console.error('This endpoint requires ADMIN privileges');
      }
      
      // Clear invalid token
      localStorage.removeItem('token');
      
      // Throw specific auth error
      throw new Error('Authentication failed: Please log in again');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error response: ${errorText}`);
      throw new Error(`API error: ${response.status} - ${response.statusText}. Details: ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`API request failed for ${endpoint}:`, err);
    throw err;
  }
};

/**
 * Make an authenticated POST request
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body data
 * @returns {Promise} Response promise
 */
export const apiPost = async (endpoint, data) => {
  console.log(`Making POST request to: ${API_BASE_URL}${endpoint}`);
  
  try {
    // Get token directly each time to ensure fresh token
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token available');
      throw new Error('Authentication required: Please log in');
    }
    
    // Clean and format token properly - handle possible quotation marks and whitespace
    let cleanToken = token.trim();
    if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
      cleanToken = cleanToken.slice(1, -1).trim();
      console.log("Removed quotes from token");
    }
    
    // Build headers manually to ensure correct format
    const headers = {
      'Authorization': `Bearer ${cleanToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    console.log(`Request headers for ${endpoint}: Authorization: Bearer ${cleanToken.substring(0, Math.min(10, cleanToken.length))}...`);
    
    // Make request with explicit options
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
      mode: 'cors',
      cache: 'no-cache'
    });
    console.log(`API Response for ${endpoint}: Status ${response.status}`);
    
    if (response.status === 401) {
      console.error('Authentication failed: 401 Unauthorized');
      throw new Error('Authentication failed: Please log in again');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error response: ${errorText}`);
      throw new Error(`API error: ${response.status} - ${response.statusText}. Details: ${errorText}`);
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error(`API request failed for ${endpoint}:`, err);
    throw err;
  }
};

/**
 * Make an authenticated PUT request
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body data
 * @returns {Promise} Response promise
 */
export const apiPut = async (endpoint, data) => {
  console.log(`Making PUT request to: ${API_BASE_URL}${endpoint}`);
  
  try {
    // Get token directly each time to ensure fresh token
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token available');
      throw new Error('Authentication required: Please log in');
    }
    
    // Clean and format token properly - handle possible quotation marks and whitespace
    let cleanToken = token.trim();
    if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
      cleanToken = cleanToken.slice(1, -1).trim();
      console.log("Removed quotes from token");
    }
    
    // Build headers manually to ensure correct format
    const headers = {
      'Authorization': `Bearer ${cleanToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    console.log(`Request headers for ${endpoint}: Authorization: Bearer ${cleanToken.substring(0, Math.min(10, cleanToken.length))}...`);
    
    // Make request with explicit options
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data),
      mode: 'cors',
      credentials: 'omit', // Changed from 'include' to 'omit' to avoid cookie-based auth conflict
      cache: 'no-cache'
    });
    
    console.log(`API Response for ${endpoint}: Status ${response.status}`);
    
    if (response.status === 401) {
      console.error('Authentication failed: 401 Unauthorized');
      throw new Error('Authentication failed: Please log in again');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error response: ${errorText}`);
      throw new Error(`API error: ${response.status} - ${response.statusText}. Details: ${errorText}`);
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error(`API request failed for ${endpoint}:`, err);
    throw err;
  }
};

/**
 * Make an authenticated DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise} Response promise
 */
export const apiDelete = async (endpoint) => {
  console.log(`Making DELETE request to: ${API_BASE_URL}${endpoint}`);
  
  try {
    // Get token directly each time to ensure fresh token
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token available');
      throw new Error('Authentication required: Please log in');
    }
    
    // Clean and format token properly - handle possible quotation marks and whitespace
    let cleanToken = token.trim();
    if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
      cleanToken = cleanToken.slice(1, -1).trim();
      console.log("Removed quotes from token");
    }
    
    // Build headers manually to ensure correct format
    const headers = {
      'Authorization': `Bearer ${cleanToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    console.log(`Request headers for ${endpoint}: Authorization: Bearer ${cleanToken.substring(0, Math.min(10, cleanToken.length))}...`);
    
    // Make request with explicit options
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: headers,
      mode: 'cors',
      cache: 'no-cache'
    });
    
    console.log(`API Response for ${endpoint}: Status ${response.status}`);
    
    if (response.status === 401) {
      console.error('Authentication failed: 401 Unauthorized');
      throw new Error('Authentication failed: Please log in again');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error response: ${errorText}`);
      throw new Error(`API error: ${response.status} - ${response.statusText}. Details: ${errorText}`);
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error(`API request failed for ${endpoint}:`, err);
    throw err;
  }
};

/**
 * Upload a file with authentication
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - Form data with file
 * @returns {Promise} Response promise
 */
export const apiUpload = async (endpoint, formData) => {
  console.log(`Making file upload request to: ${API_BASE_URL}${endpoint}`);
  
  try {
    // Get token directly each time to ensure fresh token
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token available');
      throw new Error('Authentication required: Please log in');
    }
    
    // Clean and format token properly - handle possible quotation marks and whitespace
    let cleanToken = token.trim();
    if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
      cleanToken = cleanToken.slice(1, -1).trim();
      console.log("Removed quotes from token");
    }
    
    // Build headers manually to ensure correct format - don't include Content-Type for FormData
    const headers = {
      'Authorization': `Bearer ${cleanToken}`
    };
    
    console.log(`Request headers for ${endpoint}: Authorization: Bearer ${cleanToken.substring(0, Math.min(10, cleanToken.length))}...`);
    
    // Make request with explicit options
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: formData,
      mode: 'cors',
      credentials: 'include',
      cache: 'no-cache'
    });
    
    console.log(`API Response for ${endpoint}: Status ${response.status}`);
    
    if (response.status === 401) {
      console.error('Authentication failed: 401 Unauthorized');
      throw new Error('Authentication failed: Please log in again');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error response: ${errorText}`);
      throw new Error(`API error: ${response.status} - ${response.statusText}. Details: ${errorText}`);
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error(`API request failed for ${endpoint}:`, err);
    throw err;
  }
};