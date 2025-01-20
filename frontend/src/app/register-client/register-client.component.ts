import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClientService } from '../services/client.service'; // Servicio para manejar la lógica de clientes

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-register-client',
  templateUrl: './register-client.component.html',
  styleUrls: ['./register-client.component.css'],
})
export class RegisterClientComponent {
  registerClientForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router
  ) {
    this.registerClientForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
      company_name: ['', Validators.required],
      cif: ['', Validators.required],
      tel_number: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postal_code: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{5}$')],
      ],
    });
  }

  onSubmit(): void {
    if (this.registerClientForm.valid) {
      this.clientService
        .registerClient(this.registerClientForm.value)
        .subscribe({
          next: (response) => {
            alert(response.message); // Mostrar mensaje del backend
            this.router.navigate(['/admin-clients']); // Redirigir tras el registro
          },
          error: (err) => {
            console.error('Error al registrar cliente:', err);
            alert('Ocurrió un error al registrar el cliente.');
          },
        });
    }
  }
}
