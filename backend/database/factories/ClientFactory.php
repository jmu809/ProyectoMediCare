<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
  public function definition()
  {
    return [
      'company_name' => $this->faker->company,
      'cif' => $this->faker->unique()->bothify('########X'), // Evitar conflictos con CIF duplicados
      'tel_number' => $this->faker->numerify('#########'),
      'address' => $this->faker->address,
      'city' => $this->faker->city,
      'state' => $this->faker->state,
      'postal_code' => $this->faker->postcode,
      // Crear usuario asociado antes de insertar el cliente
      'user_id' => User::factory()->create(['role_id' => 2])->id,
    ];
  }
}
