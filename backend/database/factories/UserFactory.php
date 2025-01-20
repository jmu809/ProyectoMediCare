<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
  protected $model = User::class;

  public function definition()
  {
    return [
      'name' => $this->faker->firstName,
      'lastname' => $this->faker->lastName,
      'email' => $this->faker->unique()->safeEmail,
      'email_verified_at' => now(),
      'password' => bcrypt('password'), // Contraseña predeterminada
      'role_id' => 2, // Por defecto, cliente
      'remember_token' => Str::random(10),
    ];
  }
}
