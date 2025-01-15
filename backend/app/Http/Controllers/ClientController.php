<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ClientController extends Controller
{
  public function update(Request $request)
  {
    // Obtener el usuario autenticado
    $user = Auth::user();

    // Log para verificar el usuario autenticado
    if (!$user) {
      Log::error('Usuario no autenticado. Token no válido o ausente.');
      return response()->json([
        'success' => false,
        'message' => 'Usuario no autenticado.',
      ], 401);
    }
    Log::info('Usuario autenticado:', ['user' => $user]);

    // Verificar si el usuario tiene un cliente asociado
    if (!$user->client) {
      Log::error('Cliente no encontrado para el usuario.', ['user_id' => $user->id]);
      return response()->json([
        'success' => false,
        'message' => 'Cliente no encontrado para el usuario.',
      ], 404);
    }
    Log::info('Cliente asociado encontrado:', ['client' => $user->client]);

    // Validar los datos recibidos
    $validated = $request->validate([
      'company_name' => 'nullable|string|max:255',
      'cif' => 'nullable|string|max:255',
      'tel_number' => 'nullable|string|max:20',
      'address' => 'nullable|string|max:255',
      'city' => 'nullable|string|max:255',
      'state' => 'nullable|string|max:255',
      'postal_code' => 'nullable|string|max:10',
    ]);
    Log::info('Datos validados para actualizar:', $validated);

    // Actualizar los datos del cliente
    $client = $user->client;
    $client->update($validated);

    Log::info('Datos del cliente actualizados:', ['client' => $client]);

    return response()->json([
      'success' => true,
      'message' => 'Datos del cliente actualizados con éxito.',
      'client' => $client,
    ]);
  }
}
