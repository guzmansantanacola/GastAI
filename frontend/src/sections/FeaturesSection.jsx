import React from 'react';
import { Container, Row, Col, Card, Carousel, Button } from 'react-bootstrap';
import { FaChartLine, FaBrain, FaBell, FaShieldAlt, FaFileAlt, FaSync } from 'react-icons/fa';

function FeaturesSection() {
  const features = [
    {
      icon: <FaBrain />,
      title: 'IA Inteligente',
      description: 'Detecta patrones de gasto y hábitos automáticamente'
    },
    {
      icon: <FaFileAlt />,
      title: 'Categorización Automática',
      description: 'Clasifica tus gastos por categoría sin esfuerzo'
    },
    {
      icon: <FaChartLine />,
      title: 'Presupuestos Inteligentes',
      description: 'Define límites y controla tus gastos por mes'
    },
    {
      icon: <FaBell />,
      title: 'Alertas en Tiempo Real',
      description: 'Recibe avisos cuando te acercas a tus límites'
    },
    {
      icon: <FaChartLine />,
      title: 'Insights y Reportes',
      description: 'Visualiza tendencias y compara períodos de gasto'
    },
    {
      icon: <FaSync />,
      title: 'Recomendaciones IA',
      description: 'Consejos personalizados para ahorrar y cumplir metas'
    }
  ];

  return (
    <section id="features" className="features-section py-5">
      <Container className=''>
        <Row className="features-hero mb-5">
          <Col lg={12} className="text-center p-5 rounded" >
            <h2 className="features-title text-light">Controla tus Gastos con <strong className='title'>GastAi</strong></h2>
            <p className="features-lead lead text-light">Herramientas inteligentes enfocadas en tu día a día</p>

            <Button className="btn btn-sm" >
              Comienza Gratis Ahora
            </Button>
  



          </Col>
        </Row>
                <div className="features-scroll-container">
          <div className="features-scroll-track">
            {[...features, ...features].map((feature, index) => (
              <div key={index} className="feature-scroll-item">
                <div className="feature-card p-4 text-center h-100">
                  <div className="feature-icon mb-3">{feature.icon}</div>
                  <h5>{feature.title}</h5>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
      
    </section>
  );
}

export default FeaturesSection;
