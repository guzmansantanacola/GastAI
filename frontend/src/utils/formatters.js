// Formatear moneda
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
};

// Formatear fecha
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Formatear fecha corta
export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('es-AR');
};
