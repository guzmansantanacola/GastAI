import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { FaCalendar, FaDollarSign, FaTag, FaFileAlt } from 'react-icons/fa';

function TransactionModal({ show, onHide, onSave, transaction, categories }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category_id: '',
    is_monthly: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      // Editar transacción existente
      setFormData({
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description || '',
        date: transaction.date,
        category_id: transaction.category_id,
        is_monthly: transaction.is_monthly || false
      });
    } else {
      // Nueva transacción
      setFormData({
        type: 'expense',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        category_id: '',
        is_monthly: false
      });
    }
  }, [transaction, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSave(formData);
      onHide();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar categorías según el tipo seleccionado
  const filteredCategories = categories?.filter(cat => cat.type === formData.type) || [];

  return (
    <Modal show={show} onHide={onHide} centered className="transaction-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          {transaction ? 'Editar' : 'Nueva'} Transacción
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Tipo de Transacción */}
          <Form.Group className="mb-3">
            <Form.Label>Tipo</Form.Label>
            <div className="d-flex gap-2">
              <Button
                type="button"
                variant={formData.type === 'expense' ? 'danger' : 'outline-danger'}
                className="flex-fill"
                onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category_id: '' }))}
              >
                💸 Gasto
              </Button>
              <Button
                type="button"
                variant={formData.type === 'income' ? 'success' : 'outline-success'}
                className="flex-fill"
                onClick={() => setFormData(prev => ({ ...prev, type: 'income', category_id: '' }))}
              >
                💰 Ingreso
              </Button>
            </div>
          </Form.Group>

          <Row>
            {/* Monto */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaDollarSign className="me-2" />
                  Monto
                </Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  required
                  className="input-custom"
                />
              </Form.Group>
            </Col>

            {/* Fecha */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaCalendar className="me-2" />
                  Fecha
                </Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="input-custom"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Categoría */}
          <Form.Group className="mb-3">
            <Form.Label>
              <FaTag className="me-2" />
              Categoría
            </Form.Label>
            <Form.Select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className="input-custom"
            >
              <option value="">Seleccionar categoría...</option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Descripción */}
          <Form.Group className="mb-3">
            <Form.Label>
              <FaFileAlt className="me-2" />
              Descripción (Opcional)
            </Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Añade una nota..."
              rows={3}
              className="input-custom"
            />
          </Form.Group>

          {/* Transacción Mensual */}
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="is-monthly-switch"
              name="is_monthly"
              label="¿Es una transacción mensual recurrente?"
              checked={formData.is_monthly}
              onChange={(e) => setFormData(prev => ({ ...prev, is_monthly: e.target.checked }))}
            />
            <Form.Text className="text-muted">
              Las transacciones mensuales se cargarán automáticamente cada mes.
            </Form.Text>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant={formData.type === 'expense' ? 'danger' : 'success'}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (transaction ? 'Actualizar' : 'Guardar')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default TransactionModal;
