import React, { useState } from 'react';
import './HospitalRegistration.css';

const HospitalRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactPerson: '',
    email: '',
    phone: '',
    registrationNumber: '',
    status: 'ACTIVE'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:8081/api/hospitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Hospital registered successfully!'
        });
        // Reset form
        setFormData({
          name: '',
          address: '',
          contactPerson: '',
          email: '',
          phone: '',
          registrationNumber: '',
          status: 'ACTIVE'
        });
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Failed to register hospital'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error connecting to server. Please try again.'
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hospital-registration-container">
      <div className="hospital-registration-card">
        <h2 className="hospital-registration-title">Hospital Registration</h2>
        <p className="hospital-registration-subtitle">Add a new hospital to the blood bank system</p>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="hospital-form">
          <div className="form-group">
            <label htmlFor="name">Hospital Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter hospital name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter complete address"
              className="form-textarea"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactPerson">Contact Person *</label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                required
                placeholder="e.g., Dr. John Smith"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="registrationNumber">Registration Number *</label>
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                required
                placeholder="e.g., REG-XXX-2024-001"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="hospital@example.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+1-XXX-XXX-XXXX"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Hospital'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HospitalRegistration;
