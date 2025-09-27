import React, { useState, useEffect } from "react";
import "./NotificationsSystem.css";

const NotificationsSystem = ({ notifications, onSendNotification, onDeleteNotification, loading, error, successMessage }) => {
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    recipientType: "ALL", // ALL, DONORS, RECEIVERS, SPECIFIC
    recipientId: "",
    priority: "NORMAL", // HIGH, NORMAL, LOW
    bloodGroup: "ALL"
  });
  const [filterType, setFilterType] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [displayForm, setDisplayForm] = useState(false);

  // Group notifications by date
  const groupNotificationsByDate = (notifs) => {
    const grouped = {};
    
    notifs.forEach(notification => {
      const date = new Date(notification.createdAt).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(notification);
    });
    
    return grouped;
  };

  // Filter and sort notifications
  const getFilteredNotifications = () => {
    let filtered = [...notifications];
    
    // Apply filters
    if (filterType !== "ALL") {
      filtered = filtered.filter(n => n.recipientType === filterType);
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(term) || 
        n.message.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "date":
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case "priority":
          const priorityOrder = { "HIGH": 0, "NORMAL": 1, "LOW": 2 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case "type":
          comparison = a.recipientType.localeCompare(b.recipientType);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    return filtered;
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendNotification(newNotification);
    
    // Reset form
    setNewNotification({
      title: "",
      message: "",
      recipientType: "ALL",
      recipientId: "",
      priority: "NORMAL",
      bloodGroup: "ALL"
    });
    setDisplayForm(false);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "HIGH": return "high";
      case "NORMAL": return "normal";
      case "LOW": return "low";
      default: return "normal";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const filteredNotifications = getFilteredNotifications();
  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  return (
    <div className="notifications-system">
      <div className="management-header">
        <h2>Emergency Alerts & Notifications</h2>
        <p>Manage and send notifications to donors and receivers</p>
      </div>

      {successMessage && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          {successMessage}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="notifications-stats">
        <div className="stat-card">
          <i className="fas fa-bell"></i>
          <div className="stat-info">
            <h3>{notifications.length}</h3>
            <p>Total Notifications</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-exclamation-circle"></i>
          <div className="stat-info">
            <h3>{notifications.filter(n => n.priority === "HIGH").length}</h3>
            <p>High Priority</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-users"></i>
          <div className="stat-info">
            <h3>{notifications.filter(n => n.recipientType === "DONORS").length}</h3>
            <p>For Donors</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-hospital-user"></i>
          <div className="stat-info">
            <h3>{notifications.filter(n => n.recipientType === "RECEIVERS").length}</h3>
            <p>For Receivers</p>
          </div>
        </div>
      </div>

      <div className="filter-controls">
        <div className="search-sort">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="filter-dropdown"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">All Recipients</option>
            <option value="DONORS">Donors Only</option>
            <option value="RECEIVERS">Receivers Only</option>
            <option value="SPECIFIC">Specific Users</option>
          </select>
          <select 
            className="sort-dropdown"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="type">Sort by Recipient Type</option>
          </select>
          <div className="sort-direction" onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}>
            <i className={`fas fa-sort-${sortDirection === "asc" ? "up" : "down"}`}></i>
          </div>
        </div>
        <button 
          className="add-notification-button" 
          onClick={() => setDisplayForm(!displayForm)}
        >
          {displayForm ? (
            <>
              <i className="fas fa-times"></i> Cancel
            </>
          ) : (
            <>
              <i className="fas fa-plus"></i> New Notification
            </>
          )}
        </button>
      </div>

      {displayForm && (
        <div className="notification-form">
          <h3>Create New Notification</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newNotification.title}
                  onChange={handleInputChange}
                  placeholder="Notification Title"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={newNotification.priority}
                  onChange={handleInputChange}
                  required
                >
                  <option value="HIGH">High</option>
                  <option value="NORMAL">Normal</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="recipientType">Recipient Type</label>
                <select
                  id="recipientType"
                  name="recipientType"
                  value={newNotification.recipientType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="ALL">All Users</option>
                  <option value="DONORS">All Donors</option>
                  <option value="RECEIVERS">All Receivers</option>
                  <option value="SPECIFIC">Specific User</option>
                </select>
              </div>
              {newNotification.recipientType === "SPECIFIC" && (
                <div className="form-group">
                  <label htmlFor="recipientId">Recipient ID</label>
                  <input
                    type="text"
                    id="recipientId"
                    name="recipientId"
                    value={newNotification.recipientId}
                    onChange={handleInputChange}
                    placeholder="Enter user ID"
                    required={newNotification.recipientType === "SPECIFIC"}
                  />
                </div>
              )}
            </div>

            {(newNotification.recipientType === "DONORS" || newNotification.recipientType === "ALL") && (
              <div className="form-group">
                <label htmlFor="bloodGroup">Blood Group (for targeting donors)</label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={newNotification.bloodGroup}
                  onChange={handleInputChange}
                >
                  <option value="ALL">All Blood Groups</option>
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
            )}

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={newNotification.message}
                onChange={handleInputChange}
                placeholder="Notification message content"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                <i className="fas fa-paper-plane"></i> Send Notification
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="notifications-content">
        {loading ? (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i> Loading notifications...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="no-notifications">
            <i className="fas fa-bell-slash"></i>
            <p>No notifications found</p>
          </div>
        ) : (
          <div className="notifications-list">
            {Object.entries(groupedNotifications).map(([date, notifs]) => (
              <div className="notification-group" key={date}>
                <div className="group-header">
                  <h4>{date}</h4>
                </div>
                <div className="notifications-group-items">
                  {notifs.map(notification => (
                    <div className="notification-card" key={notification.id}>
                      <div className={`priority-indicator ${getPriorityClass(notification.priority)}`}></div>
                      <div className="notification-header">
                        <h3>{notification.title}</h3>
                        <div className="notification-meta">
                          <span className="notification-time">{formatDate(notification.createdAt)}</span>
                          <span className={`notification-priority ${getPriorityClass(notification.priority)}`}>
                            {notification.priority}
                          </span>
                        </div>
                      </div>
                      <div className="notification-body">
                        <p>{notification.message}</p>
                      </div>
                      <div className="notification-footer">
                        <div className="recipient-info">
                          <i className="fas fa-user-tag"></i>
                          <span>
                            {notification.recipientType === "SPECIFIC" 
                              ? `Specific User (ID: ${notification.recipientId})` 
                              : notification.recipientType === "DONORS" 
                                ? `All Donors${notification.bloodGroup !== "ALL" ? ` (Blood Group: ${notification.bloodGroup})` : ''}` 
                                : notification.recipientType === "RECEIVERS" 
                                  ? "All Receivers" 
                                  : "All Users"}
                          </span>
                        </div>
                        <button 
                          className="delete-button"
                          onClick={() => onDeleteNotification(notification.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsSystem;