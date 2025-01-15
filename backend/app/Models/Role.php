<?php
// Role.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
  use HasFactory;

  public $timestamps = false; // Si no tienes timestamps en roles

  protected $fillable = [
    'name',
  ];

  // Relación con usuarios
  public function users()
  {
    return $this->hasMany(User::class);
  }
}
