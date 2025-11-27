import React, { useState } from 'react';
import { getApiUrl } from '../utils/apiConfig';
import './AdminSetup.css';

const AdminSetup = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);

  const initializeAdmin = async () => {
    setLoading(true);
    setStatus('');
    
    try {
      const response = await fetch(getApiUrl('auth/init-admin'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setAdminInfo(data);
        setStatus('success');
      } else {
        setStatus('error');
        setAdminInfo({ message: data.message || 'Failed to initialize admin' });
      }
    } catch (error) {
      setStatus('error');
      setAdminInfo({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-setup-container">
      <div className="admin-setup-card">
        <h2>Admin Account Setup</h2>
        
        <div className="setup-info">
          <p>Click the button below to initialize the default admin account.</p>
          <p>This will create an admin user if one doesn't already exist.</p>
        </div>

        <button 
          className="btn-initialize" 
          onClick={initializeAdmin}
          disabled={loading}
        >
          {loading ? 'Initializing...' : 'Initialize Admin Account'}
        </button>

        {status === 'success' && adminInfo && (
          <div className="success-message">
            <h3>✅ {adminInfo.message}</h3>
            <div className="credentials-box">
              <p><strong>Email:</strong> {adminInfo.email}</p>
              {adminInfo.password && (
                <>
                  <p><strong>Password:</strong> {adminInfo.password}</p>
                  <p className="warning-text">{adminInfo.note}</p>
                </>
              )}
              {adminInfo.role && <p><strong>Role:</strong> {adminInfo.role}</p>}
            </div>
          </div>
        )}

        {status === 'error' && adminInfo && (
          <div className="error-message">
            <h3>❌ Error</h3>
            <p>{adminInfo.message}</p>
          </div>
        )}

        <div className="default-credentials">
          <h3>Default Admin Credentials:</h3>
          <div className="credentials-info">
            <p><strong>Email:</strong> admin@bloodbank.com</p>
            <p><strong>Password:</strong> Admin@123</p>
          </div>
          <p className="note">Use these credentials to login to the admin panel.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
