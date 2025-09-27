/**
 * Authentication Testing Script
 * 
 * This script can be pasted into the browser console to test authentication issues
 */

// Configuration
const API_BASE_URL = 'http://localhost:8081/api';

// Test authentication with basic fetch
async function testAuth() {
  console.log('---------- AUTH TEST REPORT ----------');
  
  // Check for token in localStorage
  const token = localStorage.getItem('token');
  console.log(`1. Token exists: ${!!token}`);
  if (token) {
    console.log(`   Token length: ${token.length}`);
    console.log(`   Token first 20 chars: ${token.substring(0, 20)}...`);
  }
  
  // Check other auth data in localStorage
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  console.log(`2. User data in localStorage:`, { userId, userName, userRole });
  
  // Test a working endpoint to compare behavior
  console.log('\n3. Testing known working endpoint: /health');
  try {
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    console.log(`   Response status: ${healthResponse.status}`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log(`   Response data:`, healthData);
    } else {
      console.log(`   Error response: ${await healthResponse.text()}`);
    }
  } catch (err) {
    console.error(`   Request error:`, err);
  }
  
  // Test the problematic endpoints with authorization
  console.log('\n4. Testing protected endpoint: /donors');
  await testProtectedEndpoint('/donors');
  
  console.log('\n5. Testing problematic endpoint: /blood-donations/pending');
  await testProtectedEndpoint('/blood-donations/pending');
  
  console.log('\n6. Testing problematic endpoint: /blood-requests/pending');
  await testProtectedEndpoint('/blood-requests/pending');
  
  console.log('\n7. Testing problematic endpoint: /notifications');
  await testProtectedEndpoint('/notifications');
  
  console.log('\n---------- END AUTH TEST ----------');
}

// Helper function to test protected endpoints
async function testProtectedEndpoint(endpoint) {
  try {
    // Get token
    const token = localStorage.getItem('token');
    
    // Print complete request details
    console.log(`   Requesting: ${API_BASE_URL}${endpoint}`);
    console.log(`   Headers: Authorization: Bearer ${token ? token.substring(0, 10) + '...' : 'MISSING'}`);
    
    // Make request with credentials
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'include',
      cache: 'no-cache'
    });
    
    console.log(`   Response status: ${response.status}`);
    
    // Log response headers
    const responseHeaders = {};
    response.headers.forEach((value, name) => {
      responseHeaders[name] = value;
    });
    console.log(`   Response headers:`, responseHeaders);
    
    // Log data or error
    if (response.ok) {
      const data = await response.json();
      console.log(`   Data received: ${data.length} items`);
      if (data.length > 0) {
        console.log(`   First item:`, data[0]);
      }
    } else {
      const errorText = await response.text();
      console.log(`   Error response: ${errorText}`);
    }
  } catch (err) {
    console.error(`   Request error:`, err);
  }
}

// Function to attempt login
async function testLogin(username, password, isAdmin = false) {
  console.log('---------- LOGIN TEST ----------');
  console.log(`Attempting ${isAdmin ? 'admin' : 'regular'} login with ${username}`);
  
  try {
    const endpoint = isAdmin ? '/auth/admin/login' : '/auth/login';
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password }),
      mode: 'cors',
      credentials: 'include'
    });
    
    console.log(`Login response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Login successful! Token received:', data.token ? `${data.token.substring(0, 20)}...` : 'No token in response');
      
      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userRole', data.role);
      
      // Verify storage
      console.log('Token stored in localStorage:', localStorage.getItem('token') ? 'Yes' : 'No');
      
      return true;
    } else {
      const errorText = await response.text();
      console.log(`Login failed: ${response.status} - ${response.statusText}`);
      console.log(`Error details: ${errorText}`);
      return false;
    }
  } catch (err) {
    console.error('Login request error:', err);
    return false;
  }
}

// Function to clear auth data
function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
  console.log('Auth data cleared from localStorage');
}

// Run the tests on script execution
console.log('Auth testing script loaded. Use these functions:');
console.log('- testAuth() - Test authentication with endpoints');
console.log('- testLogin(username, password, isAdmin) - Test login with credentials');
console.log('- clearAuthData() - Clear authentication data');

// Export functions to window for direct console access
window.testAuth = testAuth;
window.testLogin = testLogin;
window.clearAuthData = clearAuthData;