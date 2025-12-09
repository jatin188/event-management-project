import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EventDetails from './pages/EventDetails';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/admin" element={<AdminDashboard/>} />
      <Route path="/event/:id" element={<EventDetails/>} />
      <Route path="/dashboard" element={<UserDashboard/>} />
    </Routes>
  );
}

export default App;
