<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StatsController;
Route::get('/test', function () {
    return response()->json([
        'message' => 'API funcionando correctamente',
        'status' => 'success'
    ]);
});

// Rutas de autenticación (públicas)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas públicas
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);

// Rutas protegidas (requieren token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Transacciones (requieren autenticación)
    Route::apiResource('transactions', TransactionController::class);

    // Categorías (crear, actualizar, eliminar requieren autenticación)
    Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);

    // Dashboard stats
    Route::get('/dashboard/stats', [DashboardController::class, 'index']);

    // Perfil de usuario
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);




    Route::get('/stats', [StatsController::class, 'index']);


});
