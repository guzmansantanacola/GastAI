import { useState } from 'react'
import './App.css'
import apiClient from './services/api'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Transactions from './pages/Transactions.jsx'
import Statistics from './pages/Statistics.jsx'
import Recommendations from './pages/Recommendations.jsx'
import Profile from './pages/Profile.jsx'

function App() {
  return (
    <div className="container-fluid p-0">
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
