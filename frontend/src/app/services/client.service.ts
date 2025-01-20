import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient) {}
  registerClient(clientData: any): Observable<any> {
    return this.http.post('/api/register-client', clientData);
  }

  getClients(): Observable<any> {
    return this.http.get('/api/clients'); // Llama al endpoint del backend
  }
  getClientById(clientId: number): Observable<any> {
    return this.http.get(`/api/clients/${clientId}`);
  }

  updateClient(userId: number, clientData: any): Observable<any> {
    return this.http.put(`/api/clients/${userId}`, clientData);
  }
}
