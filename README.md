# 💰 Sistema de Gastos Personales

Aplicación full-stack para gestión de gastos e ingresos personales con React + Laravel.

## 🎯 Características

- ✅ Registro de ingresos y gastos
- 📊 Categorías personalizables
- 📈 Gráficos y estadísticas
- 📅 Filtros por fecha y categoría
- 💳 Balance y resumen mensual
- 📄 Exportar reportes
- 🔐 Autenticación de usuarios

## 📋 Requisitos Previos

- **Node.js** v20.19+ o v22.12+ (actualmente tienes v20.11.1)
- **PHP** 8.1 o superior
- **Composer** (gestor de dependencias de PHP)
- **MySQL** o **PostgreSQL** (base de datos)

## 🚀 Instalación

### 1. Instalar Composer (para Laravel)

Descarga e instala Composer desde: https://getcomposer.org/download/

### 2. Configurar el Backend (Laravel)

```bash
# Navegar a la carpeta backend
cd backend

# Instalar Laravel
composer create-project laravel/laravel .

# Copiar el archivo de configuración
copy .env.example .env

# Generar key de aplicación
php artisan key:generate

# Configurar la base de datos en el archivo .env
# Edita: DB_DATABASE, DB_USERNAME, DB_PASSWORD

# Ejecutar migraciones
php artisan migrate

# Instalar Laravel Sanctum para autenticación API
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate

# Iniciar el servidor de desarrollo
php artisan serve
```

El backend estará disponible en: http://localhost:8000

### 3. Configurar el Frontend (React)

```bash
# Navegar a la carpeta frontend
cd frontend

# Las dependencias ya están instaladas, pero si necesitas reinstalar:
npm install

# Copiar variables de entorno
copy .env.example .env

# Iniciar el servidor de desarrollo
npm run dev
```

El frontend estará disponible en: http://localhost:5173

## 🔧 Configuración CORS en Laravel

Edita el archivo `backend/config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:5173'],
'supports_credentials' => true,
```

## 📁 Estructura del Proyecto

```
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── services/     # Configuración de API
│   │   ├── components/   # Componentes React
│   │   └── App.jsx       # Componente principal
│   ├── package.json
│   └── vite.config.js
│
├── backend/              # API Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   └── Models/
│   ├── routes/
│   │   └── api.php       # Rutas de la API
│   ├── database/
│   └── composer.json
│
└── README.md
```

## 🎯 Crear un Endpoint de Prueba en Laravel

1. Crea un controlador:
```bash
cd backend
php artisan make:controller Api/TestController
```

2. Edita `backend/app/Http/Controllers/Api/TestController.php`:
```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class TestController extends Controller
{
    public function index()
    {
        return response()->json([
            'message' => '¡Conexión exitosa con Laravel!',
            'timestamp' => now(),
        ]);
    }
}
```

3. Agrega la ruta en `backend/routes/api.php`:
```php
use App\Http\Controllers\Api\TestController;

Route::get('/test', [TestController::class, 'index']);
```

## 🧪 Probar la Conexión

1. Asegúrate de que el backend esté corriendo: `php artisan serve`
2. Asegúrate de que el frontend esté corriendo: `npm run dev`
3. Abre http://localhost:5173
4. Haz clic en "Probar Conexión"
5. Deberías ver un mensaje de éxito

## 📝 Scripts Disponibles

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build

### Backend
- `php artisan serve` - Servidor de desarrollo
- `php artisan migrate` - Ejecutar migraciones
- `php artisan make:controller` - Crear controlador
- `php artisan make:model` - Crear modelo

## 🔐 Autenticación

El proyecto está preparado para usar Laravel Sanctum para autenticación basada en tokens.

## 📚 Próximos Pasos

1. ✅ Instalar Composer
2. ✅ Configurar Laravel en la carpeta backend
3. ✅ Configurar la base de datos
4. ✅ Crear endpoints de la API
5. ✅ Implementar componentes de React
6. ✅ Agregar autenticación
7. ✅ Desplegar en producción

## 🆘 Solución de Problemas

### Error de CORS
- Verifica que `backend/config/cors.php` esté configurado correctamente
- Asegúrate de que las URLs coincidan

### Error de conexión a la base de datos
- Verifica las credenciales en `backend/.env`
- Asegúrate de que MySQL/PostgreSQL esté corriendo

### Error "vite not found"
- Ejecuta `npm install` en la carpeta frontend
- Verifica la versión de Node.js

## 📄 Licencia

Este proyecto es de código abierto para tu portfolio personal.
