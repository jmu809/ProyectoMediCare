<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\DB;



class AuthController extends Controller
{

  public function login(Request $request)
  {
    $credentials = $request->validate([
      'email' => 'required|email',
      'password' => 'required',
    ]);

    if (!Auth::attempt($credentials)) {
      return response()->json(['message' => 'Credenciales incorrectas'], 401);
    }

    $user = Auth::user();
    $user->load('client'); // Cargar datos de la relación client
    $user->load('role'); // Esto ya está incluido
    $token = $user->createToken('authToken')->plainTextToken;

    return response()->json([
      'user' => $user,
      'token' => $token,
    ]);
  }

  public function register(Request $request): \Illuminate\Http\JsonResponse
  {
    $validated = $request->validate([
      'firstName' => 'required|string|max:255',
      'lastName' => 'required|string|max:255',
      'email' => 'required|email|unique:users,email',
      'password' => 'required|min:6|confirmed',
    ]);

    $user = User::create([
      'name' => $validated['firstName'],
      'lastname' => $validated['lastName'],
      'email' => $validated['email'],
      'password' => Hash::make($validated['password']),
      'role_id' => 2, // Asignar rol predeterminado
    ]);
    $client = $user->client()->create([
      'company_name' => '', // Vacío por ahora
      'cif' => '', // Vacío por ahora
      'tel_number' => '', // Vacío por ahora
      'address' => '', // Vacío por ahora
      'city' => '', // Vacío por ahora
      'state' => '', // Vacío por ahora
      'postal_code' => '', // Vacío por ahora
    ]);
    // Crear el contrato asociado
    $contract = DB::table('contracts')->insert([
      'client_id' => $client->id,
      'start_date' => now(), // Fecha de inicio del contrato
      'expiration_date' => now()->addYear(), // Fecha de expiración (1 año después)
      'medical_checkups_count' => 10, // Número inicial de consultas
      'created_at' => now(),
      'updated_at' => now(),
    ]);

    $token = $user->createToken('authToken')->plainTextToken;

    return response()->json([
      'success' => true,
      'user' => $user,
      'token' => $token,
    ], 201);
  }
  public function getDoctors()
  {
    $doctors = DB::table('doctors')
      ->join('users', 'doctors.user_id', '=', 'users.id') // Combina la tabla users y doctors
      ->select('doctors.id as doctor_id', 'users.name', 'users.lastname') // Obtén el id del doctor
      ->get();

    return response()->json($doctors);
  }
}
