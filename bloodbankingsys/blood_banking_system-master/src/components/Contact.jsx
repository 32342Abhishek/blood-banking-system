import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    phone: "",
    subject: "",
    message: "" 
  });
  
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Phone validation (optional but if provided, must be valid)
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 20) {
      newErrors.message = 'Message should be at least 20 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };
  
  const handleSubmit = e => { 
    e.preventDefault();
    
    if (validateForm()) {
      // Form is valid, proceed with submission
      setSubmitStatus({
        submitted: true,
        success: true,
        message: 'Your message has been sent successfully! We will get back to you soon.'
      });
      
      // Reset form
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } else {
      // Form has errors
      setSubmitStatus({
        submitted: true,
        success: false,
        message: 'Please correct the errors in the form.'
      });
    }
  };
  
  const handleWhatsAppRedirect = () => {
    // Format phone number for WhatsApp
    const phoneNumber = '+919142552982'; // Using the provided business number
    const messageText = encodeURIComponent('Hello! I would like to inquire about blood donation.');
    
    // Create WhatsApp API URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${messageText}`;
    
    // Open WhatsApp in a new window/tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="contact-container">
      <div className="hero-banner">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We're here to help with any questions or concerns about blood donation or requests.</p>
        </div>
      </div>
      
      <div className="container contact-content">
        <div className="contact-info">
          <div className="contact-info-item">
            <div className="contact-icon">
              <i className="fa fa-map-marker"></i>
            </div>
            <div>
              <h3>Our Location</h3>
              <p>Blood Center, Gajipur, Nalanda, Bihar, 805105</p>
            </div>
          </div>
          
          <div className="contact-info-item">
            <div className="contact-icon">
              <i className="fa fa-phone"></i>
            </div>
            <div>
              <h3>Phone Number</h3>
              <p>+91 9142552982</p>
              <p>Emergency: +91 8544058609</p>
            </div>
          </div>
          
          <div className="contact-info-item">
            <div className="contact-icon">
              <i className="fa fa-envelope"></i>
            </div>
            <div>
              <h3>Email Address</h3>
              <p><a href="mailto:abhishek842634@gmail.com">abhishek842634@gmail.com</a></p>
              <p><a href="mailto:ak7667042@gmail.com">ak7667042@gmail.com</a></p>
            </div>
          </div>
          
          <div className="contact-info-item whatsapp-item">
            <div className="contact-icon whatsapp-icon">
              <i className="fab fa-whatsapp"></i>
            </div>
            <div>
              <h3>WhatsApp Support</h3>
              <p>Chat with us for immediate assistance</p>
              <button className="whatsapp-button" onClick={handleWhatsAppRedirect}>
                <i className="fab fa-whatsapp"></i> Start Chat
              </button>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Send us a Message</h2>
          <p>If you have any queries or feedback, feel free to reach out!</p>
          
          {submitStatus.submitted && (
            <div className={`submission-message ${submitStatus.success ? 'success' : 'error'}`}>
              {submitStatus.message}
            </div>
          )}
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  id="name"
                  name="name" 
                  placeholder="Your Name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className={errors.name ? 'error-input' : ''}
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address <span className="required">*</span></label>
                <input 
                  type="email" 
                  id="email"
                  name="email" 
                  placeholder="Your Email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className={errors.email ? 'error-input' : ''}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone"
                  name="phone" 
                  placeholder="Your Phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                  className={errors.phone ? 'error-input' : ''}
                />
                {errors.phone && <div className="error-message">{errors.phone}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input 
                  type="text" 
                  id="subject"
                  name="subject" 
                  placeholder="Message Subject" 
                  value={formData.subject} 
                  onChange={handleChange}
                  className={errors.subject ? 'error-input' : ''}
                />
                {errors.subject && <div className="error-message">{errors.subject}</div>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Your Message <span className="required">*</span></label>
              <textarea 
                id="message"
                name="message" 
                placeholder="Type your message here..." 
                value={formData.message} 
                onChange={handleChange}
                className={errors.message ? 'error-input' : ''}
              />
              {errors.message && <div className="error-message">{errors.message}</div>}
            </div>
            
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </div>
      
      <div className="map-container container">
        <h2>Find Us</h2>
        <div className="map-embed">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14390.304546295764!2d85.43119676779261!3d25.129603235949173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f29191dea5052f%3A0x3e5e9956e1852fef!2sGajipur%2C%20Nalanda%2C%20Bihar%20805105!5e0!3m2!1sen!2sin!4v1695623212429!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Blood Bank Location"
            onError={(e) => {
              e.target.style.display = 'none';
              document.getElementById('map-fallback').style.display = 'block';
            }}
          ></iframe>
          <div id="map-fallback" className="map-fallback" style={{ display: 'none' }}>
            <p>Unable to load the map. Please <a href="https://www.google.com/maps?q=Gajipur,Nalanda,Bihar,805105" target="_blank" rel="noreferrer">click here</a> to view our location on Google Maps.</p>
          </div>
        </div>
      </div>
      
      <div className="faq-section container">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>How can I donate blood?</h3>
            <p>You can register as a donor on our website and schedule an appointment at your convenience. Our team will guide you through the donation process.</p>
          </div>
          <div className="faq-item">
            <h3>What are the requirements for blood donation?</h3>
            <p>Generally, you must be at least 18 years old, weigh at least 45kg, be in good health, and have not donated blood in the last 3 months.</p>
          </div>
          <div className="faq-item">
            <h3>How do I request blood in an emergency?</h3>
            <p>You can submit an emergency blood request through our website or contact our 24/7 emergency hotline at +91 9999988888.</p>
          </div>
          <div className="faq-item">
            <h3>Do you organize blood donation camps?</h3>
            <p>Yes, we organize regular blood donation camps. Please contact us for collaboration or to organize a camp at your institution.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
