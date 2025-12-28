import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUser, FaFileAlt, FaRobot, FaChartBar } from 'react-icons/fa';

function HowItWorksSection() {
  const steps = [
    {
      icon: <FaUser />,
      step: '1',
      title: 'Crea tu Cuenta',
      description: 'Regístrate en segundos con tu correo electrónico'
    },
    {
      icon: <FaFileAlt />,
      step: '2',
      title: 'Registra tus Gastos',
      description: 'Añade gastos manualmente o importa un archivo CSV'
    },
    {
      icon: <FaRobot />,
      step: '3',
      title: 'IA Analiza',
      description: 'Categoriza automáticamente y detecta patrones de gasto'
    },
    {
      icon: <FaChartBar />,
      step: '4',
      title: 'Recibe Recomendaciones',
      description: 'Consejos personalizados y metas para ahorrar'
    }
  ];

  return (
    <section id="como-funciona" className="how-it-works-section py-5">
      <Container>
        <Row className="mb-5">
          <Col lg={12} className="text-center">
            <h2>¿Cómo Funciona?</h2>
            <p className="lead">Empieza en 4 sencillos pasos</p>
          </Col>
        </Row>
        <Row>
          {steps.map((step, index) => (
            <Col lg={3} md={6} key={index} className="mb-4">
              <div className="step-card text-center">
                <div className="step-icon mb-3">
                  {step.icon}
                  <div className="step-number">{step.step}</div>
                </div>
                <h5>{step.title}</h5>
                <p>{step.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default HowItWorksSection;
