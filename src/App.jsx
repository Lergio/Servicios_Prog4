import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ServiceForm from './components/ServiceForm';
import ServiceUpdate from './components/ServiceUpdate';
import ServiceDelete from './components/ServiceDelete';
import RatingForm from './components/RatingForm';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Profile from './components/Profile';
import ServiceRequestModal from './components/ServiceRequestModal';
import RequestsPage from './components/RequestPage';
import RatingsPage from './components/RatingsPage';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/services/new" element={<ServiceForm />} />
          <Route path="/services/update" element={<ServiceUpdate />} />
          <Route path="/services/delete" element={<ServiceDelete />} />
          <Route path="/requests/new" element={<ServiceRequestModal />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/ratings/new" element={<RatingForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ratings" element={<RatingsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
