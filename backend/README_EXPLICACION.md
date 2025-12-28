# 📚 Guía Completa: Entendiendo Laravel desde Cero

## 🎯 ¿Qué es Laravel?

Laravel es un **framework de PHP** que te ayuda a crear aplicaciones web de forma más rápida y organizada. Piensa en él como una "caja de herramientas" que ya tiene soluciones para problemas comunes.

### ¿Por qué Laravel?
- ✅ **Organizado**: Todo tiene su lugar (MVC: Modelo-Vista-Controlador)
- ✅ **Seguro**: Protección contra ataques comunes
- ✅ **Rápido de desarrollar**: Menos código, más funcionalidad
- ✅ **Base de datos fácil**: No escribes SQL directamente

---

## 🏗️ Estructura de Laravel (Lo Básico)

```
backend/
├── app/
│   ├── Http/
│   │   └── Controllers/     ← Aquí va la lógica de tu aplicación
│   └── Models/              ← Representan las tablas de tu base de datos
├── database/
│   └── migrations/          ← Definen cómo se crean las tablas
├── routes/
│   ├── api.php             ← Rutas de tu API (lo que usamos)
│   └── web.php             ← Rutas para vistas HTML
├── .env                    ← Configuración (base de datos, etc.)
└── public/                 ← Carpeta pública (index.php)
```

---

## 📖 Conceptos Clave de Laravel

### 1. **Migraciones** (database/migrations/)

**¿Qué son?** Archivos que crean/modifican tablas en la base de datos.

**¿Por qué no usar SQL directamente?** 
- Laravel las ejecuta en orden
- Puedes revertirlas (`migrate:rollback`)
- Fácil de compartir con tu equipo

**Ejemplo de lo que hicimos:**

```php
// 2025_12_24_011559_create_categories_table.php
Schema::create('categories', function (Blueprint $table) {
    $table->id();                    // Crea columna 'id' auto-incremental
    $table->string('name');          // Columna 'name' tipo texto
    $table->enum('type', ['income', 'expense']); // Solo puede ser 'income' o 'expense'
    $table->string('icon')->nullable(); // Opcional (puede ser NULL)
    $table->string('color', 7)->default('#6366f1'); // Con valor por defecto
    $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Relación con users
    $table->timestamps();            // Crea 'created_at' y 'updated_at'
});
```

**Traducción a SQL:**
```sql
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    icon VARCHAR(255) NULL,
    color VARCHAR(7) DEFAULT '#6366f1',
    user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Comandos importantes:**
```bash
php artisan make:migration create_categories_table  # Crear migración
php artisan migrate                                   # Ejecutar migraciones
php artisan migrate:fresh                            # Borrar todo y recrear
```

---

### 2. **Modelos** (app/Models/)

**¿Qué son?** Clases de PHP que representan una tabla de la base de datos.

**Regla importante:** 
- Modelo `Category` → tabla `categories` (plural)
- Modelo `Transaction` → tabla `transactions`

**Ejemplo de lo que hicimos:**

```php
// app/Models/Category.php
class Category extends Model
{
    // Campos que se pueden llenar masivamente (protección)
    protected $fillable = [
        'name',
        'type',
        'icon',
        'color',
        'user_id',
    ];

    // Relación: Una categoría pertenece a un usuario
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relación: Una categoría tiene muchas transacciones
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
```

**¿Cómo usarlo?**

```php
// Crear una categoría
$category = Category::create([
    'name' => 'Comida',
    'type' => 'expense',
    'icon' => '🍔',
    'color' => '#FF5733',
    'user_id' => 1
]);

// Obtener todas las categorías
$categories = Category::all();

// Buscar una categoría
$category = Category::find(1);

// Obtener las transacciones de una categoría
$category->transactions; // Gracias a la relación!
```

**Comandos:**
```bash
php artisan make:model Category  # Crear modelo
```

---

### 3. **Controladores** (app/Http/Controllers/)

**¿Qué son?** Clases que manejan la lógica de tu aplicación (como responder peticiones).

**Ejemplo de lo que creamos:**

```php
// app/Http/Controllers/Api/CategoryController.php
class CategoryController extends Controller
{
    // GET /api/categories - Listar todas
    public function index() {
        return Category::all();
    }

    // POST /api/categories - Crear nueva
    public function store(Request $request) {
        return Category::create($request->all());
    }

    // GET /api/categories/1 - Ver una específica
    public function show($id) {
        return Category::find($id);
    }

    // PUT /api/categories/1 - Actualizar
    public function update(Request $request, $id) {
        $category = Category::find($id);
        $category->update($request->all());
        return $category;
    }

    // DELETE /api/categories/1 - Eliminar
    public function destroy($id) {
        Category::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
```

**Comandos:**
```bash
php artisan make:controller CategoryController        # Controlador normal
php artisan make:controller CategoryController --api  # Controlador para API
```

---

### 4. **Rutas** (routes/api.php)

**¿Qué son?** Definen qué URL llama a qué controlador.

**Ejemplo de lo que hicimos:**

```php
// routes/api.php
use App\Http\Controllers\Api\CategoryController;

// Forma larga (manual)
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

// Forma corta (recomendada)
Route::apiResource('categories', CategoryController::class);
// Esto crea TODAS las rutas de arriba automáticamente!
```

**Resultado:**
```
GET    /api/categories       → index()   (listar todas)
POST   /api/categories       → store()   (crear nueva)
GET    /api/categories/1     → show()    (ver una)
PUT    /api/categories/1     → update()  (actualizar)
DELETE /api/categories/1     → destroy() (eliminar)
```

**Comando útil:**
```bash
php artisan route:list  # Ver todas las rutas disponibles
```

---

## 🔄 Flujo de una Petición en Laravel

```
1. Usuario hace petición: GET /api/categories
                ↓
2. Laravel busca en routes/api.php
                ↓
3. Encuentra: Route::apiResource('categories', CategoryController::class)
                ↓
4. Llama al método index() del CategoryController
                ↓
5. El controlador usa el modelo: Category::all()
                ↓
6. El modelo consulta la base de datos
                ↓
7. Devuelve los datos en formato JSON
                ↓
8. Usuario recibe: [{"id": 1, "name": "Comida", ...}]
```

---

## 🛠️ Lo Que Hicimos Paso a Paso

### 1. **Instalamos Laravel**
```bash
composer create-project laravel/laravel backend-temp
```
Esto descargó Laravel y todas sus dependencias.

### 2. **Configuramos la Base de Datos** (.env)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=portfolio
DB_USERNAME=root
DB_PASSWORD=
```

### 3. **Creamos las Migraciones**
```bash
php artisan make:migration create_categories_table
php artisan make:migration create_transactions_table
```

Definimos los campos de cada tabla:
- **categories**: name, type, icon, color, user_id
- **transactions**: type, amount, description, date, category_id, user_id

### 4. **Ejecutamos las Migraciones**
```bash
php artisan migrate:fresh
```
Esto creó las tablas en MySQL.

### 5. **Creamos los Modelos**
```bash
php artisan make:model Category
php artisan make:model Transaction
```

Definimos:
- Campos `$fillable` (qué se puede llenar)
- Relaciones (`belongsTo`, `hasMany`)

### 6. **Creamos los Controladores**
```bash
php artisan make:controller Api/CategoryController --api
php artisan make:controller Api/TransactionController --api
```

### 7. **Definimos las Rutas** (routes/api.php)
```php
Route::apiResource('categories', CategoryController::class);
Route::apiResource('transactions', TransactionController::class);
```

Esto creó automáticamente 5 rutas para cada recurso (CRUD completo).

---

## 🔍 Cómo Probar Tu API

### 1. **Inicia el servidor**
```bash
cd backend
php artisan serve
```

### 2. **Usa Postman, Thunder Client o el navegador**

**Probar que funciona:**
```
GET http://localhost:8000/api/test
```

**Listar categorías:**
```
GET http://localhost:8000/api/categories
```

**Crear una categoría:**
```
POST http://localhost:8000/api/categories
Content-Type: application/json

{
  "name": "Comida",
  "type": "expense",
  "icon": "🍔",
  "color": "#FF5733",
  "user_id": 1
}
```

---

## 📊 Arquitectura del Proyecto: Sistema de Gastos

```
┌─────────────────────────────────────────────┐
│              FRONTEND (React)                │
│  - Formularios para crear gastos            │
│  - Dashboard con gráficos                   │
│  - Lista de transacciones                   │
└──────────────────┬──────────────────────────┘
                   │ HTTP Requests (axios)
                   │
┌──────────────────▼──────────────────────────┐
│          BACKEND (Laravel API)              │
│                                             │
│  routes/api.php                             │
│    ↓                                        │
│  Controllers/                               │
│    - CategoryController                     │
│    - TransactionController                  │
│    ↓                                        │
│  Models/                                    │
│    - Category                               │
│    - Transaction                            │
│    ↓                                        │
└──────────────────┬──────────────────────────┘
                   │ SQL Queries
                   │
┌──────────────────▼──────────────────────────┐
│         BASE DE DATOS (MySQL)               │
│                                             │
│  Tablas:                                    │
│  - users                                    │
│  - categories                               │
│  - transactions                             │
└─────────────────────────────────────────────┘
```

---

## 📝 Comandos Útiles de Laravel

```bash
# Ver todas las rutas
php artisan route:list

# Limpiar caché
php artisan cache:clear
php artisan config:clear

# Ver migraciones pendientes
php artisan migrate:status

# Revertir última migración
php artisan migrate:rollback

# Abrir consola interactiva (tinker)
php artisan tinker
# Dentro de tinker:
# >>> Category::all()
# >>> Category::create(['name' => 'Test', 'type' => 'expense', 'user_id' => 1])

# Ver todas las tareas disponibles
php artisan list
```

---

## 🎓 Recursos para Aprender Más

1. **Documentación oficial:** https://laravel.com/docs
2. **Laracasts (videos):** https://laracasts.com/series/laravel-11-for-beginners
3. **Laravel Bootcamp:** https://bootcamp.laravel.com/

---

## 🚀 Próximos Pasos

1. **Implementar la lógica en los controladores** (agregar validación)
2. **Crear datos de prueba** (seeders)
3. **Conectar el frontend React**
4. **Agregar autenticación con Sanctum**
5. **Crear gráficos y estadísticas**

---

## ❓ Preguntas Frecuentes

**¿Por qué usar migraciones en vez de crear tablas manualmente?**
- Puedes revertir cambios fácilmente
- Tu equipo puede replicar la base de datos
- Laravel las ejecuta en orden correcto

**¿Qué es Eloquent?**
- El ORM (Object-Relational Mapping) de Laravel
- Te permite trabajar con la BD usando objetos PHP en vez de SQL

**¿Qué es `$fillable`?**
- Protección contra "mass assignment"
- Define qué campos se pueden llenar masivamente
- Previene que alguien modifique campos sensibles

**¿Cuándo usar `belongsTo` vs `hasMany`?**
- `belongsTo`: La tabla tiene la foreign key (transaction → category_id)
- `hasMany`: La otra tabla te referencia (category → transactions)

---

## 💡 Consejos

1. **Siempre revisa los logs:** `storage/logs/laravel.log`
2. **Usa `php artisan tinker`** para probar código rápido
3. **Lee los mensajes de error** - Laravel es muy descriptivo
4. **Sigue las convenciones** - Laravel funciona mejor así

---

¿Tienes preguntas sobre algún concepto? ¡Pregúntame!
