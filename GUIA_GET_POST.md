# Guía Completa: Cómo hacer GET y POST en Laravel + React

Esta guía te explica paso a paso todos los archivos que necesitas editar para crear endpoints GET y POST.

---

## 📋 Resumen de Archivos a Editar

Para crear un endpoint completo necesitas editar **4-5 archivos**:

### **Backend (Laravel)**
1. **Migración** - Define la estructura de la tabla en la BD
2. **Modelo** - Representa la tabla y sus relaciones
3. **Controlador** - Maneja la lógica del endpoint
4. **Rutas (api.php)** - Define las URLs del API

### **Frontend (React)**
5. **Servicio (api.js)** - Función para llamar al endpoint
6. **Componente** - UI que usa el servicio

---

## 🔧 BACKEND (Laravel)

### 1️⃣ MIGRACIÓN (database/migrations/XXXX_create_table.php)

**¿Qué hace?** Define las columnas de la tabla en la base de datos.

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['income', 'expense']);
            $table->decimal('amount', 10, 2);
            $table->text('description')->nullable();
            $table->date('date');
            $table->boolean('is_monthly')->default(false);
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
```

**Crear migración:**
```bash
php artisan make:migration create_transactions_table
```

**Ejecutar migración:**
```bash
php artisan migrate
```

---

### 2️⃣ MODELO (app/Models/Transaction.php)

**¿Qué hace?** Representa la tabla y permite interactuar con ella.

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    // Campos que se pueden llenar masivamente (POST/PUT)
    protected $fillable = [
        'type',
        'amount',
        'description',
        'date',
        'category_id',
        'user_id',
        'is_monthly',
    ];

    // Convierte tipos de datos automáticamente
    protected $casts = [
        'amount' => 'decimal:2',
        'date' => 'date',
        'is_monthly' => 'boolean',
    ];

    // Relaciones
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

**Crear modelo:**
```bash
php artisan make:model Transaction
```

---

### 3️⃣ CONTROLADOR (app/Http/Controllers/Api/TransactionController.php)

**¿Qué hace?** Maneja la lógica de cada endpoint (GET, POST, PUT, DELETE).

```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    // 📥 GET /api/transactions - Obtener todas las transacciones
    public function index(Request $request)
    {
        $transactions = Transaction::with('category')
            ->where('user_id', $request->user()->id)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }

    // 📥 GET /api/transactions/{id} - Obtener UNA transacción
    public function show(Request $request, $id)
    {
        $transaction = Transaction::with('category')
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $transaction
        ]);
    }

    // 📤 POST /api/transactions - Crear nueva transacción
    public function store(Request $request)
    {
        // 1. Validar datos
        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'date' => 'required|date',
            'category_id' => 'required|exists:categories,id',
            'is_monthly' => 'boolean'
        ]);

        // 2. Agregar user_id automáticamente
        $validated['user_id'] = $request->user()->id;
        $validated['is_monthly'] = $validated['is_monthly'] ?? false;

        // 3. Crear registro
        $transaction = Transaction::create($validated);

        // 4. Devolver con relaciones
        return response()->json([
            'success' => true,
            'data' => $transaction->load('category')
        ], 201);
    }

    // 📝 PUT /api/transactions/{id} - Actualizar transacción
    public function update(Request $request, $id)
    {
        $transaction = Transaction::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'date' => 'required|date',
            'category_id' => 'required|exists:categories,id',
            'is_monthly' => 'boolean'
        ]);

        $transaction->update($validated);

        return response()->json([
            'success' => true,
            'data' => $transaction->load('category')
        ]);
    }

    // 🗑️ DELETE /api/transactions/{id} - Eliminar transacción
    public function destroy(Request $request, $id)
    {
        $transaction = Transaction::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $transaction->delete();

        return response()->json([
            'success' => true,
            'message' => 'Transacción eliminada'
        ]);
    }
}
```

**Crear controlador:**
```bash
php artisan make:controller Api/TransactionController --api
```

---

### 4️⃣ RUTAS (routes/api.php)

**¿Qué hace?** Define qué URL llama a qué método del controlador.

```php
<?php
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Support\Facades\Route;

// Rutas protegidas (requieren autenticación)
Route::middleware('auth:sanctum')->group(function () {
    
    // Opción A: Una por una (más control)
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);
    Route::put('/transactions/{id}', [TransactionController::class, 'update']);
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);

    // Opción B: apiResource crea todas las rutas automáticamente
    Route::apiResource('transactions', TransactionController::class);
    
    // Ruta personalizada
    Route::get('/dashboard/stats', [DashboardController::class, 'index']);
});
```

**URLs generadas por apiResource:**
- `GET /api/transactions` → index()
- `POST /api/transactions` → store()
- `GET /api/transactions/{id}` → show()
- `PUT /api/transactions/{id}` → update()
- `DELETE /api/transactions/{id}` → destroy()

---

## 🎨 FRONTEND (React)

### 5️⃣ SERVICIO (src/services/api.js)

**¿Qué hace?** Funciones para llamar al backend.

```javascript
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

// Interceptor: Agregar token en cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicio de Transacciones
export const transactionService = {
  // 📥 GET todas las transacciones
  getAll: async () => {
    const response = await apiClient.get('/transactions');
    return response.data;
  },
  
  // 📥 GET una transacción por ID
  getById: async (id) => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data;
  },
  
  // 📤 POST crear transacción
  create: async (transactionData) => {
    const response = await apiClient.post('/transactions', transactionData);
    return response.data;
  },
  
  // 📝 PUT actualizar transacción
  update: async (id, transactionData) => {
    const response = await apiClient.put(`/transactions/${id}`, transactionData);
    return response.data;
  },
  
  // 🗑️ DELETE eliminar transacción
  delete: async (id) => {
    const response = await apiClient.delete(`/transactions/${id}`);
    return response.data;
  }
};

// Servicio de Dashboard
export const dashboardService = {
  getStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  }
};

export default apiClient;
```

---

### 6️⃣ COMPONENTE (src/pages/Transactions.jsx)

**¿Qué hace?** Usa los servicios para mostrar y modificar datos.

```jsx
import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/api';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📥 GET - Cargar transacciones al montar el componente
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await transactionService.getAll();
        setTransactions(response.data);
      } catch (error) {
        console.error('Error al cargar transacciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []); // [] = solo al montar

  // 📤 POST - Crear nueva transacción
  const handleCreate = async (formData) => {
    try {
      const newTransaction = await transactionService.create(formData);
      // Agregar al estado
      setTransactions([newTransaction.data, ...transactions]);
    } catch (error) {
      console.error('Error al crear:', error);
      throw error;
    }
  };

  // 📝 PUT - Actualizar transacción
  const handleUpdate = async (id, formData) => {
    try {
      const updated = await transactionService.update(id, formData);
      // Actualizar en el estado
      setTransactions(prev => 
        prev.map(t => t.id === id ? updated.data : t)
      );
    } catch (error) {
      console.error('Error al actualizar:', error);
      throw error;
    }
  };

  // 🗑️ DELETE - Eliminar transacción
  const handleDelete = async (id) => {
    try {
      await transactionService.delete(id);
      // Eliminar del estado
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Transacciones</h1>
      {/* Renderizar transacciones */}
      {transactions.map(transaction => (
        <div key={transaction.id}>
          {transaction.description} - ${transaction.amount}
        </div>
      ))}
    </div>
  );
}

export default Transactions;
```

---

## 🔄 Flujo Completo de un POST

### **Paso a paso:**

1. **Usuario llena un formulario** en React
   ```jsx
   const formData = {
     type: 'expense',
     amount: 100,
     description: 'Compras',
     date: '2025-12-29',
     category_id: 1,
     is_monthly: false
   };
   ```

2. **Frontend llama al servicio**
   ```jsx
   await transactionService.create(formData);
   ```

3. **api.js hace el POST**
   ```javascript
   apiClient.post('/transactions', formData)
   ```

4. **Laravel recibe en la ruta**
   ```php
   Route::post('/transactions', [TransactionController::class, 'store'])
   ```

5. **Controlador valida y guarda**
   ```php
   $validated = $request->validate([...]);
   $transaction = Transaction::create($validated);
   ```

6. **Laravel responde JSON**
   ```json
   {
     "success": true,
     "data": {
       "id": 1,
       "type": "expense",
       "amount": 100,
       ...
     }
   }
   ```

7. **Frontend actualiza el estado**
   ```jsx
   setTransactions([newTransaction.data, ...transactions]);
   ```

---

## 📝 Checklist Rápido

### Para crear un nuevo endpoint:

**Backend:**
- [ ] ¿Necesito nueva tabla? → Crear migración
- [ ] ¿Necesito nuevo modelo? → Crear modelo con fillable
- [ ] Crear/actualizar controlador con el método
- [ ] Agregar ruta en api.php

**Frontend:**
- [ ] Agregar función en api.js (transactionService)
- [ ] Llamar la función en el componente con useEffect o evento

---

## 💡 Tips Importantes

1. **Siempre valida** los datos en el backend (validate)
2. **Usa response()->json()** para devolver datos
3. **Incluye relaciones** con `->with('category')`
4. **Maneja errores** con try-catch en frontend
5. **Actualiza el estado** después de POST/PUT/DELETE
6. **Usa loading states** para mejor UX

---

## 🐛 Debugging

**Error 401 (No autorizado):**
- Verifica que la ruta esté dentro de `auth:sanctum`
- Revisa que el token esté en localStorage
- Confirma que el header Authorization se envíe

**Error 422 (Validación falló):**
- Revisa la consola del browser para ver qué campo falló
- Verifica que los nombres coincidan entre frontend y backend

**Error 500 (Server error):**
- Revisa `storage/logs/laravel.log` en el backend
- Probablemente hay un error en el controlador

**No aparecen datos:**
- Verifica que el useEffect tenga `[]` como dependencia
- Confirma que la respuesta del backend tenga `data`
- Usa `console.log(response)` para ver qué llega

---

¡Con esto deberías poder crear cualquier endpoint GET/POST/PUT/DELETE! 🚀
