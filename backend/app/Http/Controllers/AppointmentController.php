<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AppointmentController extends Controller
{
  public function create(Request $request)
  {
    $validated = $request->validate([
      'client_id' => 'required|exists:clients,id',
      'doctor_id' => 'required|exists:doctors,id',
      'date_time' => 'required|date_format:Y-m-d H:i',
    ]);
    Log::info('Datos validados en el backend:', $validated);

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
  public function getDoctors()
  {
    $doctors = DB::table('doctors')
      ->join('users', 'doctors.user_id', '=', 'users.id') // Relación con la tabla de usuarios
      ->select('doctors.id as doctor_id', 'users.name', 'users.lastname') // Obtén doctor_id, nombre y apellido
      ->get();

    return response()->json($doctors);
  }

  public function getDoctorAppointments(Request $request)
  {
    try {
      $user = Auth::user();
      Log::info('Usuario autenticado:', ['user' => $user]);

      if (!$user || !$user->doctor) {
        Log::warning('El usuario no tiene una relación con Doctor:', ['userId' => $user->id ?? 'No autenticado']);
        return response()->json(['message' => 'No autorizado.'], 403);
      }

      $doctorId = $user->doctor->id;
      Log::info('Cargando citas para el doctor:', ['doctorId' => $doctorId]);

      $appointments = DB::table('appointments')
        ->join('clients', 'appointments.client_id', '=', 'clients.id')
        ->join('users as client_users', 'clients.user_id', '=', 'client_users.id')
        ->where('appointments.doctor_id', $doctorId)
        ->select(
          'appointments.id',
          'appointments.date_time',
          'appointments.status',
          'client_users.name as client_name',
          'client_users.lastname as client_lastname'
        )
        ->orderBy('appointments.date_time', 'asc')
        ->get();

      Log::info('Citas cargadas:', ['appointments' => $appointments]);

      return response()->json($appointments);
    } catch (\Exception $e) {
      Log::error('Error al obtener citas del médico:', ['error' => $e->getMessage()]);
      return response()->json(['message' => 'Error interno del servidor.'], 500);
    }
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
  public function updateStatus(Request $request, $id)
  {
    $appointment = Appointment::find($id);

    if (!$appointment) {
      return response()->json(['message' => 'Cita no encontrada.'], 404);
    }

    $validated = $request->validate([
      'status' => 'required|integer|in:0,1,2', // Validar que sea un estado válido
    ]);

    $appointment->status = $validated['status'];
    $appointment->save();

    return response()->json([
      'message' => 'Estado actualizado con éxito.',
      'appointment' => $appointment,
    ]);
  }

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
      $query->whereBetween('appointments.date_time', [
        $request->startDate,
        $request->endDate,
      ]);
    }

    // Filtrar por cliente
    if ($request->has('clientName')) {
      $query->where(DB::raw('CONCAT(client_users.name, " ", client_users.lastname)'), 'like', '%' . $request->clientName . '%');
    }

    // Filtrar por doctor
    if ($request->has('doctorId')) {
      Log::info('Valor recibido para doctorId:', ['doctorId' => $request->doctorId]);
      $query->where('appointments.doctor_id', $request->doctorId);
    }


    $appointments = $query->orderBy('appointments.date_time', 'asc')->get();

    return response()->json($appointments);
  }
}
