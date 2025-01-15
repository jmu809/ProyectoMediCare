<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;



class AppointmentsSeeder extends Seeder
{
  public function run(): void
  {
    DB::table('appointments')->insert([
      'client_id' => 2,
      'doctor_id' => 2,
      'contract_id' => 2,
      'date_time' => now()->addDays(3)->setTime(11, 0),
      'status' => 0,
      'actual_checkups_count' => 0,
      'created_at' => now(),
      'updated_at' => now(),
    ]);
    DB::table('appointments')->insert([
      'client_id' => 2,
      'doctor_id' => 2,
      'contract_id' => 2,
      'date_time' => now()->addDays(3)->setTime(12, 0),
      'status' => 1,
      'actual_checkups_count' => 0,
      'created_at' => now(),
      'updated_at' => now(),
    ]);
    DB::table('appointments')->insert([
      'client_id' => 2,
      'doctor_id' => 2,
      'contract_id' => 2,
      'date_time' => now()->addDays(3)->setTime(12, 0),
      'status' => 2,
      'actual_checkups_count' => 0,
      'created_at' => now(),
      'updated_at' => now(),
    ]);

    // Add more sample appointments as needed
  }
}
