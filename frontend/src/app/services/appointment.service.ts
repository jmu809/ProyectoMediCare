import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Asegúrate de importar correctamente
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}`;

  cancelAppointment(appointmentId: number): Observable<any> {
    const url = `${this.apiUrl}/appointments/${appointmentId}/cancel`;
    return this.http.put(url, {}); // Enviar solicitud PUT con el ID de la cita
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  getReservedTimes(date: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.apiUrl}/appointments/reserved-times?date=${date}`
    );
  }

  getUserAppointments(): Observable<any[]> {
    const headers = this.authService.getAuthHeaders(); // Obtener las cabeceras con el token
    return this.http.get<any[]>(`${this.apiUrl}/appointments/user`, {
      headers,
    });
  }
  updateAppointment(appointmentId: number, data: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/admin/appointments/${appointmentId}`,
      data
    );
  }
  getAdminAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/appointments`);
  }
  getAllAppointments(): Observable<any[]> {
    const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<any[]>(`${this.apiUrl}/admin/appointments`, {
      headers,
    });
  }
  updateAppointmentStatus(
    appointmentId: number,
    status: number
  ): Observable<any> {
    const headers = this.authService.getAuthHeaders(); // Obtén las cabeceras con el token
    return this.http.put(
      `${this.apiUrl}/appointments/${appointmentId}/status`,
      { status }, // Envía el estado como payload
      { headers }
    );
  }
  getDoctors(): Observable<any[]> {
    const headers = this.authService.getAuthHeaders(); // Agregar las cabeceras con el token
    return this.http.get<any[]>(`${this.apiUrl}/doctors`, { headers });
  }

  getFilteredAppointments(filters: any): Observable<any[]> {
    const headers = this.authService.getAuthHeaders(); // Agregar las cabeceras con el token
    return this.http.get<any[]>(`${this.apiUrl}/appointments`, {
      headers,
      params: filters, // Pasar los filtros como parámetros de consulta
    });
  }
  getDoctorAppointments(): Observable<any> {
    const token = localStorage.getItem('token'); // Asegúrate de que el token se guarde en localStorage al iniciar sesión
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/doctor-appointments`, { headers });
  }
  getAppointmentById(appointmentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/appointments/${appointmentId}`);
  }

  updateAppointmentMed(
    appointmentId: number,
    appointmentData: any
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/appointments/${appointmentId}`,
      appointmentData
    );
  }
}
