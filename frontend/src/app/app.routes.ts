import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { IndexComponent } from './index/index.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'index', component: IndexComponent }, // Add the index route
  { path: '', redirectTo: '/index', pathMatch: 'full' }, // Change redirect to index
];
