import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Donar.css";

const Donar = () => {
  const { loggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    bloodGroup: "",
    age: "",
    weight: "",
    lastDonation: "",
    medicalConditions: "",
    address: ""
  });

  const [donors, setDonors] = useState([]);
  const [showDonorsList, setShowDonorsList] = useState(false);

  // Redirect website user if not logged in
  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    
    // Pre-fill form with user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        bloodGroup: user.bloodType || "",
        email: user.email || ""
      }));
    }
  }, [loggedIn, navigate, user]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Register donation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      // Validation
      if (formData.weight && parseInt(formData.weight) < 50) {
        throw new Error("Weight must be at least 50kg to donate blood");
      }
      
      if (formData.age && parseInt(formData.age) < 18) {
        throw new Error("You must be at least 18 years old to donate blood");
      }

      // First, check if the user is already registered as a donor
      let donorId = null;
      
      // Try to create/register as a donor first
      const donorRes = await fetch("http://localhost:8081/api/donors", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: formData.name || user?.name,
          location: formData.location || formData.address,
          phone: formData.phone,
          bloodGroup: formData.bloodGroup || user?.bloodType,
          username: user?.email, // Use email as username
          password: "defaultPassword123", // We'll use the token for authentication anyway
          email: user?.email
        })
      });
      
      if (!donorRes.ok) {
        // If 409 Conflict, the donor likely already exists - try to search for it
          if (donorRes.status === 409) {
            console.log("Donor may already exist, trying to find by email...");
            const token = localStorage.getItem("token");
            console.log("Using token for search:", token);
            const searchRes = await fetch(`http://localhost:8081/api/donors/search?email=${encodeURIComponent(user?.email)}`, {
              headers: { 
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
              },
              mode: 'cors',
              credentials: 'include'
            });          if (searchRes.ok) {
            const donorData = await searchRes.json();
            if (donorData && donorData.id) {
              donorId = donorData.id;
            }
          }
        } else {
          const errorText = await donorRes.text();
          console.error("Failed to register as donor:", errorText);
          throw new Error("Failed to register as donor: " + errorText);
        }
      } else {
        const donorData = await donorRes.json();
        donorId = donorData.id;
      }
      
      if (!donorId) {
        throw new Error("Unable to find or create a donor profile. Please contact support.");
      }
      
      // Now proceed with blood donation using the donor ID
      const res = await fetch("http://localhost:8081/api/blood-donations", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          donor: {
            id: donorId
          },
          bloodGroup: formData.bloodGroup,
          quantityMl: 450, // Standard blood donation amount
          healthStatus: formData.medicalConditions ? "REQUIRES_REVIEW" : "NORMAL",
          notes: formData.medicalConditions || "No medical conditions",
          temperature: 36.6, // Normal body temperature
          bloodPressure: "120/80", // Normal blood pressure
          hemoglobinLevel: 14.0, // Normal hemoglobin level
          pulseRate: 72 // Normal pulse rate
        }),
      });

      if (res.ok) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: user?.name || "",
          location: "",
          phone: "",
          bloodGroup: user?.bloodType || "",
          age: "",
          weight: "",
          lastDonation: "",
          medicalConditions: "",
          address: ""
        });
      } else {
        // Try to parse as JSON, but fall back to text if it's not valid JSON
        const text = await res.text();
        let errorMessage;
        try {
          const data = JSON.parse(text);
          errorMessage = data.message || "Failed to register donation";
        } catch (jsonError) {
          // If parsing as JSON fails, use the raw text as the error message
          errorMessage = text || "Failed to register donation";
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("Donation registration error:", err);
      setError(err.message || "Failed to register donation");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all donors
  const fetchDonors = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }
      
      console.log("Fetching donors with token:", token);
      
      const res = await fetch("http://localhost:8081/api/donors", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        mode: 'cors',
        credentials: 'include'
      });
      
      console.log("Donor fetch response status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched donors:", data);
        setDonors(data);
        setShowDonorsList(true);
      } else {
        // Try to parse as JSON, but fall back to text if it's not valid JSON
        const text = await res.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || `Failed to fetch donors: ${res.status}`;
        } catch (jsonError) {
          // If parsing as JSON fails, use the raw text as the error message
          errorMessage = text || `Failed to fetch donors: ${res.status}`;
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("Error fetching donors:", err);
      setError(err.message || "Failed to load donors list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="donar-container">
        <div className="donar-header">
          <h1>Blood Donation Registration</h1>
          <p>Please fill out the form below to register for blood donation</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            Your donation registration was successful! Thank you for your contribution.
          </div>
        )}
        
        <div className="donar-content">
          <div className="donar-form-container">
            <form className="donar-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bloodGroup">Blood Group</label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
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
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Your age"
                    min="18"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Your weight in kg"
                    min="50"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastDonation">Last Donation Date</label>
                  <input
                    type="date"
                    id="lastDonation"
                    name="lastDonation"
                    value={formData.lastDonation}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="location">City/Town</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Your city or town"
                  required
                />
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="address">Full Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your complete address"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="medicalConditions">Medical Conditions (if any)</label>
                <textarea
                  id="medicalConditions"
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleChange}
                  placeholder="Please mention any medical conditions that may affect blood donation"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Submitting..." : "Register Donation"}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={fetchDonors}
                  disabled={loading}
                >
                  View All Donors
                </button>
              </div>
            </form>
          </div>
          
          {showDonorsList && (
            <div className="donors-list-container">
              <h2>Available Donors</h2>
              {donors.length > 0 ? (
                <div className="donors-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Blood Group</th>
                        <th>Location</th>
                        <th>Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donors.map((donor, index) => (
                        <tr key={donor.id || index}>
                          <td>{donor.name || "N/A"}</td>
                          <td className="blood-group">{donor.bloodGroup || donor.bloodType || "Unknown"}</td>
                          <td>{donor.location || "N/A"}</td>
                          <td>{donor.phone || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-donors">No donors found in the system.</p>
              )}
              <button 
                className="btn-secondary"
                onClick={() => setShowDonorsList(false)}
              >
                Close List
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donar;
