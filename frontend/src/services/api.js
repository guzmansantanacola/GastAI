import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para agregar token de autenticación si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Registro
  register: async (userData) => {
    const response = await apiClient.post('/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.confirmPassword,
    });

    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await apiClient.post('/login', credentials);

    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  // Obtener usuario actual
  me: async () => {
    const response = await apiClient.get('/me');
    return response.data;
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  // Obtener usuario del localStorage
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export const categoryService = {
  getAll: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  }
}

export const transactionService = {
  getAll: async () => {
    const response = await apiClient.get('/transactions');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data;
  },

  create: async (transactionData) => {
    const response = await apiClient.post('/transactions', transactionData);
    return response.data;
  },

  update: async (id, transactionData) => {
    const response = await apiClient.put(`/transactions/${id}`, transactionData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/transactions/${id}`);
    return response.data;
  }
};

export const dashboardService = {
  getStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  }
};

export const profileService = {
  getProfile: async () => {
    const response = await apiClient.get('/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.put('/profile', profileData);
    return response.data;
  }
};
export const statService = {
  getStats: async() => {
    const response = await apiClient.get('/stats');
    return response.data;
  }
};

export default apiClient;
