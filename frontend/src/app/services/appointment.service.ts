import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Asegúrate de importar correctamente

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  cancelAppointment(appointmentId: number): Observable<any> {
    const url = `/api/appointments/${appointmentId}/cancel`;
    return this.http.put(url, {}); // Enviar solicitud PUT con el ID de la cita
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  getReservedTimes(date: string): Observable<string[]> {
    return this.http.get<string[]>(
      `/api/appointments/reserved-times?date=${date}`
    );
  }

  getUserAppointments(): Observable<any[]> {
    const headers = this.authService.getAuthHeaders(); // Obtener las cabeceras con el token
    return this.http.get<any[]>('/api/appointments/user', { headers });
  }
  updateAppointment(appointmentId: number, data: any): Observable<any> {
    return this.http.put(`/api/admin/appointments/${appointmentId}`, data);
  }
  getAdminAppointments(): Observable<any[]> {
    return this.http.get<any[]>('/api/admin/appointments');
  }
  getAllAppointments(): Observable<any[]> {
    const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<any[]>('/api/admin/appointments', { headers });
  }
}
