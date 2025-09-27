import React from 'react';
import './FAQ.css';

const FAQ = () => {
  return (
    <div className="faq-container">
      <h1 className="faq-header">Frequently Asked Questions</h1>
      <div className="faq-intro">
        <p>Find answers to common questions about blood donation, eligibility, and our blood banking system.</p>
      </div>
      
      <div className="faq-section">
        <h2>General Questions</h2>
        
        <div className="faq-item">
          <h3>Why should I donate blood?</h3>
          <div className="faq-answer">
            <p>Blood donation saves lives. A single donation can help up to three people in need. Blood is essential for surgeries, cancer treatments, chronic illnesses, and traumatic injuries. By donating blood, you are directly helping patients in critical need.</p>
          </div>
        </div>
        
        <div className="faq-item">
          <h3>How often can I donate blood?</h3>
          <div className="faq-answer">
            <p>Healthy adults can donate whole blood every 56 days (8 weeks). Platelet donors can give every 7 days up to 24 times per year. Plasma donors can donate every 28 days, and double red cell donors can give every 112 days.</p>
          </div>
        </div>
        
        <div className="faq-item">
          <h3>How long does the donation process take?</h3>
          <div className="faq-answer">
            <p>The entire process takes about one hour from registration to post-donation refreshments. The actual blood drawing usually takes only 8-10 minutes. First-time donors may take slightly longer due to additional paperwork.</p>
          </div>
        </div>
      </div>
      
      <div className="faq-section">
        <h2>Donation Eligibility</h2>
        
        <div className="faq-item">
          <h3>What are the basic requirements for blood donation?</h3>
          <div className="faq-answer">
            <p>Basic requirements include:</p>
            <ul>
              <li>Being at least 18 years old</li>
              <li>Weighing at least 50 kg (110 lbs)</li>
              <li>Being in good general health</li>
              <li>Having hemoglobin levels of at least 12.5 g/dL for women and 13.5 g/dL for men</li>
              <li>Normal blood pressure, pulse, and temperature</li>
            </ul>
          </div>
        </div>
        
        <div className="faq-item">
          <h3>Can I donate if I'm taking medication?</h3>
          <div className="faq-answer">
            <p>Most medications do not prevent you from donating blood. However, some medications may require a waiting period after your last dose. Common medications like those for high blood pressure, thyroid, or cholesterol typically don't affect eligibility. Please inform the medical staff about all medications you're taking during screening.</p>
          </div>
        </div>
        
        <div className="faq-item">
          <h3>Are there any medical conditions that prevent blood donation?</h3>
          <div className="faq-answer">
            <p>Some medical conditions that may prevent blood donation include:</p>
            <ul>
              <li>Bloodborne diseases like HIV or hepatitis</li>
              <li>Heart disease or recent heart surgery</li>
              <li>Cancer (depending on type and treatment status)</li>
              <li>Severe asthma or respiratory conditions</li>
              <li>Blood clotting disorders</li>
              <li>Recent significant surgeries</li>
              <li>Pregnancy or recent childbirth (within 6 weeks)</li>
            </ul>
            <p>Each case is evaluated individually during screening.</p>
          </div>
        </div>
      </div>
      
      <div className="faq-section">
        <h2>Blood Banking System</h2>
        
        <div className="faq-item">
          <h3>How do I schedule an appointment to donate?</h3>
          <div className="faq-answer">
            <p>You can schedule an appointment through our website by logging in to your account and clicking on "Donate" or by calling our blood bank center. Walk-ins are also welcome, but appointments are preferred to reduce waiting times.</p>
          </div>
        </div>
        
        <div className="faq-item">
          <h3>How is my blood used after donation?</h3>
          <div className="faq-answer">
            <p>After collection, your blood is tested for infectious diseases and processed into components (red cells, platelets, and plasma). These components are then stored appropriately and distributed to hospitals based on their needs. Your donation can help accident victims, surgical patients, cancer patients, and those with blood disorders.</p>
          </div>
        </div>
        
        <div className="faq-item">
          <h3>Is my personal information kept confidential?</h3>
          <div className="faq-answer">
            <p>Yes, all donor information is kept strictly confidential. We follow all privacy laws and regulations to protect your personal and medical information. Your data is only used for blood banking purposes and will never be shared with unauthorized third parties.</p>
          </div>
        </div>
        
        <div className="faq-item">
          <h3>How can I view my donation history?</h3>
          <div className="faq-answer">
            <p>You can view your donation history by logging into your account on our website. The dashboard shows all your previous donations, including dates, types of donation, and any upcoming eligibility dates.</p>
          </div>
        </div>
      </div>
      
      <div className="faq-cta">
        <h3>Have more questions?</h3>
        <p>Contact our support team at <a href="mailto:support@bloodbank.org">support@bloodbank.org</a> or call us at +91 9142552982.</p>
      </div>
    </div>
  );
};

export default FAQ;