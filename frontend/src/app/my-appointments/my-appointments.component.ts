import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.css'],
})
export class MyAppointmentsComponent implements OnInit {
  appointments: any[] = []; // Lista de citas
  errorMessage: string = '';

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getUserAppointments().subscribe({
      next: (response: any[]) => {
        this.appointments = response; // Asigna las citas
      },
      error: (err) => {
        console.error('Error al cargar las citas:', err);
        this.errorMessage = 'Ocurrió un error al cargar tus citas.';
      },
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
}
