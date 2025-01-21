import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // Cambiar al nuevo endpoint
  getAllDoctors(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all-doctors`);
  }
  registerDoctor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-doctor`, data);
  }
}
/* import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  constructor(private http: HttpClient) {}

  getAllDoctors(): Observable<any> {
    const token = localStorage.getItem('authToken'); // Obtén el token del almacenamiento local (o de donde lo guardes).
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Incluye el token en la cabecera.
    });

    return this.http.get('/api/all-doctors', { headers }); // Llama al endpoint con los headers.
  }
} */
