<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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
}
