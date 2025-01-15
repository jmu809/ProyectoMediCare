<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthRegisterTest extends TestCase
{
  use RefreshDatabase;

  /**
   * Test para validar el registro de un usuario exitoso.
   */
  public function test_user_can_register_successfully()
  {
    $formData = [
      'firstName' => 'Juan',
      'lastName' => 'Pérez',
      'email' => 'juan.perez@example.com',
      'password' => 'password',
      'password_confirmation' => 'password',
    ];

    $response = $this->postJson('/api/register', $formData);

    $response->assertStatus(201)
      ->assertJsonStructure([
        'success',
        'user' => [
          'id',
          'name',
          'lastname',
          'email',
          'role_id',
        ],
        'token',
      ]);

    // Verificar que el usuario está en la base de datos
    $this->assertDatabaseHas('users', [
      'email' => 'juan.perez@example.com',
      'name' => 'Juan',
      'lastname' => 'Pérez',
    ]);
  }

  /**
   * Test para validar el fallo en el registro por correo duplicado.
   */
  public function test_registration_fails_with_duplicate_email()
  {
    // Crear un usuario existente
    \DB::table('users')->insert([
      'name' => 'Usuario',
      'lastname' => 'Existente',
      'email' => 'usuario.existente@example.com',
      'password' => \Hash::make('password'),
      'role_id' => 2, // Rol de cliente
    ]);

    $formData = [
      'firstName' => 'Juan',
      'lastName' => 'Pérez',
      'email' => 'usuario.existente@example.com', // Email duplicado
      'password' => 'password',
      'password_confirmation' => 'password',
    ];

    $response = $this->postJson('/api/register', $formData);

    $response->assertStatus(422) // Error de validación
      ->assertJsonValidationErrors(['email']);
  }

  /**
   * Test para validar el fallo en el registro por contraseña no confirmada.
   */
  public function test_registration_fails_with_unmatched_password_confirmation()
  {
    $formData = [
      'firstName' => 'Juan',
      'lastName' => 'Pérez',
      'email' => 'juan.perez@example.com',
      'password' => 'password',
      'password_confirmation' => 'wrong_password', // Contraseña no coincide
    ];

    $response = $this->postJson('/api/register', $formData);

    $response->assertStatus(422) // Error de validación
      ->assertJsonValidationErrors(['password']);
  }
}
