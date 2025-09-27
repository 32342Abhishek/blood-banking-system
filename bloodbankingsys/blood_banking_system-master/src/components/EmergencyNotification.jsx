import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import './EmergencyNotification.css';

function EmergencyNotification() {
  const { token, user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state for creating new emergency notification
  const [formData, setFormData] = useState({
    bloodType: 'A+',
    unitsNeeded: 1,
    priority: 'HIGH',
    hospital: '',
    message: '',
    expiryDate: ''
  });
  
  // Add a state to track sent notifications
  const [sentNotifications, setSentNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/emergency-notifications/active', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch emergency notifications');
      }
      
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching emergency notifications:', err);
      setError('Failed to load notifications. Please try again later.');
      
      // Fallback to mock data if API fails
      const mockNotifications = [
        {
          id: 1,
          bloodType: 'O-',
          unitsNeeded: 3,
          priority: 'CRITICAL',
          hospital: 'City General Hospital',
          message: 'Urgent need for accident victim',
          createdAt: '2025-09-22T14:23:00',
          expiryDate: '2025-09-24T14:23:00',
          status: 'ACTIVE'
        },
        {
          id: 2,
          bloodType: 'AB+',
          unitsNeeded: 2,
          priority: 'HIGH',
          hospital: 'Memorial Hospital',
          message: 'Required for scheduled surgery',
          createdAt: '2025-09-21T09:15:00',
          expiryDate: '2025-09-25T09:15:00',
          status: 'ACTIVE'
        }
      ];
      
      setNotifications(mockNotifications);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'unitsNeeded' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Format data for the API
      const notificationData = {
        title: "Emergency Blood Request",
        message: formData.message,
        bloodType: formData.bloodType,
        unitsNeeded: parseInt(formData.unitsNeeded),
        hospitalName: formData.hospital,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
        status: "ACTIVE"
      };
      
      const response = await fetch('http://localhost:8081/api/emergency-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(notificationData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create emergency notification');
      }
      
      const newNotification = await response.json();
      setNotifications([...notifications, newNotification]);
      
      // For demo purposes in case API fails, also track sent notifications locally
      const localNewNotification = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'ACTIVE'
      };
      
      setNotifications([newNotification, ...notifications]);
      
      // Reset form
      setFormData({
        bloodType: 'A+',
        unitsNeeded: 1,
        priority: 'HIGH',
        hospital: '',
        message: '',
        expiryDate: ''
      });
      
      // Show success message
      alert('Emergency notification created successfully!');
      
    } catch (err) {
      console.error('Error creating notification:', err);
      setError('Failed to create emergency notification. Please try again.');
    }
  };

  const handleRespond = (notification) => {
    setSentNotifications([...sentNotifications, notification.id]);
    alert(`Thank you for responding! The ${notification.hospital} team will contact you shortly.`);
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'CRITICAL':
        return 'priority-critical';
      case 'HIGH':
        return 'priority-high';
      case 'MEDIUM':
        return 'priority-medium';
      default:
        return 'priority-low';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Check if current user is admin
  const isAdmin = user && user.role === 'ADMIN';

  // Get filtered notifications based on user's blood type for non-admins
  const getRelevantNotifications = () => {
    if (isAdmin) {
      return notifications;
    } else {
      // Filter notifications relevant to user's blood type if we had that info
      // For now, just return all
      return notifications;
    }
  };

  const relevantNotifications = getRelevantNotifications();

  return (
    <div className="emergency-notification-container">
      <h2>Emergency Blood Needs</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {isAdmin && (
        <div className="notification-form-container">
          <h3>Create Emergency Notification</h3>
          <form onSubmit={handleSubmit} className="notification-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bloodType">Blood Type Needed:</label>
                <select 
                  id="bloodType" 
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="unitsNeeded">Units Needed:</label>
                <input 
                  type="number" 
                  id="unitsNeeded"
                  name="unitsNeeded"
                  value={formData.unitsNeeded}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="priority">Priority:</label>
                <select 
                  id="priority" 
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  required
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="hospital">Hospital/Clinic:</label>
                <input 
                  type="text" 
                  id="hospital"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleInputChange}
                  placeholder="e.g., City General Hospital"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="expiryDate">Valid Until:</label>
                <input 
                  type="datetime-local" 
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="message">Message:</label>
              <textarea 
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="3"
                placeholder="Provide details about the emergency need"
                required
              />
            </div>
            
            <div className="form-buttons">
              <button type="submit" className="btn-primary">
                Create Emergency Notification
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="notifications-list">
        <h3>Current Emergency Needs</h3>
        {loading ? (
          <p className="loading-message">Loading notifications...</p>
        ) : relevantNotifications.length === 0 ? (
          <p className="no-data-message">No current emergency blood needs.</p>
        ) : (
          <div className="notification-cards">
            {relevantNotifications.map(notification => (
              <div key={notification.id} className={`notification-card ${getPriorityClass(notification.priority)}`}>
                <div className="notification-header">
                  <div className="notification-blood-type">{notification.bloodType}</div>
                  <div className={`notification-priority ${getPriorityClass(notification.priority)}`}>
                    {notification.priority}
                  </div>
                </div>
                
                <div className="notification-body">
                  <div className="notification-hospital">{notification.hospital}</div>
                  <div className="notification-units">{notification.unitsNeeded} units needed</div>
                  <p className="notification-message">{notification.message}</p>
                  
                  <div className="notification-dates">
                    <div>Posted: {formatDate(notification.createdAt)}</div>
                    {notification.expiryDate && (
                      <div>Valid until: {formatDate(notification.expiryDate)}</div>
                    )}
                  </div>
                </div>
                
                <div className="notification-footer">
                  {!isAdmin && !sentNotifications.includes(notification.id) && (
                    <button 
                      className="btn-respond"
                      onClick={() => handleRespond(notification)}
                    >
                      I Can Donate
                    </button>
                  )}
                  
                  {sentNotifications.includes(notification.id) && (
                    <div className="response-sent">Response Sent</div>
                  )}
                  
                  {isAdmin && (
                    <div className="admin-controls">
                      <button className="btn-edit">Edit</button>
                      <button className="btn-cancel">Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="emergency-info">
        <h3>About Emergency Blood Requests</h3>
        <p>
          Emergency notifications are sent out when there is an urgent need for specific blood types.
          If your blood type matches a request and you are eligible to donate, please consider responding.
          The hospital or blood bank will contact you with next steps.
        </p>
        <p>
          <strong>Priorities explained:</strong>
        </p>
        <ul>
          <li><span className="priority-tag priority-critical">Critical</span> - Immediate life-threatening emergency</li>
          <li><span className="priority-tag priority-high">High</span> - Urgent need within 24 hours</li>
          <li><span className="priority-tag priority-medium">Medium</span> - Needed within 2-3 days</li>
          <li><span className="priority-tag priority-low">Low</span> - Needed for inventory replenishment</li>
        </ul>
      </div>
    </div>
  );
}

export default EmergencyNotification;