import React, { useEffect, useRef } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown, FaWallet, FaCalendar } from 'react-icons/fa';
import Chart from 'chart.js/auto';

function Dashboard() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // TODO: Reemplazar con datos reales del backend
  const stats = {
    balance: 12500,
    monthExpenses: 3200,
    monthIncome: 5000,
    lastMonth: 3500
  };

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      // Destruir chart anterior si existe
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [{
            label: 'Gastos',
            data: [120, 190, 300, 500, 200, 300, 450],
            borderColor: 'rgb(6, 182, 212)',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Resumen de tus finanzas</p>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon balance">
                <FaWallet />
              </div>
              <h6 className="stat-label">Balance Total</h6>
              <h3 className="stat-value">${stats.balance.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon expense">
                <FaArrowDown />
              </div>
              <h6 className="stat-label">Gastos del Mes</h6>
              <h3 className="stat-value">${stats.monthExpenses.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon income">
                <FaArrowUp />
              </div>
              <h6 className="stat-label">Ingresos del Mes</h6>
              <h3 className="stat-value">${stats.monthIncome.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon month">
                <FaCalendar />
              </div>
              <h6 className="stat-label">Mes Anterior</h6>
              <h3 className="stat-value">${stats.lastMonth.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Chart */}
      <Row>
        <Col lg={8} className="mb-4">
          <Card className="chart-card">
            <Card.Body>
              <h5 className="card-title">Gastos de la Semana</h5>
              <div style={{ height: '300px' }}>
                <canvas ref={chartRef}></canvas>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-4">
          <Card className="alerts-card">
            <Card.Body>
              <h5 className="card-title">Alertas IA</h5>
              <div className="alert-item">
                <p className="alert-text">🤖 Detectamos un gasto inusual en "Entretenimiento"</p>
              </div>
              <div className="alert-item">
                <p className="alert-text">💡 Podrías ahorrar $200 este mes reduciendo salidas</p>
              </div>
              <div className="alert-item">
                <p className="alert-text">📊 Estás 15% por debajo de tu promedio mensual</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
