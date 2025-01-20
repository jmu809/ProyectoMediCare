<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Contract;
use Illuminate\Support\Facades\Log;

class ContractController extends Controller
{
  /**
   * Obtiene todos los contratos con la información del cliente asociada.
   */
  public function getAllContracts()
  {
    $contracts = DB::table('contracts')
      ->join('clients', 'contracts.client_id', '=', 'clients.id')
      ->join('users', 'clients.user_id', '=', 'users.id')
      ->select(
        'contracts.id',
        'contracts.start_date',
        'contracts.expiration_date',
        'contracts.medical_checkups_count',
        'users.name as client_name',
        'users.lastname as client_lastname'
      )
      ->get();

    return response()->json($contracts);
  }
}
