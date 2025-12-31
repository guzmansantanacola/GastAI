import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { authService } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.login({ email, password });
      toast.success('¡Bienvenido! 🎉', {
        position: 'top-right',
        autoClose: 2000,
      });
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      toast.error(
        err.response?.data?.message || 
        '❌ Error al iniciar sesión. Verifica tus credenciales.',
        {
          position: 'top-right',
          autoClose: 4000,
        }
      );
    } finally {
      setLoading(false);
    }
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
              <Link to="/recuperar-contrasena">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className='text-center'>
              <Button type="submit " disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
            </div>
            
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
