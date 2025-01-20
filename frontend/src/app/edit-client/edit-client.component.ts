import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../services/client.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class EditClientComponent implements OnInit {
  editClientForm: FormGroup;
  clientId: number | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editClientForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company_name: ['', Validators.required],
      cif: ['', Validators.required],
      tel_number: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postal_code: ['', Validators.required],
    });
  }

  loadClientData(clientId: number): void {
    this.clientService.getClientById(clientId).subscribe({
      next: (response) => {
        const { client, user } = response;

        // Rellena los datos del cliente
        this.editClientForm.patchValue({
          company_name: client.company_name,
          cif: client.cif,
          tel_number: client.tel_number,
          address: client.address,
          city: client.city,
          state: client.state,
          postal_code: client.postal_code,
          name: user.name, // Datos del usuario
          lastname: user.lastname,
          email: user.email,
        });
      },
      error: (err) => {
        console.error('Error al cargar los datos del cliente:', err);
        this.errorMessage = 'Error al cargar los datos del cliente.';
      },
    });
  }

  onSubmit(): void {
    if (this.editClientForm.valid && this.clientId) {
      this.clientService
        .updateClient(this.clientId, this.editClientForm.value)
        .subscribe({
          next: () => {
            alert('Cliente actualizado exitosamente');
            this.router.navigate(['/admin-clients']); // Redirigir a la página de clientes
          },
          error: (err) => {
            console.error('Error al actualizar el cliente:', err);
            this.errorMessage = 'Error al actualizar el cliente.';
          },
        });
    }
  }

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id'); // Obtén el ID desde la URL
    if (clientId) {
      console.log('Cargando datos para el cliente con ID:', clientId); // Verifica el ID en la consola
      this.clientId = Number(clientId); // Almacena el ID en una variable local
      this.loadClientData(this.clientId); // Carga los datos del cliente
    } else {
      console.error('ID de cliente no encontrado en la ruta');
    }
  }
}
