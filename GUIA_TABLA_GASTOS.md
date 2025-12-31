# 💰 Guía: Tabla de Gastos (Transactions)

## ✅ ¿Qué se creó?

### **1. Tabla `categories`**
Almacena las categorías de ingresos y gastos.

**Estructura:**
```sql
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),              -- Nombre: "Alimentación", "Salario"
    type ENUM('income', 'expense'), -- Tipo: ingreso o gasto
    icon VARCHAR(255) NULLABLE,     -- Emoji: 🍔, 💰
    color VARCHAR(7) DEFAULT '#6366f1', -- Color hex: #ef4444
    user_id BIGINT,                 -- Usuario propietario
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Ejemplo de registros:**
| id | name | type | icon | color | user_id |
|----|------|------|------|-------|---------|
| 1 | Alimentación | expense | 🍔 | #ef4444 | 1 |
| 2 | Transporte | expense | 🚗 | #3b82f6 | 1 |
| 9 | Salario | income | 💰 | #22c55e | 1 |

---

### **2. Tabla `transactions`**
Almacena todas las transacciones (gastos e ingresos).

**Estructura:**
```sql
CREATE TABLE transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('income', 'expense'), -- Tipo: ingreso o gasto
    amount DECIMAL(10, 2),          -- Monto: 150.50
    description TEXT NULLABLE,      -- Descripción: "Compra en supermercado"
    date DATE,                      -- Fecha: 2025-12-28
    category_id BIGINT,             -- Categoría relacionada
    user_id BIGINT,                 -- Usuario propietario
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Ejemplo de registros:**
| id | type | amount | description | date | category_id | user_id |
|----|------|--------|-------------|------|-------------|---------|
| 1 | expense | 45.50 | Almuerzo | 2025-12-28 | 1 | 1 |
| 2 | income | 2500.00 | Salario mensual | 2025-12-01 | 9 | 1 |

---

## 📁 Archivos Creados

### **1. Migraciones**

**`database/migrations/2025_12_24_011559_create_categories_table.php`**
```php
Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->enum('type', ['income', 'expense']);
    $table->string('icon')->nullable();
    $table->string('color', 7)->default('#6366f1');
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->timestamps();
});
```

**`database/migrations/2025_12_24_011600_create_transactions_table.php`**
```php
Schema::create('transactions', function (Blueprint $table) {
    $table->id();
    $table->enum('type', ['income', 'expense']);
    $table->decimal('amount', 10, 2);
    $table->text('description')->nullable();
    $table->date('date');
    $table->foreignId('category_id')->constrained()->onDelete('cascade');
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->timestamps();
});
```

---

### **2. Modelos**

**`app/Models/Category.php`**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'name',
        'type',
        'icon',
        'color',
        'user_id',
    ];

    // Una categoría pertenece a un usuario
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Una categoría tiene muchas transacciones
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
```

**`app/Models/Transaction.php`**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'type',
        'amount',
        'description',
        'date',
        'category_id',
        'user_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',  // Convierte a decimal
        'date' => 'date',         // Convierte a fecha
    ];

    // Una transacción pertenece a un usuario
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Una transacción pertenece a una categoría
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
```

---

### **3. Seeder (Datos Iniciales)**

**`database/seeders/CategorySeeder.php`**

Crea 12 categorías predeterminadas:

**Gastos (8):**
- 🍔 Alimentación (#ef4444)
- 🚗 Transporte (#3b82f6)
- 🎮 Entretenimiento (#8b5cf6)
- 💊 Salud (#10b981)
- 📚 Educación (#f59e0b)
- 🏠 Hogar (#06b6d4)
- 👕 Ropa (#ec4899)
- 💸 Otros Gastos (#6366f1)

**Ingresos (4):**
- 💰 Salario (#22c55e)
- 💻 Freelance (#14b8a6)
- 📈 Inversiones (#84cc16)
- 💵 Otros Ingresos (#10b981)

---

## 🚀 Comandos para Ejecutar

### **1. Verificar que las tablas están creadas**
```bash
cd C:\Users\elguz\Escritorio\Proyectos\pensando\backend
php artisan migrate:status
```

**Salida esperada:**
```
Migration name .................................................. Batch / Status  
0001_01_01_000000_create_users_table ............................ [1] Ran
2025_12_24_011559_create_categories_table ....................... [2] Ran
2025_12_24_011600_create_transactions_table ..................... [2] Ran
2025_12_28_230432_create_personal_access_tokens_table ........... [3] Ran
```

---

### **2. Poblar categorías predeterminadas**
```bash
php artisan db:seed --class=CategorySeeder
```

**Resultado:** Se crearán 12 categorías para el usuario con ID 1.

---

### **3. Ver las categorías creadas**
```bash
php artisan tinker
```

Luego ejecuta:
```php
>>> Category::all();
>>> Category::where('type', 'expense')->get();
>>> Category::where('type', 'income')->get();
```

---

### **4. Crear una transacción de prueba**
```bash
php artisan tinker
```

```php
>>> use App\Models\Transaction;
>>> Transaction::create([
    'type' => 'expense',
    'amount' => 45.50,
    'description' => 'Almuerzo en restaurante',
    'date' => '2025-12-28',
    'category_id' => 1,  // Alimentación
    'user_id' => 1
]);
```

---

## 🔗 Relaciones entre Modelos

```
User (Usuario)
  ├── hasMany → Categories (Categorías)
  └── hasMany → Transactions (Transacciones)

Category (Categoría)
  ├── belongsTo → User
  └── hasMany → Transactions

Transaction (Transacción)
  ├── belongsTo → User
  └── belongsTo → Category
```

**Ejemplo de uso:**
```php
// Obtener todas las transacciones de un usuario
$user = User::find(1);
$transactions = $user->transactions;

// Obtener la categoría de una transacción
$transaction = Transaction::find(1);
$category = $transaction->category;

// Obtener todas las transacciones de una categoría
$category = Category::find(1);
$transactions = $category->transactions;

// Crear transacción con relaciones
$user = User::find(1);
$user->transactions()->create([
    'type' => 'expense',
    'amount' => 100.00,
    'description' => 'Compra en supermercado',
    'date' => now(),
    'category_id' => 1,
]);
```

---

## 🎯 Próximos Pasos

### **1. Crear el TransactionController**
```bash
php artisan make:controller Api/TransactionController --api
```

### **2. Implementar métodos CRUD**
```php
// GET /api/transactions - Listar todas
public function index(Request $request)
{
    return $request->user()->transactions()
        ->with('category')
        ->orderBy('date', 'desc')
        ->get();
}

// POST /api/transactions - Crear nueva
public function store(Request $request)
{
    $validated = $request->validate([
        'type' => 'required|in:income,expense',
        'amount' => 'required|numeric|min:0.01',
        'description' => 'nullable|string',
        'date' => 'required|date',
        'category_id' => 'required|exists:categories,id',
    ]);

    $transaction = $request->user()->transactions()->create($validated);
    
    return response()->json($transaction, 201);
}

// PUT /api/transactions/{id} - Actualizar
public function update(Request $request, Transaction $transaction)
{
    // Verificar que pertenece al usuario
    if ($transaction->user_id !== $request->user()->id) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    $validated = $request->validate([
        'type' => 'sometimes|in:income,expense',
        'amount' => 'sometimes|numeric|min:0.01',
        'description' => 'nullable|string',
        'date' => 'sometimes|date',
        'category_id' => 'sometimes|exists:categories,id',
    ]);

    $transaction->update($validated);
    
    return response()->json($transaction);
}

// DELETE /api/transactions/{id} - Eliminar
public function destroy(Request $request, Transaction $transaction)
{
    if ($transaction->user_id !== $request->user()->id) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    $transaction->delete();
    
    return response()->json(['message' => 'Transacción eliminada']);
}
```

### **3. Agregar rutas protegidas**
En `routes/api.php`:
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('transactions', TransactionController::class);
    Route::apiResource('categories', CategoryController::class);
});
```

### **4. Endpoints disponibles**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/transactions` | Listar todas las transacciones |
| POST | `/api/transactions` | Crear nueva transacción |
| GET | `/api/transactions/{id}` | Ver una transacción |
| PUT | `/api/transactions/{id}` | Actualizar transacción |
| DELETE | `/api/transactions/{id}` | Eliminar transacción |
| GET | `/api/categories` | Listar categorías |
| POST | `/api/categories` | Crear categoría |

---

## 📊 Consultas Útiles

### **Estadísticas del mes actual**
```php
$userId = 1;
$startOfMonth = now()->startOfMonth();
$endOfMonth = now()->endOfMonth();

// Total de gastos
$totalExpenses = Transaction::where('user_id', $userId)
    ->where('type', 'expense')
    ->whereBetween('date', [$startOfMonth, $endOfMonth])
    ->sum('amount');

// Total de ingresos
$totalIncome = Transaction::where('user_id', $userId)
    ->where('type', 'income')
    ->whereBetween('date', [$startOfMonth, $endOfMonth])
    ->sum('amount');

// Balance
$balance = $totalIncome - $totalExpenses;
```

### **Gastos por categoría**
```php
$expensesByCategory = Transaction::where('user_id', $userId)
    ->where('type', 'expense')
    ->with('category')
    ->selectRaw('category_id, SUM(amount) as total')
    ->groupBy('category_id')
    ->orderBy('total', 'desc')
    ->get();
```

### **Últimas 10 transacciones**
```php
$recentTransactions = Transaction::where('user_id', $userId)
    ->with('category')
    ->orderBy('date', 'desc')
    ->orderBy('created_at', 'desc')
    ->take(10)
    ->get();
```

---

## ✅ Checklist

- [x] Tabla `categories` creada
- [x] Tabla `transactions` creada
- [x] Modelo `Category` con relaciones
- [x] Modelo `Transaction` con relaciones
- [x] Seeder para categorías predeterminadas
- [ ] Ejecutar seeder para poblar categorías
- [ ] Crear `TransactionController`
- [ ] Crear `CategoryController`
- [ ] Agregar rutas protegidas
- [ ] Conectar frontend con API

---

**Fecha:** 28 de diciembre de 2025  
**Proyecto:** GastAi - Sistema de Gestión de Gastos
