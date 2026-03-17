<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\StockController;
use App\Http\Controllers\Api\StockMovementController;


//categorias
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

//produtos
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

// estoques
Route::get('/stocks', [StockController::class, 'index']);
Route::get('/stocks/{id}', [StockController::class, 'show']);
Route::patch('/stocks/{id}/minimum', [StockController::class, 'updateMinimum']);

// movimentações de estoque
Route::get('/stock-movements', [StockMovementController::class, 'index']);
Route::post('/stock-movements', [StockMovementController::class, 'store']);
