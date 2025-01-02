import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, of, catchError, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  error$ = new Observable<string>();
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error$ = this.authService.login(this.loginForm.value).pipe(
        tap(() => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        }),
        catchError((error) => {
          this.isLoading = false;
          return of(error.message || 'Credenciales inválidas');
        })
      );
    }
  }
}
