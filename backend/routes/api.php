<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\AdminAppointmentController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\DoctorRegistrationController;


Route::middleware('api')->group(function () {
  Route::post('/login', [AuthController::class, 'login']);
  Route::post('/register', [AuthController::class, 'register']);
  Route::get('/doctors', [AuthController::class, 'getDoctors']);
  Route::post('/appointments', [AppointmentController::class, 'create']);
  Route::get('/appointments/reserved-times', [AppointmentController::class, 'getReservedTimes']);
  Route::middleware('auth:sanctum')->get('/profile', [UserController::class, 'getProfile']);
  Route::get('/clients', [ClientController::class, 'getClients']);

  //Route::put('/client/update', [ClientController::class, 'update']);
});
Route::middleware('auth:sanctum')->get('/protected-resource', function (Request $request) {
  //Route::put('/client/update', [ClientController::class, 'update']);
  return response()->json(['message' => 'Acceso autorizado']);
});

Route::middleware('auth:sanctum')->put('/client/update', [ClientController::class, 'update']);

Route::middleware('auth:sanctum')->group(function () {
  Route::get('/appointments/user', [AppointmentController::class, 'getUserAppointments']);
});
Route::put('/appointments/{id}/cancel', [AppointmentController::class, 'cancelAppointment']);

Route::middleware('auth:sanctum')->put('/appointments/{id}/status', [AppointmentController::class, 'updateStatus']);
Route::middleware('auth:sanctum')->get('/doctors', [AuthController::class, 'getDoctors']);
Route::middleware('auth:sanctum')->get('/api/admin/appointments', [AppointmentController::class, 'getAllAppointments']);

//Route::middleware('auth:sanctum')->get('/all-doctors', [DoctorController::class, 'getAllDoctors']);
Route::get('/all-doctors', [DoctorController::class, 'getAllDoctors']);
Route::post('/register-doctor', [DoctorRegistrationController::class, 'store']);

Route::middleware(['auth:sanctum'])->group(function () {
  Route::get('/admin/appointments', [AdminAppointmentController::class, 'getAllAppointments']);
  Route::put('/admin/appointments/{id}', [AdminAppointmentController::class, 'updateAppointment']);
  Route::delete('/admin/appointments/{id}', [AdminAppointmentController::class, 'cancelAppointment']);
  Route::get('/doctor-appointments', [AppointmentController::class, 'getDoctorAppointments']);
});
Route::middleware('auth:sanctum')->get('/doctor-appointments', [AppointmentController::class, 'getDoctorAppointments']);
