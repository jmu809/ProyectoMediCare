import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private apiUrl = `${environment.apiUrl}`;

  private apiUrl2 = `${this.apiUrl}/contracts`; // Asegúrate de que esta ruta sea correcta

  constructor(private http: HttpClient) {}

  getAllContracts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl2);
  }
}
