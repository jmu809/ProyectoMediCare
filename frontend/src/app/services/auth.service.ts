import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AbstractControl, ValidationErrors } from '@angular/forms';

interface RegisterResponse {
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token';
  private userKey = 'user';
  private roleKey = 'role'; // Nuevo para almacenar el rol
  private userSubject = new BehaviorSubject<any>(this.getUser()); // Emite el estado del usuario

  constructor(private http: HttpClient) {}

  // Método para iniciar sesión
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`/api/login`, credentials).pipe(
      tap((response: any) => {
        this.setToken(response.token);
        this.setUser(response.user);
        this.setRole(response.user.role.name); // Guardar el rol
        this.userSubject.next(response.user); // Emitir cambios en el estado del usuario
      })
    );
  }

  // Obtener el rol del usuario
  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  // Guardar el rol del usuario
  setRole(role: string): void {
    localStorage.setItem(this.roleKey, role);
  }

  // Verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Emitir cambios de usuario
  onAuthChange(): Observable<any> {
    return this.userSubject.asObservable();
  }

  // Método para registrar un nuevo usuario
  register(data: any): Observable<any> {
    return this.http.post('/api/register', data).pipe(
      catchError((error) => {
        console.error('Error en el registro:', error);
        return throwError(() => error);
      })
    );
  }

  // Guardar el token
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Obtener el token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Guardar la información del usuario
  setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Obtener la información del usuario
  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.roleKey);
    this.userSubject.next(null); // Emitir que no hay usuario
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Obtener headers con el token
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>('/api/doctors'); // URL del backend
  }

  createAppointment(appointmentData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(
      `${environment.apiUrl}/appointments`,
      appointmentData,
      {
        headers: headers,
        withCredentials: true,
      }
    );
  }

  getReservedTimes(date: string): Observable<string[]> {
    return this.http.get<string[]>(
      `/api/appointments/reserved-times?date=${date}`
    );
  }

  updateClient(clientData: any): Observable<any> {
    const headers = this.getAuthHeaders(); // Obtener las cabeceras con el token
    return this.http.put('/api/client/update', clientData, { headers });
  }
}

export class ProtectedService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getProtectedResource(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/protected`, {
      headers: this.authService.getAuthHeaders(),
    });
  }
}
