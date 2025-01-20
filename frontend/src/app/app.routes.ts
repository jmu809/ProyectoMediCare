import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { IndexComponent } from './index/index.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { ProfileComponent } from './profile/profile.component';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';
import { AdminAppointmentsComponent } from './admin-appointments/admin-appointments.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminClientsComponent } from './admin-clients/admin-clients.component';
import { AdminDoctorsComponent } from './admin-doctors/admin-doctors.component';
import { RegisterDoctorComponent } from './register-doctor/register-doctor.component';
import { DoctorAppointmentsComponent } from './doctor-appointments/doctor-appointments.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterClientComponent } from './register-client/register-client.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { EditAppointmentComponent } from './edit-appointment/edit-appointment.component';
import { AdminContractsComponent } from './admin-contracts/admin-contracts.component';
import { MantenimientoComponent } from './mantenimiento/mantenimiento.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'index', component: IndexComponent },
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'appointment', component: AppointmentComponent },
  { path: 'profile', component: ProfileComponent }, // Ruta del perfil
  { path: 'myappointments', component: MyAppointmentsComponent },
  {
    path: 'adminappointments',
    component: AdminAppointmentsComponent,
    canActivate: [AdminGuard], // Protege la ruta con el guard
  },
  {
    path: 'admin-clients',
    component: AdminClientsComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'admin-doctors',
    component: AdminDoctorsComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'register-doctor',
    component: RegisterDoctorComponent,
    canActivate: [AdminGuard],
  }, // Ruta futura
  {
    path: 'doctor-appointments',
    component: DoctorAppointmentsComponent,
    canActivate: [AuthGuard], // Aplica el guard aquí
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register-client',
    component: RegisterClientComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'edit-client/:id',
    component: EditClientComponent,
    canActivate: [AdminGuard], // Solo accesible para administradores
  },
  {
    path: 'admin-contracts',
    component: AdminContractsComponent,
    canActivate: [AdminGuard], // Solo accesible para administradores
  },
  { path: 'mantenimiento', component: MantenimientoComponent },
  // Otras rutas...
  { path: 'edit-appointment/:id', component: EditAppointmentComponent },

  { path: '**', redirectTo: '' }, // Manejo de rutas no existentes
];
