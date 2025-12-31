import React, { useEffect, useRef } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import { statService, transactionService } from '../services/api';
import { useState } from 'react';
function Statistics() {
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  const[Loading, setLoading] = useState(true);
const [stats, setStats] = useState({
  average_monthly_expense: 0,
  highest_expense: { amount: 0, category: '' },
  dominant_category: { name: '', percentage: 0 },
  monthly_change: 0
});

    // Obtener 
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [statsResult] = await Promise.all([
            statService.getStats(),
            transactionService.getAll()
           
          ]);
          setStats(statsResult.data);
          
        } catch (error) {
          console.error('Error al obtener datos:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);
    
    // Actualizar gráficos con datos reales
    useEffect(() => {
      if (Loading || !stats) return;

      // Pie Chart (Gastos por Categoría)
      if (pieChartRef.current && stats.expenses_by_category) {
        const ctx = pieChartRef.current.getContext('2d');
        if (pieChartInstance.current) pieChartInstance.current.destroy();
        const pieLabels = stats.expenses_by_category.map(item => item.category);
        const pieData = stats.expenses_by_category.map(item => item.total);
        const pieColors = stats.expenses_by_category.map(item => item.color || 'rgba(6,182,212,0.8)');
        pieChartInstance.current = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: pieLabels,
            datasets: [{
              data: pieData,
              backgroundColor: pieColors,
              borderColor: pieColors,
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { labels: { color: 'rgba(255,255,255,0.8)' } }
            }
          }
        });
      }

      // Bar Chart (Comparativa Mensual)
      if (barChartRef.current && stats.monthly_expenses && stats.monthly_income) {
        const ctx = barChartRef.current.getContext('2d');
        if (barChartInstance.current) barChartInstance.current.destroy();
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        // Unificar meses de ambos arreglos
        const allMonths = Array.from(new Set([
          ...stats.monthly_expenses.map(e => `${e.year}-${e.month}`),
          ...stats.monthly_income.map(i => `${i.year}-${i.month}`)
        ])).sort();
        const barLabels = allMonths.map(key => {
          const [year, month] = key.split('-');
          return `${monthNames[parseInt(month,10)-1]} ${year}`;
        });
        const barExpenses = allMonths.map(key => {
          const found = stats.monthly_expenses.find(e => `${e.year}-${e.month}` === key);
          return found ? found.total : 0;
        });
        const barIncome = allMonths.map(key => {
          const found = stats.monthly_income.find(i => `${i.year}-${i.month}` === key);
          return found ? found.total : 0;
        });
        barChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: barLabels,
            datasets: [
              {
                label: 'Gastos',
                data: barExpenses,
                backgroundColor: 'rgba(6, 182, 212, 0.8)',
                borderColor: 'rgb(6, 182, 212)',
                borderWidth: 2
              },
              {
                label: 'Ingresos',
                data: barIncome,
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
              legend: { labels: { color: 'rgba(255,255,255,0.8)' } }
            },
            scales: {
              y: {
                grid: { color: 'rgba(255,255,255,0.1)' },
                ticks: { color: 'rgba(255,255,255,0.7)' }
              },
              x: {
                grid: { color: 'rgba(255,255,255,0.1)' },
                ticks: { color: 'rgba(255,255,255,0.7)' }
              }
            }
          }
        });
      }

      return () => {
        if (pieChartInstance.current) pieChartInstance.current.destroy();
        if (barChartInstance.current) barChartInstance.current.destroy();
      };
    }, [stats, Loading]);
    
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
              <h3 className="summary-value">${stats.average_monthly_expense ? stats.average_monthly_expense.toFixed(2) : '0.00'}</h3>
              <p
                className={`summary-change ${
                  stats.monthly_change >= 0 ? 'positive' : 'negative'
                }`}
              >
                {stats.monthly_change >= 0 ? '+' : ''}
                {stats.monthly_change}% vs mes anterior
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="summary-card">
            <Card.Body>
              <h6 className="summary-label">Mayor Gasto</h6>
              <h3 className="summary-value">${stats.highest_expense && stats.highest_expense.amount ? stats.highest_expense.amount : 0}</h3>
              <p className="summary-detail">{stats.highest_expense && stats.highest_expense.category ? stats.highest_expense.category : ''}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="summary-card">
            <Card.Body>
              <h6 className="summary-label">Categoría Dominante</h6>
              <h3 className="summary-value">{stats.dominant_category && stats.dominant_category.percentage ? stats.dominant_category.percentage : 0}%</h3>
              <p className="summary-detail">{stats.dominant_category && stats.dominant_category.name ? stats.dominant_category.name : ''}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Statistics;
