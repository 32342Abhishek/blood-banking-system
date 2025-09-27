import React from 'react';
import './BloodCompatibility.css';

function BloodCompatibility() {
  // Blood compatibility information
  const compatibilityData = {
    "A+": {
      canDonateTo: ["A+", "AB+"],
      canReceiveFrom: ["A+", "A-", "O+", "O-"]
    },
    "A-": {
      canDonateTo: ["A+", "A-", "AB+", "AB-"],
      canReceiveFrom: ["A-", "O-"]
    },
    "B+": {
      canDonateTo: ["B+", "AB+"],
      canReceiveFrom: ["B+", "B-", "O+", "O-"]
    },
    "B-": {
      canDonateTo: ["B+", "B-", "AB+", "AB-"],
      canReceiveFrom: ["B-", "O-"]
    },
    "AB+": {
      canDonateTo: ["AB+"],
      canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    "AB-": {
      canDonateTo: ["AB+", "AB-"],
      canReceiveFrom: ["A-", "B-", "AB-", "O-"]
    },
    "O+": {
      canDonateTo: ["A+", "B+", "AB+", "O+"],
      canReceiveFrom: ["O+", "O-"]
    },
    "O-": {
      canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      canReceiveFrom: ["O-"]
    }
  };

  // Blood type distribution in population (approximate percentages)
  const bloodDistribution = [
    { bloodType: "O+", percentage: 38 },
    { bloodType: "A+", percentage: 34 },
    { bloodType: "B+", percentage: 9 },
    { bloodType: "AB+", percentage: 3 },
    { bloodType: "O-", percentage: 7 },
    { bloodType: "A-", percentage: 6 },
    { bloodType: "B-", percentage: 2 },
    { bloodType: "AB-", percentage: 1 }
  ];

  // Facts about blood
  const bloodFacts = [
    "One pint of blood can save up to three lives.",
    "The average adult has about 10 pints of blood in their body.",
    "Blood makes up about 7% of your body's weight.",
    "Red blood cells live about 120 days in the bloodstream.",
    "A person can donate whole blood every 56 days (8 weeks).",
    "Type O- blood is known as the universal donor type.",
    "Type AB+ is the universal recipient type.",
    "Platelets can be donated every 7 days, up to 24 times a year.",
    "A single car accident victim can require as many as 100 pints of blood.",
    "Blood cannot be manufactured; it can only come from volunteer donors."
  ];

  // Blood components information
  const bloodComponents = [
    {
      name: "Red Blood Cells",
      description: "Carry oxygen from the lungs to the rest of the body and carbon dioxide back to the lungs.",
      storageTime: "42 days when refrigerated",
      usedFor: "Trauma, surgery, anemia, blood disorders"
    },
    {
      name: "Platelets",
      description: "Help blood to clot and control bleeding.",
      storageTime: "5 days at room temperature",
      usedFor: "Cancer treatments, transplant, surgery, bleeding disorders"
    },
    {
      name: "Plasma",
      description: "Liquid portion of blood containing proteins for clotting and immunity.",
      storageTime: "1 year when frozen",
      usedFor: "Trauma, burns, shock, bleeding disorders"
    },
    {
      name: "Cryoprecipitate",
      description: "Contains clotting factors extracted from plasma.",
      storageTime: "1 year when frozen",
      usedFor: "Hemophilia, von Willebrand disease, other clotting disorders"
    }
  ];

  return (
    <div className="blood-compatibility-container">
      <div className="hero-banner">
        <div className="container">
          <h1>Blood Type Compatibility</h1>
          <p>Understanding blood types is crucial for safe transfusions and donations.</p>
        </div>
      </div>
      
      <section className="compatibility-section">
        <h3>Blood Type Compatibility Chart</h3>
        <p className="intro-text">
          Blood type compatibility is crucial for safe blood transfusions. 
          The chart below shows which blood types are compatible for donations and transfusions.
        </p>
        
        <div className="compatibility-chart">
          <table>
            <thead>
              <tr>
                <th>Blood Type</th>
                <th>Can Donate To</th>
                <th>Can Receive From</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(compatibilityData).map(bloodType => (
                <tr key={bloodType}>
                  <td className="blood-type">{bloodType}</td>
                  <td>{compatibilityData[bloodType].canDonateTo.join(", ")}</td>
                  <td>{compatibilityData[bloodType].canReceiveFrom.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="compatibility-section">
        <h3>Universal Donors and Recipients</h3>
        <div className="universal-types">
          <div className="universal-card">
            <h4>Universal Donor</h4>
            <div className="blood-type-badge">O-</div>
            <p>Type O- individuals can donate red blood cells to anyone, regardless of blood type.</p>
          </div>
          <div className="universal-card">
            <h4>Universal Recipient</h4>
            <div className="blood-type-badge">AB+</div>
            <p>Type AB+ individuals can receive red blood cells from any blood type.</p>
          </div>
        </div>
      </section>
      
      <section className="compatibility-section">
        <h3>Blood Type Distribution</h3>
        <p className="intro-text">
          Blood types are not distributed equally in the population. 
          This chart shows the approximate percentage of each blood type.
        </p>
        
        <div className="distribution-chart">
          {bloodDistribution.map(item => (
            <div key={item.bloodType} className="distribution-bar">
              <div className="blood-type-label">{item.bloodType}</div>
              <div className="bar-container">
                <div 
                  className="bar" 
                  style={{ width: `${item.percentage}%` }}
                >
                  {item.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="compatibility-section">
        <h3>Blood Components</h3>
        <p className="intro-text">
          When you donate blood, it can be separated into different components 
          to help multiple patients with specific needs.
        </p>
        
        <div className="component-cards">
          {bloodComponents.map((component, index) => (
            <div key={index} className="component-card">
              <h4>{component.name}</h4>
              <p><strong>Function:</strong> {component.description}</p>
              <p><strong>Storage:</strong> {component.storageTime}</p>
              <p><strong>Used For:</strong> {component.usedFor}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="compatibility-section">
        <h3>Blood Donation Facts</h3>
        <div className="facts-container">
          {bloodFacts.map((fact, index) => (
            <div key={index} className="fact-card">
              <div className="fact-number">{index + 1}</div>
              <p>{fact}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="compatibility-section">
        <h3>Why Donate Blood?</h3>
        <div className="donation-reasons">
          <div className="reason-card">
            <h4>Save Lives</h4>
            <p>Your blood donation can help accident and burn victims, heart surgery patients, organ transplant recipients, and those fighting cancer.</p>
          </div>
          <div className="reason-card">
            <h4>Always Needed</h4>
            <p>Every two seconds, someone in the world needs blood. The need is constant and your contribution is essential for a healthy and reliable blood supply.</p>
          </div>
          <div className="reason-card">
            <h4>Health Benefits</h4>
            <p>Regular blood donation reduces iron levels in the body, which is linked to lower risk of heart attacks. You also get a free mini health check-up.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BloodCompatibility;