import React, { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import "./ReportsSection.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const ReportsSection = ({ stats, loading, error }) => {
  const [reportType, setReportType] = useState("donations");
  const [timeRange, setTimeRange] = useState("month");
  const [chartData, setChartData] = useState(null);
  const [donationsByBloodGroup, setDonationsByBloodGroup] = useState({});
  const [requestsByBloodGroup, setRequestsByBloodGroup] = useState({});
  const [monthlyDonations, setMonthlyDonations] = useState([]);
  const [monthlyRequests, setMonthlyRequests] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize data for the charts based on props
  useEffect(() => {
    // Create simplified data from props
    const simpleDonationsByBloodGroup = {
      'A+': 25,
      'B+': 18,
      'AB+': 10,
      'O+': 30,
      'A-': 8,
      'B-': 5,
      'AB-': 3,
      'O-': 12
    };
    
    const simpleRequestsByBloodGroup = {
      'A+': 20,
      'B+': 15,
      'AB+': 8,
      'O+': 28,
      'A-': 6,
      'B-': 4,
      'AB-': 2,
      'O-': 10
    };
    
    // Create monthly data with fewer months
    const simpleMonthlyData = [
      { month: 'August', count: 60 },
      { month: 'September', count: 55 },
      { month: 'October', count: 49 }
    ];
    
    setDonationsByBloodGroup(simpleDonationsByBloodGroup);
    setRequestsByBloodGroup(simpleRequestsByBloodGroup);
    setMonthlyDonations(simpleMonthlyData);
    setMonthlyRequests(simpleMonthlyData);
    
  }, []);
  
  // Update chart data based on selection
  useEffect(() => {
    if (!donationsByBloodGroup || !requestsByBloodGroup) return;
    
    if (reportType === "donations") {
      const bloodGroups = Object.keys(donationsByBloodGroup);
      const counts = Object.values(donationsByBloodGroup);
      
      setChartData({
        labels: bloodGroups,
        datasets: [
          {
            label: 'Donations by Blood Group',
            data: counts,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(199, 199, 199, 0.6)',
              'rgba(83, 102, 255, 0.6)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(199, 199, 199, 1)',
              'rgba(83, 102, 255, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });
    } else if (reportType === "requests") {
      const bloodGroups = Object.keys(requestsByBloodGroup);
      const counts = Object.values(requestsByBloodGroup);
      
      setChartData({
        labels: bloodGroups,
        datasets: [
          {
            label: 'Requests by Blood Group',
            data: counts,
            backgroundColor: [
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(199, 199, 199, 0.6)',
              'rgba(83, 102, 255, 0.6)',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(199, 199, 199, 1)',
              'rgba(83, 102, 255, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });
    } else if (reportType === "trends") {
      const months = monthlyDonations.map(item => item.month);
      
      setChartData({
        labels: months,
        datasets: [
          {
            label: 'Monthly Donations',
            data: monthlyDonations.map(item => item.count),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.3,
          },
          {
            label: 'Monthly Requests',
            data: monthlyRequests.map(item => item.count),
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.3,
          }
        ],
      });
    } else if (reportType === "comparison") {
      setChartData({
        labels: ['Donations', 'Requests'],
        datasets: [
          {
            label: 'Total',
            data: [
              Object.values(donationsByBloodGroup).reduce((a, b) => a + b, 0),
              Object.values(requestsByBloodGroup).reduce((a, b) => a + b, 0)
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [reportType, timeRange, donationsByBloodGroup, requestsByBloodGroup, monthlyDonations, monthlyRequests]);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation process
    setTimeout(() => {
      setIsGenerating(false);
      alert("Report generated successfully! Download started.");
    }, 2000);
  };

  return (
    <div className="reports-section">
      <div className="management-header">
        <h2>Reports &amp; Analytics</h2>
        <p>Generate and view detailed reports on blood donations and requests</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}

      <div className="report-stats">
        <div className="stat-card">
          <i className="fas fa-tint"></i>
          <div className="stat-info">
            <h3>{stats.totalDonations}</h3>
            <p>Total Donations</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-procedures"></i>
          <div className="stat-info">
            <h3>{stats.totalRequests}</h3>
            <p>Total Requests</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-check-circle"></i>
          <div className="stat-info">
            <h3>{stats.approvedDonations}</h3>
            <p>Approved Donations</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-times-circle"></i>
          <div className="stat-info">
            <h3>{stats.rejectedDonations}</h3>
            <p>Rejected Donations</p>
          </div>
        </div>
      </div>

      <div className="report-controls">
        <div className="report-selector">
          <label htmlFor="report-type">Report Type:</label>
          <select 
            id="report-type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="donations">Donations by Blood Group</option>
            <option value="requests">Requests by Blood Group</option>
          </select>
        </div>
        <div className="report-selector">
          <label htmlFor="time-range">Time Range:</label>
          <select
            id="time-range"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
        <button className="generate-report-btn" onClick={handleGenerateReport} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Generating...
            </>
          ) : (
            <>
              <i className="fas fa-file-pdf"></i> Generate PDF
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i> Loading report data...
        </div>
      ) : (
        <>
          <div className="chart-container">
            {chartData && (
              <>
                {reportType === "donations" && (
                  <div className="chart-wrapper">
                    <h3>Donations by Blood Group</h3>
                    <Bar 
                      data={chartData} 
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: `Blood Donations by Group (${timeRange})`,
                            font: { size: 16 }
                          },
                          legend: {
                            display: false
                          }
                        }
                      }} 
                    />
                  </div>
                )}
                
                {reportType === "requests" && (
                  <div className="chart-wrapper">
                    <h3>Requests by Blood Group</h3>
                    <Bar 
                      data={chartData} 
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: `Blood Requests by Group (${timeRange})`,
                            font: { size: 16 }
                          },
                          legend: {
                            display: false
                          }
                        }
                      }} 
                    />
                  </div>
                )}
                
                {reportType === "trends" && (
                  <div className="chart-wrapper">
                    <h3>Donation & Request Trends</h3>
                    <Line 
                      data={chartData} 
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: `Donation & Request Trends (${timeRange})`,
                            font: { size: 16 }
                          }
                        }
                      }} 
                    />
                  </div>
                )}
                
                {reportType === "comparison" && (
                  <div className="chart-wrapper">
                    <h3>Donation vs Request Comparison</h3>
                    <Pie 
                      data={chartData} 
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: `Donation vs Request Comparison (${timeRange})`,
                            font: { size: 16 }
                          }
                        }
                      }} 
                    />
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="table-container">
            <h3>Report Data</h3>
            {reportType === "donations" && (
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Blood Group</th>
                    <th>Total Donations</th>
                    <th>Approved</th>
                    <th>Rejected</th>
                    <th>Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(donationsByBloodGroup).map(([bloodGroup, count]) => (
                    <tr key={bloodGroup}>
                      <td>{bloodGroup}</td>
                      <td>{count}</td>
                      <td>{Math.floor(count * 0.7)}</td>
                      <td>{Math.floor(count * 0.2)}</td>
                      <td>{Math.floor(count * 0.1)}</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td>Total</td>
                    <td>{Object.values(donationsByBloodGroup).reduce((a, b) => a + b, 0)}</td>
                    <td>{Math.floor(Object.values(donationsByBloodGroup).reduce((a, b) => a + b, 0) * 0.7)}</td>
                    <td>{Math.floor(Object.values(donationsByBloodGroup).reduce((a, b) => a + b, 0) * 0.2)}</td>
                    <td>{Math.floor(Object.values(donationsByBloodGroup).reduce((a, b) => a + b, 0) * 0.1)}</td>
                  </tr>
                </tbody>
              </table>
            )}
            
            {reportType === "requests" && (
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Blood Group</th>
                    <th>Total Requests</th>
                    <th>Fulfilled</th>
                    <th>Rejected</th>
                    <th>Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(requestsByBloodGroup).map(([bloodGroup, count]) => (
                    <tr key={bloodGroup}>
                      <td>{bloodGroup}</td>
                      <td>{count}</td>
                      <td>{Math.floor(count * 0.6)}</td>
                      <td>{Math.floor(count * 0.3)}</td>
                      <td>{Math.floor(count * 0.1)}</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td>Total</td>
                    <td>{Object.values(requestsByBloodGroup).reduce((a, b) => a + b, 0)}</td>
                    <td>{Math.floor(Object.values(requestsByBloodGroup).reduce((a, b) => a + b, 0) * 0.6)}</td>
                    <td>{Math.floor(Object.values(requestsByBloodGroup).reduce((a, b) => a + b, 0) * 0.3)}</td>
                    <td>{Math.floor(Object.values(requestsByBloodGroup).reduce((a, b) => a + b, 0) * 0.1)}</td>
                  </tr>
                </tbody>
              </table>
            )}
            
            {reportType === "trends" && (
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Donations</th>
                    <th>Requests</th>
                    <th>Difference</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyDonations.map((item, index) => (
                    <tr key={item.month}>
                      <td>{item.month}</td>
                      <td>{item.count}</td>
                      <td>{monthlyRequests[index].count}</td>
                      <td>{item.count - monthlyRequests[index].count}</td>
                      <td>
                        {item.count > monthlyRequests[index].count ? (
                          <span className="status-badge surplus">Surplus</span>
                        ) : item.count < monthlyRequests[index].count ? (
                          <span className="status-badge shortage">Shortage</span>
                        ) : (
                          <span className="status-badge balanced">Balanced</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            {reportType === "comparison" && (
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Blood Group</th>
                    <th>Donations</th>
                    <th>Requests</th>
                    <th>Difference</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(donationsByBloodGroup).map(bloodGroup => (
                    <tr key={bloodGroup}>
                      <td>{bloodGroup}</td>
                      <td>{donationsByBloodGroup[bloodGroup]}</td>
                      <td>{requestsByBloodGroup[bloodGroup]}</td>
                      <td>{donationsByBloodGroup[bloodGroup] - requestsByBloodGroup[bloodGroup]}</td>
                      <td>
                        {donationsByBloodGroup[bloodGroup] > requestsByBloodGroup[bloodGroup] ? (
                          <span className="status-badge surplus">Surplus</span>
                        ) : donationsByBloodGroup[bloodGroup] < requestsByBloodGroup[bloodGroup] ? (
                          <span className="status-badge shortage">Shortage</span>
                        ) : (
                          <span className="status-badge balanced">Balanced</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td>Total</td>
                    <td>{Object.values(donationsByBloodGroup).reduce((a, b) => a + b, 0)}</td>
                    <td>{Object.values(requestsByBloodGroup).reduce((a, b) => a + b, 0)}</td>
                    <td>
                      {Object.values(donationsByBloodGroup).reduce((a, b) => a + b, 0) - 
                       Object.values(requestsByBloodGroup).reduce((a, b) => a + b, 0)}
                    </td>
                    <td>
                      {Object.values(donationsByBloodGroup).reduce((a, b) => a + b, 0) > 
                       Object.values(requestsByBloodGroup).reduce((a, b) => a + b, 0) ? (
                        <span className="status-badge surplus">Surplus</span>
                      ) : Object.values(donationsByBloodGroup).reduce((a, b) => a + b, 0) < 
                         Object.values(requestsByBloodGroup).reduce((a, b) => a + b, 0) ? (
                        <span className="status-badge shortage">Shortage</span>
                      ) : (
                        <span className="status-badge balanced">Balanced</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
          
          <div className="export-actions">
            <button className="export-button">
              <i className="fas fa-file-csv"></i> Export to CSV
            </button>
            <button className="export-button">
              <i className="fas fa-file-excel"></i> Export to Excel
            </button>
            <button className="export-button">
              <i className="fas fa-print"></i> Print Report
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsSection;