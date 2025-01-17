import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('token'); // Obtén el token
    const role = localStorage.getItem('role'); // Obtén el rol del usuario

    if (token && role === 'doctor') {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
