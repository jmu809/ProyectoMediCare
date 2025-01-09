<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
  use HasFactory;

  protected $fillable = [
    'company_name',
    'cif',
    'tel_number',
    'address',
    'city',
    'state',
    'postal_code',
    'user_id',
  ];

  /**
   * Relación inversa: un cliente pertenece a un usuario.
   */
  public function user()
  {
    return $this->belongsTo(User::class);
  }
}
