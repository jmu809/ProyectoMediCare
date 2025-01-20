<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class LargeDoctorSeeder extends Seeder
{
  public function run()
  {
    $specialties = [
      'Cardiología',
      'Neurología',
      'Medicina General',
      'Pediatría',
      'Traumatología',
      'Dermatología',
      'Oftalmología',
      'Psiquiatría'
    ];

    $universities = [
      'Universidad de Barcelona',
      'Universidad Complutense de Madrid',
      'Universidad de Valencia',
      'Universidad de Sevilla',
      'Universidad de Granada',
      'Universidad de Salamanca'
    ];

    $awards = [
      'Premio a la Excelencia Médica',
      'Premio a la Investigación Médica',
      'Reconocimiento a la Labor Profesional',
      'Premio de Innovación en Medicina',
      'Medalla al Mérito Sanitario',
      'Sin premios destacados' // Opción por defecto
    ];

    // Crear 20 doctores
    for ($i = 0; $i < 20; $i++) {
      $userId = DB::table('users')->insertGetId([
        'name' => fake()->firstName(),
        'lastname' => fake()->lastName(),
        'email' => fake()->unique()->userName() . '@medicare.com',
        'password' => Hash::make('password'),
        'role_id' => 3, // doctor
        'created_at' => now(),
        'updated_at' => now(),
      ]);

      // Generar un premio aleatorio o usar el valor por defecto
      $award = fake()->boolean(70)
        ? fake()->randomElement(array_slice($awards, 0, -1)) . ' ' . fake()->year()
        : $awards[count($awards) - 1];

      DB::table('doctors')->insert([
        'studies' => 'Doctor en ' . fake()->randomElement($specialties) .
          ' por la ' . fake()->randomElement($universities),
        'awards' => $award,
        'description' => fake()->text(200),
        'num_appointments' => 0,
        'user_id' => $userId,
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }
  }
}
