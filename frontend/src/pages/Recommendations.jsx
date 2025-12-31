import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Badge, ProgressBar } from 'react-bootstrap';
import { FaRobot, FaLightbulb, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';

import { getAIRecommendations } from '../services/aiRecommendations';
import { transactionService } from '../services/api';

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchAIRecommendations() {
      setLoading(true);
      setError(null);
      try {
        // 1. Obtener transacciones del usuario
        const txResult = await transactionService.getAll();
        const txs = txResult.data || [];
        setTransactions(txs);
        // 2. Pasar transacciones a la IA
        const aiRecs = await getAIRecommendations(txs);
        setRecommendations(aiRecs);
      } catch (err) {
        setError('No se pudieron obtener recomendaciones de IA.');
      } finally {
        setLoading(false);
      }
    }
    fetchAIRecommendations();
  }, []);

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

  const iconMap = {
    warning: <FaExclamationTriangle />,
    tip: <FaLightbulb />,
    insight: <FaChartLine />
  };

  // Calcular potencial de ahorro y porcentaje
  const ahorroPotencial = recommendations.reduce((acc, rec) => acc + (rec.savings || 0), 0);
  // Sumar solo gastos (amount < 0 o type === 'expense') del mes actual
  const now = new Date();
  const gastosMes = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    return (
      (tx.type === 'expense' || tx.amount < 0) &&
      txDate.getMonth() === now.getMonth() &&
      txDate.getFullYear() === now.getFullYear()
    );
  });
  const totalGastosMes = gastosMes.reduce((acc, tx) => acc + Math.abs(tx.amount), 0);
  const porcentajeAhorro = totalGastosMes > 0 ? Math.round((ahorroPotencial / totalGastosMes) * 100) : 0;

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
              <h2 className="savings-amount">${ahorroPotencial.toLocaleString()}</h2>
              <p className="savings-description">
                Siguiendo estas recomendaciones podrías ahorrar hasta un {porcentajeAhorro}% de tus gastos mensuales
              </p>
            </Col>
            <Col md={4}>
              <div className="savings-progress">
                <ProgressBar 
                  now={porcentajeAhorro} 
                  label={`${porcentajeAhorro}%`}
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
        {loading && (
          <Col><div>Cargando recomendaciones de IA...</div></Col>
        )}
        {error && (
          <Col><div className="text-danger">{error}</div></Col>
        )}
        {!loading && !error && recommendations.map(rec => (
          <Col lg={6} key={rec.id} className="mb-3">
            <Card className={`recommendation-card ${rec.type}`}>
              <Card.Body>
                <div className="recommendation-header">
                  <div className="recommendation-icon">{iconMap[rec.type] || <FaRobot />}</div>
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
    </div>
  );
}

export default Recommendations;
