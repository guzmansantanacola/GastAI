# 📚 Documentación: Sistema de Autenticación GastAi

## 📋 Índice
1. [Resumen General](#resumen-general)
2. [Backend - Laravel](#backend-laravel)
3. [Frontend - React](#frontend-react)
4. [Flujo de Autenticación](#flujo-de-autenticación)
5. [Seguridad](#seguridad)
6. [Testing](#testing)

---

## 🎯 Resumen General

Implementamos un sistema de autenticación completo usando **Laravel Sanctum** para el backend y **React con Axios** para el frontend. El sistema permite:

- ✅ Registro de nuevos usuarios
- ✅ Inicio de sesión (Login)
- ✅ Cierre de sesión (Logout)
- ✅ Protección de rutas mediante tokens
- ✅ Manejo de errores y validaciones

**Tecnologías:**
- Backend: Laravel 12 + Sanctum (autenticación basada en tokens)
- Frontend: React 19 + Axios + React Router
- Base de datos: MySQL
- Comunicación: API REST con JSON

---

## 🔧 Backend - Laravel

### 1. **Instalación y Configuración de Sanctum**

**Paso 1: Instalación**
```bash
composer require laravel/sanctum
```

**Paso 2: Publicar configuración**
```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

**Paso 3: Ejecutar migraciones**
```bash
php artisan migrate
```

Esto crea la tabla `personal_access_tokens` que almacena los tokens de autenticación.

---

### 2. **Modelo User** (`app/Models/User.php`)

Se agregó el trait `HasApiTokens` de Sanctum:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;  // ⬅️ IMPORTANTE

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;  // ⬅️ AGREGADO

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
```

**¿Qué hace `HasApiTokens`?**
- Permite crear tokens con `$user->createToken()`
- Permite eliminar tokens con `$user->tokens()->delete()`
- Habilita la autenticación mediante Sanctum

---

### 3. **AuthController** (`app/Http/Controllers/Api/AuthController.php`)

Este controlador maneja toda la lógica de autenticación.

#### **Método `register()` - Registro de usuarios**

```php
public function register(Request $request)
{
    // 1. Validar datos de entrada
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
    ]);

    // 2. Crear el usuario
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),  // ⬅️ Encripta la contraseña
    ]);

    // 3. Generar token de acceso
    $token = $user->createToken('auth_token')->plainTextToken;

    // 4. Devolver respuesta con usuario y token
    return response()->json([
        'message' => 'Usuario registrado exitosamente',
        'user' => $user,
        'token' => $token,
        'token_type' => 'Bearer',
    ], 201);
}
```

**Explicación:**
- `Hash::make()`: Encripta la contraseña antes de guardarla (nunca guardamos contraseñas en texto plano)
- `confirmed`: Valida que `password_confirmation` coincida con `password`
- `unique:users`: Verifica que el email no esté registrado
- `createToken()`: Genera un token único para el usuario
- Código de respuesta `201`: Indica que se creó un recurso exitosamente

---

#### **Método `login()` - Inicio de sesión**

```php
public function login(Request $request)
{
    // 1. Validar datos
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    // 2. Buscar usuario por email
    $user = User::where('email', $request->email)->first();

    // 3. Verificar que existe y la contraseña es correcta
    if (!$user || !Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Las credenciales son incorrectas.'],
        ]);
    }

    // 4. Eliminar tokens anteriores (opcional, para una sola sesión activa)
    $user->tokens()->delete();

    // 5. Crear nuevo token
    $token = $user->createToken('auth_token')->plainTextToken;

    // 6. Devolver respuesta
    return response()->json([
        'message' => 'Login exitoso',
        'user' => $user,
        'token' => $token,
        'token_type' => 'Bearer',
    ]);
}
```

**Explicación:**
- `Hash::check()`: Compara la contraseña ingresada con la encriptada en la BD
- `tokens()->delete()`: Elimina tokens antiguos para permitir solo una sesión activa
- `ValidationException`: Devuelve un error 422 con el mensaje específico

---

#### **Método `logout()` - Cierre de sesión**

```php
public function logout(Request $request)
{
    // Elimina solo el token actual del usuario autenticado
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Logout exitoso',
    ]);
}
```

**Explicación:**
- `$request->user()`: Obtiene el usuario autenticado mediante Sanctum
- `currentAccessToken()`: Obtiene el token usado en la petición actual
- Solo elimina el token actual, no todos los tokens del usuario

---

#### **Método `me()` - Obtener usuario autenticado**

```php
public function me(Request $request)
{
    return response()->json([
        'user' => $request->user(),
    ]);
}
```

**Explicación:**
- Devuelve los datos del usuario que está autenticado
- Útil para obtener información actualizada del perfil

---

### 4. **Rutas API** (`routes/api.php`)

```php
<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// ========================================
// RUTAS PÚBLICAS (No requieren token)
// ========================================

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ========================================
// RUTAS PROTEGIDAS (Requieren token)
// ========================================

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
```

**Explicación de rutas:**

| Método | Endpoint | Descripción | Requiere Token |
|--------|----------|-------------|----------------|
| POST | `/api/register` | Crear nueva cuenta | No |
| POST | `/api/login` | Iniciar sesión | No |
| GET | `/api/me` | Obtener usuario actual | Sí |
| POST | `/api/logout` | Cerrar sesión | Sí |

**¿Qué hace `middleware('auth:sanctum')`?**
- Verifica que la petición tenga un token válido en el header `Authorization: Bearer {token}`
- Si no hay token o es inválido, devuelve error 401 (No autorizado)
- Si el token es válido, permite el acceso a la ruta

---

### 5. **Configuración CORS** (`config/cors.php`)

Para que el frontend (puerto 5173) pueda comunicarse con el backend (puerto 8000), configuramos CORS:

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173',      // Frontend local
        'http://127.0.0.1:5173'
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

**Explicación:**
- `paths`: Rutas donde se aplica CORS
- `allowed_origins`: Orígenes permitidos (frontend)
- `allowed_methods`: Métodos HTTP permitidos (GET, POST, etc.)
- `allowed_headers`: Headers permitidos en las peticiones
- `supports_credentials`: Permite enviar cookies y tokens

---

### 6. **Middleware CORS** (`bootstrap/app.php`)

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->validateCsrfTokens(except: [
        'api/*',  // Las APIs no usan CSRF
    ]);
    
    // Configurar CORS para rutas API
    $middleware->api(prepend: [
        \Illuminate\Http\Middleware\HandleCors::class,
    ]);
})
```

**Explicación:**
- Desactiva CSRF para rutas API (usamos tokens en su lugar)
- Agrega el middleware de CORS a todas las rutas API

---

## ⚛️ Frontend - React

### 1. **Servicio API** (`src/services/api.js`)

Este archivo centraliza toda la comunicación con el backend.

```javascript
import axios from 'axios';

// URL del backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,  // Permite enviar cookies
});
```

#### **Interceptor de Peticiones (Request)**

Agrega automáticamente el token a todas las peticiones:

```javascript
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Agregar header Authorization con el token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

**Explicación:**
- Se ejecuta antes de cada petición HTTP
- Busca el token en `localStorage`
- Si existe, lo agrega al header `Authorization: Bearer {token}`
- Así no tenemos que agregar el token manualmente en cada petición

---

#### **Interceptor de Respuestas (Response)**

Maneja errores de autenticación globalmente:

```javascript
apiClient.interceptors.response.use(
  (response) => response,  // Si es exitosa, devuelve la respuesta
  (error) => {
    // Si recibe error 401 (No autorizado)
    if (error.response?.status === 401) {
      // Limpiar datos de sesión
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Redirigir al login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Explicación:**
- Se ejecuta después de cada respuesta HTTP
- Si el servidor responde con 401 (token expirado/inválido):
  - Elimina token y datos del usuario
  - Redirige al login automáticamente
- Esto evita que el usuario se quede en el dashboard sin autenticación

---

#### **AuthService - Servicio de Autenticación**

##### **Método `register()`**

```javascript
register: async (userData) => {
  const response = await apiClient.post('/register', {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    password_confirmation: userData.confirmPassword,
  });
  
  // Si el registro es exitoso, guardar token y usuario
  if (response.data.token) {
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
}
```

**Explicación:**
- Envía datos al endpoint `/api/register`
- Si es exitoso, guarda el token y datos del usuario en `localStorage`
- El `localStorage` persiste incluso si el usuario cierra el navegador

---

##### **Método `login()`**

```javascript
login: async (credentials) => {
  const response = await apiClient.post('/login', credentials);
  
  // Guardar token y usuario
  if (response.data.token) {
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
}
```

**Explicación:**
- Envía email y password al endpoint `/api/login`
- Guarda token y datos del usuario si es exitoso
- El interceptor de peticiones usará este token en futuras llamadas

---

##### **Método `logout()`**

```javascript
logout: async () => {
  try {
    await apiClient.post('/logout');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  } finally {
    // Siempre limpia los datos locales
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
}
```

**Explicación:**
- Notifica al backend para eliminar el token
- Siempre limpia `localStorage` (incluso si la petición falla)
- Usa `finally` para asegurar la limpieza

---

##### **Métodos auxiliares**

```javascript
// Verificar si está autenticado
isAuthenticated: () => {
  return !!localStorage.getItem('auth_token');
}

// Obtener usuario del localStorage
getUser: () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Obtener datos actualizados del usuario
me: async () => {
  const response = await apiClient.get('/me');
  return response.data;
}
```

---

### 2. **Componente Login** (`src/pages/Login.jsx`)

```jsx
import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

function Login() {
  // Estados del componente
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Llamar al servicio de login
      await authService.login({ email, password });
      
      // Si es exitoso, navegar al dashboard
      navigate('/dashboard');
      
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      
      // Mostrar mensaje de error
      setError(
        err.response?.data?.message || 
        'Error al iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container>
        <div className="login-card">
          <h1 className="login-title">GastAi</h1>
          
          {/* Mostrar alerta de error si existe */}
          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {/* Deshabilitar botón durante carga */}
            <Button type="submit" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default Login;
```

**Características:**
- **Estados locales**: email, password, loading, error
- **Validación**: campos requeridos en HTML5
- **UX**: botón deshabilitado durante carga
- **Feedback**: muestra errores del servidor
- **Navegación**: redirige al dashboard tras login exitoso

---

### 3. **Componente Register** (`src/pages/Register.jsx`)

Similar al Login pero con validaciones adicionales:

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  // Validación: contraseñas coinciden
  if (formData.password !== formData.confirmPassword) {
    setError('Las contraseñas no coinciden');
    setLoading(false);
    return;
  }

  // Validación: longitud mínima
  if (formData.password.length < 8) {
    setError('La contraseña debe tener al menos 8 caracteres');
    setLoading(false);
    return;
  }

  try {
    await authService.register(formData);
    navigate('/dashboard');
  } catch (err) {
    const errorMsg = err.response?.data?.message || 
                     err.response?.data?.errors?.email?.[0] ||
                     'Error al crear la cuenta.';
    setError(errorMsg);
  } finally {
    setLoading(false);
  }
};
```

**Validaciones del frontend:**
- Contraseñas deben coincidir
- Mínimo 8 caracteres
- Email válido (HTML5)
- Nombre requerido

---

## 🔄 Flujo de Autenticación

### **1. Registro de Usuario**

```
┌─────────┐                    ┌─────────┐                    ┌──────────┐
│ Usuario │                    │ React   │                    │ Laravel  │
└────┬────┘                    └────┬────┘                    └────┬─────┘
     │                              │                              │
     │ 1. Completa formulario       │                              │
     ├─────────────────────────────>│                              │
     │                              │                              │
     │                              │ 2. POST /api/register        │
     │                              ├─────────────────────────────>│
     │                              │                              │
     │                              │                              │ 3. Validar datos
     │                              │                              │
     │                              │                              │ 4. Crear usuario
     │                              │                              │
     │                              │                              │ 5. Generar token
     │                              │                              │
     │                              │ 6. Respuesta {user, token}   │
     │                              │<─────────────────────────────┤
     │                              │                              │
     │                              │ 7. Guardar en localStorage   │
     │                              │                              │
     │ 8. Redirigir a /dashboard    │                              │
     │<─────────────────────────────┤                              │
     │                              │                              │
```

---

### **2. Inicio de Sesión**

```
┌─────────┐                    ┌─────────┐                    ┌──────────┐
│ Usuario │                    │ React   │                    │ Laravel  │
└────┬────┘                    └────┬────┘                    └────┬─────┘
     │                              │                              │
     │ 1. Ingresa email/password    │                              │
     ├─────────────────────────────>│                              │
     │                              │                              │
     │                              │ 2. POST /api/login           │
     │                              ├─────────────────────────────>│
     │                              │                              │
     │                              │                              │ 3. Buscar usuario
     │                              │                              │
     │                              │                              │ 4. Verificar password
     │                              │                              │
     │                              │                              │ 5. Generar token
     │                              │                              │
     │                              │ 6. Respuesta {user, token}   │
     │                              │<─────────────────────────────┤
     │                              │                              │
     │                              │ 7. Guardar en localStorage   │
     │                              │                              │
     │ 8. Redirigir a /dashboard    │                              │
     │<─────────────────────────────┤                              │
     │                              │                              │
```

---

### **3. Petición Protegida**

```
┌─────────┐                    ┌─────────┐                    ┌──────────┐
│ Usuario │                    │ React   │                    │ Laravel  │
└────┬────┘                    └────┬────┘                    └────┬─────┘
     │                              │                              │
     │ 1. Navega a página protegida │                              │
     ├─────────────────────────────>│                              │
     │                              │                              │
     │                              │ 2. Interceptor: agregar token│
     │                              │                              │
     │                              │ 3. GET /api/me               │
     │                              │    Authorization: Bearer xxx │
     │                              ├─────────────────────────────>│
     │                              │                              │
     │                              │                              │ 4. Verificar token
     │                              │                              │
     │                              │                              │ 5. Si válido: ok
     │                              │ 6. Respuesta {user}          │
     │                              │<─────────────────────────────┤
     │                              │                              │
     │ 7. Mostrar datos             │                              │
     │<─────────────────────────────┤                              │
     │                              │                              │
```

---

### **4. Cierre de Sesión**

```
┌─────────┐                    ┌─────────┐                    ┌──────────┐
│ Usuario │                    │ React   │                    │ Laravel  │
└────┬────┘                    └────┬────┘                    └────┬─────┘
     │                              │                              │
     │ 1. Click en "Cerrar sesión"  │                              │
     ├─────────────────────────────>│                              │
     │                              │                              │
     │                              │ 2. POST /api/logout          │
     │                              │    Authorization: Bearer xxx │
     │                              ├─────────────────────────────>│
     │                              │                              │
     │                              │                              │ 3. Eliminar token
     │                              │                              │
     │                              │ 4. Respuesta OK              │
     │                              │<─────────────────────────────┤
     │                              │                              │
     │                              │ 5. Limpiar localStorage      │
     │                              │                              │
     │ 6. Redirigir a /login        │                              │
     │<─────────────────────────────┤                              │
     │                              │                              │
```

---

## 🔐 Seguridad

### **1. Contraseñas**
- ✅ Encriptadas con `Hash::make()` (bcrypt)
- ✅ Nunca se almacenan en texto plano
- ✅ Validación de longitud mínima (8 caracteres)
- ✅ Confirmación requerida en registro

### **2. Tokens**
- ✅ Generados por Sanctum (únicos y aleatorios)
- ✅ Almacenados en tabla `personal_access_tokens`
- ✅ Enviados en header `Authorization: Bearer {token}`
- ✅ Pueden ser revocados individualmente

### **3. Validaciones**
- ✅ Email único (no duplicados)
- ✅ Email válido (formato)
- ✅ Contraseñas deben coincidir
- ✅ Campos requeridos

### **4. CORS**
- ✅ Solo permite origen `localhost:5173`
- ✅ Evita ataques de otros dominios
- ✅ Configurado para desarrollo local

### **5. Errores**
- ✅ No revela información sensible
- ✅ Mensajes genéricos para credenciales incorrectas
- ✅ Logs de errores en servidor

---

## 🧪 Testing

### **Probar con Postman/Thunder Client**

#### **1. Registro**
```http
POST http://localhost:8000/api/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Respuesta esperada (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com"
  },
  "token": "1|abc123def456...",
  "token_type": "Bearer"
}
```

---

#### **2. Login**
```http
POST http://localhost:8000/api/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta esperada (200):**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com"
  },
  "token": "2|xyz789ghi012...",
  "token_type": "Bearer"
}
```

---

#### **3. Obtener usuario (protegida)**
```http
GET http://localhost:8000/api/me
Authorization: Bearer 2|xyz789ghi012...
```

**Respuesta esperada (200):**
```json
{
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

---

#### **4. Logout (protegida)**
```http
POST http://localhost:8000/api/logout
Authorization: Bearer 2|xyz789ghi012...
```

**Respuesta esperada (200):**
```json
{
  "message": "Logout exitoso"
}
```

---

## 📝 Comandos Útiles

### **Backend**
```bash
# Iniciar servidor
php artisan serve

# Ver rutas
php artisan route:list

# Limpiar caché
php artisan cache:clear
php artisan config:clear

# Ver usuarios en BD
php artisan tinker
>>> User::all();

# Ver tokens activos
>>> DB::table('personal_access_tokens')->get();
```

### **Frontend**
```bash
# Iniciar desarrollo
npm run dev

# Ver localStorage en consola del navegador
localStorage.getItem('auth_token')
localStorage.getItem('user')

# Limpiar localStorage
localStorage.clear()
```

---

## 🎯 Próximos Pasos

1. **Proteger rutas en React** con un componente `PrivateRoute`
2. **Implementar refresh de tokens** para sesiones más largas
3. **Agregar recuperación de contraseña** vía email
4. **Roles y permisos** (admin, user, etc.)
5. **Verificación de email** para nuevos usuarios
6. **Rate limiting** para prevenir ataques de fuerza bruta
7. **Logs de actividad** (quién inició sesión y cuándo)

---

## 📚 Recursos Adicionales

- [Documentación Laravel Sanctum](https://laravel.com/docs/12.x/sanctum)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [React Router](https://reactrouter.com/)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Fecha de creación:** 28 de diciembre de 2025  
**Autor:** Documentación generada para el proyecto GastAi  
**Versión:** 1.0
