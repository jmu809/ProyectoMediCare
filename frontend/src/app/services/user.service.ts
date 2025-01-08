import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Hace que el servicio esté disponible en toda la aplicación
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/register'; // URL de tu backend para registro

  constructor(private http: HttpClient) {}

  // Método para registrar un usuario
  register(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }
}
