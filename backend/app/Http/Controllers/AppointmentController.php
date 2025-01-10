<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use Illuminate\Support\Facades\DB;

class AppointmentController extends Controller
{
  public function create(Request $request)
  {
    // Validar los datos de entrada
    $validated = $request->validate([
      'client_id' => 'required|exists:clients,id',
      /*       'doctor_id' => 'required|exists:users,id',
 */
      'doctor_id' => 'required|exists:doctors,id',
      'date_time' => 'required|date_format:Y-m-d H:i',
    ]);
    // Obtener el contrato del cliente
    $contractId = DB::table('contracts')
      ->where('client_id', $validated['client_id'])
      ->value('id');

    if (!$contractId) {
      return response()->json([
        'success' => false,
        'message' => 'No se encontró un contrato para este cliente.',
      ], 400);
    }

    // Crear la cita
    $appointment = Appointment::create([
      'client_id' => $validated['client_id'],
      'doctor_id' => $validated['doctor_id'],
      'contract_id' => $contractId,
      'date_time' => $validated['date_time'],
      'status' => 0, // Estado inicial
      'actual_checkups_count' => 1, // Primera consulta
    ]);

    return response()->json([
      'success' => true,
      'appointment' => $appointment,
    ]);
  }
}
