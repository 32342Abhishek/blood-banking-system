// Import necessary libraries
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { apiGet, ENDPOINTS } from './utils/api';

// Simple component to test authentication
const AuthTester = () => {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [token, setToken] = useState('');
  const [endpoint, setEndpoint] = useState(ENDPOINTS.HEALTH);
  
  const runTest = async () => {
    setStatus('testing');
    try {
      // Store token in localStorage if provided
      if (token) {
        localStorage.setItem('token', token);
      }
      
      // Make API request
      const data = await apiGet(endpoint);
      
      // Success
      setStatus('success');
      setResult({
        success: true,
        data: data
      });
    } catch (err) {
      // Error
      setStatus('error');
      setResult({
        success: false,
        error: err.message,
        details: err.toString()
      });
    }
  };
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Auth API Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Test Settings</h2>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="token" style={{ display: 'block', marginBottom: '5px' }}>
            JWT Token (leave empty to use token from localStorage):
          </label>
          <textarea
            id="token"
            value={token}
            onChange={e => setToken(e.target.value)}
            style={{ width: '100%', height: '80px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="endpoint" style={{ display: 'block', marginBottom: '5px' }}>
            API Endpoint:
          </label>
          <select
            id="endpoint"
            value={endpoint}
            onChange={e => setEndpoint(e.target.value)}
            style={{ width: '100%', padding: '5px' }}
          >
            {Object.entries(ENDPOINTS).map(([key, value]) => (
              <option key={key} value={value}>
                {key}: {value}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={runTest}
          disabled={status === 'testing'}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none',
            cursor: status === 'testing' ? 'wait' : 'pointer'
          }}
        >
          {status === 'testing' ? 'Testing...' : 'Run Test'}
        </button>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Current LocalStorage State:</h2>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          border: '1px solid #ddd',
          whiteSpace: 'pre-wrap'
        }}>
          {JSON.stringify({
            token: localStorage.getItem('token'),
            userId: localStorage.getItem('userId'),
            userName: localStorage.getItem('userName'),
            userRole: localStorage.getItem('userRole'),
            loginTimestamp: localStorage.getItem('loginTimestamp')
          }, null, 2)}
        </pre>
      </div>
      
      {result && (
        <div style={{ 
          marginTop: '20px',
          backgroundColor: result.success ? '#e8f5e9' : '#ffebee', 
          padding: '15px', 
          borderRadius: '4px'
        }}>
          <h2>{result.success ? 'Success!' : 'Error!'}</h2>
          <pre style={{ 
            backgroundColor: result.success ? '#c8e6c9' : '#ffcdd2', 
            padding: '10px', 
            border: '1px solid #ddd',
            whiteSpace: 'pre-wrap'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// Mount the component to a new div in the body
const div = document.createElement('div');
document.body.appendChild(div);
ReactDOM.render(<AuthTester />, div);