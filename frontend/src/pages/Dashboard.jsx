import React, { useEffect, useRef } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown, FaWallet, FaCalendar } from 'react-icons/fa';
import Chart from 'chart.js/auto';
import { dashboardService } from '../services/api';
import { useState } from 'react';

function Dashboard() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

   const [stats, setStats] = useState({
    balance: 0,
    monthExpenses: 0,
    monthIncome: 0,
    lastMonth: 0,
    expensesByCategory: [],
    dailyExpenses: []
  });
    const [loading, setLoading] = useState(true);
   useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // [] = solo se ejecuta al montar el componente

  useEffect(() => {
    if (chartRef.current && stats.dailyExpenses.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      
      // Destruir chart anterior si existe
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Preparar datos del backend
      const labels = stats.dailyExpenses.map(item => {
        const date = new Date(item.day);
        return date.toLocaleDateString('es', { weekday: 'short', day: 'numeric' });
      });
      const data = stats.dailyExpenses.map(item => parseFloat(item.total));

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Gastos',
            data: data,
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
  }, [stats.dailyExpenses]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

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
              <h6 className="stat-label">Gastos del Mes Anterior</h6>
              <h3 className="stat-value">${stats.lastMonth.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Chart */}
      <Row>
        <Col lg={12} className="mb-4">
          <Card className="chart-card">
            <Card.Body>
              <h5 className="card-title">Gastos de la Semana</h5>
              <div style={{ height: '300px' }}>
                <canvas ref={chartRef}></canvas>
              </div>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </div>
  );
}

export default Dashboard;
