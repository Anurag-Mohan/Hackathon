import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import HotelDashboard from './pages/HotelDashboard';
import ReportPage from './pages/ReportPage';

import Chatbot from './components/Chatbot';
import CursorTrail from './components/CursorTrail';

function App() {
  return (
    <Router>
      <CursorTrail />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register-hotel" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/report" element={<ReportPage />} />

        {/* Protected Routes (Ideally wrapped in PrivateRoute) */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/hotel" element={<HotelDashboard />} />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;
