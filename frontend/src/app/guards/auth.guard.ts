import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    // Verifica si el usuario está autenticado y tiene el rol de médico
    const token = localStorage.getItem('token'); // Obtén el token de autenticación
    const userRole = localStorage.getItem('role'); // Obtén el rol del usuario

    if (token && userRole === 'doctor') {
      // Si está autenticado y el rol es médico, permite el acceso
      return true;
    } else {
      // Si no, redirige al login y niega el acceso
      this.router.navigate(['/login']);
      return false;
    }
  }
}
