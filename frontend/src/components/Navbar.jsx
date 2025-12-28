import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Navbar as BSNavbar, Nav } from 'react-bootstrap';

function Navbar() {
  return (
    <BSNavbar expand="lg" className="navbar-custom" fixed="top">
      <Container fluid className="px-4">
        <BSNavbar.Brand as={NavLink} to="/">
            <h2 className='title'>GastAi</h2>
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Iniciar Sesión</Nav.Link>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;
