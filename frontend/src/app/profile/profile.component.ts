import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [FormsModule, CommonModule], // Agrega FormsModule aquí
})
export class ProfileComponent implements OnInit {
  user: any = null; // Datos del usuario
  client: any = {
    company_name: '',
    cif: '',
    tel_number: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
  }; // Inicializamos un objeto vacío con las propiedades necesarias
  editing: boolean = false; // Indica si se está editando el perfil
  router: any;

  constructor(private authService: AuthService) {}

  openEditForm(): void {
    this.editing = true;
  }

  cancelEdit(): void {
    this.editing = false;
  }
  saveChanges(): void {
    console.log('Datos guardados (enviando al backend):', this.client);

    // Enviar los datos al backend
    this.authService.updateClient(this.client).subscribe({
      next: (response) => {
        console.log('Perfil actualizado con éxito:', response);
        alert('Perfil actualizado con éxito.');
        this.editing = false; // Salir del modo de edición
      },
      error: (err) => {
        console.error('Error al actualizar el perfil:', err);
        if (err.status === 404) {
          alert('No se encontró un cliente asociado a este usuario.');
        } else {
          alert('Ocurrió un error al actualizar el perfil.');
        }
      },
    });
  }

  ngOnInit(): void {
    this.authService.onAuthChange().subscribe((user) => {
      this.user = user; // Datos del usuario
      this.client = user?.client || this.client; // Si no hay cliente, mantenemos el objeto inicializado
    });
  }
  goToMyAppointments(): void {
    this.router.navigate(['/myappointments']);
  }
}
