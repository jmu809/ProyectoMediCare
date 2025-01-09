<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::middleware('api')->group(function () {
  Route::post('/login', [AuthController::class, 'login']);
  Route::post('/register', [AuthController::class, 'register']);
  Route::get('/doctors', [AuthController::class, 'getDoctors']);
});
Route::middleware('auth:sanctum')->get('/protected-resource', function (Request $request) {
  return response()->json(['message' => 'Acceso autorizado']);
});
