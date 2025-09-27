import React, { useState, useEffect } from "react";
import "./BloodStockManagement.css";

const BloodStockManagement = ({ bloodInventory, onUpdateStock, loading, error, successMessage }) => {
  const [stock, setStock] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editedStock, setEditedStock] = useState({});
  const [editedNotes, setEditedNotes] = useState({});
  const [filterBloodGroup, setFilterBloodGroup] = useState("ALL");

  useEffect(() => {
    if (bloodInventory) {
      setStock(bloodInventory);
      // Initialize edited stock with current values
      const initialEditedStock = {};
      const initialEditedNotes = {};
      Object.keys(bloodInventory).forEach(group => {
        initialEditedStock[group] = bloodInventory[group]?.quantity || 0;
        initialEditedNotes[group] = bloodInventory[group]?.notes || "";
      });
      setEditedStock(initialEditedStock);
      setEditedNotes(initialEditedNotes);
    }
  }, [bloodInventory]);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode) {
      // Reset edited values when canceling edit
      const initialEditedStock = {};
      const initialEditedNotes = {};
      Object.keys(stock).forEach(group => {
        initialEditedStock[group] = stock[group]?.quantity || 0;
        initialEditedNotes[group] = stock[group]?.notes || "";
      });
      setEditedStock(initialEditedStock);
      setEditedNotes(initialEditedNotes);
    }
  };

  const handleStockChange = (bloodGroup, value) => {
    setEditedStock({
      ...editedStock,
      [bloodGroup]: Math.max(0, parseInt(value, 10) || 0)
    });
  };

  const handleNotesChange = (bloodGroup, value) => {
    setEditedNotes({
      ...editedNotes,
      [bloodGroup]: value
    });
  };

  const handleSaveChanges = () => {
    const updates = {};
    bloodGroups.forEach(group => {
      updates[group] = {
        quantity: editedStock[group] || 0,
        notes: editedNotes[group] || ""
      };
    });
    
    onUpdateStock(updates);
    setEditMode(false);
  };

  const getBloodLevelClass = (quantity) => {
    if (quantity === 0) return "critical";
    if (quantity < 5) return "low";
    if (quantity < 15) return "medium";
    return "high";
  };

  const filteredBloodGroups = filterBloodGroup === "ALL" 
    ? bloodGroups
    : bloodGroups.filter(group => group === filterBloodGroup);

  const calculateTotalUnits = () => {
    return bloodGroups.reduce((total, group) => {
      return total + (stock[group]?.quantity || 0);
    }, 0);
  };

  const getStockStats = () => {
    let lowStock = 0;
    let criticalStock = 0;
    let sufficientStock = 0;

    bloodGroups.forEach(group => {
      const quantity = stock[group]?.quantity || 0;
      if (quantity === 0) criticalStock++;
      else if (quantity < 5) lowStock++;
      else sufficientStock++;
    });

    return { lowStock, criticalStock, sufficientStock };
  };

  const stats = getStockStats();

  return (
    <div className="blood-stock-management">
      <div className="management-header">
        <h2>Blood Stock Management</h2>
        <p>Manage and update blood inventory levels</p>
      </div>

      {successMessage && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          {successMessage}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i> Loading inventory data...
        </div>
      ) : (
        <>
          <div className="stock-stats">
            <div className="stat-card">
              <i className="fas fa-tint"></i>
              <div className="stat-info">
                <h3>{calculateTotalUnits()}</h3>
                <p>Total Units</p>
              </div>
            </div>
            <div className="stat-card">
              <i className="fas fa-exclamation-triangle"></i>
              <div className="stat-info">
                <h3>{stats.criticalStock}</h3>
                <p>Critical Stock (0 units)</p>
              </div>
            </div>
            <div className="stat-card">
              <i className="fas fa-exclamation"></i>
              <div className="stat-info">
                <h3>{stats.lowStock}</h3>
                <p>Low Stock (1-4 units)</p>
              </div>
            </div>
            <div className="stat-card">
              <i className="fas fa-check"></i>
              <div className="stat-info">
                <h3>{stats.sufficientStock}</h3>
                <p>Sufficient Stock (5+ units)</p>
              </div>
            </div>
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label>Filter by Blood Group:</label>
              <select 
                value={filterBloodGroup} 
                onChange={(e) => setFilterBloodGroup(e.target.value)}
              >
                <option value="ALL">All Blood Groups</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            <button 
              className={`edit-button ${editMode ? 'cancel' : ''}`} 
              onClick={handleEditToggle}
            >
              {editMode ? (
                <>
                  <i className="fas fa-times"></i> Cancel
                </>
              ) : (
                <>
                  <i className="fas fa-edit"></i> Update Stock
                </>
              )}
            </button>
          </div>

          <div className="blood-stock-grid">
            {filteredBloodGroups.map(bloodGroup => (
              <div key={bloodGroup} className="blood-group-card">
                <div className="card-header">
                  <h3>{bloodGroup}</h3>
                  <div className={`status-indicator ${getBloodLevelClass(stock[bloodGroup]?.quantity || 0)}`}></div>
                </div>
                <div className="card-content">
                  {editMode ? (
                    <div className="edit-fields">
                      <div className="input-group">
                        <label>Units Available:</label>
                        <input 
                          type="number" 
                          min="0"
                          value={editedStock[bloodGroup] || 0} 
                          onChange={(e) => handleStockChange(bloodGroup, e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label>Notes:</label>
                        <textarea
                          value={editedNotes[bloodGroup] || ""} 
                          onChange={(e) => handleNotesChange(bloodGroup, e.target.value)}
                          placeholder="Add notes about this blood group"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="stock-details">
                      <div className="detail-row">
                        <span className="label">Units Available:</span>
                        <span className={`value ${getBloodLevelClass(stock[bloodGroup]?.quantity || 0)}`}>
                          {stock[bloodGroup]?.quantity || 0}
                        </span>
                      </div>
                      {(stock[bloodGroup]?.notes) && (
                        <div className="detail-row">
                          <span className="label">Notes:</span>
                          <span className="value notes">{stock[bloodGroup]?.notes}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="stock-level-indicator">
                  <div 
                    className={`indicator-bar ${getBloodLevelClass(stock[bloodGroup]?.quantity || 0)}`}
                    style={{ width: `${Math.min(100, (stock[bloodGroup]?.quantity || 0) * 5)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {editMode && (
            <div className="edit-actions">
              <button className="save-button" onClick={handleSaveChanges}>
                <i className="fas fa-save"></i> Save Changes
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BloodStockManagement;