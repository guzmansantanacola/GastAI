import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { authService } from '../services/api';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      toast.error('❌ Las contraseñas no coinciden', {
        position: 'top-right',
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    // Validar longitud mínima de contraseña
    if (formData.password.length < 8) {
      toast.error('❌ La contraseña debe tener al menos 8 caracteres', {
        position: 'top-right',
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      await authService.register(formData);
      toast.success('¡Cuenta creada exitosamente! 🎉', {
        position: 'top-right',
        autoClose: 2000,
      });
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      console.error('Error al registrar:', err);
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.errors?.email?.[0] ||
                       'Error al crear la cuenta. Intenta nuevamente.';
      toast.error(`❌ ${errorMsg}`, {
        position: 'top-right',
        autoClose: 4000,
      });
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

            <Button type="submit" className="w-100 btn-login mb-3" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
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
