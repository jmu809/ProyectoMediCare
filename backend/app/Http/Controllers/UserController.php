<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
  public function getProfile()
  {
    // Obtener el usuario autenticado
    $user = Auth::user();

    // Asegúrate de cargar la relación con el cliente
    $client = $user->client;
    $role = $user->role;

    // Devolver los datos del usuario y del cliente asociado
    return response()->json([
      'user' => [
        'name' => $user->name,
        'lastname' => $user->lastname,
        'email' => $user->email,
        'role' => $user->role->name, // Asegúrate de tener la relación con `roles`
      ],
      'client' => $user->client ? [
        'company_name' => $user->client->company_name,
        'cif' => $user->client->cif,
        'tel_number' => $user->client->tel_number,
        'address' => $user->client->address,
        'city' => $user->client->city,
        'state' => $user->client->state,
        'postal_code' => $user->client->postal_code,
      ] : null,
    ]);
  }
}
