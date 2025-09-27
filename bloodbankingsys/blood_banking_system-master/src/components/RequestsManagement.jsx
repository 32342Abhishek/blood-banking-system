import React, { useState } from "react";
import "./RequestsManagement.css";

const RequestsManagement = ({ 
  pendingRequests, 
  approvedRequests, 
  rejectedRequests,
  onApprove,
  onReject,
  stats,
  bloodInventory,
  loading,
  error,
  successMessage
}) => {
  const [activeTab, setActiveTab] = useState("pending");
  const [rejectReason, setRejectReason] = useState("");
  const [requestToReject, setRequestToReject] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRejectClick = (request) => {
    setRequestToReject(request);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    if (requestToReject && rejectReason.trim()) {
      onReject(requestToReject.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason("");
      setRequestToReject(null);
    }
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectReason("");
    setRequestToReject(null);
  };

  // Check if blood is available for the request
  const isBloodAvailable = (request) => {
    const inventory = bloodInventory[request.bloodGroup] || 0;
    const requestedUnits = request.units || 1;
    return inventory >= requestedUnits;
  };

  const filterRequests = (requests) => {
    if (!searchTerm) return requests;
    
    return requests.filter(request => 
      request.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const sortRequests = (requests) => {
    return [...requests].sort((a, b) => {
      let valA = sortField === "createdAt" ? new Date(a[sortField]) : a[sortField];
      let valB = sortField === "createdAt" ? new Date(b[sortField]) : b[sortField];
      
      // Handle nested properties
      if (sortField === "patient.name") {
        valA = a.patientName;
        valB = b.patientName;
      } else if (sortField === "hospital.name") {
        valA = a.hospitalName;
        valB = b.hospitalName;
      }
      
      // Handle null/undefined values
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      
      // Compare based on direction
      if (sortDirection === "asc") {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
  };

  const getRequestsToDisplay = () => {
    let requests;
    switch (activeTab) {
      case "pending":
        requests = pendingRequests || [];
        break;
      case "approved":
        requests = approvedRequests || [];
        break;
      case "rejected":
        requests = rejectedRequests || [];
        break;
      default:
        requests = [];
    }
    
    return sortRequests(filterRequests(requests));
  };

  const renderRequestCards = () => {
    const requests = getRequestsToDisplay();

    if (loading) {
      return <div className="loading-spinner">Loading...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (requests.length === 0) {
      return (
        <div className="no-requests">
          <i className="fas fa-info-circle"></i>
          <p>No {activeTab} requests found</p>
        </div>
      );
    }

    return (
      <div className="requests-list">
        {requests.map((request) => {
          const bloodAvailable = isBloodAvailable(request);
          
          return (
            <div 
              key={request.id} 
              className={`request-card ${activeTab === "pending" ? "pending" : activeTab === "approved" ? "approved" : "rejected"}`}
            >
              <div className="request-header">
                <h3>{request.patientName || "Unknown Patient"}</h3>
                <span className={`request-status ${activeTab}`}>
                  {activeTab.toUpperCase()}
                </span>
              </div>
              
              <div className="request-details">
                <div className="detail-group">
                  <span className="detail-label">Blood Group:</span>
                  <span className="detail-value">{request.bloodGroup}</span>
                </div>
                
                <div className="detail-group">
                  <span className="detail-label">Units Needed:</span>
                  <span className="detail-value">{request.units}</span>
                </div>
                
                <div className="detail-group">
                  <span className="detail-label">Hospital:</span>
                  <span className="detail-value">{request.hospitalName || "Unknown"}</span>
                </div>
                
                <div className="detail-group">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="detail-group">
                  <span className="detail-label">Urgency:</span>
                  <span className={`detail-value urgency-${request.urgency?.toLowerCase() || "normal"}`}>
                    {request.urgency || "Normal"}
                  </span>
                </div>
                
                {activeTab === "pending" && (
                  <div className="detail-group availability">
                    <span className="detail-label">Availability:</span>
                    <span className={`detail-value ${bloodAvailable ? 'available' : 'unavailable'}`}>
                      {bloodAvailable 
                        ? `Available (${bloodInventory[request.bloodGroup] || 0} units)` 
                        : `Unavailable (${bloodInventory[request.bloodGroup] || 0} units)`}
                    </span>
                  </div>
                )}
                
                {request.rejectionReason && (
                  <div className="detail-group rejection-reason">
                    <span className="detail-label">Rejection Reason:</span>
                    <span className="detail-value">{request.rejectionReason}</span>
                  </div>
                )}
              </div>
              
              {activeTab === "pending" && (
                <div className="request-actions">
                  <button 
                    className="action-button approve"
                    onClick={() => onApprove(request.id)}
                    disabled={!bloodAvailable}
                    title={!bloodAvailable ? "Insufficient blood units" : ""}
                  >
                    <i className="fas fa-check"></i> Approve
                  </button>
                  <button 
                    className="action-button reject"
                    onClick={() => handleRejectClick(request)}
                  >
                    <i className="fas fa-times"></i> Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="requests-management">
      <div className="management-header">
        <h2>Blood Requests Management</h2>
        <div className="request-stats">
          <div className="stat-card">
            <i className="fas fa-clipboard-list"></i>
            <div className="stat-info">
              <h3>{stats.totalRequests}</h3>
              <p>Total Requests</p>
            </div>
          </div>
          
          <div className="stat-card">
            <i className="fas fa-hourglass-half"></i>
            <div className="stat-info">
              <h3>{stats.pendingRequests}</h3>
              <p>Pending</p>
            </div>
          </div>
          
          <div className="stat-card">
            <i className="fas fa-check-circle"></i>
            <div className="stat-info">
              <h3>{stats.approvedRequests}</h3>
              <p>Approved</p>
            </div>
          </div>
          
          <div className="stat-card">
            <i className="fas fa-times-circle"></i>
            <div className="stat-info">
              <h3>{stats.rejectedRequests}</h3>
              <p>Rejected</p>
            </div>
          </div>
        </div>
      </div>
      
      {successMessage && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          <p>{successMessage}</p>
        </div>
      )}
      
      <div className="filter-controls">
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
          <button 
            className={`tab-button ${activeTab === "approved" ? "active" : ""}`}
            onClick={() => setActiveTab("approved")}
          >
            Approved
          </button>
          <button 
            className={`tab-button ${activeTab === "rejected" ? "active" : ""}`}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected
          </button>
        </div>
        
        <div className="search-sort">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search requests..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="sort-dropdown"
            value={`${sortField}-${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              setSortField(field);
              setSortDirection(direction);
            }}
          >
            <option value="createdAt-desc">Date (Newest First)</option>
            <option value="createdAt-asc">Date (Oldest First)</option>
            <option value="patient.name-asc">Patient Name (A-Z)</option>
            <option value="patient.name-desc">Patient Name (Z-A)</option>
            <option value="bloodGroup-asc">Blood Group (A-Z)</option>
            <option value="bloodGroup-desc">Blood Group (Z-A)</option>
            <option value="urgency-desc">Urgency (High to Low)</option>
          </select>
        </div>
      </div>
      
      {renderRequestCards()}
      
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="reject-modal">
            <h3>Reject Blood Request</h3>
            <p>Please provide a reason for rejecting this request:</p>
            
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
            ></textarea>
            
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={handleRejectCancel}
              >
                Cancel
              </button>
              <button 
                className="confirm-button"
                disabled={!rejectReason.trim()}
                onClick={handleRejectConfirm}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsManagement;