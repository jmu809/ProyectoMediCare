import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true, // Indica que es independiente
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
  imports: [CommonModule, ReactiveFormsModule], // Importa los módulos necesarios
})
export class AppointmentComponent {
  appointmentForm: FormGroup;
  user: any;
  availableTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
  doctors = [
    { id: 1, name: 'Dr. Juan Pérez' },
    { id: 2, name: 'Dra. María López' },
  ];

  constructor(private fb: FormBuilder) {
    this.appointmentForm = this.fb.group({
      doctor: [''],
      name: [''],
      lastname: [''],
      dni: [''],
      phone: [''],
    });
  }

  ngOnInit(): void {
    this.user = {
      name: 'Juan',
      lastname: 'Pérez',
      dni: '12345678X',
      phone: '987654321',
    }; // Esto debería venir de un servicio
    this.appointmentForm.patchValue(this.user);
  }
}
