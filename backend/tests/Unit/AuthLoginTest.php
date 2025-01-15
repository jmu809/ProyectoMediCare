<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthLoginTest extends TestCase
{
  use RefreshDatabase;

  /**
   * Configurar los datos iniciales antes de ejecutar las pruebas.
   */
  protected function setUp(): void
  {
    parent::setUp();

    // Insertar usuarios en la base de datos para las pruebas
    \DB::table('users')->insert([
      [
        'name' => 'Admin',
        'lastname' => 'User',
        'email' => 'admin@medicare.com',
        'password' => Hash::make('password'),
        'role_id' => 1, // 1 = admin
      ],
      [
        'name' => 'Cliente',
        'lastname' => 'Ejemplo',
        'email' => 'cliente@medicare.com',
        'password' => Hash::make('password'),
        'role_id' => 2, // 2 = cliente
      ],
      [
        'name' => 'Doctor',
        'lastname' => 'Ejemplo',
        'email' => 'doctor@medicare.com',
        'password' => Hash::make('password'),
        'role_id' => 3, // 3 = doctor
      ],
    ]);
  }

  /**
   * Test para validar el inicio de sesión como administrador.
   */
  public function test_admin_can_login()
  {
    $response = $this->postJson('/api/login', [
      'email' => 'admin@medicare.com',
      'password' => 'password',
    ]);

    $response->assertStatus(200)
      ->assertJsonStructure([
        'user' => [
          'id',
          'name',
          'lastname',
          'email',
          'role_id',
        ],
        'token',
      ]);
  }

  /**
   * Test para validar el inicio de sesión como cliente.
   */
  public function test_client_can_login()
  {
    $response = $this->postJson('/api/login', [
      'email' => 'cliente@medicare.com',
      'password' => 'password',
    ]);

    $response->assertStatus(200)
      ->assertJsonStructure([
        'user' => [
          'id',
          'name',
          'lastname',
          'email',
          'role_id',
        ],
        'token',
      ]);
  }

  /**
   * Test para validar el inicio de sesión como doctor.
   */
  public function test_doctor_can_login()
  {
    $response = $this->postJson('/api/login', [
      'email' => 'doctor@medicare.com',
      'password' => 'password',
    ]);

    $response->assertStatus(200)
      ->assertJsonStructure([
        'user' => [
          'id',
          'name',
          'lastname',
          'email',
          'role_id',
        ],
        'token',
      ]);
  }
}
