<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DoctorSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    DB::table('doctors')->insert([
      [
        'studies' => 'Doctor en Medicina por la Universidad de Ejemplo',
        'awards' => 'Premio a la Excelencia Médica 2023',
        'description' => 'Especialista en cardiología con más de 10 años de experiencia.',
        'num_appointments' => 0,
        'user_id' => 4,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'studies' => 'Doctor en Neurología por la Universidad de Salud',
        'awards' => 'Investigador del año 2022',
        'description' => 'Experto en neurología y enfermedades neurodegenerativas.',
        'num_appointments' => 0,
        'user_id' => 5,
        'created_at' => now(),
        'updated_at' => now(),
      ],
    ]);
  }
}
