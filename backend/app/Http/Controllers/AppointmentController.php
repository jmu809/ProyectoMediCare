<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
  public function create(Request $request)
  {
    $validated = $request->validate([
      'client_id' => 'required|exists:clients,id',
      'doctor_id' => 'required|exists:doctors,id',
      'date_time' => 'required|date_format:Y-m-d H:i',
    ]);

    $contractId = DB::table('contracts')
      ->where('client_id', $validated['client_id'])
      ->value('id');

    if (!$contractId) {
      return response()->json([
        'success' => false,
        'message' => 'No se encontró un contrato para este cliente.',
      ], 400);
    }

    // Ajustar la hora sumando 1 hora antes de guardar
    $validated['date_time'] = Carbon::parse($validated['date_time'], 'Europe/Madrid')
      ->addHour() // Sumar 1 hora// Convertir a UTC antes de guardar
      ->format('Y-m-d H:i:s');

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


  public function getReservedTimes(Request $request)
  {
    $date = $request->query('date'); // Fecha recibida como parámetro

    if (!$date) {
      return response()->json(['error' => 'La fecha es requerida.'], 400);
    }

    // Restar 1 día a la fecha
    $adjustedDate = Carbon::parse($date)->addDay()->format('Y-m-d');

    $reservedTimes = Appointment::whereDate('date_time', $adjustedDate)
      ->pluck('date_time')
      ->map(function ($dateTime) {
        return Carbon::parse($dateTime) // Asegurarse de que está en UTC
          ->setTimezone('Europe/Madrid') // Convertir a la zona horaria local
          ->format('H:i'); // Formatear como "HH:mm"
      });

    return response()->json($reservedTimes);
  }
  public function getUserAppointments(Request $request)
  {
    $user = $request->user();

    if (!$user || !$user->client) {
      return response()->json(['message' => 'No tienes citas registradas.'], 404);
    }

    $appointments = DB::table('appointments')
      ->join('doctors', 'appointments.doctor_id', '=', 'doctors.id')
      ->join('users', 'doctors.user_id', '=', 'users.id')
      ->where('appointments.client_id', $user->client->id)
      ->select(
        'appointments.id',           // Incluye el ID de la cita
        'users.name as doctor_name',
        'users.lastname as doctor_lastname',
        'appointments.date_time',
        'appointments.status'
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
  }

  public function cancelAppointment($id)
  {
    $appointment = Appointment::find($id);

    if (!$appointment) {
      return response()->json(['message' => 'Cita no encontrada.'], 404);
    }

    $appointment->status = 2; // Cambiar estado a cancelado
    $appointment->save();

    return response()->json(['message' => 'Cita cancelada con éxito.']);
  }
}
