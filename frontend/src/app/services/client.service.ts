import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}
  registerClient(clientData: any): Observable<any> {
    return this.http.post('/api/register-client', clientData);
  }

  getClients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clients`); // Llama al endpoint del backend
  }
  getClientById(clientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/clients/${clientId}`);
  }

  updateClient(userId: number, clientData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/clients/${userId}`, clientData);
  }
}
