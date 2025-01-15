import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUser();
    if (user && user.role.name === 'admin') {
      return true; // Permitir acceso
    }

    this.router.navigate(['/login']); // Redirigir si no es administrador
    return false; // Denegar acceso
  }
}
