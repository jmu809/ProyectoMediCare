<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Aquí es donde puedes registrar las rutas de la API para tu aplicación.
| Estas rutas son cargadas por el RouteServiceProvider y se asignan
| al grupo de middleware "api".
|
*/

Route::middleware('api')->get('/test', function () {
  return response()->json(['message' => 'API Working!', 'status' => 'success']);
});


Route::post('/login', [AuthController::class, 'login']);
