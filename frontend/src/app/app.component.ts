import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule para *ngIf y otros pipes
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, CommonModule], // Incluye CommonModule aquí
})
export class AppComponent implements OnInit {
  title = 'frontend';
  response$!: Observable<any>; // Cambiamos a un observable

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.response$ = this.apiService.getTestData(); // Asignamos directamente el observable
  }
}
