import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.authService.getToken(); // Verifica si hay un token
    const userRole = this.authService.getRole(); // Obtiene el rol del usuario

    if (token && userRole === 'admin') {
      return true; // Permite el acceso si el rol es admin
    } else {
      this.router.navigate(['/login']); // Redirige al login si no es admin
      return false;
    }
  }
}
