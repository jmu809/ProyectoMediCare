import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service'; // Adjust the path as needed

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { last } from 'rxjs';
import { AppointmentService } from '../services/appointment.service';

@Component({
  standalone: true, // Indica que es independiente
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class AppointmentComponent {
  appointmentForm: FormGroup;
  user: any = null;
  doctors: any[] = [];

  availableTimes = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
  ];
  selectedDate: Date | null = null;
  selectedTime: string | null = null; // Nueva propiedad para almacenar la hora seleccionada

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private dateAdapter: DateAdapter<Date>,
    private appointmentService: AppointmentService
  ) {
    this.dateAdapter.setLocale('es');
    this.appointmentForm = this.fb.group({
      doctor: ['', Validators.required], // Campo obligatorio
    });
  }
  isDateDisabled = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }
    const today = new Date();
    const tomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    return date > tomorrow;
  };

  onDateChange(selectedDate: Date | null): void {
    this.selectedDate = selectedDate; // Actualizamos la fecha seleccionada
    console.log('Fecha seleccionada:', this.selectedDate);

    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      this.appointmentService.getReservedTimes(formattedDate).subscribe({
        next: (reservedTimes) => {
          console.log('Horas ocupadas desde el backend:', reservedTimes);

          // Filtrar las horas disponibles eliminando las ocupadas
          this.availableTimes = [
            '09:00',
            '09:30',
            '10:00',
            '10:30',
            '11:00',
            '11:30',
            '12:00',
            '12:30',
            '13:00',
            '13:30',
            '14:00',
            '14:30',
            '16:00',
            '16:30',
            '17:00',
            '17:30',
            '18:00',
            '18:30',
            '19:00',
            '19:30',
          ].filter((time) => !reservedTimes.includes(time));

          console.log(
            'Horas disponibles después del filtrado:',
            this.availableTimes
          );

          // Forzar la actualización de la vista
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al obtener las horas ocupadas:', err);
        },
      });
    }
  }

  onTimeSelect(time: string, event: Event): void {
    event.preventDefault(); // Evitar el comportamiento predeterminado del botón
    this.selectedTime = time; // Almacena la hora seleccionada
    console.log('Hora seleccionada:', this.selectedTime);
  }

  dateClass = (date: Date): string => {
    if (!this.selectedDate) {
      return '';
    }

    const selected = new Date(this.selectedDate).setHours(0, 0, 0, 0);
    const current = new Date(date).setHours(0, 0, 0, 0);

    const result = selected === current;
    console.log('Comparando fechas:', { current, selected, result });

    return result ? 'selected-date-class' : '';
  };

  ngOnInit(): void {
    this.authService.onAuthChange().subscribe((user) => {
      this.user = user; // Cargar usuario y cliente
    });

    this.authService.getDoctors().subscribe((doctors) => {
      this.doctors = doctors.map((doctor) => ({
        id: doctor.doctor_id, // Cambiar a doctor_id
        name: doctor.name,
        lastname: doctor.lastname,
      }));
    });
  }

  createAppointment(): void {
    if (
      !this.selectedDate ||
      !this.selectedTime ||
      !this.appointmentForm.valid
    ) {
      console.error('Datos incompletos para crear la cita.');
      return;
    }

    const dateTime = new Date(this.selectedDate);
    const [hours, minutes] = this.selectedTime.split(':');
    dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

    // Formato correcto para Laravel: YYYY-MM-DD HH:mm
    const formattedDateTime = dateTime
      .toISOString()
      .slice(0, 16)
      .replace('T', ' ');

    const appointmentData = {
      client_id: this.user.client.id,
      doctor_id: this.appointmentForm.value.doctor,
      date_time: formattedDateTime,
    };

    console.log('Datos a enviar:', appointmentData); // Para debug

    this.authService.createAppointment(appointmentData).subscribe({
      next: (response) => {
        console.log('Cita creada con éxito:', response);
        alert('Cita creada con éxito.');
      },
      error: (err) => {
        console.error('Error detallado:', err);
        alert('Error al crear la cita: ' + err.message);
      },
    });
  }

  onSubmit() {
    if (!this.selectedDate || !this.selectedTime) {
      alert('Selecciona una fecha y una hora.');
      return;
    }

    if (this.appointmentForm.invalid) {
      alert('Selecciona un médico.');
      return;
    }
    this.createAppointment();
  }
}
