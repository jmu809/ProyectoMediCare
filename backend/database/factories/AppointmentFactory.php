<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Doctor;
use App\Models\Contract;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppointmentFactory extends Factory
{
  public function definition()
  {
    // Asegurar que las relaciones existan
    $client = Client::inRandomOrder()->first();
    $contract = Contract::where('client_id', $client->id)->first();

    return [
      'client_id' => $client->id,
      'doctor_id' => Doctor::inRandomOrder()->first()->id,
      'contract_id' => $contract->id, // Relacionar con el contrato del cliente
      'date_time' => $this->faker->dateTimeBetween('-5 years', '+1 years'),
      'status' => $this->faker->numberBetween(0, 2),
      'actual_checkups_count' => $this->faker->numberBetween(0, 5),
    ];
  }
}
