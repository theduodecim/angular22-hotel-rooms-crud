import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { Room } from './core/models/room.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly http = inject(HttpClient);

  protected readonly title = signal('hotel-crud-shell');
  protected readonly rooms = signal<Room[]>([]);
  protected readonly apiError = signal<string | null>(null);
  protected readonly loading = signal(true);

  constructor() {
    this.http.get<Room[]>('/api/rooms').subscribe({
      next: (rooms) => {
        this.rooms.set(rooms);
        this.loading.set(false);
      },
      error: (err) => {
        this.apiError.set(err.message ?? 'Error al cargar habitaciones');
        this.loading.set(false);
      },
    });
  }
}
