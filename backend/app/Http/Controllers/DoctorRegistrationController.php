<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Doctor;

class DoctorRegistrationController extends Controller
{
  public function store(Request $request)
  {
    // Validar los datos enviados desde el frontend
    $validator = Validator::make($request->all(), [
      'name' => 'required|string|max:255',
      'lastname' => 'required|string|max:255',
      'email' => 'required|email|unique:users,email',
      'password' => 'required|string|min:6|confirmed',
      'studies' => 'required|string',
      'awards' => 'nullable|string',
      'description' => 'nullable|string',
    ]);

    // Si hay errores de validación, devolverlos
    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'errors' => $validator->errors(),
      ], 422);
    }

    // Crear el usuario con rol de doctor
    $user = User::create([
      'name' => $request->name,
      'lastname' => $request->lastname,
      'email' => $request->email,
      'password' => Hash::make($request->password),
      'role_id' => 3, // Rol de doctor
    ]);

    // Crear el registro en la tabla doctors
    $doctor = Doctor::create([
      'user_id' => $user->id,
      'studies' => $request->studies ?? '',
      'awards' => $request->awards ?? '',
      'description' => $request->description ?? '',
    ]);

    // Devolver una respuesta de éxito
    return response()->json([
      'success' => true,
      'message' => 'Doctor registrado exitosamente.',
      'user' => $user,
      'doctor' => $doctor,
    ], 201);
  }
}
