import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { password, confirmPassword } = this.registerForm.value;

      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      const formData = {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        password_confirmation: this.registerForm.value.confirmPassword,
      };

      this.authService.register(formData).subscribe({
        next: (response) => {
          window.location.href = '/index';
        },
        error: (err) => {
          console.error('Error en el registro:', err);

          // Manejar errores de validación específicos
          if (err.status === 422) {
            const errorDetails = err.error.errors; // Captura los errores específicos
            if (errorDetails?.email) {
              this.errorMessage = 'El correo electrónico ya está en uso.';
            } else {
              this.errorMessage =
                'Error de validación. Por favor revisa los datos ingresados.';
            }
          } else {
            this.errorMessage =
              err.error?.message || 'Error en el registro. Intenta más tarde.';
          }
        },
      });
    }
  }
}
