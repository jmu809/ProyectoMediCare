import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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
  private userSubject = new BehaviorSubject<any>(this.getUser());

  constructor(private http: HttpClient) {}

  // Método para iniciar sesión
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        this.setToken(response.token);
        this.setUser(response.user);
      })
    );
  }

  // Método para emitir cambios de usuario
  onAuthChange(): Observable<any> {
    return this.userSubject.asObservable();
  }

  // Método para registrar un nuevo usuario
  register(data: {
    firstName: any;
    lastName: any;
    password: any;
    password_confirmation: (
      | string
      | ((control: AbstractControl) => ValidationErrors | null)
    )[];
    email: any;
  }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${environment.apiUrl}/register`,
      data
    );
  }

  // Método para guardar el token
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Método para obtener el token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Método para guardar la información del usuario
  setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Método para obtener la información del usuario
  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Método para obtener los headers con el token
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
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
