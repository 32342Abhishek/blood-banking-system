import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Tabs, Tab, Alert, Spinner, Form, Modal, Badge } from 'react-bootstrap';
import { API_BASE_URL } from '../utils/api';
import './DataManagement.css';

const DataManagement = () => {
  const [activeTab, setActiveTab] = useState('import');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generationParams, setGenerationParams] = useState({
    donors: 20,
    donations: 50,
    hospitals: 5
  });
  const [importFile, setImportFile] = useState(null);
  const [importType, setImportType] = useState('donors');
  
  // Fetch statistics
  const fetchStats = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await fetch(`${API_BASE_URL}/stats`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch statistics: ${response.status}`);
      }
      
      const data = await response.json();
      setStats(data);
      setSuccess('Statistics loaded successfully');
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError(err.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate sample data
  const generateSampleData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await fetch(`${API_BASE_URL}/data/generate-sample?donors=${generationParams.donors}&donations=${generationParams.donations}&hospitals=${generationParams.hospitals}`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate sample data: ${response.status}`);
      }
      
      const data = await response.json();
      setSuccess(`Sample data generated successfully: ${data.donors} donors, ${data.donations} donations, ${data.hospitals} hospitals`);
      setShowGenerateModal(false);
      
      // Refresh stats after generating data
      fetchStats();
    } catch (err) {
      console.error("Error generating sample data:", err);
      setError(err.message || 'Failed to generate sample data');
    } finally {
      setLoading(false);
    }
  };
  
  // Import data
  const importData = async (e) => {
    e.preventDefault();
    
    if (!importFile) {
      setError('Please select a file to import');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const formData = new FormData();
      formData.append('file', importFile);
      
      const response = await fetch(`${API_BASE_URL}/data/import/${importType}`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Failed to import data: ${response.status}`);
      }
      
      const data = await response.json();
      setSuccess(`${importType} imported successfully: ${data.count} records`);
      
      // Reset form and refresh stats
      setImportFile(null);
      document.getElementById('importFileInput').value = '';
      fetchStats();
    } catch (err) {
      console.error("Error importing data:", err);
      setError(err.message || 'Failed to import data');
    } finally {
      setLoading(false);
    }
  };
  
  // Export data
  const exportData = async (type) => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await fetch(`${API_BASE_URL}/data/export/${type}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to export data: ${response.status}`);
      }
      
      // Convert response to blob
      const blob = await response.blob();
      
      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${type}.csv`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccess(`${type} exported successfully`);
    } catch (err) {
      console.error("Error exporting data:", err);
      setError(err.message || 'Failed to export data');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="data-management-container">
      <h2>Data Management</h2>
      <p className="text-muted">Manage blood bank system data - import, export, and generate sample data</p>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Tabs activeKey={activeTab} onSelect={k => setActiveTab(k)} className="mb-4">
        <Tab eventKey="import" title="Import Data">
          <Card>
            <Card.Body>
              <h3>Import Data</h3>
              <p>Upload CSV files to import data into the system</p>
              
              <Form onSubmit={importData}>
                <Form.Group className="mb-3">
                  <Form.Label>Data Type</Form.Label>
                  <Form.Control 
                    as="select" 
                    value={importType} 
                    onChange={e => setImportType(e.target.value)}
                    disabled={loading}
                  >
                    <option value="donors">Donors</option>
                    <option value="donations">Blood Donations</option>
                    <option value="inventory">Blood Inventory</option>
                  </Form.Control>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>CSV File</Form.Label>
                  <Form.Control 
                    type="file" 
                    accept=".csv" 
                    id="importFileInput"
                    onChange={e => setImportFile(e.target.files[0])} 
                    disabled={loading}
                  />
                  <Form.Text className="text-muted">
                    Please select a CSV file with the correct format for {importType}
                  </Form.Text>
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading || !importFile}
                >
                  {loading ? <><Spinner animation="border" size="sm" /> Importing...</> : 'Import Data'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="export" title="Export Data">
          <Card>
            <Card.Body>
              <h3>Export Data</h3>
              <p>Export data from the system as CSV files</p>
              
              <Row className="g-4">
                <Col md={4}>
                  <Card className="text-center h-100">
                    <Card.Body>
                      <Card.Title>Donors</Card.Title>
                      <Card.Text>Export all donor records</Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <Button 
                        variant="outline-primary" 
                        onClick={() => exportData('donors')}
                        disabled={loading}
                      >
                        {loading ? <Spinner animation="border" size="sm" /> : 'Export Donors'}
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
                
                <Col md={4}>
                  <Card className="text-center h-100">
                    <Card.Body>
                      <Card.Title>Blood Donations</Card.Title>
                      <Card.Text>Export all blood donation records</Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <Button 
                        variant="outline-primary" 
                        onClick={() => exportData('donations')}
                        disabled={loading}
                      >
                        {loading ? <Spinner animation="border" size="sm" /> : 'Export Donations'}
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
                
                <Col md={4}>
                  <Card className="text-center h-100">
                    <Card.Body>
                      <Card.Title>Blood Requests</Card.Title>
                      <Card.Text>Export all blood request records</Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <Button 
                        variant="outline-primary" 
                        onClick={() => exportData('requests')}
                        disabled={loading}
                      >
                        {loading ? <Spinner animation="border" size="sm" /> : 'Export Requests'}
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="generate" title="Generate Data">
          <Card>
            <Card.Body>
              <h3>Generate Sample Data</h3>
              <p>Generate sample data for testing and demonstration purposes</p>
              
              <Alert variant="warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Generating sample data will add test records to the database. Use this feature only in development or testing environments.
              </Alert>
              
              <Button 
                variant="primary" 
                onClick={() => setShowGenerateModal(true)}
                disabled={loading}
              >
                Generate Sample Data
              </Button>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="stats" title="Database Statistics">
          <Card>
            <Card.Body>
              <h3>Database Statistics</h3>
              <p>View statistics about the data in the system</p>
              
              <Button 
                variant="outline-primary" 
                onClick={fetchStats}
                disabled={loading}
                className="mb-3"
              >
                {loading ? <><Spinner animation="border" size="sm" /> Loading...</> : 'Refresh Statistics'}
              </Button>
              
              {stats && (
                <div className="stats-container">
                  <Row className="g-4">
                    <Col md={3}>
                      <Card className="text-center h-100 bg-light">
                        <Card.Body>
                          <Card.Title>Donors</Card.Title>
                          <h1>{stats.totalDonors}</h1>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col md={3}>
                      <Card className="text-center h-100 bg-light">
                        <Card.Body>
                          <Card.Title>Donations</Card.Title>
                          <h1>{stats.totalDonations}</h1>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col md={3}>
                      <Card className="text-center h-100 bg-light">
                        <Card.Body>
                          <Card.Title>Blood Requests</Card.Title>
                          <h1>{stats.totalBloodRequests}</h1>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col md={3}>
                      <Card className="text-center h-100 bg-light">
                        <Card.Body>
                          <Card.Title>Hospitals</Card.Title>
                          <h1>{stats.totalHospitals}</h1>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  
                  <h4 className="mt-4">Critical Blood Inventory</h4>
                  {stats.criticalBloodGroups && stats.criticalBloodGroups.length > 0 ? (
                    <div className="mb-3">
                      {stats.criticalBloodGroups.map(group => (
                        <Badge bg="danger" className="me-2 mb-2 p-2" key={group}>
                          {group} <i className="fas fa-exclamation-triangle ms-1"></i>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p>No critical inventory levels detected</p>
                  )}
                  
                  <h4 className="mt-4">Upcoming Appointments</h4>
                  <p>{stats.upcomingAppointments} appointments scheduled for the next week</p>
                  
                  <h4 className="mt-4">Emergency Notifications</h4>
                  <p>{stats.activeEmergencyNotifications} active emergency notifications</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
      
      {/* Generate Sample Data Modal */}
      <Modal show={showGenerateModal} onHide={() => setShowGenerateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Generate Sample Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Number of Donors</Form.Label>
              <Form.Control 
                type="number" 
                min="1" 
                max="100" 
                value={generationParams.donors} 
                onChange={e => setGenerationParams({...generationParams, donors: parseInt(e.target.value) || 1})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Number of Donations</Form.Label>
              <Form.Control 
                type="number" 
                min="1" 
                max="200" 
                value={generationParams.donations} 
                onChange={e => setGenerationParams({...generationParams, donations: parseInt(e.target.value) || 1})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Number of Hospitals</Form.Label>
              <Form.Control 
                type="number" 
                min="1" 
                max="50" 
                value={generationParams.hospitals} 
                onChange={e => setGenerationParams({...generationParams, hospitals: parseInt(e.target.value) || 1})}
              />
            </Form.Group>
          </Form>
          
          <Alert variant="warning">
            <i className="fas fa-exclamation-triangle me-2"></i>
            This will generate {generationParams.donors} donors, {generationParams.donations} donations, and {generationParams.hospitals} hospitals in the database. Use this feature only in development or testing environments.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGenerateModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={generateSampleData}
            disabled={loading}
          >
            {loading ? <><Spinner animation="border" size="sm" /> Generating...</> : 'Generate Data'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DataManagement;