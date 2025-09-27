import React from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <div className="container">
        <h1 className="page-title">Privacy Policy</h1>
        
        <div className="policy-content">
          <div className="last-updated">
            <i className="fas fa-calendar-alt"></i> Last Updated: September 20, 2025
          </div>
          
          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to the Blood Banking System. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. We respect your privacy and are committed to protecting your personal data.
            </p>
            <p>
              Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with our policies, please do not access or use our services.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>2. Information We Collect</h2>
            <p>We collect several types of information from and about our users, including:</p>
            
            <h3>2.1 Personal Information</h3>
            <ul>
              <li>Contact information (name, email address, phone number, address)</li>
              <li>Demographic information (date of birth, gender)</li>
              <li>Health information (blood type, medical history relevant to blood donation)</li>
              <li>Government-issued identification numbers (as required by health regulations)</li>
              <li>Login credentials</li>
            </ul>
            
            <h3>2.2 Technical Information</h3>
            <ul>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Operating system</li>
              <li>Time zone setting and location</li>
              <li>Cookie data</li>
            </ul>
          </section>
          
          <section className="policy-section">
            <h2>3. How We Collect Information</h2>
            <p>We collect information through:</p>
            <ul>
              <li>Direct interactions (registration forms, donation records, etc.)</li>
              <li>Automated technologies or interactions (cookies, server logs)</li>
              <li>Third parties or publicly available sources (hospitals, health organizations)</li>
            </ul>
          </section>
          
          <section className="policy-section">
            <h2>4. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul>
              <li>To register and maintain your account</li>
              <li>To manage blood donation appointments and records</li>
              <li>To match donors with recipients</li>
              <li>To communicate important information about donations, appointments, and emergencies</li>
              <li>To provide and improve our services</li>
              <li>To ensure the safety and quality of blood products</li>
              <li>To comply with legal and regulatory requirements</li>
              <li>To analyze usage patterns and optimize our platform</li>
            </ul>
          </section>
          
          <section className="policy-section">
            <h2>5. Disclosure of Your Information</h2>
            <p>We may disclose your personal information to:</p>
            <ul>
              <li>Healthcare providers and hospitals for blood transfusion purposes</li>
              <li>Health authorities for regulatory compliance</li>
              <li>Service providers who perform functions on our behalf</li>
              <li>Law enforcement agencies when required by law</li>
            </ul>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to outside parties without your consent, except as outlined in this Privacy Policy.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>6. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul>
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication procedures</li>
              <li>Secure storage of physical documents</li>
              <li>Staff training on data protection</li>
            </ul>
            <p>
              While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security. No method of electronic transmission or storage is 100% secure.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Health-related information may be subject to specific retention periods as mandated by healthcare regulations.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>8. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Restrict or object to our processing of your data</li>
              <li>Request transfer of your data to another organization</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the details provided below.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>9. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us so that we can delete such information.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>10. Changes to Our Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. Any changes will be posted on this page with a revised "Last Updated" date. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>11. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> abhishek842634@gmail.com</p>
              <p><strong>Phone:</strong> +91 9142552982</p>
              <p><strong>Address:</strong> Near District Hospital, Gajipur, Nalanda, Bihar 805105, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;