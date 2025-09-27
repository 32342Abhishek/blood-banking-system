// TokenDebugger.jsx
// Simple component to help debug token issues
import React, { useState } from 'react';

const TokenDebugger = () => {
  const [tokenStatus, setTokenStatus] = useState({});

  const checkToken = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const timestamp = localStorage.getItem('loginTimestamp');

    let tokenInfo = {
      exists: !!token,
      length: token ? token.length : 0,
      hasQuotes: token ? (token.startsWith('"') && token.endsWith('"')) : false,
      preview: token ? `${token.substring(0, 15)}...` : 'No token',
      userId,
      userName,
      userRole,
      loginTime: timestamp ? new Date(parseInt(timestamp)).toLocaleString() : 'Unknown'
    };

    // Check token format
    if (token) {
      try {
        // Get payload section
        const parts = token.split('.');
        tokenInfo.validFormat = parts.length === 3;
        
        if (tokenInfo.validFormat) {
          // Try to decode payload
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = window.atob(base64);
          const payload = JSON.parse(jsonPayload);
          
          tokenInfo.decodedPayload = {
            sub: payload.sub,
            exp: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'Unknown',
            role: payload.role || 'Not found',
            isExpired: payload.exp ? (payload.exp * 1000 < Date.now()) : 'Unknown'
          };
        }
      } catch (err) {
        tokenInfo.parseError = err.message;
      }
    }

    setTokenStatus(tokenInfo);
  };

  const testEndpoint = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found in localStorage');
        return;
      }
      
      // Import apiGet from api.js
      const { apiGet } = await import('../utils/api');
      
      // Use our improved apiGet function that properly handles token cleaning
      const response = await apiGet('/health');
      alert(`Success! API returned: ${JSON.stringify(response)}`);
      
      setTokenStatus({
        ...tokenStatus,
        testResult: {
          success: true,
          response: response
        }
      });
    } catch (err) {
      alert(`Error: ${err.message}`);
      setTokenStatus({
        ...tokenStatus,
        testResult: {
          success: false,
          error: err.message
        }
      });
    }
  };

  const testAdminEndpoints = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found in localStorage');
        return;
      }
      
      const userRole = localStorage.getItem('userRole');
      if (userRole !== 'ADMIN') {
        alert('Warning: Your user role is not ADMIN. These endpoints may fail.');
      }
      
      // Import standard API utils for common endpoints
      const { apiGet } = await import('../utils/api');
      
      // Import admin-specific API utils
      const { adminGet, ADMIN_ENDPOINTS } = await import('../utils/adminUtils');
      
      const results = [];
      
      // Test standard endpoints with normal API utils
      try {
        const healthResponse = await apiGet('/health');
        results.push(`/health: SUCCESS`);
      } catch (err) {
        results.push(`/health: FAILED - ${err.message}`);
      }
      
      try {
        const stockResponse = await apiGet('/blood-inventory/stock');
        results.push(`/blood-inventory/stock: SUCCESS`);
      } catch (err) {
        results.push(`/blood-inventory/stock: FAILED - ${err.message}`);
      }
      
      try {
        const notificationsResponse = await apiGet('/emergency-notifications');
        results.push(`/emergency-notifications: SUCCESS`);
      } catch (err) {
        results.push(`/emergency-notifications: FAILED - ${err.message}`);
      }
      
      // Test admin-specific endpoints with admin utils
      try {
        console.log("Testing pending donations with admin utility...");
        const pendingDonationsResponse = await adminGet(ADMIN_ENDPOINTS.PENDING_DONATIONS);
        results.push(`${ADMIN_ENDPOINTS.PENDING_DONATIONS}: SUCCESS - Found ${pendingDonationsResponse.length} items`);
      } catch (err) {
        console.error("Admin pending donations test failed:", err);
        results.push(`${ADMIN_ENDPOINTS.PENDING_DONATIONS}: FAILED - ${err.message}`);
      }
      
      try {
        console.log("Testing pending requests with admin utility...");
        const pendingRequestsResponse = await adminGet(ADMIN_ENDPOINTS.PENDING_REQUESTS);
        results.push(`${ADMIN_ENDPOINTS.PENDING_REQUESTS}: SUCCESS - Found ${pendingRequestsResponse.length} items`);
      } catch (err) {
        console.error("Admin pending requests test failed:", err);
        results.push(`${ADMIN_ENDPOINTS.PENDING_REQUESTS}: FAILED - ${err.message}`);
      }
      
      alert('Admin Endpoint Test Results:\n\n' + results.join('\n'));
      
      setTokenStatus({
        ...tokenStatus,
        adminEndpointTests: results
      });
    } catch (err) {
      console.error("Error in testAdminEndpoints:", err);
      alert(`Error testing endpoints: ${err.message}`);
    }
  };
  
  const clearToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('loginTimestamp');
    setTokenStatus({});
    alert('Auth data cleared');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>JWT Token Debugger</h2>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={checkToken}
          style={{ padding: '8px 16px', marginRight: '10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Check Current Token
        </button>
        <button 
          onClick={testEndpoint}
          style={{ padding: '8px 16px', marginRight: '10px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Test Auth Endpoint
        </button>
        <button 
          onClick={testAdminEndpoints}
          style={{ padding: '8px 16px', marginRight: '10px', background: '#673AB7', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Test Admin Endpoints
        </button>
        <button 
          onClick={clearToken}
          style={{ padding: '8px 16px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Clear Token
        </button>
      </div>

      {Object.keys(tokenStatus).length > 0 && (
        <div style={{ 
          padding: '15px', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          backgroundColor: tokenStatus.exists ? '#e8f5e9' : '#ffebee'
        }}>
          <h3>Token Status</h3>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            <li><strong>Token Exists:</strong> {tokenStatus.exists ? 'Yes' : 'No'}</li>
            {tokenStatus.exists && (
              <>
                <li><strong>Token Length:</strong> {tokenStatus.length} characters</li>
                <li><strong>Has Quotes:</strong> {tokenStatus.hasQuotes ? 'Yes (Problem)' : 'No (Good)'}</li>
                <li><strong>Token Preview:</strong> {tokenStatus.preview}</li>
                <li><strong>Valid Format:</strong> {tokenStatus.validFormat ? 'Yes' : 'No'}</li>
                {tokenStatus.parseError && <li><strong>Parse Error:</strong> {tokenStatus.parseError}</li>}
              </>
            )}
            <li><strong>User ID:</strong> {tokenStatus.userId || 'Not found'}</li>
            <li><strong>User Name:</strong> {tokenStatus.userName || 'Not found'}</li>
            <li><strong>User Role:</strong> {tokenStatus.userRole || 'Not found'}</li>
            <li><strong>Login Time:</strong> {tokenStatus.loginTime}</li>
          </ul>

          {tokenStatus.decodedPayload && (
            <div>
              <h4>Decoded Payload</h4>
              <ul style={{ listStyleType: 'none', padding: '0' }}>
                <li><strong>Subject:</strong> {tokenStatus.decodedPayload.sub}</li>
                <li><strong>Expiration:</strong> {tokenStatus.decodedPayload.exp}</li>
                <li><strong>Role:</strong> {tokenStatus.decodedPayload.role}</li>
                <li><strong>Is Expired:</strong> {typeof tokenStatus.decodedPayload.isExpired === 'boolean' ? 
                  (tokenStatus.decodedPayload.isExpired ? 'Yes (Problem)' : 'No (Good)') : 
                  tokenStatus.decodedPayload.isExpired}
                </li>
              </ul>
            </div>
          )}
          
          {tokenStatus.adminEndpointTests && (
            <div>
              <h4>Admin Endpoint Tests</h4>
              <ul style={{ listStyleType: 'none', padding: '0' }}>
                {tokenStatus.adminEndpointTests.map((result, index) => (
                  <li key={index} style={{ 
                    color: result.includes('SUCCESS') ? 'green' : 'red',
                    marginBottom: '5px'
                  }}>
                    {result}
                  </li>
                ))}
              </ul>
              {tokenStatus.adminEndpointTests.some(result => result.includes('FAILED')) && (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                  <strong>Note:</strong> Failures on /blood-donations/pending and /blood-requests/pending may indicate 
                  your user does not have ADMIN role, or that the token does not contain the required role claims.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Debugging Tips</h3>
        <ol>
          <li>Make sure the token exists in localStorage and doesn't have quotes around it</li>
          <li>Ensure the token format is valid (should have 3 parts separated by periods)</li>
          <li>Check if the token is expired</li>
          <li>Verify that the user role in the token matches what's expected</li>
          <li>Try accessing a protected endpoint with the token to confirm it works</li>
        </ol>
      </div>
    </div>
  );
};

export default TokenDebugger;