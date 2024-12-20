<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
  public function run()
  {
    // Crear usuario administrador
    DB::table('users')->insert([
      'name' => 'Admin',
      'lastname' => 'User',
      'email' => 'admin@medicare.com',
      'password' => Hash::make('password'),
      'role_id' => 1, // 1 = admin
    ]);

    // Crear usuario cliente de ejemplo
    DB::table('users')->insert([
      'name' => 'Cliente',
      'lastname' => 'Ejemplo',
      'email' => 'cliente@medicare.com',
      'password' => Hash::make('password'),
      'role_id' => 2, // 2 = client
    ]);

    // Crear usuario doctor de ejemplo
    DB::table('users')->insert([
      'name' => 'Doctor',
      'lastname' => 'Ejemplo',
      'email' => 'doctor@medicare.com',
      'password' => Hash::make('password'),
      'role_id' => 3, // 3 = doctor
    ]);
  }
}
