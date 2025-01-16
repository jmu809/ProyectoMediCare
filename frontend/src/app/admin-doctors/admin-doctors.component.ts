import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-admin-doctors',
  templateUrl: './admin-doctors.component.html',
  styleUrls: ['./admin-doctors.component.css'],
})
export class AdminDoctorsComponent implements OnInit {
  doctors: any[] = []; // Lista de doctores
  filteredDoctors: any[] = []; // Lista de doctores filtrados
  errorMessage: string = '';
  filters = {
    name: '',
    email: '',
    studies: '',
    numAppointments: 100, // Filtro para el máximo de citas
  };

  constructor(
    private doctorService: DoctorService,
    private router: Router // Inyecta el Router correctamente
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (response: any[]) => {
        console.log('Doctores cargados:', response);
        this.doctors = response;

        // Calcular el valor máximo de citas dinámicamente
        const maxCitas = Math.max(...response.map((doc) => doc.num_citas || 0));
        this.filters.numAppointments = maxCitas;

        this.filteredDoctors = response; // Inicializar doctores filtrados
      },
      error: (err) => {
        console.error('Error al cargar los doctores:', err);
        this.errorMessage = 'Ocurrió un error al cargar los doctores.';
      },
    });
  }

  applyFilters(): void {
    this.filteredDoctors = this.doctors.filter((doctor) => {
      const matchesName =
        !this.filters.name ||
        `${doctor.name} ${doctor.lastname}`
          .toLowerCase()
          .includes(this.filters.name.toLowerCase());

      const matchesEmail =
        !this.filters.email ||
        doctor.email.toLowerCase().includes(this.filters.email.toLowerCase());

      const matchesStudies =
        !this.filters.studies ||
        doctor.studies
          .toLowerCase()
          .includes(this.filters.studies.toLowerCase());

      const matchesNumAppointments =
        doctor.num_citas <= this.filters.numAppointments;

      return (
        matchesName && matchesEmail && matchesStudies && matchesNumAppointments
      );
    });
  }

  clearFilters(): void {
    this.filters = {
      name: '',
      email: '',
      studies: '',
      numAppointments: Math.max(
        ...this.doctors.map((doc) => doc.num_citas || 0)
      ),
    };
    this.filteredDoctors = this.doctors; // Restaurar lista completa
  }

  navigateToAddDoctor(): void {
    this.router.navigate(['/register-doctor']); // Ruta de la página de registro
  }
}
