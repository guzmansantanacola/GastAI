import React, { useState } from 'react';
import { Container, Nav } from 'react-bootstrap';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaHome, FaWallet, FaChartBar, FaRobot, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implementar lógica de logout
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-brand">GastAi</h2>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </button>
        </div>

        <Nav className="flex-column sidebar-nav">
          <NavLink to="/dashboard" className="sidebar-link">
            <FaHome className="sidebar-icon" />
            <span className="sidebar-text">Dashboard</span>
          </NavLink>
          
          <NavLink to="/dashboard/transactions" className="sidebar-link">
            <FaWallet className="sidebar-icon" />
            <span className="sidebar-text">Transacciones</span>
          </NavLink>
          
          <NavLink to="/dashboard/statistics" className="sidebar-link">
            <FaChartBar className="sidebar-icon" />
            <span className="sidebar-text">Estadísticas</span>
          </NavLink>
          
          <NavLink to="/dashboard/recommendations" className="sidebar-link">
            <FaRobot className="sidebar-icon" />
            <span className="sidebar-text">IA Recomendaciones</span>
          </NavLink>
          
          <NavLink to="/dashboard/profile" className="sidebar-link">
            <FaUser className="sidebar-icon" />
            <span className="sidebar-text">Perfil</span>
          </NavLink>
        </Nav>

        <div className="sidebar-footer">
          <button className="sidebar-link logout-link" onClick={handleLogout}>
            <FaSignOutAlt className="sidebar-icon" />
            <span className="sidebar-text">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <Container fluid className="p-4">
          <Outlet />
        </Container>
      </main>
    </div>
  );
}

export default DashboardLayout;
