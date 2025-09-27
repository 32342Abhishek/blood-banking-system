import React from "react";
import "./BloodDonationTips.css";

const BloodDonationTips = () => {
  return (
    <div className="blood-donation-tips">
      <div className="container">
        <h1 className="page-title">Blood Donation Tips</h1>
        
        <div className="tips-section">
          <h2>Before Donation</h2>
          <div className="tip-card">
            <div className="tip-icon">
              <i className="fas fa-utensils"></i>
            </div>
            <div className="tip-content">
              <h3>Eat Well</h3>
              <p>Have a healthy, low-fat meal within 2-3 hours before donating. Avoid fatty foods like hamburgers, fries or ice cream before donating. Fatty foods can affect blood tests and potentially disqualify you from donating.</p>
            </div>
          </div>

          <div className="tip-card">
            <div className="tip-icon">
              <i className="fas fa-tint"></i>
            </div>
            <div className="tip-content">
              <h3>Stay Hydrated</h3>
              <p>Drink an extra 16 oz of water (or other non-alcoholic fluids) before your donation. Being well-hydrated makes it easier to find your veins and can prevent you from feeling dizzy after donation.</p>
            </div>
          </div>

          <div className="tip-card">
            <div className="tip-icon">
              <i className="fas fa-bed"></i>
            </div>
            <div className="tip-content">
              <h3>Get Rest</h3>
              <p>Ensure you get a good night's sleep of at least 7-8 hours before your donation day. Being well-rested improves your donation experience and recovery.</p>
            </div>
          </div>

          <div className="tip-card">
            <div className="tip-icon">
              <i className="fas fa-id-card"></i>
            </div>
            <div className="tip-content">
              <h3>Bring ID</h3>
              <p>Bring your donor card, driver's license or two other forms of identification with you to your appointment.</p>
            </div>
          </div>
        </div>

        <div className="tips-section">
          <h2>During Donation</h2>
          <div className="tip-card">
            <div className="tip-icon">
              <i className="fas fa-heart"></i>
            </div>
            <div className="tip-content">
              <h3>Relax</h3>
              <p>Try to relax during the donation process. Listening to music, reading a book, or chatting with staff can help ease any nervousness.</p>
            </div>
          </div>

          <div className="tip-card">
            <div className="tip-icon">
              <i className="fas fa-hand-paper"></i>
            </div>
            <div className="tip-content">
              <h3>Squeeze</h3>
              <p>During donation, squeeze the donation ball/stress ball every 5-10 seconds. This can help maintain blood flow and complete the donation more quickly.</p>
            </div>
          </div>
        </div>

        <div className="tips-section">
          <h2>After Donation</h2>
          <div className="tip-card">
            <div className="tip-icon">
              <i className="fas fa-cookie-bite"></i>
            </div>
            <div className="tip-content">
              <h3>Refreshments</h3>
              <p>Enjoy the refreshments offered after donation. The snacks and drinks help replenish your blood sugar levels and fluids.</p>
            </div>
          </div>

          <div className="tip-card">
            <div className="tip-icon">
              <i className="fas fa-ban"></i>
            </div>
            <div className="tip-content">
              <h3>Avoid Heavy Lifting</h3>
              <p>Avoid heavy lifting or strenuous exercise for the rest of the day. Give your body time to replenish the donated blood volume.</p>
            </div>
          </div>

          <div className="tip-card">
            <div className="tip-icon">
              <i className="fas fa-glass-water"></i>
            </div>
            <div className="tip-content">
              <h3>Stay Hydrated</h3>
              <p>Continue drinking water and fluids for the next 24-48 hours to help your body replace the lost fluids.</p>
            </div>
          </div>

          <div className="tip-card">
            <div className="tip-icon">
              <i className="fas fa-bandage"></i>
            </div>
            <div className="tip-content">
              <h3>Keep the Bandage</h3>
              <p>Keep the bandage on your arm for at least 4-5 hours after donation. Avoid heavy use of the donation arm for 24 hours.</p>
            </div>
          </div>
        </div>

        <div className="donation-benefits">
          <h2>Benefits of Regular Blood Donation</h2>
          <ul>
            <li>Free health screening with each donation</li>
            <li>Reduced risk of heart disease and cancer</li>
            <li>Stimulation of new blood cell production</li>
            <li>Helps maintain iron levels (especially important for men)</li>
            <li>Burns calories (donating one pint can burn up to 650 calories)</li>
            <li>Psychological benefits from helping others</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BloodDonationTips;