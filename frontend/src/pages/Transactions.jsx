import React, { useState } from 'react';
import { Row, Col, Card, Table, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';

function Transactions() {
  // TODO: Reemplazar con datos reales del backend
  const [transactions] = useState([
    { id: 1, date: '2024-12-27', description: 'Supermercado', category: 'Alimentación', amount: -1250, type: 'expense' },
    { id: 2, date: '2024-12-26', description: 'Salario', category: 'Ingreso', amount: 5000, type: 'income' },
    { id: 3, date: '2024-12-25', description: 'Netflix', category: 'Entretenimiento', amount: -450, type: 'expense' },
    { id: 4, date: '2024-12-24', description: 'Uber', category: 'Transporte', amount: -320, type: 'expense' },
    { id: 5, date: '2024-12-23', description: 'Farmacia', category: 'Salud', amount: -890, type: 'expense' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const getCategoryBadge = (category) => {
    const colors = {
      'Alimentación': 'success',
      'Ingreso': 'primary',
      'Entretenimiento': 'warning',
      'Transporte': 'info',
      'Salud': 'danger'
    };
    return colors[category] || 'secondary';
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Transacciones</h1>
          <p className="page-subtitle">Gestiona todos tus gastos e ingresos</p>
        </div>
        <Button className="btn-add">
          <FaPlus className="me-2" />
          Agregar Gasto
        </Button>
      </div>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text className="search-icon">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar transacción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select className="filter-select">
            <option>Todas las categorías</option>
            <option>Alimentación</option>
            <option>Transporte</option>
            <option>Entretenimiento</option>
            <option>Salud</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select className="filter-select">
            <option>Este mes</option>
            <option>Mes anterior</option>
            <option>Últimos 3 meses</option>
            <option>Este año</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Transactions Table */}
      <Card className="transactions-card">
        <Card.Body>
          <Table responsive hover className="transactions-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Monto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.date}</td>
                  <td>{transaction.description}</td>
                  <td>
                    <Badge bg={getCategoryBadge(transaction.category)}>
                      {transaction.category}
                    </Badge>
                  </td>
                  <td className={transaction.type === 'income' ? 'amount-income' : 'amount-expense'}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </td>
                  <td>
                    <Button variant="link" className="action-btn">
                      <FaEdit />
                    </Button>
                    <Button variant="link" className="action-btn text-danger">
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Transactions;
