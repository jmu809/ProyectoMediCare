<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
  use HasFactory;

  protected $fillable = [
    'studies',
    'awards',
    'description',
    'num_appointments',
    'user_id',
  ];

  /**
   * Relación inversa: un doctor pertenece a un usuario.
   */
  public function user()
  {
    return $this->belongsTo(User::class);
  }
}
