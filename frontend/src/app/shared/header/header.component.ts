import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // Ajusta la ruta según sea necesario

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [RouterModule, CommonModule], // Importa el RouterModule aquí
})
export class HeaderComponent {
  user: any = null;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.authService.onAuthChange().subscribe((user) => {
      this.user = user;
      this.cdr.detectChanges();
    });
  }

  logout(): void {
    this.authService.logout();
    this.user = null;
    this.cdr.detectChanges(); // Actualizar el header al cerrar sesión
  }
}
