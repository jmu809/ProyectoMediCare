<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\hash;

use App\Models\User;
use Illuminate\Validation\ValidationException;


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
  public function getClients()
  {
    // Obtener todos los usuarios con rol de cliente
    $clients = User::where('role_id', 2) // 2 = rol de cliente
      ->join('clients', 'users.id', '=', 'clients.user_id') // Relación con la tabla clients
      ->leftJoin('contracts', 'clients.id', '=', 'contracts.client_id') // Relación con la tabla contracts
      ->select(
        'users.id as user_id',
        'users.name',
        'users.lastname',
        'users.email',
        'clients.cif as dni',
        'clients.company_name as company',
        'clients.city as city',
        'clients.tel_number as tel_number',
        'contracts.medical_checkups_count as num_citas'
      )
      ->get();

    return response()->json($clients);
  }
  public function registerClient(Request $request)
  {
    try {
      // Validación de los datos
      $validated = $request->validate([
        'name' => 'required|string|max:255',
        'lastname' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|min:6|confirmed',
        'company_name' => 'required|string|max:255',
        'cif' => 'required|string|unique:clients,cif|max:255',
        'tel_number' => 'required|string|max:15',
        'address' => 'required|string|max:255',
        'city' => 'required|string|max:255',
        'state' => 'required|string|max:255',
        'postal_code' => 'required|string|max:10',
      ]);

      // Crear usuario asociado al cliente
      $user = User::create([
        'name' => $validated['name'],
        'lastname' => $validated['lastname'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
        'role_id' => 2, // Rol de cliente
      ]);

      // Crear cliente
      $client = Client::create([
        'user_id' => $user->id,
        'company_name' => $validated['company_name'],
        'cif' => $validated['cif'],
        'tel_number' => $validated['tel_number'],
        'address' => $validated['address'],
        'city' => $validated['city'],
        'state' => $validated['state'],
        'postal_code' => $validated['postal_code'],
      ]);

      return response()->json([
        'success' => true,
        'message' => 'Cliente registrado exitosamente.',
        'client' => $client,
      ], 201);
    } catch (ValidationException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Errores de validación.',
        'errors' => $e->errors(),
      ], 422);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error interno del servidor.',
        'error' => $e->getMessage(),
      ], 500);
    }
  }
  public function show($id)
  {
    // Busca el cliente basado en el user_id
    $client = Client::where('user_id', $id)->with('user')->first();

    if (!$client) {
      return response()->json(['message' => 'Client not found'], 404);
    }

    return response()->json([
      'client' => $client,
      'user' => $client->user, // Incluye los datos del usuario asociado
    ], 200);
  }
  public function updateEditedClient(Request $request, $id)
  {
    // Buscar el cliente asociado al user_id
    $client = Client::where('user_id', $id)->first();

    if (!$client) {
      return response()->json(['message' => 'Cliente no encontrado.'], 404);
    }

    // Validar los datos recibidos
    $validated = $request->validate([
      'name' => 'required|string|max:255',
      'lastname' => 'required|string|max:255',
      'email' => 'required|email|unique:users,email,' . $id, // Ignorar el email del usuario actual
      'company_name' => 'required|string|max:255',
      'cif' => 'required|string|max:255',
      'tel_number' => 'required|string|max:20',
      'address' => 'required|string|max:255',
      'city' => 'required|string|max:255',
      'state' => 'required|string|max:255',
      'postal_code' => 'required|string|max:10',
    ]);

    // Actualizar el usuario asociado
    $user = $client->user;
    $user->update([
      'name' => $validated['name'],
      'lastname' => $validated['lastname'],
      'email' => $validated['email'],
    ]);

    // Actualizar los datos del cliente
    $client->update([
      'company_name' => $validated['company_name'],
      'cif' => $validated['cif'],
      'tel_number' => $validated['tel_number'],
      'address' => $validated['address'],
      'city' => $validated['city'],
      'state' => $validated['state'],
      'postal_code' => $validated['postal_code'],
    ]);

    return response()->json([
      'success' => true,
      'message' => 'Cliente actualizado correctamente.',
      'client' => $client,
    ]);
  }
}
