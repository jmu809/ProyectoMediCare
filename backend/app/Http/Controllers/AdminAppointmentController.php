<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AdminAppointmentController extends Controller
{
  // Obtener todas las citas para administración
  public function getAllAppointments(Request $request)
  {
    $query = DB::table('appointments')
      ->join('clients', 'appointments.client_id', '=', 'clients.id')
      ->join('doctors', 'appointments.doctor_id', '=', 'doctors.id')
      ->join('users as doctor_users', 'doctors.user_id', '=', 'doctor_users.id')
      ->join('users as client_users', 'clients.user_id', '=', 'client_users.id')
      ->select(
        'appointments.id',
        'appointments.date_time',
        'appointments.status',
        'appointments.doctor_id', // Asegúrate de que este campo esté incluido
        'client_users.name as client_name',
        'client_users.lastname as client_lastname',
        'doctor_users.name as doctor_name',
        'doctor_users.lastname as doctor_lastname'
      );

    // Filtrar por rango de fechas
    if ($request->has('startDate') && $request->has('endDate')) {
      $query->whereBetween(
        'appointments.date_time',
        [
          $request->startDate,
          $request->endDate,
        ]
      );
    }

    // Filtrar por cliente
    if ($request->has('clientName')) {
      $query->where(DB::raw('CONCAT(client_users.name, " ", client_users.lastname)'), 'like', '%' . $request->clientName . '%');
    }

    // Filtrar por doctor
    if ($request->has('doctorId')) {
      $query->where('appointments.doctor_id', $request->doctorId);
    }

    $appointments = $query->orderBy('appointments.date_time', 'asc')->get();

    return response()->json($appointments);
  }

  // Actualizar el estado o información de una cita
  public function updateAppointment(Request $request, $id)
  {
    try {
      $appointment = Appointment::find($id);

      if (!$appointment) {
        return response()->json(['message' => 'Cita no encontrada'], 404);
      }

      $appointment->update($request->all());
      return response()->json(['message' => 'Cita actualizada con éxito']);
    } catch (\Exception $e) {
      return response()->json([
        'message' => 'Error al actualizar la cita: ' . $e->getMessage(),
      ], 500);
    }
  }

  // Cancelar una cita
  public function cancelAppointment($id)
  {
    try {
      $appointment = Appointment::find($id);

      if (!$appointment) {
        return response()->json(['message' => 'Cita no encontrada.'], 404);
      }

      $appointment->status = 2; // Cambiar estado a cancelado
      $appointment->save();

      return response()->json(['message' => 'Cita cancelada con éxito.']);
    } catch (\Exception $e) {
      return response()->json([
        'message' => 'Error al cancelar la cita: ' . $e->getMessage(),
      ], 500);
    }
  }
}
