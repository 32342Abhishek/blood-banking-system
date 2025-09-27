import React, { useContext } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Donar from "./components/Donar";
import Request from "./components/Request";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Register from "./components/Register";
import { AuthContext } from "./components/AuthContext";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import AdminRegister from "./components/AdminRegister";
import BloodInventory from "./components/BloodInventory";
import AppointmentManagement from "./components/AppointmentManagement";
import BloodCompatibility from "./components/BloodCompatibility";
import HospitalIntegration from "./components/HospitalIntegration";
import EligibilityCriteria from "./components/EligibilityCriteria";
import BloodDonationTips from "./components/BloodDonationTips";
import PrivacyPolicy from "./components/PrivacyPolicy";
import AboutUs from "./components/AboutUs";
import Services from "./components/Services";
import FAQ from "./components/FAQ";
import DonorAnalytics from "./components/DonorAnalytics";
import EmergencyNotification from "./components/EmergencyNotification";
import TokenDebugger from "./components/TokenDebugger";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SupportChatbot from "./components/SupportChatbot";

const App = () => {
  const { loggedIn, user } = useContext(AuthContext);
  const location = useLocation();

  // Check if user is admin
  const isAdmin = loggedIn && user?.role === 'ADMIN';
  
  // Check if current route is login or register page
  const isAuthPage = ['/login', '/register', '/admin-login', '/admin-register'].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blood-compatibility" element={<BloodCompatibility />} />
          <Route path="/eligibility-criteria" element={<EligibilityCriteria />} />
          <Route path="/donation-tips" element={<BloodDonationTips />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Protected Routes */}
          <Route path="/donar" element={loggedIn ? <Donar /> : <Navigate to="/login" />} />
          <Route path="/request" element={loggedIn ? <Request /> : <Navigate to="/login" />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin-dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/inventory" element={isAdmin ? <BloodInventory /> : <Navigate to="/login" />} />
          <Route path="/blood-inventory" element={isAdmin ? <BloodInventory /> : <Navigate to="/login" />} />
          <Route path="/schedule-appointment" element={loggedIn ? <AppointmentManagement /> : <Navigate to="/login" />} />
          <Route path="/appointments" element={isAdmin ? <AppointmentManagement /> : <Navigate to="/login" />} />
          <Route path="/hospital-integration" element={isAdmin ? <HospitalIntegration /> : <Navigate to="/login" />} />
          <Route path="/donor-analytics" element={isAdmin ? <DonorAnalytics /> : <Navigate to="/login" />} />
          <Route path="/emergency-notification" element={isAdmin ? <EmergencyNotification /> : <Navigate to="/login" />} />
          <Route path="/token-debugger" element={isAdmin ? <TokenDebugger /> : <Navigate to="/login" />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      {!isAuthPage && <Footer />}
      {/* Support chatbot available on all pages except login/register */}
      {!isAuthPage && <SupportChatbot />}
    </>
  );
};

export default App;
