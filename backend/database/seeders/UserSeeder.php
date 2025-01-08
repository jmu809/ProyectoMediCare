<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
  public function run()
  {
    DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // Deshabilitar las restricciones de claves foráneas
    DB::table('clients')->truncate();
    DB::table('users')->truncate();
    DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // Habilitar las restricciones de claves foráneas

    // Crear usuario administrador
    DB::table('users')->insert([
      'name' => 'Admin',
      'lastname' => 'User',
      'email' => 'admin@medicare.com',
      'password' => Hash::make('password'),
      'role_id' => 1, // 1 = admin
    ]);

    // Crear usuario cliente
    $clientUserId = DB::table('users')->insertGetId([
      'name' => 'Cliente',
      'lastname' => 'Ejemplo',
      'email' => 'cliente@medicare.com',
      'password' => Hash::make('password'),
      'role_id' => 2, // 2 = cliente
    ]);

    DB::table('clients')->insert([
      'company_name' => 'Seyte',
      'cif' => '87654321X',
      'tel_number' => '987654321',
      'address' => 'calle de la piruleta',
      'city' => 'Almería',
      'state' => 'Tabernas',
      'postal_code' => '04001',
      'user_id' => $clientUserId, // Relación con el usuario cliente
    ]);

    // Crear usuario doctor
    DB::table('users')->insert([
      'name' => 'Doctor',
      'lastname' => 'Ejemplo',
      'email' => 'doctor@medicare.com',
      'password' => Hash::make('password'),
      'role_id' => 3, // 3 = doctor
    ]);
  }
}
