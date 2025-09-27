import React, { useState } from "react";
import "./DonationsManagement.css";

const DonationsManagement = ({ 
  pendingDonations, 
  approvedDonations, 
  rejectedDonations,
  onApprove,
  onReject,
  stats,
  loading,
  error,
  successMessage
}) => {
  const [activeTab, setActiveTab] = useState("pending");
  const [rejectReason, setRejectReason] = useState("");
  const [donationToReject, setDonationToReject] = useState(null);
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

  const handleRejectClick = (donation) => {
    setDonationToReject(donation);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    if (donationToReject && rejectReason.trim()) {
      onReject(donationToReject.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason("");
      setDonationToReject(null);
    }
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectReason("");
    setDonationToReject(null);
  };

  const filterDonations = (donations) => {
    if (!searchTerm) return donations;
    
    return donations.filter(donation => 
      donation.donor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donor?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const sortDonations = (donations) => {
    return [...donations].sort((a, b) => {
      let valA = sortField === "createdAt" ? new Date(a[sortField]) : a[sortField];
      let valB = sortField === "createdAt" ? new Date(b[sortField]) : b[sortField];
      
      // Handle nested donor properties
      if (sortField === "donor.name") {
        valA = a.donor?.name;
        valB = b.donor?.name;
      } else if (sortField === "donor.email") {
        valA = a.donor?.email;
        valB = b.donor?.email;
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

  const getDonationsToDisplay = () => {
    let donations;
    switch (activeTab) {
      case "pending":
        donations = pendingDonations || [];
        break;
      case "approved":
        donations = approvedDonations || [];
        break;
      case "rejected":
        donations = rejectedDonations || [];
        break;
      default:
        donations = [];
    }
    
    return sortDonations(filterDonations(donations));
  };

  const renderDonationCards = () => {
    const donations = getDonationsToDisplay();

    if (loading) {
      return <div className="loading-spinner">Loading...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (donations.length === 0) {
      return (
        <div className="no-donations">
          <i className="fas fa-info-circle"></i>
          <p>No {activeTab} donations found</p>
        </div>
      );
    }

    return (
      <div className="donations-list">
        {donations.map((donation) => (
          <div 
            key={donation.id} 
            className={`donation-card ${activeTab === "pending" ? "pending" : activeTab === "approved" ? "approved" : "rejected"}`}
          >
            <div className="donation-header">
              <h3>{donation.donor?.name || "Unknown Donor"}</h3>
              <span className={`donation-status ${activeTab}`}>
                {activeTab.toUpperCase()}
              </span>
            </div>
            
            <div className="donation-details">
              <div className="detail-group">
                <span className="detail-label">Blood Group:</span>
                <span className="detail-value">{donation.bloodGroup}</span>
              </div>
              
              <div className="detail-group">
                <span className="detail-label">Units:</span>
                <span className="detail-value">{donation.units}</span>
              </div>
              
              <div className="detail-group">
                <span className="detail-label">Date:</span>
                <span className="detail-value">
                  {new Date(donation.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="detail-group">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{donation.donor?.email}</span>
              </div>
              
              <div className="detail-group">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{donation.donor?.phone || "N/A"}</span>
              </div>
              
              {donation.rejectionReason && (
                <div className="detail-group rejection-reason">
                  <span className="detail-label">Rejection Reason:</span>
                  <span className="detail-value">{donation.rejectionReason}</span>
                </div>
              )}
            </div>
            
            {activeTab === "pending" && (
              <div className="donation-actions">
                <button 
                  className="action-button approve"
                  onClick={() => onApprove(donation.id)}
                >
                  <i className="fas fa-check"></i> Approve
                </button>
                <button 
                  className="action-button reject"
                  onClick={() => handleRejectClick(donation)}
                >
                  <i className="fas fa-times"></i> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="donations-management">
      <div className="management-header">
        <h2>Blood Donations Management</h2>
        <div className="donation-stats">
          <div className="stat-card">
            <i className="fas fa-tint"></i>
            <div className="stat-info">
              <h3>{stats.totalDonations}</h3>
              <p>Total Donations</p>
            </div>
          </div>
          
          <div className="stat-card">
            <i className="fas fa-hourglass-half"></i>
            <div className="stat-info">
              <h3>{stats.pendingDonations}</h3>
              <p>Pending</p>
            </div>
          </div>
          
          <div className="stat-card">
            <i className="fas fa-check-circle"></i>
            <div className="stat-info">
              <h3>{stats.approvedDonations}</h3>
              <p>Approved</p>
            </div>
          </div>
          
          <div className="stat-card">
            <i className="fas fa-times-circle"></i>
            <div className="stat-info">
              <h3>{stats.rejectedDonations}</h3>
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
              placeholder="Search donations..." 
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
            <option value="donor.name-asc">Donor Name (A-Z)</option>
            <option value="donor.name-desc">Donor Name (Z-A)</option>
            <option value="bloodGroup-asc">Blood Group (A-Z)</option>
            <option value="bloodGroup-desc">Blood Group (Z-A)</option>
          </select>
        </div>
      </div>
      
      {renderDonationCards()}
      
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="reject-modal">
            <h3>Reject Donation</h3>
            <p>Please provide a reason for rejecting this donation:</p>
            
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

export default DonationsManagement;