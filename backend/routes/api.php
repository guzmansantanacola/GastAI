<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API funcionando correctamente',
        'status' => 'success'
    ]);
});

// Rutas públicas (sin autenticación por ahora)
Route::apiResource('categories', CategoryController::class);
Route::apiResource('transactions', TransactionController::class);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
