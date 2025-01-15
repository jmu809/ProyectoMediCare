<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up()
  {
    Schema::create('appointments', function (Blueprint $table) {
      $table->id();
      $table->foreignId('client_id')->constrained()->onDelete('cascade');
      $table->foreignId('doctor_id')->constrained()->onDelete('cascade');
      $table->foreignId('contract_id')->constrained()->onDelete('cascade');
      $table->dateTime('date_time');
      $table->integer('status');
      $table->integer('actual_checkups_count');
      $table->timestamps();
    });
  }

  public function down()
  {
    Schema::dropIfExists('appointments');
  }
};
