<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
  use HasFactory;

  /**
   * Los atributos que se pueden asignar masivamente.
   *
   * @var array
   */
  protected $fillable = [
    'client_id',
    'start_date',
    'expiration_date',
    'created_at',
    'updated_at',
  ];

  /**
   * Relación: El contrato pertenece a un cliente.
   */
  public function client()
  {
    return $this->belongsTo(Client::class);
  }
}
