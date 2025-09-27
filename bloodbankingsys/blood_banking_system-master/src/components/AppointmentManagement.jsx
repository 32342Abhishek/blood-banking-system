import { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import './AppointmentManagement.css';

function AppointmentManagement() {
  const { token } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donors, setDonors] = useState([]);
  
  // Form state for adding/updating appointment
  const [formData, setFormData] = useState({
    donorId: '',
    appointmentDate: '',
    appointmentTime: '',
    status: 'SCHEDULED',
    notes: ''
  });
  
  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  
  useEffect(() => {
    fetchAppointments();
    fetchDonors();
  }, [token]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/donation-appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      const data = await response.json();
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDonors = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/donors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch donors');
      }
      
      const data = await response.json();
      setDonors(data);
    } catch (err) {
      console.error('Error fetching donors:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Format date and time for API
      const appointmentDateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`;
      
      const apiData = {
        donorId: parseInt(formData.donorId),
        appointmentDateTime: appointmentDateTime,
        status: formData.status,
        notes: formData.notes
      };
      
      const url = editMode 
        ? `http://localhost:8081/api/donation-appointments/${editId}` 
        : 'http://localhost:8081/api/donation-appointments';
      
      const method = editMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiData)
      });
      
      if (!response.ok) {
        throw new Error(editMode ? 'Failed to update appointment' : 'Failed to schedule appointment');
      }
      
      // Reset form and state
      setFormData({
        donorId: '',
        appointmentDate: '',
        appointmentTime: '',
        status: 'SCHEDULED',
        notes: ''
      });
      setEditMode(false);
      setEditId(null);
      
      // Refresh appointment data
      fetchAppointments();
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  const handleEdit = (appointment) => {
    const appointmentDateTime = new Date(appointment.appointmentDateTime);
    const date = appointmentDateTime.toISOString().split('T')[0];
    const time = appointmentDateTime.toTimeString().slice(0, 5);
    
    setFormData({
      donorId: appointment.donor.id.toString(),
      appointmentDate: date,
      appointmentTime: time,
      status: appointment.status,
      notes: appointment.notes || ''
    });
    setEditMode(true);
    setEditId(appointment.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8081/api/donation-appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }
      
      // Refresh appointment data
      fetchAppointments();
      
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setError('Failed to delete appointment. Please try again.');
    }
  };

  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8081/api/donation-appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update appointment status to ${newStatus}`);
      }
      
      // Refresh appointment data
      fetchAppointments();
      
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError(`Failed to update appointment status. Please try again.`);
    }
  };

  const cancelEdit = () => {
    setFormData({
      donorId: '',
      appointmentDate: '',
      appointmentTime: '',
      status: 'SCHEDULED',
      notes: ''
    });
    setEditMode(false);
    setEditId(null);
  };

  // Format date for display
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Get donor name by ID
  const getDonorName = (donorId) => {
    const donor = donors.find(d => d.id === donorId);
    return donor ? `${donor.firstName} ${donor.lastName}` : 'Unknown Donor';
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'status-badge scheduled';
      case 'COMPLETED':
        return 'status-badge completed';
      case 'CANCELLED':
        return 'status-badge cancelled';
      case 'NO_SHOW':
        return 'status-badge no-show';
      default:
        return 'status-badge';
    }
  };

  return (
    <div className="appointment-management">
      <h2>Appointment Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="appointment-form-container">
        <h3>{editMode ? 'Update Appointment' : 'Schedule New Appointment'}</h3>
        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group">
            <label htmlFor="donorId">Donor:</label>
            <select 
              id="donorId" 
              name="donorId"
              value={formData.donorId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a Donor</option>
              {donors.map(donor => (
                <option key={donor.id} value={donor.id}>
                  {donor.firstName} {donor.lastName} ({donor.bloodType})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="appointmentDate">Date:</label>
            <input 
              type="date" 
              id="appointmentDate"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="appointmentTime">Time:</label>
            <input 
              type="time" 
              id="appointmentTime"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select 
              id="status" 
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="NO_SHOW">No Show</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">Notes:</label>
            <textarea 
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              placeholder="Any special notes or instructions..."
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {editMode ? 'Update Appointment' : 'Schedule Appointment'}
            </button>
            {editMode && (
              <button type="button" className="btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="appointment-table-container">
        <h3>Upcoming Appointments</h3>
        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Blood Type</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td>{appointment.donor ? `${appointment.donor.firstName} ${appointment.donor.lastName}` : 'Unknown Donor'}</td>
                    <td>{appointment.donor ? appointment.donor.bloodType : 'N/A'}</td>
                    <td>{formatDateTime(appointment.appointmentDateTime)}</td>
                    <td>
                      <span className={getStatusBadgeClass(appointment.status)}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>{appointment.notes || 'No notes'}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-button edit"
                          onClick={() => handleEdit(appointment)}
                        >
                          Edit
                        </button>
                        {appointment.status === 'SCHEDULED' && (
                          <>
                            <button 
                              className="action-button complete"
                              onClick={() => updateAppointmentStatus(appointment.id, 'COMPLETED')}
                            >
                              Complete
                            </button>
                            <button 
                              className="action-button cancel"
                              onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                            >
                              Cancel
                            </button>
                            <button 
                              className="action-button no-show"
                              onClick={() => updateAppointmentStatus(appointment.id, 'NO_SHOW')}
                            >
                              No Show
                            </button>
                          </>
                        )}
                        <button 
                          className="action-button delete"
                          onClick={() => handleDelete(appointment.id)}
                        >
                          Delete
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
    </div>
  );
}

export default AppointmentManagement;