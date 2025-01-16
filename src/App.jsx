import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ServiceForm from './components/ServiceForm';
import RequestForm from './components/RequestForm';
import RatingForm from './components/RatingForm';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Profile from './components/Profile';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/services/new" element={<ServiceForm />} />
          <Route path="/requests/new" element={<RequestForm />} />
          <Route path="/ratings/new" element={<RatingForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;