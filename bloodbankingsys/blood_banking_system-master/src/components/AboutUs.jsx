import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-us">
      <div className="hero-section">
        <div className="container">
          <h1>About Our Blood Bank</h1>
          <p className="tagline">Connecting donors with recipients to save lives every day.</p>
        </div>
      </div>
      
      <div className="container main-content">
        <section className="mission-section">
          <div className="section-content">
            <h2>Our Mission</h2>
            <p>
              At Blood Bank System, our mission is to ensure a safe and adequate blood supply to meet the healthcare needs of our community. We are dedicated to collecting, processing, and distributing blood and blood components of the highest quality while providing exceptional service to donors and healthcare providers.
            </p>
            <p>
              We believe that every donation is a gift of life, and we work tirelessly to honor that gift by maintaining the highest standards of safety, quality, and service.
            </p>
          </div>
          <div className="section-image">
            <div className="image-wrapper mission-image">
              <div className="overlay">
                <div className="stat">
                  <div className="stat-number">10,000+</div>
                  <div className="stat-text">Lives Saved</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="history-section">
          <div className="section-image">
            <div className="image-wrapper history-image">
              <div className="overlay">
                <div className="stat">
                  <div className="stat-number">Since</div>
                  <div className="stat-text">2015</div>
                </div>
              </div>
            </div>
          </div>
          <div className="section-content">
            <h2>Our History</h2>
            <p>
              Established in 2015, our blood bank was founded with a simple yet powerful vision: to save lives through voluntary blood donation. What started as a small facility with a handful of dedicated staff has grown into a vital healthcare resource serving multiple hospitals and medical facilities across the region.
            </p>
            <p>
              Over the years, we have introduced numerous technological advancements and innovative programs to improve both donor experience and recipient outcomes. Our growth is a testament to the generosity of our donors and the commitment of our staff.
            </p>
          </div>
        </section>
        
        <section className="values-section">
          <h2>Our Core Values</h2>
          <div className="values-container">
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>Compassion</h3>
              <p>We approach our work with empathy and understanding, recognizing the human impact of every donation.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Safety</h3>
              <p>We maintain rigorous safety standards for our donors, recipients, and blood products.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-microscope"></i>
              </div>
              <h3>Excellence</h3>
              <p>We pursue the highest quality in all aspects of our operations, from collection to distribution.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Community</h3>
              <p>We foster a sense of community among donors, recipients, healthcare providers, and staff.</p>
            </div>
          </div>
        </section>
        
        <section className="team-section">
          <h2>Our Team</h2>
          <p className="team-intro">
            Our dedicated team of healthcare professionals, technicians, and support staff work together to ensure the highest standards of blood collection, processing, and distribution.
          </p>
          
          <div className="team-members">
            <div className="team-member">
              <div className="member-image member-1"></div>
              <h3>Dr. Rajesh Kumar</h3>
              <p className="member-title">Medical Director</p>
              <p className="member-bio">Dr. Kumar has over 15 years of experience in transfusion medicine and has been with our organization since its inception.</p>
            </div>
            
            <div className="team-member">
              <div className="member-image member-2"></div>
              <h3>Priya Sharma</h3>
              <p className="member-title">Operations Manager</p>
              <p className="member-bio">Priya oversees the day-to-day operations of our blood bank, ensuring smooth functioning of all departments.</p>
            </div>
            
            <div className="team-member">
              <div className="member-image member-3"></div>
              <h3>Dr. Ananya Patel</h3>
              <p className="member-title">Lab Director</p>
              <p className="member-bio">Dr. Patel leads our laboratory team, ensuring all blood products meet rigorous safety and quality standards.</p>
            </div>
            
            <div className="team-member">
              <div className="member-image member-4"></div>
              <h3>Vikram Singh</h3>
              <p className="member-title">Community Outreach Coordinator</p>
              <p className="member-bio">Vikram organizes blood donation camps and awareness programs throughout the community.</p>
            </div>
          </div>
        </section>
        
        <section className="impact-section">
          <h2>Our Impact</h2>
          
          <div className="stats-container">
            <div className="stat-box">
              <div className="stat-number">50,000+</div>
              <div className="stat-label">Donations Collected</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-number">30+</div>
              <div className="stat-label">Hospitals Served</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Lives Saved</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-number">200+</div>
              <div className="stat-label">Blood Donation Camps</div>
            </div>
          </div>
          
          <div className="testimonial">
            <div className="quote-icon">
              <i className="fas fa-quote-left"></i>
            </div>
            <p className="quote-text">
              "The blood donation I received during my emergency surgery saved my life. I'm forever grateful to the anonymous donor and the efficient blood bank system that made it possible."
            </p>
            <p className="quote-author">- Meera Desai, Recipient</p>
          </div>
        </section>
        
        <section className="contact-section">
          <h2>Connect With Us</h2>
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <p>Near District Hospital, Gajipur, Nalanda, Bihar 805105, India</p>
            </div>
            
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <p>+91 9142552982</p>
            </div>
            
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <p>abhishek842634@gmail.com</p>
            </div>
            
            <div className="contact-item">
              <i className="fas fa-clock"></i>
              <p>Monday - Friday: 9AM - 6PM<br />Weekends: 10AM - 4PM</p>
            </div>
          </div>
          
          <div className="social-links">
            <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
            <a href="#" className="social-link"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;