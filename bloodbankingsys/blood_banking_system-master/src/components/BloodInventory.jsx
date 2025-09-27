import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './BloodInventory.css';

function BloodInventory() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state for adding/updating inventory
  const [formData, setFormData] = useState({
    bloodType: 'A+',
    units: 0,
    expiryDate: '',
    location: ''
  });
  
  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // State for summary data
  const [summary, setSummary] = useState({
    availableBlood: {},
    totalAvailableUnits: 0,
    expiringBloodCount: 0,
    criticalLevels: {}
  });

  useEffect(() => {
    fetchInventory();
    fetchSummary();
  }, [token]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/blood-inventory', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }
      
      const data = await response.json();
      setInventory(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load blood inventory. Please try again.');
      
      // Mock data for demonstration
      setInventory([
        {
          id: 1,
          bloodGroup: 'A+',
          units: 15,
          expiryDate: '2025-10-15T00:00:00',
          status: 'AVAILABLE',
          lastUpdated: '2025-09-01T10:30:00'
        },
        {
          id: 2,
          bloodGroup: 'B+',
          units: 8,
          expiryDate: '2025-10-20T00:00:00',
          status: 'AVAILABLE',
          lastUpdated: '2025-09-05T14:15:00'
        },
        {
          id: 3,
          bloodGroup: 'O-',
          units: 5,
          expiryDate: '2025-09-30T00:00:00',
          status: 'AVAILABLE',
          lastUpdated: '2025-08-28T09:45:00'
        },
        {
          id: 4,
          bloodGroup: 'AB+',
          units: 3,
          expiryDate: '2025-10-10T00:00:00',
          status: 'RESERVED',
          lastUpdated: '2025-09-10T11:20:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSummary = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/blood-inventory/summary', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }
      
      const data = await response.json();
      setSummary(data);
    } catch (err) {
      console.error('Error fetching summary:', err);
      
      // Mock data for demonstration
      setSummary({
        availableBlood: {
          'A+': 15,
          'A-': 7,
          'B+': 12,
          'B-': 5,
          'AB+': 4,
          'AB-': 2,
          'O+': 20,
          'O-': 8
        },
        totalAvailableUnits: 73,
        expiringBloodCount: 3,
        criticalLevels: {
          'AB-': 2,
          'AB+': 4
        }
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'units' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convert form data to backend format
      const inventoryItem = {
        bloodGroup: formData.bloodType,
        units: formData.units,
        expiryDate: new Date(formData.expiryDate).toISOString(),
        status: 'AVAILABLE'
      };
      
      const url = editMode 
        ? `http://localhost:8081/api/blood-inventory/${editId}` 
        : 'http://localhost:8081/api/blood-inventory';
      
      const method = editMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(inventoryItem)
      });
      
      if (!response.ok) {
        throw new Error(editMode ? 'Failed to update inventory' : 'Failed to add inventory');
      }
      
      // Reset form and state
      setFormData({
        bloodType: 'A+',
        units: 0,
        expiryDate: '',
        location: ''
      });
      setEditMode(false);
      setEditId(null);
      
      // Refresh inventory data and summary
      fetchInventory();
      fetchSummary();
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      bloodType: item.bloodGroup,
      units: item.units,
      expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
      location: item.location || ''
    });
    setEditMode(true);
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inventory item?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8081/api/blood-inventory/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete inventory item');
      }
      
      // Refresh inventory data and summary
      fetchInventory();
      fetchSummary();
      
    } catch (err) {
      console.error('Error deleting inventory item:', err);
      setError('Failed to delete inventory item. Please try again.');
    }
  };

  const cancelEdit = () => {
    setFormData({
      bloodType: 'A+',
      units: 0,
      expiryDate: '',
      location: ''
    });
    setEditMode(false);
    setEditId(null);
  };

  // Function to check if blood is low in stock (less than 5 units)
  const isLowStock = (units) => units < 5;

  // Blood types for the dropdown
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Function to navigate back to previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="blood-inventory-container">
      <div className="page-header">
        <button className="back-button" onClick={handleGoBack}>
          &#8592; Back
        </button>
        <h2>Blood Inventory Management</h2>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="inventory-summary">
        <h3>Current Inventory</h3>
        {loading ? (
          <p>Loading inventory data...</p>
        ) : inventory.length === 0 ? (
          <p>No inventory items found.</p>
        ) : (
          <div className="inventory-grid">
            {bloodTypes.map(type => {
              const item = inventory.find(i => i.bloodType === type);
              const units = item ? item.units : 0;
              return (
                <div key={type} className="inventory-card">
                  <h4>{type}</h4>
                  <div className={`units ${isLowStock(units) ? 'low-stock' : ''}`}>
                    {units} units
                  </div>
                  {isLowStock(units) && <div className="low-stock-alert">Low Stock!</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="inventory-form-container">
        <h3>{editMode ? 'Update Inventory' : 'Add New Inventory'}</h3>
        <form onSubmit={handleSubmit} className="inventory-form">
          <div className="form-group">
            <label htmlFor="bloodType">Blood Type:</label>
            <select 
              id="bloodType" 
              name="bloodType"
              value={formData.bloodType}
              onChange={handleInputChange}
              required
            >
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="units">Units:</label>
            <input 
              type="number" 
              id="units"
              name="units"
              value={formData.units}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date:</label>
            <input 
              type="date" 
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Storage Location:</label>
            <input 
              type="text" 
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Refrigerator B, Shelf 3"
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {editMode ? 'Update Inventory' : 'Add Inventory'}
            </button>
            {editMode && (
              <button type="button" className="btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="blood-inventory-dashboard">
        <h3>Blood Inventory Dashboard</h3>
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="dashboard-card-header">Total Available Blood Units</div>
            <div className="dashboard-card-content">
              <span className="dashboard-card-number">{summary.totalAvailableUnits}</span>
              <span className="dashboard-card-label">units</span>
            </div>
          </div>
          
          <div className="dashboard-card warning">
            <div className="dashboard-card-header">Expiring Soon</div>
            <div className="dashboard-card-content">
              <span className="dashboard-card-number">{summary.expiringBloodCount}</span>
              <span className="dashboard-card-label">units</span>
            </div>
            <div className="dashboard-card-footer">Within 7 days</div>
          </div>
          
          <div className="dashboard-card danger">
            <div className="dashboard-card-header">Critical Levels</div>
            <div className="dashboard-card-content">
              <span className="dashboard-card-number">{Object.keys(summary.criticalLevels).length}</span>
              <span className="dashboard-card-label">blood types</span>
            </div>
            <div className="dashboard-card-footer">
              {Object.keys(summary.criticalLevels).join(', ')}
            </div>
          </div>
        </div>
        
        <div className="blood-types-chart">
          <h4>Available Blood Units by Type</h4>
          <div className="blood-types-bars">
            {Object.entries(summary.availableBlood).map(([type, units]) => (
              <div key={type} className="blood-type-bar-container">
                <div className="blood-type-label">{type}</div>
                <div className="blood-type-bar-wrapper">
                  <div 
                    className={`blood-type-bar ${units < 5 ? 'critical' : ''}`}
                    style={{ width: `${Math.min(units * 5, 100)}%` }}
                  ></div>
                </div>
                <div className="blood-type-value">{units} units</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="inventory-table-container">
        <h3>Detailed Inventory</h3>
        {loading ? (
          <p className="loading-message">Loading inventory data...</p>
        ) : inventory.length === 0 ? (
          <p className="no-data-message">No inventory items found.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Blood Type</th>
                  <th>Units</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.id} className={item.units < 5 ? 'low-stock-row' : ''}>
                    <td><span className="blood-type-badge">{item.bloodGroup}</span></td>
                    <td>{item.units}</td>
                    <td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}</td>
                    <td><span className={`status-badge status-${item.status.toLowerCase()}`}>{item.status}</span></td>
                    <td>{item.lastUpdated ? new Date(item.lastUpdated).toLocaleString() : 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-button edit"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button 
                          className="action-button delete"
                          onClick={() => handleDelete(item.id)}
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

export default BloodInventory;