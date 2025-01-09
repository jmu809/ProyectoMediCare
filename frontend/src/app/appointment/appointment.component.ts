import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service'; // Adjust the path as needed
//imports calendario
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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

  availableTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
  selectedDate: Date | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.appointmentForm = this.fb.group({
      doctor: [''],
      name: [''],
      lastname: [''],
      dni: [''],
      phone: [''],
    });
  }
  onDateChange(selectedDate: Date): void {
    this.selectedDate = selectedDate;
    console.log('Fecha seleccionada:', this.selectedDate); // Depuración
  }

  /*   ngOnInit(): void {
    this.user = {
      name: 'Juan',
      lastname: 'Pérez',
      dni: '12345678X',
      phone: '987654321',
    }; // Esto debería venir de un servicio
    this.appointmentForm.patchValue(this.user);
  } */
  ngOnInit(): void {
    this.authService.onAuthChange().subscribe((user) => {
      this.user = user; // Cargar usuario y cliente
    });
    // Cargar lista de médicos
    this.authService.getDoctors().subscribe((doctors) => {
      this.doctors = doctors;
    });
  }
}
