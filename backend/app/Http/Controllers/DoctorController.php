<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class DoctorController extends Controller
{
  public function getAllDoctors()
  {
    // Obtener todos los usuarios con rol de doctor
    $doctors = User::where('role_id', 3) // 3 = rol de doctor
      ->join('doctors', 'users.id', '=', 'doctors.user_id') // Relación con la tabla doctors
      ->select(
        'users.id as user_id',
        'users.name',
        'users.lastname',
        'users.email',
        'doctors.studies',
        'doctors.awards',
        'doctors.description',
        'doctors.num_appointments as num_citas'
      )
      ->get();

    return response()->json($doctors);
  }
}
