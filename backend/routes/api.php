<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::post('/login', function (Request $request) {
  $credentials = $request->only(['email', 'password']);

  // Aquí puedes verificar las credenciales (por ejemplo, usando una tabla `users`)
  if ($credentials['email'] === 'admin@example.com' && $credentials['password'] === 'password') {
    return response()->json(['message' => 'Login exitoso', 'token' => 'abc123'], 200);
  }

  return response()->json(['error' => 'Credenciales inválidas'], 401);
});
