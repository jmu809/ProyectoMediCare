<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContractSeeder extends Seeder
{
  /**
   * Ejecutar el seeder.
   *
   * @return void
   */
  public function run()
  {
    DB::table('contracts')->insert([
      [
        'client_id' => 1, // ID del cliente
        'start_date' => now(),
        'expiration_date' => now()->addYear(), // Fecha de expiración, 1 año después
        'medical_checkups_count' => 3, // Número de chequeos médicos restantes
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'client_id' => 2, // ID del cliente
        'start_date' => now(),
        'expiration_date' => now()->addYear(),
        'medical_checkups_count' => 5,
        'created_at' => now(),
        'updated_at' => now(),
      ],
    ]);
  }
}
