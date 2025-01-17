import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    ReactiveFormsModule, // Para formGroup y formControlName
    CommonModule, // Para directivas como *ngIf y *ngFor
    RouterModule,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // Inyecta el AuthService en lugar de http
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loginData = this.loginForm.value;

      this.authService.login(loginData).subscribe({
        next: (response: {
          token: string;
          user: { role: { name: string } };
        }) => {
          this.isLoading = false;
          this.authService.setToken(response.token);

          // Almacenar el rol como un string en localStorage
          localStorage.setItem('role', response.user.role.name);

          // Redirigir según el rol
          if (response.user.role.name === 'doctor') {
            this.router.navigate(['/doctor-appointments']);
          } else if (response.user.role.name === 'admin') {
            this.router.navigate(['/admin-appointments']);
          } else {
            this.router.navigate(['/index']);
          }
        },
        error: (err: { error: { message: string } }) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Error en el servidor';
        },
      });
    }
  }
}
