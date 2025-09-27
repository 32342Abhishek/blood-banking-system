import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './DonorAnalytics.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function DonorAnalytics() {
  const { token } = useContext(AuthContext);
  const [donors, setDonors] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'year'
  const [reportType, setReportType] = useState('blood-type'); // 'blood-type', 'age', 'location', 'frequency'

  useEffect(() => {
    fetchDonors();
    fetchDonations();
  }, [token]);

  const fetchDonors = async () => {
    try {
      setLoading(true);
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
      setError(null);
    } catch (err) {
      console.error('Error fetching donors:', err);
      setError('Failed to load donor data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/blood-donations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch donations');
      }
      
      const data = await response.json();
      setDonations(data);
    } catch (err) {
      console.error('Error fetching donations:', err);
    }
  };

  // Filter donations by date range
  const getFilteredDonations = () => {
    if (!donations.length) return [];
    
    const now = new Date();
    let filterDate = new Date();
    
    switch(dateRange) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        filterDate.setMonth(now.getMonth() - 1); // Default to month
    }
    
    return donations.filter(donation => {
      const donationDate = new Date(donation.donationDate);
      return donationDate >= filterDate;
    });
  };

  // Blood type distribution chart data
  const getBloodTypeChartData = () => {
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const bloodTypeCounts = bloodTypes.map(type => 
      donors.filter(donor => donor.bloodType === type).length
    );
    
    return {
      labels: bloodTypes,
      datasets: [
        {
          label: 'Blood Types',
          data: bloodTypeCounts,
          backgroundColor: [
            '#e74c3c', '#c0392b', '#3498db', '#2980b9', 
            '#9b59b6', '#8e44ad', '#2ecc71', '#27ae60'
          ],
          borderColor: [
            '#fff', '#fff', '#fff', '#fff',
            '#fff', '#fff', '#fff', '#fff'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Age distribution chart data
  const getAgeDistributionChartData = () => {
    // Calculate age ranges
    const ageRanges = {
      '18-24': 0,
      '25-34': 0,
      '35-44': 0,
      '45-54': 0,
      '55-64': 0,
      '65+': 0
    };
    
    donors.forEach(donor => {
      // Assuming donor has dateOfBirth field
      if (donor.dateOfBirth) {
        const birthDate = new Date(donor.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        if (age < 18) return; // Skip if under 18
        
        if (age < 25) ageRanges['18-24']++;
        else if (age < 35) ageRanges['25-34']++;
        else if (age < 45) ageRanges['35-44']++;
        else if (age < 55) ageRanges['45-54']++;
        else if (age < 65) ageRanges['55-64']++;
        else ageRanges['65+']++;
      }
    });
    
    return {
      labels: Object.keys(ageRanges),
      datasets: [
        {
          label: 'Age Distribution',
          data: Object.values(ageRanges),
          backgroundColor: '#3498db',
          borderColor: '#2980b9',
          borderWidth: 1,
        },
      ],
    };
  };

  // Donation frequency chart data (donations per month)
  const getDonationFrequencyChartData = () => {
    const filteredDonations = getFilteredDonations();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthCounts = Array(12).fill(0);
    
    filteredDonations.forEach(donation => {
      const date = new Date(donation.donationDate);
      monthCounts[date.getMonth()]++;
    });
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Donations per Month',
          data: monthCounts,
          backgroundColor: '#e74c3c',
        },
      ],
    };
  };

  // Location distribution chart data
  const getLocationChartData = () => {
    const locationCounts = {};
    
    donors.forEach(donor => {
      // Assuming donor has a city field
      if (donor.city) {
        if (locationCounts[donor.city]) {
          locationCounts[donor.city]++;
        } else {
          locationCounts[donor.city] = 1;
        }
      }
    });
    
    // Sort by count and take top 10
    const sortedLocations = Object.keys(locationCounts)
      .sort((a, b) => locationCounts[b] - locationCounts[a])
      .slice(0, 10);
    
    return {
      labels: sortedLocations,
      datasets: [
        {
          label: 'Donors by Location',
          data: sortedLocations.map(loc => locationCounts[loc]),
          backgroundColor: '#9b59b6',
        },
      ],
    };
  };

  // Get summary statistics
  const getSummaryStats = () => {
    const filteredDonations = getFilteredDonations();
    
    const totalDonors = donors.length;
    const newDonorsThisMonth = donors.filter(donor => {
      const registrationDate = new Date(donor.createdAt);
      const now = new Date();
      return registrationDate.getMonth() === now.getMonth() && 
             registrationDate.getFullYear() === now.getFullYear();
    }).length;
    
    const totalDonations = filteredDonations.length;
    const totalUnits = filteredDonations.reduce((sum, donation) => sum + (donation.units || 0), 0);
    
    return {
      totalDonors,
      newDonorsThisMonth,
      totalDonations,
      totalUnits
    };
  };

  // Get chart based on selected report type
  const getChartComponent = () => {
    switch(reportType) {
      case 'blood-type':
        return (
          <div className="chart-container pie-chart">
            <h3>Blood Type Distribution</h3>
            <Pie data={getBloodTypeChartData()} />
          </div>
        );
      case 'age':
        return (
          <div className="chart-container bar-chart">
            <h3>Age Distribution</h3>
            <Bar 
              data={getAgeDistributionChartData()} 
              options={{
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        );
      case 'location':
        return (
          <div className="chart-container bar-chart">
            <h3>Donor Location Distribution</h3>
            <Bar 
              data={getLocationChartData()}
              options={{
                indexAxis: 'y',
                scales: {
                  x: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        );
      case 'frequency':
        return (
          <div className="chart-container bar-chart">
            <h3>Donation Frequency</h3>
            <Bar 
              data={getDonationFrequencyChartData()}
              options={{
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        );
      default:
        return (
          <div className="chart-container pie-chart">
            <h3>Blood Type Distribution</h3>
            <Pie data={getBloodTypeChartData()} />
          </div>
        );
    }
  };

  const stats = getSummaryStats();

  return (
    <div className="donor-analytics-container">
      <h2>Donor Analytics</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="analytics-controls">
        <div className="control-group">
          <label htmlFor="dateRange">Time Period:</label>
          <select 
            id="dateRange" 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="reportType">Report Type:</label>
          <select 
            id="reportType" 
            value={reportType} 
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="blood-type">Blood Type Distribution</option>
            <option value="age">Age Distribution</option>
            <option value="location">Location Distribution</option>
            <option value="frequency">Donation Frequency</option>
          </select>
        </div>
      </div>
      
      <div className="analytics-summary">
        <div className="summary-card">
          <div className="summary-value">{stats.totalDonors}</div>
          <div className="summary-label">Total Donors</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{stats.newDonorsThisMonth}</div>
          <div className="summary-label">New Donors (This Month)</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{stats.totalDonations}</div>
          <div className="summary-label">Recent Donations</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{stats.totalUnits}</div>
          <div className="summary-label">Total Units Collected</div>
        </div>
      </div>
      
      <div className="analytics-charts">
        {loading ? (
          <p className="loading-message">Loading donor data...</p>
        ) : (
          getChartComponent()
        )}
      </div>
      
      <div className="donor-efficiency">
        <h3>Donor Retention</h3>
        <div className="efficiency-stats">
          <div className="efficiency-card">
            <div className="efficiency-value">
              {Math.round((donations.filter(d => 
                donors.some(donor => donor.id === d.donorId && 
                  donations.filter(donation => donation.donorId === donor.id).length > 1)
              ).length / donations.length) * 100)}%
            </div>
            <div className="efficiency-label">Repeat Donor Rate</div>
          </div>
          <div className="efficiency-card">
            <div className="efficiency-value">
              {donors.length > 0 ? Math.round(donations.length / donors.length * 100) / 100 : 0}
            </div>
            <div className="efficiency-label">Donations per Donor</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorAnalytics;