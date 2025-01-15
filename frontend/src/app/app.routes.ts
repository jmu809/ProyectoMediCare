import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { IndexComponent } from './index/index.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { ProfileComponent } from './profile/profile.component';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';
import { AdminAppointmentsComponent } from './admin-appointments/admin-appointments.component';
import { AdminGuard } from './guards/admin.guard';

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
  { path: '**', redirectTo: '' }, // Manejo de rutas no existentes
];
