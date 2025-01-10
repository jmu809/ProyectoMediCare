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
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { last } from 'rxjs';

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
    private cdr: ChangeDetectorRef
  ) {
    this.appointmentForm = this.fb.group({
      doctor: ['', Validators.required], // Campo obligatorio
    });
  }
  onDateChange(selectedDate: Date | null): void {
    this.selectedDate = selectedDate;
    console.log('Fecha seleccionada:', this.selectedDate);

    // Forzar la actualización del calendario
    this.cdr.detectChanges();
  }
  onTimeSelect(time: string): void {
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

  //Crear una cita
  /*   createAppointment(): void {
    if (
      !this.selectedDate ||
      !this.selectedTime ||
      !this.appointmentForm.valid
    ) {
      console.error('Datos incompletos para crear la cita.');
      return;
    }

    // Combinar fecha y hora seleccionadas
    const dateTime = new Date(this.selectedDate);
    const [hours, minutes] = this.selectedTime.split(':');
    dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

    // Datos de la cita
    const appointmentData = {
      client_id: this.user.client.id, // ID del cliente autenticado
      doctor_id: this.appointmentForm.value.doctor, // ID del doctor seleccionado
      date_time: dateTime.toISOString().slice(0, 16).replace('T', ' '), // Formato: "YYYY-MM-DD HH:mm"
    };

    console.log('Datos de la cita:', appointmentData);

    // Llamar al servicio para crear la cita
    this.authService.createAppointment(appointmentData).subscribe({
      next: (response) => {
        console.log('Cita creada con éxito:', response);
        alert('Cita creada con éxito.');
      },
      error: (err) => {
        console.error('Error al crear la cita:', err);
        alert('Error al crear la cita.');
      },
    });
  } */

  ngOnInit(): void {
    this.authService.onAuthChange().subscribe((user) => {
      this.user = user; // Cargar usuario y cliente
    });
    // Cargar lista de médicos
    /*     this.authService.getDoctors().subscribe((doctors) => {
      this.doctors = doctors;
    }); */
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

    /*     // Combinar fecha y hora seleccionadas
    const dateTime = new Date(this.selectedDate);
    const [hours, minutes] = this.selectedTime.split(':');
    dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

    // Datos de la cita
    const appointmentData = {
      client_id: this.user.client.id, // ID del cliente autenticado
      doctor_id: this.appointmentForm.value.doctor, // ID del doctor seleccionado
      date_time: dateTime.toISOString().slice(0, 16).replace('T', ' '), // Formato: "YYYY-MM-DD HH:mm"
    };

    console.log('Datos de la cita:', appointmentData);

    // Llamar al servicio para crear la cita
    this.authService.createAppointment(appointmentData).subscribe({
      next: (response) => {
        console.log('Cita creada con éxito:', response);
        alert('Cita creada con éxito.');
      },
      error: (err) => {
        console.error('Error al crear la cita:', err);
        alert('Error al crear la cita.');
      },
    }); */
  }
}
