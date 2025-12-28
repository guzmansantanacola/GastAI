import React, { useEffect, useRef } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Chart from 'chart.js/auto';

function Statistics() {
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  // TODO: Reemplazar con datos reales del backend

  useEffect(() => {
    // Pie Chart
    if (pieChartRef.current) {
      const ctx = pieChartRef.current.getContext('2d');
      
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }

      pieChartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 'Otros'],
          datasets: [{
            data: [35, 20, 15, 20, 10],
            backgroundColor: [
              'rgba(6, 182, 212, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(147, 51, 234, 0.8)',
              'rgba(236, 72, 153, 0.8)',
              'rgba(168, 85, 247, 0.8)'
            ],
            borderColor: [
              'rgb(6, 182, 212)',
              'rgb(59, 130, 246)',
              'rgb(147, 51, 234)',
              'rgb(236, 72, 153)',
              'rgb(168, 85, 247)'
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: 'rgba(255, 255, 255, 0.8)'
              }
            }
          }
        }
      });
    }

    // Bar Chart
    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext('2d');
      
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }

      barChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Gastos',
              data: [3200, 2800, 3500, 3100, 2900, 3200],
              backgroundColor: 'rgba(6, 182, 212, 0.8)',
              borderColor: 'rgb(6, 182, 212)',
              borderWidth: 2
            },
            {
              label: 'Ingresos',
              data: [5000, 5000, 5200, 5000, 5100, 5000],
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: 'rgba(255, 255, 255, 0.8)'
              }
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
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="statistics-page">
      <h1 className="page-title">Estadísticas</h1>
      <p className="page-subtitle">Análisis detallado de tus finanzas</p>

      <Row className="mb-4">
        <Col lg={6} className="mb-4">
          <Card className="chart-card">
            <Card.Body>
              <h5 className="card-title">Gastos por Categoría</h5>
              <div style={{ height: '300px' }}>
                <canvas ref={pieChartRef}></canvas>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="chart-card">
            <Card.Body>
              <h5 className="card-title">Comparativa Mensual</h5>
              <div style={{ height: '300px' }}>
                <canvas ref={barChartRef}></canvas>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Summary Stats */}
      <Row>
        <Col md={4} className="mb-3">
          <Card className="summary-card">
            <Card.Body>
              <h6 className="summary-label">Promedio Mensual</h6>
              <h3 className="summary-value">$3,117</h3>
              <p className="summary-change positive">+5% vs mes anterior</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="summary-card">
            <Card.Body>
              <h6 className="summary-label">Mayor Gasto</h6>
              <h3 className="summary-value">$1,250</h3>
              <p className="summary-detail">Supermercado</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="summary-card">
            <Card.Body>
              <h6 className="summary-label">Categoría Dominante</h6>
              <h3 className="summary-value">35%</h3>
              <p className="summary-detail">Alimentación</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Statistics;
