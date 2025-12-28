import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer bg-dark text-white py-5">
      <Container>
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-4">
            <h5>GastAi</h5>
            <p>Tu Asistente de Gastos Inteligente</p>
            <div className="social-links">
              <a href="#" className="me-3"><FaFacebook /></a>
              <a href="#" className="me-3"><FaTwitter /></a>
              <a href="#" className="me-3"><FaLinkedin /></a>
              <a href="#" className="me-3"><FaInstagram /></a>
            </div>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <h5>Producto</h5>
            <ul className="list-unstyled">
              <li><a href="#features">Características</a></li>
              <li><a href="#como-funciona">Cómo Funciona</a></li>
              <li><a href="#precios">Precios</a></li>
              <li><a href="#seguridad">Seguridad</a></li>
            </ul>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <h5>Empresa</h5>
            <ul className="list-unstyled">
              <li><a href="#about">Sobre Nosotros</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#contacto">Contacto</a></li>
              <li><a href="#careers">Carreras</a></li>
            </ul>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <h5>Legal</h5>
            <ul className="list-unstyled">
              <li><a href="#privacy">Privacidad</a></li>
              <li><a href="#terms">Términos de Servicio</a></li>
              <li><a href="#cookies">Cookies</a></li>
              <li><a href="#compliance">Cumplimiento</a></li>
            </ul>
          </Col>
        </Row>
        <Row className="border-top pt-4">
          <Col lg={12} className="text-center">
            <p className="mb-0">&copy; 2025 GastAi. Todos los derechos reservados.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
