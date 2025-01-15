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
  public function getAllAppointments()
  {
    try {
      $appointments = DB::table('appointments')
        ->join('clients', 'appointments.client_id', '=', 'clients.id')
        ->join('users as client_users', 'clients.user_id', '=', 'client_users.id')
        ->join('doctors', 'appointments.doctor_id', '=', 'doctors.id')
        ->join('users as doctor_users', 'doctors.user_id', '=', 'doctor_users.id')
        ->select(
          'appointments.id',
          'appointments.date_time',
          'appointments.status',
          'client_users.name as client_name',
          'client_users.lastname as client_lastname',
          'doctor_users.name as doctor_name',
          'doctor_users.lastname as doctor_lastname'
        )
        ->orderBy('appointments.date_time', 'asc')
        ->get()
        ->map(function ($appointment) {
          $appointment->status_text = match ($appointment->status) {
            0 => 'Pendiente',
            1 => 'Completada',
            2 => 'Cancelada',
            default => 'Desconocido',
          };
          return $appointment;
        });

      return response()->json($appointments);
    } catch (\Exception $e) {
      return response()->json([
        'message' => 'Error al cargar las citas: ' . $e->getMessage(),
      ], 500);
    }
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
