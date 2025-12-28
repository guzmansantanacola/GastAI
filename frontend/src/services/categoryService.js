import api from './api';

// Obtener todas las categorías
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

// Obtener una categoría por ID
export const getCategory = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// Crear nueva categoría
export const createCategory = async (data) => {
  const response = await api.post('/categories', data);
  return response.data;
};

// Actualizar categoría
export const updateCategory = async (id, data) => {
  const response = await api.put(`/categories/${id}`, data);
  return response.data;
};

// Eliminar categoría
export const deleteCategory = async (id) => {
  await api.delete(`/categories/${id}`);
};
