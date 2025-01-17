// weekly-calendar.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface WeeklyCalendarSlot {
  hour: string;
  appointments: any[];
}

interface DayColumn {
  date: Date;
  slots: WeeklyCalendarSlot[];
}

@Component({
  selector: 'app-weekly-calendar',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./weekly-calendar.component.css'],

  template: `
    <div class="calendar-container">
      <!-- Navegación del calendario -->
      <div class="calendar-navigation">
        <button class="btn btn-primary" (click)="previousWeek()">
          ← Semana anterior
        </button>
        <span class="current-week">
          {{ days[0].date | date : 'dd/MM/yyyy' }} -
          {{ days[6].date | date : 'dd/MM/yyyy' }}
        </span>
        <button class="btn btn-primary" (click)="nextWeek()">
          Semana siguiente →
        </button>
      </div>

      <div class="calendar-grid">
        <!-- Cabecera con días -->
        <div class="header-cell"></div>
        <div *ngFor="let day of days" class="header-cell">
          {{ day.date | date : 'EEE dd/MM' }}
        </div>

        <!-- Filas de horas -->
        <ng-container *ngFor="let hour of hours">
          <!-- Celda de hora -->
          <div class="time-cell">{{ hour }}</div>

          <!-- Celdas de citas para cada día -->
          <div
            *ngFor="let day of days"
            class="calendar-cell"
            [class.today]="isToday(day.date)"
          >
            <div
              *ngFor="
                let appointment of getAppointmentsForTimeSlot(day.date, hour)
              "
              class="appointment status-{{ appointment.status }}"
              [title]="
                appointment.client_name + ' ' + appointment.client_lastname
              "
            >
              {{ appointment.client_name }} {{ appointment.client_lastname }}
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
export class WeeklyCalendarComponent implements OnInit {
  @Input() appointments: any[] = [];
  days: DayColumn[] = [];
  hours: string[] = [];
  currentWeekOffset: number = 0;

  ngOnInit() {
    this.initializeCalendar();
    this.generateHours();
  }

  private initializeCalendar() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ajusta la fecha según el offset de semanas
    const baseDate = new Date(today);
    baseDate.setDate(today.getDate() + this.currentWeekOffset * 7);

    // Encuentra el primer día de la semana (domingo)
    const firstDay = new Date(baseDate);
    firstDay.setDate(baseDate.getDate() - baseDate.getDay());

    // Genera los 7 días de la semana
    this.days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + i);
      return {
        date,
        slots: [],
      };
    });
  }

  private generateHours() {
    // Genera horas desde las 8:00 hasta las 20:00
    this.hours = Array.from({ length: 13 }, (_, i) => {
      const hour = i + 8;
      return `${hour.toString().padStart(2, '0')}:00`;
    });
  }

  nextWeek() {
    this.currentWeekOffset++;
    this.initializeCalendar();
  }

  previousWeek() {
    this.currentWeekOffset--;
    this.initializeCalendar();
  }

  getAppointmentsForTimeSlot(date: Date, timeSlot: string): any[] {
    // Filtra las citas canceladas (status === 2)
    return this.appointments
      .filter((appointment) => appointment.status !== 2) // Excluye citas canceladas
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.date_time);
        return (
          this.isSameDay(appointmentDate, date) &&
          this.isSameHour(appointmentDate, timeSlot)
        );
      });
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private isSameHour(date: Date, timeSlot: string): boolean {
    const hour = parseInt(timeSlot.split(':')[0]);
    return date.getHours() === hour;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDay(date, today);
  }
}
