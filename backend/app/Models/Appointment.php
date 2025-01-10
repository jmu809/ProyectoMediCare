<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
  use HasFactory;

  /**
   * Atributos asignables en masa.
   *
   * @var array
   */
  protected $fillable = [
    'client_id',
    'doctor_id',
    'contract_id',
    'date_time',
    'status',
    'actual_checkups_count',
  ];

  /**
   * Relación: La cita pertenece a un cliente.
   */
  public function client()
  {
    return $this->belongsTo(Client::class);
  }

  /**
   * Relación: La cita pertenece a un médico (usuario con rol = 3).
   */
  public function doctor()
  {
    return $this->belongsTo(User::class, 'doctor_id');
  }

  /**
   * Relación: La cita pertenece a un contrato.
   */
  public function contract()
  {
    return $this->belongsTo(Contract::class);
  }
}
