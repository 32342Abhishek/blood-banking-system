import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <div className="footer-logo">
              <img src="/blood-drop-logo.svg" alt="Blood Banking System" />
              <h3>Blood Banking System</h3>
              <p>Every Drop Counts. Donate Blood, Save Lives.</p>
              <p className="footer-tagline">Committed to saving lives through safe blood collection, processing, and distribution.</p>
            </div>
            
            <div className="footer-section">
              <h4>Contact Information</h4>
              <address className="footer-contact-info">
                <div className="contact-group">
                  <p><i className="fas fa-map-marker-alt"></i> <strong>Address:</strong></p>
                  <p>Blood Bank Center, Near District Hospital</p>
                  <p>Gajipur, Nalanda, Bihar 805105, India</p>
                </div>
                
                <div className="contact-group">
                  <p><i className="fas fa-phone-alt"></i> <strong>Phone:</strong></p>
                  <p>Main: <span className="phone-number">+91 9142552982</span></p>
                  <p>Emergency: <span className="phone-number">+91 8544058609</span></p>
                </div>
                
                <div className="contact-group">
                  <p><i className="fas fa-envelope"></i> <strong>Email:</strong></p>
                  <p><a href="mailto:abhishek842634@gmail.com">abhishek842634@gmail.com</a></p>
                </div>
              </address>
            </div>
          </div>
          
          <div className="footer-links-container">
            <div className="footer-section links-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/"><i className="fas fa-chevron-right"></i> Home</Link></li>
                <li><Link to="/blood-compatibility"><i className="fas fa-chevron-right"></i> Blood Compatibility</Link></li>
                <li><Link to="/donar"><i className="fas fa-chevron-right"></i> Donate Blood</Link></li>
                <li><Link to="/request"><i className="fas fa-chevron-right"></i> Request Blood</Link></li>
                <li><Link to="/admin"><i className="fas fa-chevron-right"></i> Admin Dashboard</Link></li>
              </ul>
            </div>
            
            <div className="footer-section links-section">
              <h4>Resources</h4>
              <ul>
                <li><Link to="/contact"><i className="fas fa-chevron-right"></i> Contact Us</Link></li>
                <li><Link to="/faq"><i className="fas fa-chevron-right"></i> FAQ</Link></li>
                <li><Link to="/donation-tips"><i className="fas fa-chevron-right"></i> Blood Donation Tips</Link></li>
                <li><Link to="/eligibility-criteria"><i className="fas fa-chevron-right"></i> Eligibility Criteria</Link></li>
                <li><Link to="/privacy-policy"><i className="fas fa-chevron-right"></i> Privacy Policy</Link></li>
                <li><Link to="/about-us"><i className="fas fa-chevron-right"></i> About Us</Link></li>
                <li><Link to="/services"><i className="fas fa-chevron-right"></i> Services</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Location</h4>
              <div className="footer-map">
                <div className="mini-map">
                  <a href="https://www.google.com/maps?q=Gajipur,Nalanda,Bihar,805105" target="_blank" rel="noreferrer">
                    {/* Using a static image that doesn't require API key */}
                    <div className="mini-map-placeholder">
                      <div className="map-icon"><i className="fas fa-map-marker-alt"></i></div>
                      <span>Gajipur, Nalanda, Bihar</span>
                    </div>
                    <div className="map-overlay">
                      <span>View on Google Maps</span>
                    </div>
                  </a>
                </div>
              </div>
              <div className="operating-hours">
                <p><i className="far fa-clock"></i> <strong>Operating Hours:</strong> Mon-Fri: 9AM-6PM | Weekends: 10AM-4PM</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-divider"></div>
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} Blood Banking System. All rights reserved. | Reg. No: BBS-12345</p>
          </div>
          <div className="footer-social">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="https://wa.me/919142552982" target="_blank" rel="noreferrer" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="mailto:abhishek842634@gmail.com" aria-label="Email"><i className="fas fa-envelope"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;