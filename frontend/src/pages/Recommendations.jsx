import React from 'react';
import { Row, Col, Card, Badge, ProgressBar } from 'react-bootstrap';
import { FaRobot, FaLightbulb, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';

function Recommendations() {
  // TODO: Reemplazar con datos reales del backend
  const recommendations = [
    {
      id: 1,
      type: 'warning',
      icon: <FaExclamationTriangle />,
      title: 'Gasto Inusual Detectado',
      description: 'Has gastado $800 más de lo habitual en "Entretenimiento" este mes.',
      impact: 'alto',
      savings: 800
    },
    {
      id: 2,
      type: 'tip',
      icon: <FaLightbulb />,
      title: 'Oportunidad de Ahorro',
      description: 'Reduciendo 2 salidas a comer por semana, podrías ahorrar hasta $600/mes.',
      impact: 'medio',
      savings: 600
    },
    {
      id: 3,
      type: 'insight',
      icon: <FaChartLine />,
      title: 'Patrón Identificado',
      description: 'Tus gastos en transporte aumentan un 30% los fines de semana.',
      impact: 'bajo',
      savings: 0
    },
    {
      id: 4,
      type: 'tip',
      icon: <FaLightbulb />,
      title: 'Meta Sugerida',
      description: 'Con tu ingreso actual, podrías ahorrar $1000 mensuales sin afectar tu estilo de vida.',
      impact: 'alto',
      savings: 1000
    }
  ];

  const patterns = [
    { category: 'Alimentación', trend: 'estable', change: '+2%' },
    { category: 'Transporte', trend: 'aumentando', change: '+15%' },
    { category: 'Entretenimiento', trend: 'disminuyendo', change: '-8%' },
    { category: 'Salud', trend: 'estable', change: '+1%' }
  ];

  const getImpactBadge = (impact) => {
    const colors = {
      'alto': 'danger',
      'medio': 'warning',
      'bajo': 'info'
    };
    return colors[impact] || 'secondary';
  };

  const getTrendColor = (trend) => {
    const colors = {
      'estable': 'success',
      'aumentando': 'danger',
      'disminuyendo': 'info'
    };
    return colors[trend] || 'secondary';
  };

  return (
    <div className="recommendations-page">
      <div className="page-header-ai">
        <FaRobot className="ai-icon-large" />
        <div>
          <h1 className="page-title">Recomendaciones IA</h1>
          <p className="page-subtitle">Análisis inteligente de tus hábitos financieros</p>
        </div>
      </div>

      {/* Savings Potential */}
      <Card className="savings-card mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              <h4 className="savings-title">Potencial de Ahorro Mensual</h4>
              <h2 className="savings-amount">$1,400</h2>
              <p className="savings-description">
                Siguiendo estas recomendaciones podrías ahorrar hasta un 28% de tus gastos mensuales
              </p>
            </Col>
            <Col md={4}>
              <div className="savings-progress">
                <ProgressBar 
                  now={28} 
                  label="28%"
                  variant="success"
                  className="custom-progress"
                />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Recommendations Cards */}
      <Row className="mb-4">
        {recommendations.map(rec => (
          <Col lg={6} key={rec.id} className="mb-3">
            <Card className={`recommendation-card ${rec.type}`}>
              <Card.Body>
                <div className="recommendation-header">
                  <div className="recommendation-icon">{rec.icon}</div>
                  <Badge bg={getImpactBadge(rec.impact)} className="impact-badge">
                    Impacto {rec.impact}
                  </Badge>
                </div>
                <h5 className="recommendation-title">{rec.title}</h5>
                <p className="recommendation-description">{rec.description}</p>
                {rec.savings > 0 && (
                  <div className="recommendation-savings">
                    💰 Ahorro potencial: <strong>${rec.savings}</strong>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Spending Patterns */}
      <Card className="patterns-card">
        <Card.Body>
          <h5 className="card-title mb-4">Patrones de Gasto Detectados</h5>
          <Row>
            {patterns.map((pattern, index) => (
              <Col md={6} lg={3} key={index} className="mb-3">
                <div className="pattern-item">
                  <h6 className="pattern-category">{pattern.category}</h6>
                  <Badge bg={getTrendColor(pattern.trend)} className="trend-badge">
                    {pattern.trend}
                  </Badge>
                  <p className="pattern-change">{pattern.change}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Recommendations;
