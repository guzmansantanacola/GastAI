import React, { useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaSave } from 'react-icons/fa';

function Profile() {
  const [formData, setFormData] = useState({
    name: 'Juan Pérez',
    email: 'juan@example.com',
    currentPassword: '',
    newPassword: '',
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
    // TODO: Implementar actualización de perfil
    console.log('Actualizar perfil:', formData);
  };

  return (
    <div className="profile-page">
      <h1 className="page-title">Mi Perfil</h1>
      <p className="page-subtitle">Gestiona tu información personal y configuración</p>

      <Row>
        <Col lg={8}>
          <Card className="profile-card mb-4">
            <Card.Body>
              <h5 className="card-title mb-4">Información Personal</h5>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="profile-label">
                    <FaUser className="me-2" />
                    Nombre Completo
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="profile-input"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="profile-label">
                    <FaEnvelope className="me-2" />
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="profile-input"
                  />
                </Form.Group>

                <hr className="my-4" />

                <h5 className="card-title mb-4">Cambiar Contraseña</h5>

                <Form.Group className="mb-3">
                  <Form.Label className="profile-label">
                    <FaLock className="me-2" />
                    Contraseña Actual
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="profile-input"
                    placeholder="••••••••"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="profile-label">
                    <FaLock className="me-2" />
                    Nueva Contraseña
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="profile-input"
                    placeholder="••••••••"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="profile-label">
                    <FaLock className="me-2" />
                    Confirmar Nueva Contraseña
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="profile-input"
                    placeholder="••••••••"
                  />
                </Form.Group>

                <Button type="submit" className="btn-save">
                  <FaSave className="me-2" />
                  Guardar Cambios
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="profile-stats-card mb-4">
            <Card.Body>
              <h5 className="card-title mb-4">Estadísticas de Usuario</h5>
              <div className="user-stat">
                <span className="stat-label">Miembro desde</span>
                <span className="stat-value">Enero 2024</span>
              </div>
              <div className="user-stat">
                <span className="stat-label">Transacciones registradas</span>
                <span className="stat-value">142</span>
              </div>
              <div className="user-stat">
                <span className="stat-label">Categorías activas</span>
                <span className="stat-value">8</span>
              </div>
              <div className="user-stat">
                <span className="stat-label">Ahorro acumulado</span>
                <span className="stat-value">$4,200</span>
              </div>
            </Card.Body>
          </Card>

          <Card className="danger-zone-card">
            <Card.Body>
              <h5 className="card-title text-danger mb-3">Zona de Peligro</h5>
              <p className="text-muted small mb-3">
                Estas acciones son permanentes y no se pueden deshacer.
              </p>
              <Button variant="outline-danger" className="w-100">
                Eliminar Cuenta
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Profile;
