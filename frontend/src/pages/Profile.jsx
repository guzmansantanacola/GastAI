import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaSave } from 'react-icons/fa';
import { profileService} from '../services/api';
import { showSuccessAlert } from '../components/common/successAlert';

function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

   useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await profileService.getProfile();
        // El nuevo endpoint devuelve { success: true, data: { id, name, email } }
        setProfile(response.data);
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []); // [] = solo al montar

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await profileService.updateProfile(profile);
      showSuccessAlert('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Error al actualizar el perfil');
    }
  };
  if (loading) return <div>Cargando...</div>;
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
                    value={profile.name}
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
                    value={profile.email}
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
                    value={profile.newPassword}
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
                    value={profile.confirmPassword}
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
                <span className="stat-value">{new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
              <div className="user-stat">
                <span className="stat-label">Transacciones registradas</span>
                <span className="stat-value">{profile.total_transactions || 0}</span>

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
