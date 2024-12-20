import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'; // Importamos el archivo de entorno
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common'; // Importa CommonModule para usar el pipe json

@Injectable({
  providedIn: 'root', // Hace que el servicio esté disponible en toda la aplicación
})
export class ApiService {
  private apiUrl = environment.apiUrl; // URL de la API desde environment.ts

  constructor(private http: HttpClient) {}

  // Ejemplo de una función para obtener datos desde Laravel
  getTestData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/test`);
  }
}
