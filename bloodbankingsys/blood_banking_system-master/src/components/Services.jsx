import React from "react";
import { Link } from "react-router-dom";
import "./Services.css";

const Services = () => {
  return (
    <div className="services-page">
      <div className="hero-section">
        <div className="container">
          <h1>Our Services</h1>
          <p className="tagline">Comprehensive blood banking services for donors, recipients, and healthcare facilities.</p>
        </div>
      </div>
      
      <div className="container main-content">
        <section className="services-intro">
          <p>
            Our blood bank offers a wide range of services focused on blood collection, processing, testing, storage, and distribution. We are committed to maintaining the highest standards of safety and quality in all our processes, ensuring that patients receive the life-saving blood products they need.
          </p>
        </section>
        
        <section className="service-categories">
          <div className="category-card" id="donor-services">
            <div className="category-icon">
              <i className="fas fa-hand-holding-medical"></i>
            </div>
            <h2>Donor Services</h2>
            <div className="service-list">
              <div className="service-item">
                <h3>Whole Blood Donation</h3>
                <p>Standard blood donation that takes about 8-10 minutes to collect and can help up to three different patients.</p>
              </div>
              
              <div className="service-item">
                <h3>Platelet Donation</h3>
                <p>Specialized donation that collects only platelets and returns other blood components to the donor.</p>
              </div>
              
              <div className="service-item">
                <h3>Plasma Donation</h3>
                <p>Collection of plasma, the liquid portion of blood that helps patients with bleeding disorders.</p>
              </div>
              
              <div className="service-item">
                <h3>Double Red Cell Donation</h3>
                <p>Advanced donation that collects two units of red cells during one donation.</p>
              </div>
              
              <div className="service-item">
                <h3>Pre-Donation Screening</h3>
                <p>Comprehensive health check including hemoglobin testing, blood pressure, pulse, and temperature.</p>
              </div>
            </div>
            <Link to="/donar" className="service-button">Schedule a Donation</Link>
          </div>
          
          <div className="category-card" id="recipient-services">
            <div className="category-icon">
              <i className="fas fa-procedures"></i>
            </div>
            <h2>Recipient Services</h2>
            <div className="service-list">
              <div className="service-item">
                <h3>Blood Type Matching</h3>
                <p>Expert matching of blood types between donors and recipients to ensure compatibility.</p>
              </div>
              
              <div className="service-item">
                <h3>Emergency Blood Supply</h3>
                <p>24/7 emergency blood supply for trauma cases and urgent medical needs.</p>
              </div>
              
              <div className="service-item">
                <h3>Specialized Components</h3>
                <p>Provision of specialized blood components for patients with specific medical requirements.</p>
              </div>
              
              <div className="service-item">
                <h3>Rare Blood Type Supply</h3>
                <p>Access to rare blood types through our network and rare donor registry.</p>
              </div>
            </div>
            <Link to="/request" className="service-button">Request Blood</Link>
          </div>
          
          <div className="category-card" id="medical-services">
            <div className="category-icon">
              <i className="fas fa-hospital"></i>
            </div>
            <h2>Medical & Laboratory Services</h2>
            <div className="service-list">
              <div className="service-item">
                <h3>Blood Testing</h3>
                <p>Comprehensive testing for infectious diseases and blood group determination.</p>
              </div>
              
              <div className="service-item">
                <h3>Component Preparation</h3>
                <p>Processing of whole blood into separate components (red cells, platelets, plasma) for targeted patient care.</p>
              </div>
              
              <div className="service-item">
                <h3>Cross-Matching</h3>
                <p>Advanced compatibility testing between donor and recipient blood samples.</p>
              </div>
              
              <div className="service-item">
                <h3>Irradiation Services</h3>
                <p>Specialized treatment of blood products for immunocompromised patients.</p>
              </div>
              
              <div className="service-item">
                <h3>Leukoreduction</h3>
                <p>Removal of white blood cells to prevent transfusion reactions in certain patients.</p>
              </div>
            </div>
            <a href="#hospital-integration" className="service-button">Hospital Information</a>
          </div>
        </section>
        
        <section className="additional-services">
          <h2>Additional Services</h2>
          
          <div className="services-grid">
            <div className="service-box">
              <div className="service-box-icon">
                <i className="fas fa-user-md"></i>
              </div>
              <h3>Donor Health Checks</h3>
              <p>Free health screenings including blood pressure, hemoglobin levels, and infectious disease testing with every donation.</p>
            </div>
            
            <div className="service-box">
              <div className="service-box-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3>Mobile Blood Drives</h3>
              <p>Organization of blood donation camps at schools, colleges, corporate offices, and community centers.</p>
            </div>
            
            <div className="service-box">
              <div className="service-box-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3>Educational Programs</h3>
              <p>Community awareness and education programs about blood donation importance and process.</p>
            </div>
            
            <div className="service-box">
              <div className="service-box-icon">
                <i className="fas fa-ambulance"></i>
              </div>
              <h3>Emergency Response</h3>
              <p>Coordination with disaster management teams to ensure blood supply during emergencies and natural disasters.</p>
            </div>
            
            <div className="service-box">
              <div className="service-box-icon">
                <i className="fas fa-clipboard-check"></i>
              </div>
              <h3>Quality Assurance</h3>
              <p>Rigorous quality control procedures to ensure all blood products meet national and international standards.</p>
            </div>
            
            <div className="service-box">
              <div className="service-box-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <h3>Donor Recognition Program</h3>
              <p>Special recognition and benefits for regular donors who contribute consistently to the blood supply.</p>
            </div>
          </div>
        </section>
        
        <section className="hospital-integration" id="hospital-integration">
          <h2>Hospital Integration Services</h2>
          
          <div className="integration-content">
            <div className="integration-text">
              <p>
                We work closely with hospitals and healthcare facilities to ensure a seamless supply of blood products when and where they are needed most. Our hospital integration services include:
              </p>
              <ul>
                <li><strong>Hospital Blood Banking System:</strong> Integration with hospital information systems for efficient blood product management.</li>
                <li><strong>Just-in-Time Inventory:</strong> Strategic inventory management to ensure hospitals have the blood products they need without waste.</li>
                <li><strong>Emergency Supply Protocol:</strong> Specialized procedures to expedite blood supply during mass casualty events.</li>
                <li><strong>Cross-Matching Services:</strong> On-site or remote compatibility testing services.</li>
                <li><strong>Transport Services:</strong> Secure and temperature-controlled transport of blood products to healthcare facilities.</li>
              </ul>
              <p>
                For hospital administrators interested in establishing or improving blood supply partnerships with our blood bank, please contact our Hospital Services team.
              </p>
              <a href="mailto:abhishek842634@gmail.com" className="contact-link">Contact Hospital Services</a>
            </div>
            <div className="integration-image"></div>
          </div>
        </section>
        
        <section className="service-cta">
          <div className="cta-content">
            <h2>Need Assistance?</h2>
            <p>Our team is available to answer your questions about our services and how we can help you or your organization.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="cta-button primary">Contact Us</Link>
              <Link to="/blood-compatibility" className="cta-button secondary">Blood Type Guide</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;