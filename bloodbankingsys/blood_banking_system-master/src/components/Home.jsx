import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { loggedIn } = useContext(AuthContext);

  const handleClick = (path) => {
    if (loggedIn) navigate(path);
    else navigate("/login");
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <h1>Give the gift of life</h1>
            <h2>Donate Blood, Save Lives</h2>
            <p className="hero-subtitle">
              Join our community of life savers. Every donation can help save up to three lives.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary hero-btn" onClick={() => handleClick("/donar")}>
                Donate Now
              </button>
              <button className="btn btn-outline hero-btn" onClick={() => handleClick("/request")}>
                Request Blood
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img src="/blood-drop-logo.svg" alt="Life Savers" />
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Lives Saved</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">Regular Donors</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Hospital Partners</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Safety Record</div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="container">
          <h2 className="section-heading">Our Services</h2>
          <div className="services-grid">
            <div className="service-card" onClick={() => handleClick("/donar")}>
              <div className="service-img">
                <img src="/donation1.jpeg.jpg" alt="Register as Donor" />
              </div>
              <div className="service-content">
                <h3>Become a Donor</h3>
                <p>Join our community of life-savers and help those in need with your blood donation.</p>
                <button className="btn btn-outline">Learn More</button>
              </div>
            </div>

            <div className="service-card" onClick={() => handleClick("/request")}>
              <div className="service-img">
                <img src="/donation2.jpg" alt="Request Blood" />
              </div>
              <div className="service-content">
                <h3>Request Blood</h3>
                <p>Need blood for a medical procedure? Submit your request specifying type and urgency.</p>
                <button className="btn btn-outline">Request Now</button>
              </div>
            </div>

            <div className="service-card" onClick={() => navigate("/blood-compatibility")}>
              <div className="service-img">
                <img src="/donation3.jpg" alt="Blood Compatibility" />
              </div>
              <div className="service-content">
                <h3>Blood Compatibility</h3>
                <p>Learn about blood types and compatibility for transfusions and donations.</p>
                <button className="btn btn-outline">Check Compatibility</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Every Donation Counts</h2>
            <p>Your single donation can save up to three lives. Join our mission to ensure blood is available for those who need it most.</p>
            <button className="btn btn-primary" onClick={() => handleClick("/donar")}>Become a Donor Today</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
