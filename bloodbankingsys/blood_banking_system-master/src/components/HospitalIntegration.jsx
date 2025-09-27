import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './HospitalIntegration.css';

function HospitalIntegration() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('hospitals');
  
  // Form state for adding a new hospital
  const [hospitalForm, setHospitalForm] = useState({
    name: '',
    address: '',
    contactPerson: '',
    email: '',
    phone: '',
    status: 'ACTIVE'
  });
  
  // Form state for creating a new blood request for a hospital
  const [requestForm, setRequestForm] = useState({
    hospitalId: '',
    bloodType: 'A+',
    unitsNeeded: 1,
    priority: 'NORMAL',
    requiredBy: '',
    patientInfo: '',
    notes: ''
  });
  
  useEffect(() => {
    fetchHospitals();
    fetchRequests();
  }, [token]);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/hospitals', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch hospitals');
      }
      
      const data = await response.json();
      setHospitals(data);
    } catch (err) {
      console.error('Error fetching hospitals:', err);
      setError('Failed to load hospitals. Please try again later.');
      
      // Fallback to mock data if API fails
      const mockHospitals = [
        {
          id: 1,
          name: 'City General Hospital',
          address: '123 Main Street, Cityville',
          contactPerson: 'Dr. Jane Smith',
          email: 'jsmith@citygeneral.org',
          phone: '555-1234',
          status: 'ACTIVE',
          registrationNumber: 'HOS001'
        },
        {
          id: 2,
          name: 'Memorial Medical Center',
          address: '456 Park Avenue, Townsville',
          contactPerson: 'Dr. John Brown',
          email: 'jbrown@memorialmed.org',
          phone: '555-5678',
          status: 'ACTIVE',
          registrationNumber: 'HOS002'
        },
        {
          id: 3,
          name: 'University Hospital',
          address: '789 College Road, Academiaville',
          contactPerson: 'Dr. Sarah Johnson',
          email: 'sjohnson@universityhosp.org',
          phone: '555-9012',
          status: 'INACTIVE',
          registrationNumber: 'HOS003'
        }
      ];
      
      setHospitals(mockHospitals);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/blood-requests', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch blood requests');
      }
      
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching blood requests:', err);
      setError('Failed to load blood requests. Please try again later.');
      
      // Fallback to mock data if API fails
      const mockRequests = [
        {
          id: 1,
          hospitalId: 1,
          hospitalName: 'City General Hospital',
          bloodType: 'O-',
          unitsNeeded: 3,
          unitsProvided: 2,
          priority: 'URGENT',
          status: 'PARTIALLY_FULFILLED',
          requiredBy: '2025-09-25',
          patientInfo: 'Accident victim, surgery scheduled',
          notes: 'Patient has rare blood condition, needs exact match',
          requestDate: '2025-09-21'
        },
        {
          id: 2,
          hospitalId: 2,
          hospitalName: 'Memorial Medical Center',
          bloodType: 'AB+',
          unitsNeeded: 2,
          unitsProvided: 0,
          priority: 'NORMAL',
          status: 'PENDING',
          requiredBy: '2025-09-28',
          patientInfo: 'Scheduled transplant patient',
          notes: '',
          requestDate: '2025-09-22'
        },
        {
          id: 3,
          hospitalId: 1,
          hospitalName: 'City General Hospital',
          bloodType: 'B+',
          unitsNeeded: 1,
          unitsProvided: 1,
          priority: 'NORMAL',
          status: 'FULFILLED',
          requiredBy: '2025-09-24',
          patientInfo: 'Anemia treatment',
          notes: '',
          requestDate: '2025-09-20'
        }
      ];
      
      setRequests(mockRequests);
    } finally {
      setLoading(false);
    }
  };

  const handleHospitalInputChange = (e) => {
    const { name, value } = e.target;
    setHospitalForm({
      ...hospitalForm,
      [name]: value
    });
  };

  const handleRequestInputChange = (e) => {
    const { name, value } = e.target;
    setRequestForm({
      ...requestForm,
      [name]: name === 'unitsNeeded' ? parseInt(value) : value
    });
  };

  const handleHospitalSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8081/api/hospitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(hospitalForm)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add hospital');
      }
      
      const newHospital = await response.json();
      setHospitals([...hospitals, newHospital]);
      
      // Reset form
      setHospitalForm({
        name: '',
        address: '',
        contactPerson: '',
        email: '',
        phone: '',
        status: 'ACTIVE'
      });
      
      // Show success message
      alert('Hospital added successfully!');
      
    } catch (err) {
      console.error('Error adding hospital:', err);
      setError('Failed to add hospital. Please try again.');
      
      // Fallback for demo if API fails
      const newHospital = {
        id: hospitals.length + 1,
        ...hospitalForm,
        registrationNumber: `HOS${hospitals.length + 1}`.padStart(6, '0')
      };
      
      setHospitals([...hospitals, newHospital]);
      alert('Hospital added successfully! (Demo Mode)');
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const hospitalId = parseInt(requestForm.hospitalId);
      
      // Format the request object according to backend expectations
      const requestData = {
        bloodGroup: requestForm.bloodType,
        name: "Hospital Blood Request",
        email: "hospital@request.com", // Placeholder email
        phone: "0000000000", // Placeholder phone
        location: "Hospital Location",
        reason: requestForm.patientInfo || "Hospital Blood Request",
        unitsNeeded: parseInt(requestForm.unitsNeeded),
        priority: requestForm.priority,
        requiredBy: requestForm.requiredBy ? new Date(requestForm.requiredBy).toISOString() : null,
      };
      
      const response = await fetch(`http://localhost:8081/api/blood-requests/hospital/${hospitalId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create blood request');
      }
      
      const newRequest = await response.json();
      setRequests([...requests, newRequest]);
      
      // Reset form
      setRequestForm({
        hospitalId: '',
        bloodType: 'A+',
        unitsNeeded: 1,
        priority: 'NORMAL',
        requiredBy: '',
        patientInfo: '',
        notes: ''
      });
      
      // Show success message
      alert('Blood request created successfully!');
      
    } catch (err) {
      console.error('Error creating request:', err);
      setError('Failed to create blood request. Please try again.');
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:8081/api/blood-requests/${id}/status?status=${status}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to update request status');
      }
      
      const updatedRequest = await response.json();
      
      const updatedRequests = requests.map(request => 
        request.id === id ? updatedRequest : request
      );
      
      setRequests(updatedRequests);
    } catch (err) {
      console.error('Error updating request status:', err);
      setError('Failed to update request status. Please try again.');
      
      // Fallback for demo
      const updatedRequests = requests.map(request => {
        if (request.id === id) {
          return {
            ...request,
            requestStatus: status,
            unitsProvided: status === 'FULFILLED' ? request.unitsNeeded : (
              status === 'PARTIAL' ? Math.ceil(request.unitsNeeded / 2) : 0
            )
          };
        }
        return request;
      });
      
      setRequests(updatedRequests);
      alert(`Request status updated to ${status} (Demo Mode)`);
    }
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'EMERGENCY':
        return 'priority-emergency';
      case 'URGENT':
        return 'priority-urgent';
      case 'NORMAL':
        return 'priority-normal';
      default:
        return 'priority-low';
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'PENDING':
        return 'status-pending';
      case 'FULFILLED':
        return 'status-fulfilled';
      case 'PARTIALLY_FULFILLED':
        return 'status-partial';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Function to navigate back to previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="hospital-integration-container">
      <div className="page-header">
        <button className="back-button" onClick={handleGoBack}>
          &#8592; Back
        </button>
        <h2>Hospital Integration & Blood Management</h2>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="integration-tabs">
        <button 
          className={`tab-button ${activeTab === 'hospitals' ? 'active' : ''}`}
          onClick={() => setActiveTab('hospitals')}
        >
          Partner Hospitals
        </button>
        <button 
          className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Blood Requests
        </button>
        <button 
          className={`tab-button ${activeTab === 'new-hospital' ? 'active' : ''}`}
          onClick={() => setActiveTab('new-hospital')}
        >
          Add Hospital
        </button>
        <button 
          className={`tab-button ${activeTab === 'new-request' ? 'active' : ''}`}
          onClick={() => setActiveTab('new-request')}
        >
          Create Request
        </button>
      </div>
      
      <div className="tab-content">
        {/* Hospitals List Tab */}
        {activeTab === 'hospitals' && (
          <div className="hospitals-list-container">
            <h3>Partner Hospitals</h3>
            
            {loading ? (
              <p className="loading-message">Loading hospitals...</p>
            ) : hospitals.length === 0 ? (
              <p className="no-data-message">No registered hospital partners.</p>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Hospital Name</th>
                      <th>Contact Person</th>
                      <th>Contact Info</th>
                      <th>Address</th>
                      <th>Status</th>
                      <th>Registered Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hospitals.map(hospital => (
                      <tr key={hospital.id} className={hospital.status === 'ACTIVE' ? 'active-hospital-row' : ''}>
                        <td><strong>{hospital.name}</strong></td>
                        <td>{hospital.contactPerson}</td>
                        <td>
                          <div>{hospital.email}</div>
                          <div>{hospital.phone}</div>
                        </td>
                        <td>{hospital.address}</td>
                        <td>
                          <span className={`status-badge ${hospital.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
                            {hospital.status}
                          </span>
                        </td>
                        <td>{formatDate(hospital.registeredDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Blood Requests Tab */}
        {activeTab === 'requests' && (
          <div className="requests-list-container">
            <h3>Hospital Blood Requests</h3>
            
            {loading ? (
              <p className="loading-message">Loading requests...</p>
            ) : requests.length === 0 ? (
              <p className="no-data-message">No blood requests found.</p>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Hospital</th>
                      <th>Blood Type</th>
                      <th>Units</th>
                      <th>Priority</th>
                      <th>Required By</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(request => (
                      <tr key={request.id} 
                          className={`blood-request-row ${request.priority.toLowerCase()}`}>
                        <td>{request.hospitalName}</td>
                        <td>
                          <span className="blood-icon"></span>
                          <span className="blood-type-badge">{request.bloodType}</span>
                        </td>
                        <td>
                          <span className="units-info">
                            {request.unitsProvided}/{request.unitsNeeded} units
                          </span>
                        </td>
                        <td>
                          <span className={`priority-badge ${getPriorityClass(request.priority)}`}>
                            {request.priority}
                          </span>
                        </td>
                        <td>{formatDate(request.requiredBy)}</td>
                        <td>
                          <span className={`status-badge ${getStatusClass(request.status)}`}>
                            {request.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {request.status === 'PENDING' && (
                              <>
                                <button 
                                  className="action-button fulfill"
                                  onClick={() => updateRequestStatus(request.id, 'FULFILLED')}
                                >
                                  Fulfill
                                </button>
                                <button 
                                  className="action-button partial"
                                  onClick={() => updateRequestStatus(request.id, 'PARTIALLY_FULFILLED')}
                                >
                                  Partial
                                </button>
                                <button 
                                  className="action-button cancel"
                                  onClick={() => updateRequestStatus(request.id, 'CANCELLED')}
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {request.status === 'PARTIALLY_FULFILLED' && (
                              <button 
                                className="action-button complete"
                                onClick={() => updateRequestStatus(request.id, 'FULFILLED')}
                              >
                                Complete
                              </button>
                            )}
                            <button className="action-button view">
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Add New Hospital Tab */}
        {activeTab === 'new-hospital' && (
          <div className="new-hospital-container">
            <h3>Register New Hospital Partner</h3>
            
            <form onSubmit={handleHospitalSubmit} className="hospital-form">
              <div className="form-group">
                <label htmlFor="name">Hospital Name:</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={hospitalForm.name}
                  onChange={handleHospitalInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address:</label>
                <textarea 
                  id="address"
                  name="address"
                  value={hospitalForm.address}
                  onChange={handleHospitalInputChange}
                  rows="2"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contactPerson">Contact Person:</label>
                  <input 
                    type="text" 
                    id="contactPerson"
                    name="contactPerson"
                    value={hospitalForm.contactPerson}
                    onChange={handleHospitalInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    value={hospitalForm.email}
                    onChange={handleHospitalInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone:</label>
                  <input 
                    type="text" 
                    id="phone"
                    name="phone"
                    value={hospitalForm.phone}
                    onChange={handleHospitalInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Status:</label>
                <select 
                  id="status" 
                  name="status"
                  value={hospitalForm.status}
                  onChange={handleHospitalInputChange}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              
              <div className="form-buttons">
                <button type="submit" className="btn-primary">
                  Register Hospital
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Create New Request Tab */}
        {activeTab === 'new-request' && (
          <div className="new-request-container">
            <h3>Create Blood Request for Hospital</h3>
            
            <form onSubmit={handleRequestSubmit} className="request-form">
              <div className="form-group">
                <label htmlFor="hospitalId">Hospital:</label>
                <select 
                  id="hospitalId" 
                  name="hospitalId"
                  value={requestForm.hospitalId}
                  onChange={handleRequestInputChange}
                  required
                >
                  <option value="">Select a Hospital</option>
                  {hospitals
                    .filter(h => h.status === 'ACTIVE')
                    .map(hospital => (
                      <option key={hospital.id} value={hospital.id}>
                        {hospital.name}
                      </option>
                    ))
                  }
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bloodType">Blood Type:</label>
                  <select 
                    id="bloodType" 
                    name="bloodType"
                    value={requestForm.bloodType}
                    onChange={handleRequestInputChange}
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
                    value={requestForm.unitsNeeded}
                    onChange={handleRequestInputChange}
                    min="1"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="priority">Priority:</label>
                  <select 
                    id="priority" 
                    name="priority"
                    value={requestForm.priority}
                    onChange={handleRequestInputChange}
                    required
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="URGENT">Urgent</option>
                    <option value="EMERGENCY">Emergency</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="requiredBy">Required By:</label>
                <input 
                  type="date" 
                  id="requiredBy"
                  name="requiredBy"
                  value={requestForm.requiredBy}
                  onChange={handleRequestInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="patientInfo">Patient Information:</label>
                <input 
                  type="text" 
                  id="patientInfo"
                  name="patientInfo"
                  value={requestForm.patientInfo}
                  onChange={handleRequestInputChange}
                  placeholder="Brief patient details (optional)"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Additional Notes:</label>
                <textarea 
                  id="notes"
                  name="notes"
                  value={requestForm.notes}
                  onChange={handleRequestInputChange}
                  rows="3"
                  placeholder="Any special requirements or additional information"
                />
              </div>
              
              <div className="form-buttons">
                <button type="submit" className="btn-primary">
                  Submit Blood Request
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default HospitalIntegration;