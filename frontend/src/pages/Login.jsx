import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrar con backend
    console.log('Login:', { email, password });
    // Simular login exitoso y navegar al dashboard
    navigate('/dashboard');
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
            <p className="login-subtitle">Inicia sesión para continuar</p>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label className="form-label-custom">
                <FaEnvelope className="me-2" />
                Correo Electrónico
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-custom"
              />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <Form.Check
                type="checkbox"
                label="Recordarme"
                className="remember-check"
              />
              <Link to="/recuperar" className="forgot-link">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button type="submit" className="w-100 btn-login mb-3">
              Iniciar Sesión
            </Button>
          </Form>

          <div className="text-center mt-4">
            <p className="register-text">
              ¿No tienes cuenta? <Link to="/registro" className="register-link">Regístrate aquí</Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Login;
