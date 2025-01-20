import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private apiUrl = '/api/contracts'; // Asegúrate de que esta ruta sea correcta

  constructor(private http: HttpClient) {}

  getAllContracts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
