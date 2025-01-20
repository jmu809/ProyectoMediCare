import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../services/appointment.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrls: ['./edit-appointment.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class EditAppointmentComponent implements OnInit {
  editAppointmentForm: FormGroup;
  appointmentId: number | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editAppointmentForm = this.fb.group({
      client_name: [{ value: '', disabled: true }, Validators.required],
      date: [{ value: '', disabled: true }, Validators.required],
      time: [{ value: '', disabled: true }, Validators.required],
      status: ['', Validators.required],
      actual_checkups_count: ['', [Validators.required, Validators.min(0)]],
      doctor_notes: [''],
    });
  }
  loadAppointmentData(appointmentId: number): void {
    this.appointmentService.getAppointmentById(appointmentId).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response); // Log para depuración

        // Asegúrate de que date_time está definido y tiene el formato esperado
        if (response.date_time) {
          const dateTimeParts = response.date_time.split(' ');
          const date = dateTimeParts[0]; // Extrae solo la fecha
          const time = dateTimeParts[1]?.slice(0, 5) || ''; // Extrae la hora en formato HH:mm

          this.editAppointmentForm.patchValue({
            client_name: `${response.client_name} ${response.client_lastname}`,
            date: date, // Solo la fecha en formato yyyy-MM-dd
            time: time, // Solo la hora en formato HH:mm
            status: response.status,
            actual_checkups_count: response.actual_checkups_count,
            doctor_notes: response.doctor_notes || '',
          });
        } else {
          console.error(
            'date_time no está definido en la respuesta del backend.'
          );
        }
      },
      error: (err) => {
        console.error('Error al cargar los datos de la cita:', err);
        this.errorMessage = 'Error al cargar los datos de la cita.';
      },
    });
  }

  onSubmit(): void {
    if (this.editAppointmentForm.valid && this.appointmentId) {
      const formData = this.editAppointmentForm.getRawValue(); // Obtener valores del formulario
      this.appointmentService
        .updateAppointmentMed(this.appointmentId, formData)
        .subscribe({
          next: () => {
            alert('Cita actualizada exitosamente');
            this.router.navigate(['/doctor-appointments']); // Redirigir a la lista de citas
          },
          error: (err) => {
            console.error('Error al actualizar la cita:', err);
            this.errorMessage = 'Error al actualizar la cita.';
          },
        });
    }
  }

  ngOnInit(): void {
    const appointmentId = this.route.snapshot.paramMap.get('id'); // Obtén el ID desde la URL
    if (appointmentId) {
      this.appointmentId = Number(appointmentId); // Almacena el ID en una variable local
      this.loadAppointmentData(this.appointmentId); // Carga los datos de la cita
    } else {
      console.error('ID de cita no encontrado en la ruta');
    }
  }
}
