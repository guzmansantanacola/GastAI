import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaArrowLeft } from 'react-icons/fa';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrar con backend
    console.log('Registro:', formData);
  };

  return (
    <div className="login-page">
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="login-card">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Volver al inicio
          </Link>
          
          <div className="login-header text-center mb-4">
            <h1 className="login-title">GastAi</h1>
            <p className="login-subtitle">Crea tu cuenta para comenzar</p>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label className="form-label-custom">
                <FaUser className="me-2" />
                Nombre Completo
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-custom"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label className="form-label-custom">
                <FaEnvelope className="me-2" />
                Correo Electrónico
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-custom"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label className="form-label-custom">
                <FaLock className="me-2" />
                Contraseña
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-custom"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formConfirmPassword">
              <Form.Label className="form-label-custom">
                <FaLock className="me-2" />
                Confirmar Contraseña
              </Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="input-custom"
              />
            </Form.Group>

            <Button type="submit" className="w-100 btn-login mb-3">
              Crear Cuenta
            </Button>
          </Form>

          <div className="text-center mt-4">
            <p className="register-text">
              ¿Ya tienes cuenta? <Link to="/login" className="register-link">Inicia sesión aquí</Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Register;
