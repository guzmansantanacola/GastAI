import api from './api';

// Obtener todas las transacciones
export const getTransactions = async () => {
  const response = await api.get('/transactions');
  return response.data;
};

// Obtener una transacción por ID
export const getTransaction = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};

// Crear nueva transacción
export const createTransaction = async (data) => {
  const response = await api.post('/transactions', data);
  return response.data;
};

// Actualizar transacción
export const updateTransaction = async (id, data) => {
  const response = await api.put(`/transactions/${id}`, data);
  return response.data;
};

// Eliminar transacción
export const deleteTransaction = async (id) => {
  await api.delete(`/transactions/${id}`);
};
