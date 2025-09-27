import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost, ENDPOINTS } from "../utils/api";
import "./Request.css";

const Request = () => {
  const { loggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [requestData, setRequestData] = useState({
    patientName: "",
    bloodGroup: "",
    units: 1,
    hospitalName: "",
    urgency: "normal",
    phone: "",
    email: "",
    location: "",
    reason: ""
  });

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  // Redirect if not logged in
  // Fetch existing requests when component loads
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const email = user?.email;
      
      if (email) {
        // Fetch requests for the logged-in user by email
        const data = await apiGet(`${ENDPOINTS.BLOOD_REQUESTS}/email/${encodeURIComponent(email)}`);
        console.log("Fetched user blood requests:", data);
        setRequests(data || []);
      } else {
        console.warn("No user email available to fetch requests");
        setRequests([]);
      }
    } catch (err) {
      console.error("Error fetching blood requests:", err);
      setError("Failed to load your blood requests. Please refresh the page.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    
    // Pre-fill email if user is logged in
    if (user) {
      setRequestData(prev => ({
        ...prev,
        email: user.email || ""
      }));
      
      // Fetch user's blood requests
      fetchRequests();
    }
  }, [loggedIn, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      // Format the data to match backend expectations
      const requestPayload = {
        name: requestData.patientName,
        bloodGroup: requestData.bloodGroup,
        unitsNeeded: requestData.units,
        phone: requestData.phone,
        email: requestData.email || user?.email,
        location: requestData.location,
        reason: requestData.reason,
        hospitalName: requestData.hospitalName,
        priority: requestData.urgency,
        requestStatus: "PENDING"
      };
      
      console.log("Submitting blood request:", requestPayload);
      
      // Submit to backend API
      const response = await apiPost(ENDPOINTS.BLOOD_REQUESTS, requestPayload);
      console.log("Blood request submitted successfully:", response);
      
      // Add the newly created request to the list
      if (response) {
        setRequests(prev => [...prev, response]);
      }
      
      setSuccess(true);
      
      // Reset form
      setRequestData({
        patientName: "",
        bloodGroup: "",
        units: 1,
        hospitalName: "",
        urgency: "normal",
        phone: "",
        email: user?.email || "",
        location: "",
        reason: ""
      });
      
      // Refresh requests list
      fetchRequests();
    } catch (err) {
      console.error("Request submission error:", err);
      setError("Failed to submit blood request: " + (err.message || "Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="request-container">
        <div className="request-header">
          <h1>Blood Request</h1>
          <p>Fill the form below to request blood units for patients in need</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            Your blood request has been submitted successfully. We will review it shortly.
          </div>
        )}
        
        <div className="request-content">
          <div className="request-form-section">
            <form className="request-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="patientName">Patient Name</label>
                  <input 
                    type="text" 
                    id="patientName"
                    name="patientName" 
                    value={requestData.patientName} 
                    onChange={handleChange} 
                    placeholder="Enter patient's full name"
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="hospitalName">Hospital Name</label>
                  <input 
                    type="text" 
                    id="hospitalName"
                    name="hospitalName" 
                    value={requestData.hospitalName} 
                    onChange={handleChange} 
                    placeholder="Enter hospital name"
                    required 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bloodGroup">Blood Group Needed</label>
                  <select 
                    id="bloodGroup"
                    name="bloodGroup" 
                    value={requestData.bloodGroup} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">Select Blood Group</option>
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
                  <label htmlFor="units">Units Required</label>
                  <input 
                    type="number" 
                    id="units"
                    name="units" 
                    value={requestData.units} 
                    onChange={handleChange} 
                    min="1" 
                    max="10"
                    required 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="urgency">Urgency</label>
                  <select 
                    id="urgency"
                    name="urgency" 
                    value={requestData.urgency} 
                    onChange={handleChange}
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Contact Number</label>
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone" 
                    value={requestData.phone} 
                    onChange={handleChange} 
                    placeholder="Contact phone number"
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="location">Hospital Location</label>
                <input 
                  type="text" 
                  id="location"
                  name="location" 
                  value={requestData.location} 
                  onChange={handleChange} 
                  placeholder="Hospital address/location"
                  required 
                />
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="reason">Reason for Request</label>
                <textarea 
                  id="reason"
                  name="reason" 
                  value={requestData.reason} 
                  onChange={handleChange} 
                  placeholder="Provide details about the patient's condition and why blood is needed"
                  rows="3"
                  required 
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Blood Request"}
                </button>
              </div>
            </form>
          </div>
          
          <div className="request-list-section">
            <h2>Your Blood Requests</h2>
            <div className="request-table-container">
              <table className="request-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Blood Group</th>
                    <th>Units</th>
                    <th>Hospital</th>
                    <th>Urgency</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length > 0 ? (
                    requests.map((req) => (
                      <tr key={req.id} className={`request-row ${req.priority || req.urgency || 'normal'}`}>
                        <td>{req.name || req.patientName}</td>
                        <td className="blood-group">{req.bloodGroup}</td>
                        <td>{req.unitsNeeded || req.units || 1}</td>
                        <td>{req.hospitalName}</td>
                        <td className={`urgency ${req.priority || req.urgency || 'normal'}`}>{(req.priority || req.urgency || 'normal').toUpperCase()}</td>
                        <td className={`status ${req.requestStatus?.toLowerCase() || 'pending'}`}>{req.requestStatus || 'PENDING'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No blood requests have been submitted yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Request;
