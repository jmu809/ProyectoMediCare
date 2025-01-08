import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // Adjust the path as needed

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [RouterModule, CommonModule], // Import RouterModule here
})
export class HeaderComponent {
  user: any = null;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser(); // Carga inicial del usuario
    this.authService.onAuthChange().subscribe((user) => {
      this.user = user;
      this.cdr.detectChanges(); // Forzar la actualización del header
    });
  }

  logout(): void {
    this.authService.logout();
    this.user = null;
    this.cdr.detectChanges(); // Actualizar el header al cerrar sesión
  }
}
