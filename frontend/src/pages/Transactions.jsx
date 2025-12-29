import React, { useState } from 'react';
import { useEffect } from 'react';
import { Row, Col, Card, Table, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import TransactionModal from '../components/modals/TransactionModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import { categoryService } from '../services/api';


function Transactions() {
  // TODO: Reemplazar con datos reales del backend
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2024-12-27', description: 'Supermercado', category: 'Alimentación', category_id: 1, amount: 1250, type: 'expense' },
    { id: 2, date: '2024-12-26', description: 'Salario', category: 'Ingreso', category_id: 9, amount: 5000, type: 'income' },
    { id: 3, date: '2024-12-25', description: 'Netflix', category: 'Entretenimiento', category_id: 3, amount: 450, type: 'expense' },
    { id: 4, date: '2024-12-24', description: 'Uber', category: 'Transporte', category_id: 2, amount: 320, type: 'expense' },
    { id: 5, date: '2024-12-23', description: 'Farmacia', category: 'Salud', category_id: 4, amount: 890, type: 'expense' }
  ]);

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Obtener categorías del backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await categoryService.getAll();
        setCategories(result.data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };
    fetchCategories();
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setShowModal(true);
  };

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleSaveTransaction = async (formData) => {
    // TODO: Guardar en backend
    console.log('Guardando transacción:', formData);
    
    if (selectedTransaction) {
      // Editar
      setTransactions(prev => prev.map(t => 
        t.id === selectedTransaction.id ? { ...t, ...formData } : t
      ));
    } else {
      // Crear nueva
      const newTransaction = {
        id: Date.now(),
        ...formData
      };
      setTransactions(prev => [newTransaction, ...prev]);
    }
  };

  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    // TODO: Eliminar en backend
    console.log('Eliminando transacción:', selectedTransaction.id);
    
    setTimeout(() => {
      setTransactions(prev => prev.filter(t => t.id !== selectedTransaction.id));
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setSelectedTransaction(null);
    }, 500);
  };

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
        <Button className="btn-add" id="add-transaction-btn" onClick={handleAddTransaction}>
          <FaPlus className="me-2" />
          Agregar Transacción
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
                    {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                  </td>
                  <td>
                    <Button 
                      variant="link" 
                      className="action-btn"
                      onClick={() => handleEditTransaction(transaction)}
                    >
                      <FaEdit />
                    </Button>
                    <Button 
                      variant="link" 
                      className="action-btn text-danger"
                      onClick={() => handleDeleteClick(transaction)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modales */}
      <TransactionModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSaveTransaction}
        transaction={selectedTransaction}
        categories={categories}
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Transacción"
        message={`¿Estás seguro de que deseas eliminar la transacción "${selectedTransaction?.description}"?`}
        loading={deleteLoading}
      />
    </div>
  );
}

export default Transactions;
