import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

import { NgModule } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule], // Agrega FormsModule al arreglo de imports
  selector: 'app-admin-appointments',
  templateUrl: './admin-appointments.component.html',
  styleUrls: ['./admin-appointments.component.css'], // Nota: "styleUrl" corregido a "styleUrls"
})
export class AdminAppointmentsComponent implements OnInit {
  appointments: any[] = []; // Lista de citas
  filteredAppointments: any[] = []; // Lista de citas filtradas
  doctors: any[] = []; // Lista de doctores para el filtro
  errorMessage: string = '';
  filters = {
    startDate: '',
    endDate: '',
    clientName: '',
    doctorId: '',
    status: '',
  };
  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.loadDoctors();
  }

  loadAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe({
      next: (response: any[]) => {
        console.log('Citas cargadas:', response);
        this.appointments = response; // Asigna todas las citas
        this.filteredAppointments = response; // Inicialmente no hay filtros
      },
      error: (err) => {
        console.error('Error al cargar las citas:', err);
        this.errorMessage = 'Ocurrió un error al cargar las citas.';
      },
    });
  }
  loadDoctors(): void {
    this.appointmentService.getDoctors().subscribe({
      next: (response: any[]) => {
        console.log('Doctores cargados:', response);
        this.doctors = response; // Asigna la lista de doctores
      },
      error: (err) => {
        console.error('Error al cargar los doctores:', err);
      },
    });
  }
  applyFilters(): void {
    this.filteredAppointments = this.appointments.filter((appointment) => {
      const matchesDate =
        (!this.filters.startDate ||
          appointment.date_time >= this.filters.startDate) &&
        (!this.filters.endDate ||
          appointment.date_time <= this.filters.endDate);

      const matchesClient =
        !this.filters.clientName ||
        `${appointment.client_name} ${appointment.client_lastname}`
          .toLowerCase()
          .includes(this.filters.clientName.toLowerCase());

      const matchesDoctor =
        !this.filters.doctorId ||
        Number(appointment.doctor_id) === Number(this.filters.doctorId);

      const matchesStatus =
        this.filters.status === '' || // Si no hay filtro, coinciden todos los estados
        Number(appointment.status) === Number(this.filters.status);

      return matchesDate && matchesClient && matchesDoctor && matchesStatus;
    });
  }

  cancelAppointment(appointmentId: number): void {
    if (!appointmentId) {
      console.error('El ID de la cita es undefined o inválido.');
      return;
    }

    this.appointmentService.cancelAppointment(appointmentId).subscribe({
      next: (response) => {
        console.log('Cita cancelada con éxito:', response);
        // Actualiza la lista de citas
        this.loadAppointments();
      },
      error: (err) => {
        console.error('Error al cancelar la cita:', err);
      },
    });
  }
  editAppointment(appointmentId: number): void {
    console.log(`Editar cita con ID: ${appointmentId}`);
    // Implementa la lógica para editar la cita aquí
  }
  /*   updateStatus(appointmentId: number, status: number): void {
    if (!appointmentId) {
      console.error('El ID de la cita es undefined o inválido.');
      return;
    }

    this.appointmentService
      .updateAppointmentStatus(appointmentId, status)
      .subscribe({
        next: (response) => {
          console.log(
            `Estado actualizado a ${status} para la cita con ID ${appointmentId}:`,
            response
          );
          this.loadAppointments(); // Recarga las citas después de actualizar el estado
        },
        error: (err) => {
          console.error('Error al actualizar el estado de la cita:', err);
        },
      });
  } */
  updateStatus(appointmentId: number, status: number): void {
    this.appointmentService
      .updateAppointmentStatus(appointmentId, status)
      .subscribe({
        next: () => {
          this.loadAppointments();
        },
        error: (err) => {
          console.error('Error al actualizar el estado:', err);
        },
      });
  }
}
