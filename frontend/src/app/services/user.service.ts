import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root', // Hace que el servicio esté disponible en toda la aplicación
})
export class UserService {
  private apiUrl = `${environment.apiUrl}`;

  private apiUrl2 = `${this.apiUrl}/register`; // URL de tu backend para registro

  constructor(private http: HttpClient) {}

  // Método para registrar un usuario
  register(user: any): Observable<any> {
    return this.http.post(this.apiUrl2, user);
  }
}
