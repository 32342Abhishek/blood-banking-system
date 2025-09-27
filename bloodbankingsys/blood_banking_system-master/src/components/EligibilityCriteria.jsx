import React, { useState } from "react";
import "./EligibilityCriteria.css";

const EligibilityCriteria = () => {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className="eligibility-criteria">
      <div className="container">
        <h1 className="page-title">Blood Donation Eligibility Criteria</h1>
        
        <div className="eligibility-tabs">
          <button 
            className={`tab-button ${activeTab === "basic" ? "active" : ""}`}
            onClick={() => setActiveTab("basic")}
          >
            <i className="fas fa-check-circle"></i> Basic Requirements
          </button>
          <button 
            className={`tab-button ${activeTab === "medical" ? "active" : ""}`}
            onClick={() => setActiveTab("medical")}
          >
            <i className="fas fa-heartbeat"></i> Medical Conditions
          </button>
          <button 
            className={`tab-button ${activeTab === "medications" ? "active" : ""}`}
            onClick={() => setActiveTab("medications")}
          >
            <i className="fas fa-pills"></i> Medications
          </button>
          <button 
            className={`tab-button ${activeTab === "travel" ? "active" : ""}`}
            onClick={() => setActiveTab("travel")}
          >
            <i className="fas fa-plane"></i> Travel Restrictions
          </button>
        </div>
        
        <div className="criteria-content">
          {activeTab === "basic" && (
            <div className="criteria-tab">
              <h2>Basic Eligibility Requirements</h2>
              
              <div className="criteria-card">
                <div className="criteria-icon">
                  <i className="fas fa-birthday-cake"></i>
                </div>
                <div className="criteria-info">
                  <h3>Age</h3>
                  <p>You must be at least 18 years old. There is no upper age limit for blood donation as long as you are well and meet all other eligibility criteria.</p>
                </div>
              </div>
              
              <div className="criteria-card">
                <div className="criteria-icon">
                  <i className="fas fa-weight"></i>
                </div>
                <div className="criteria-info">
                  <h3>Weight</h3>
                  <p>You must weigh at least 50 kg (110 lbs). This minimum weight requirement ensures your safety during the donation process.</p>
                </div>
              </div>
              
              <div className="criteria-card">
                <div className="criteria-icon">
                  <i className="fas fa-user-check"></i>
                </div>
                <div className="criteria-info">
                  <h3>General Health</h3>
                  <p>You must be in good general health. This means you feel well and can perform your normal daily activities.</p>
                </div>
              </div>
              
              <div className="criteria-card">
                <div className="criteria-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="criteria-info">
                  <h3>Frequency of Donation</h3>
                  <p>For whole blood donation, you can donate once every 3 months (12 weeks). For plasma or platelets, you can donate more frequently.</p>
                </div>
              </div>
              
              <div className="criteria-card">
                <div className="criteria-icon">
                  <i className="fas fa-id-card"></i>
                </div>
                <div className="criteria-info">
                  <h3>Identification</h3>
                  <p>You must bring a valid photo ID or your donor card to your appointment.</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "medical" && (
            <div className="criteria-tab">
              <h2>Medical Conditions</h2>
              
              <div className="criteria-list">
                <h3>Conditions That May Affect Eligibility:</h3>
                
                <div className="condition-item">
                  <h4>Anemia</h4>
                  <p>You cannot donate if you have symptomatic anemia. Your hemoglobin levels will be tested before donation.</p>
                </div>
                
                <div className="condition-item">
                  <h4>Heart Disease</h4>
                  <p>If you have heart disease or have had a heart attack, you may not be eligible to donate. Consult with blood center staff.</p>
                </div>
                
                <div className="condition-item">
                  <h4>Diabetes</h4>
                  <p>If your diabetes is well-controlled with diet or oral medication, you may be eligible to donate. Those using insulin may donate if their diabetes is stable.</p>
                </div>
                
                <div className="condition-item">
                  <h4>Cancer</h4>
                  <p>If you have had cancer, you may be able to donate after you have been cancer-free for a certain period. This varies depending on the type of cancer.</p>
                </div>
                
                <div className="condition-item">
                  <h4>Infections</h4>
                  <p>You must be free of any cold, flu, or other active infection on the day of donation.</p>
                </div>
                
                <div className="condition-item">
                  <h4>Blood Pressure</h4>
                  <p>Your blood pressure must be below 180/100 mm Hg on the day of donation.</p>
                </div>
                
                <div className="condition-item">
                  <h4>HIV/AIDS</h4>
                  <p>You cannot donate if you have HIV/AIDS or have had a positive test for HIV.</p>
                </div>
                
                <div className="condition-item">
                  <h4>Hepatitis</h4>
                  <p>You cannot donate if you have Hepatitis B or C.</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "medications" && (
            <div className="criteria-tab">
              <h2>Medications and Donation</h2>
              
              <p className="info-message">
                <i className="fas fa-info-circle"></i>
                Most medications do not prevent you from donating blood. However, some medications may require a waiting period after your last dose before you can donate.
              </p>
              
              <div className="criteria-list">
                <h3>Common Medications and Waiting Periods:</h3>
                
                <div className="medication-item">
                  <h4>Antibiotics</h4>
                  <p>You must have finished the full course and be free from infection for at least 7 days before donating.</p>
                </div>
                
                <div className="medication-item">
                  <h4>Aspirin</h4>
                  <p>No deferral for whole blood donation. However, you must not have taken aspirin for 2 days before platelet donation.</p>
                </div>
                
                <div className="medication-item">
                  <h4>Blood Thinners</h4>
                  <p>Medications such as warfarin (Coumadin) or heparin usually require a waiting period after your last dose.</p>
                </div>
                
                <div className="medication-item">
                  <h4>Acne Treatments</h4>
                  <p>Isotretinoin (Accutane): Wait 1 month after your last dose.</p>
                </div>
                
                <div className="medication-item">
                  <h4>Hair Loss Treatments</h4>
                  <p>Finasteride (Propecia, Proscar): Wait 1 month after your last dose.</p>
                </div>
                
                <div className="medication-item">
                  <h4>Psoriasis Treatments</h4>
                  <p>Etretinate (Tegison): Permanent deferral.</p>
                </div>
              </div>
              
              <div className="note">
                <strong>Note:</strong> Always inform the blood center staff about all medications you are taking, including over-the-counter drugs and herbal supplements.
              </div>
            </div>
          )}
          
          {activeTab === "travel" && (
            <div className="criteria-tab">
              <h2>Travel Restrictions</h2>
              
              <p className="info-message">
                <i className="fas fa-info-circle"></i>
                Travel to certain countries or regions may temporarily defer you from donating blood due to the risk of exposure to certain diseases.
              </p>
              
              <div className="criteria-list">
                <h3>Common Travel-Related Deferrals:</h3>
                
                <div className="travel-item">
                  <h4>Malaria-Endemic Areas</h4>
                  <p>If you have traveled to an area where malaria is endemic, you may need to wait 3-12 months before donating, depending on the specific area and whether you took antimalarial medication.</p>
                </div>
                
                <div className="travel-item">
                  <h4>United Kingdom</h4>
                  <p>If you spent 3 months or more cumulatively in the United Kingdom between 1980 and 1996, you may be deferred due to the risk of variant Creutzfeldt-Jakob Disease (vCJD).</p>
                </div>
                
                <div className="travel-item">
                  <h4>Europe</h4>
                  <p>Similar restrictions may apply for certain European countries depending on the time period and duration of stay.</p>
                </div>
                
                <div className="travel-item">
                  <h4>Zika Virus Areas</h4>
                  <p>If you have traveled to an area with Zika virus outbreaks, you may need to wait 28 days before donating.</p>
                </div>
              </div>
              
              <div className="note">
                <strong>Note:</strong> Travel restrictions can change based on current global health situations. Always check with the blood center for the most up-to-date information.
              </div>
            </div>
          )}
        </div>
        
        <div className="eligibility-disclaimer">
          <h3><i className="fas fa-exclamation-triangle"></i> Important Note</h3>
          <p>These criteria are general guidelines. The final determination of your eligibility to donate blood will be made by the medical staff at the donation center based on your health history and assessment on the day of donation.</p>
          <p>If you're unsure about your eligibility, please contact our center directly at +91 9142552982 for personalized guidance.</p>
        </div>
      </div>
    </div>
  );
};

export default EligibilityCriteria;