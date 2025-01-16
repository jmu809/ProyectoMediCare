import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DoctorService } from '../services/doctor.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importar Router

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-register-doctor',
  templateUrl: './register-doctor.component.html',
  styleUrls: ['./register-doctor.component.css'],
})
export class RegisterDoctorComponent {
  registerDoctorForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router // Inyectar Router aquí
  ) {
    this.registerDoctorForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
      studies: ['', Validators.required],
      awards: [''],
      description: [''],
    });
  }

  onSubmit() {
    if (this.registerDoctorForm.valid) {
      this.doctorService
        .registerDoctor(this.registerDoctorForm.value)
        .subscribe({
          next: (response) => {
            alert('Médico registrado exitosamente');
            this.router.navigate(['/admin-doctors']); // Redirigir a la página de gestión de médicos
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = 'Error al registrar el médico.';
          },
        });
    }
  }
}
