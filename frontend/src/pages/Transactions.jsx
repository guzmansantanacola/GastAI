import React, { useState } from 'react';
import { useEffect } from 'react';
import { Row, Col, Card, Table, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import TransactionModal from '../components/modals/TransactionModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';

import { categoryService, transactionService } from '../services/api';
import { showSuccessAlert } from '../components/common/successAlert';


function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Obtener categorías y transacciones del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResult, transactionsResult] = await Promise.all([
          categoryService.getAll(),
          transactionService.getAll()
        ]);
        setCategories(categoriesResult.data);
        setTransactions(transactionsResult.data);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
    try {
      if (selectedTransaction) {
        // Editar transacción existente
        const updated = await transactionService.update(selectedTransaction.id, formData);
        setTransactions(prev => prev.map(t => 
          t.id === selectedTransaction.id ? updated.data : t
        ));
        showSuccessAlert('Transacción editada correctamente');
      } else {
        // Crear nueva transacción
        const newTransaction = await transactionService.create(formData);
        setTransactions(prev => [newTransaction.data, ...prev]);
        showSuccessAlert('Transacción creada correctamente');
      }
    } catch (error) {
      console.error('Error al guardar transacción:', error);
      throw error;
    }
  };

  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await transactionService.delete(selectedTransaction.id);
      setTransactions(prev => prev.filter(t => t.id !== selectedTransaction.id));
      setShowDeleteModal(false);
      setSelectedTransaction(null);
      showSuccessAlert('Transacción eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar transacción:', error);
      alert('Error al eliminar la transacción');
    } finally {
      setDeleteLoading(false);
    }
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
          <Table responsive hover className="transactions-table text-dark">
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center">Cargando transacciones...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No hay transacciones registradas</td>
                </tr>
              ) : (
                transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString('es')}</td>
                    <td>
                      {transaction.description || 'Sin descripción'}
                      {transaction.is_monthly && (
                        <Badge bg="info" className="ms-2">Mensual</Badge>
                      )}
                    </td>
                    <td>
                      <Badge bg style={{ backgroundColor: (transaction.category?.color) }}>
                        {transaction.category?.icon} {transaction.category?.name}
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
                ))
              )}
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
