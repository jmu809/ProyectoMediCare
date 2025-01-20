<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class LargeUserClientSeeder extends Seeder
{
  public function run()
  {
    $cities = [
      'Madrid',
      'Barcelona',
      'Valencia',
      'Sevilla',
      'Zaragoza',
      'Málaga',
      'Murcia',
      'Palma',
      'Las Palmas',
      'Bilbao',
    ];

    // Crear usuario administrador con credenciales conocidas
    $adminId = DB::table('users')->insertGetId([
      'name' => 'Admin',
      'lastname' => 'User',
      'email' => 'admin@medicare.com',
      'password' => Hash::make('admin123'),
      'role_id' => 1, // Administrador
      'created_at' => now(),
      'updated_at' => now(),
    ]);

    // Crear un doctor con credenciales conocidas
    $doctorUserId = DB::table('users')->insertGetId([
      'name' => 'Dr. Juan',
      'lastname' => 'Pérez',
      'email' => 'doctor@medicare.com',
      'password' => Hash::make('doctor123'),
      'role_id' => 3, // Doctor
      'created_at' => now(),
      'updated_at' => now(),
    ]);

    DB::table('doctors')->insert([
      'studies' => 'Doctor en Cardiología por la Universidad Complutense de Madrid',
      'awards' => 'Premio Nacional de Medicina 2023',
      'description' => 'Cardiólogo con 15 años de experiencia en hospitales reconocidos.',
      'num_appointments' => 0,
      'user_id' => $doctorUserId,
      'created_at' => now(),
      'updated_at' => now(),
    ]);

    // Crear 1000 clientes con contratos asociados
    for ($i = 0; $i < 1000; $i++) {
      $userId = DB::table('users')->insertGetId([
        'name' => fake()->firstName(),
        'lastname' => fake()->lastName(),
        'email' => fake()->unique()->userName() . '@' . fake()->freeEmailDomain(),
        'password' => Hash::make('password'),
        'role_id' => 2, // Cliente
        'created_at' => now(),
        'updated_at' => now(),
      ]);

      $clientId = DB::table('clients')->insertGetId([
        'company_name' => fake()->company(),
        'cif' => fake()->regexify('[A-Z][0-9]{8}'),
        'tel_number' => fake()->phoneNumber(),
        'address' => fake()->streetAddress(),
        'city' => fake()->randomElement($cities),
        'state' => fake()->state(),
        'postal_code' => fake()->postcode(),
        'user_id' => $userId,
        'created_at' => now(),
        'updated_at' => now(),
      ]);

      // Crear contrato para el cliente
      DB::table('contracts')->insert([
        'client_id' => $clientId,
        'start_date' => $startDate = fake()->dateTimeBetween('-2 years', 'now'),
        'expiration_date' => date('Y-m-d', strtotime('+1 year', $startDate->getTimestamp())),
        'medical_checkups_count' => fake()->numberBetween(3, 12),
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }
  }
}
