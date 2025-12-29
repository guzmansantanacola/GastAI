import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

function DeleteConfirmModal({ show, onHide, onConfirm, title, message, loading }) {
  return (
    <Modal show={show} onHide={onHide} centered className="delete-confirm-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <FaExclamationTriangle className="text-warning me-2" />
          {title || 'Confirmar Eliminación'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <p className="mb-0">
          {message || '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.'}
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteConfirmModal;
