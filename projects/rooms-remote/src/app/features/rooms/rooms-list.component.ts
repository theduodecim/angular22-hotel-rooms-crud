import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Room } from '../../core/models/room.model';
import { RoomFormComponent } from './room-form.component';
import { RoomsService } from './rooms.service';

@Component({
  selector: 'app-rooms-list',
  imports: [CurrencyPipe, RoomFormComponent],
  templateUrl: './rooms-list.component.html',
})
export class RoomsListComponent {
  private readonly roomsService = inject(RoomsService);

  protected readonly roomsResource = this.roomsService.roomsResource;
  protected readonly editingRoom = signal<Room | null>(null);
  protected readonly showForm = signal(false);
  protected readonly availableRooms = computed(
    () => this.roomsResource.value().filter((room) => room.available).length,
  );
  protected readonly averagePrice = computed(() => {
    const rooms = this.roomsResource.value();

    if (rooms.length === 0) {
      return 0;
    }

    return rooms.reduce((total, room) => total + room.price, 0) / rooms.length;
  });

  protected openCreateForm(): void {
    this.editingRoom.set(null);
    this.showForm.set(true);
  }

  protected openEditForm(room: Room): void {
    this.editingRoom.set(room);
    this.showForm.set(true);
  }

  protected saveRoom(room: Room | Omit<Room, 'id' | 'isSeed'>): void {
    if ('id' in room) {
      this.roomsService.updateRoom(room);
    } else {
      this.roomsService.createRoom(room);
    }

    this.closeForm();
  }

  protected deleteRoom(room: Room): void {
    if (confirm(`¿Eliminar ${room.name}?`)) {
      this.roomsService.deleteRoom(room.id);
    }
  }

  protected closeForm(): void {
    this.showForm.set(false);
    this.editingRoom.set(null);
  }
}
