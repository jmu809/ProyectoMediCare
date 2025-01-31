<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
  public function run()
  {
    $this->call([
      /*       UserSeeder::class,
      ContractSeeder::class,
      DoctorSeeder::class,
      AppointmentsSeeder::class,
 */
      LargeDoctorSeeder::class,
      LargeUserClientSeeder::class,
      LargeAppointmentSeeder::class,
    ]);
  }
}
