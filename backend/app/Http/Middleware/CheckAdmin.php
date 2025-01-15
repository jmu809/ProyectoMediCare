<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckAdmin
{
  public function handle(Request $request, Closure $next)
  {
    /*    $user = $request->user();

    // Verificar si el usuario tiene el role_id correspondiente al admin
    if ($user && $user->role_id === 1) { // Suponiendo que 1 representa el rol de admin
      return $next($request);
    }

    // Si no es admin, retornar una respuesta de "No autorizado"
    return response()->json(['message' => 'No autorizado'], 403); */
    return $next($request);
  }
}
