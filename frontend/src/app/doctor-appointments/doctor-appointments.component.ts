import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeeklyCalendarComponent } from '../weekly-calendar/weekly-calendar.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, WeeklyCalendarComponent],
  selector: 'app-doctor-appointments',
  templateUrl: './doctor-appointments.component.html',
  styleUrls: ['./doctor-appointments.component.css'],
})
export class DoctorAppointmentsComponent implements OnInit {
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  errorMessage: string = '';
  filters = {
    startDate: '',
    endDate: '',
    clientName: '',
  };

  constructor(private appointmentService: AppointmentService) {}

  loadDoctorAppointments(): void {
    this.appointmentService.getDoctorAppointments().subscribe({
      next: (response: any[]) => {
        console.log('Citas del médico cargadas:', response);
        this.appointments = response;
        this.filteredAppointments = response;
      },
      error: (err) => {
        console.error('Error al cargar las citas del médico:', err);
        this.errorMessage = 'Ocurrió un error al cargar las citas.';
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

      return matchesDate && matchesClient;
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
        this.loadDoctorAppointments();
      },
      error: (err) => {
        console.error('Error al cancelar la cita:', err);
      },
    });
  }

  updateStatus(appointmentId: number, status: number): void {
    this.appointmentService
      .updateAppointmentStatus(appointmentId, status)
      .subscribe({
        next: () => {
          this.loadDoctorAppointments();
        },
        error: (err) => {
          console.error('Error al actualizar el estado:', err);
        },
      });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert(
        'No estás autenticado. Redirigiendo a la página de inicio de sesión.'
      );
      window.location.href = '/login';
      return;
    }

    this.loadDoctorAppointments();
  }
}
