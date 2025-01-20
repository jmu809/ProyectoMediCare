<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LargeAppointmentSeeder extends Seeder
{
  public function run()
  {
    // Obtener todos los IDs de clientes, doctores y contratos
    $clientIds = DB::table('clients')->pluck('id')->toArray();
    $doctorIds = DB::table('doctors')->pluck('id')->toArray();
    $contractIds = DB::table('contracts')->pluck('id')->toArray();

    // Generar 30000 citas distribuidas en varios años
    $startDate = Carbon::now()->subYears(2);
    $endDate = Carbon::now()->addYears(1);

    for ($i = 0; $i < 3000; $i++) {
      $date = fake()->dateTimeBetween($startDate, $endDate);
      $hour = fake()->numberBetween(8, 19);
      $minute = fake()->randomElement([0, 15, 30, 45]);

      $dateTime = Carbon::createFromTimestamp($date->getTimestamp())
        ->setTime($hour, $minute, 0);

      // Si la fecha es pasada, asignar estado completado o cancelado
      // Si es futura, asignar estado pendiente
      $status = $dateTime->isPast()
        ? fake()->randomElement([1, 1, 1, 2]) // 75% completadas, 25% canceladas
        : 0; // pendiente

      $clientId = fake()->randomElement($clientIds);

      DB::table('appointments')->insert([
        'client_id' => $clientId,
        'doctor_id' => fake()->randomElement($doctorIds),
        'contract_id' => DB::table('contracts')
          ->where('client_id', $clientId)
          ->value('id'),
        'date_time' => $dateTime,
        'status' => $status,
        'actual_checkups_count' => $status == 1 ? 1 : 0,
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }
  }
}
