import { Component, OnInit } from '@angular/core';
import { ClientService } from '../services/client.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-admin-clients',
  templateUrl: './admin-clients.component.html',
  styleUrls: ['./admin-clients.component.css'],
})
export class AdminClientsComponent implements OnInit {
  clients: any[] = []; // Lista de clientes
  filteredClients: any[] = []; // Lista de clientes filtrados
  errorMessage: string = '';
  minCitas: number = 0; // Valor mínimo para el rango de citas
  maxCitas: number = 100; // Valor inicial para el rango máximo
  filters = {
    name: '',
    email: '',
    dni: '',
    company: '',
    city: '',
    numCitas: 100, // Valor inicial del filtro máximo
  };

  constructor(private clientService: ClientService, private router: Router) {} // Inyecta el Router correctamente) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (response: any[]) => {
        console.log('Clientes cargados:', response);
        this.clients = response;

        // Calcular el valor máximo de citas dinámicamente
        this.maxCitas = Math.max(
          ...response.map((client) => client.num_citas || 0)
        );
        this.filters.numCitas = this.maxCitas; // Ajustar el filtro al máximo

        this.filteredClients = response; // Inicializar clientes filtrados
      },
      error: (err) => {
        console.error('Error al cargar los clientes:', err);
        this.errorMessage = 'Ocurrió un error al cargar los clientes.';
      },
    });
  }

  applyFilters(): void {
    this.filteredClients = this.clients.filter((client) => {
      const matchesName =
        !this.filters.name ||
        `${client.name} ${client.lastname}`
          .toLowerCase()
          .includes(this.filters.name.toLowerCase());

      const matchesEmail =
        !this.filters.email ||
        client.email.toLowerCase().includes(this.filters.email.toLowerCase());

      const matchesDNI =
        !this.filters.dni ||
        client.dni.toLowerCase().includes(this.filters.dni.toLowerCase());

      const matchesCompany =
        !this.filters.company ||
        client.company
          .toLowerCase()
          .includes(this.filters.company.toLowerCase());

      const matchesCity =
        !this.filters.city ||
        client.city.toLowerCase().includes(this.filters.city.toLowerCase());

      const matchesNumCitas = client.num_citas <= this.filters.numCitas;

      return (
        matchesName &&
        matchesEmail &&
        matchesDNI &&
        matchesCompany &&
        matchesCity &&
        matchesNumCitas
      );
    });
  }
  clearFilters(): void {
    this.filters = {
      name: '',
      email: '',
      dni: '',
      company: '',
      city: '',
      numCitas: this.maxCitas, // Restaurar al valor máximo
    };
    this.filteredClients = this.clients; // Restaurar la lista completa
  }
  navigateToAddClient() {
    this.router.navigate(['/register-client']); // Ruta de la página de registro
  }
  navigateToEditClient(userId: number): void {
    this.router.navigate(['/edit-client', userId]);
  }
}
