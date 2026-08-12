import { httpResource } from '@angular/common/http';
import { effect, Injectable, signal } from '@angular/core';
import { Room } from '../../core/models/room.model';

const STORAGE_KEY = 'rooms';

@Injectable({ providedIn: 'root' })
export class RoomsService {
  private readonly hasStoredRooms = signal(localStorage.getItem(STORAGE_KEY) !== null);
  readonly roomsResource = httpResource<Room[]>(
    () => (this.hasStoredRooms() ? undefined : '/api/rooms'),
    {
      defaultValue: [],
    },
  );

  constructor() {
    const storedRooms = this.readStoredRooms();

    if (storedRooms) {
      this.roomsResource.set(storedRooms);
      return;
    }

    effect(() => {
      const rooms = this.roomsResource.value();

      if (rooms.length > 0 && !this.readStoredRooms()) {
        this.persist(rooms.map((room) => ({ ...room, isSeed: true })));
        this.hasStoredRooms.set(true);
      }
    });
  }

  createRoom(room: Omit<Room, 'id' | 'isSeed'>): void {
    const nextRoom: Room = {
      ...room,
      id: this.nextId(),
      isSeed: false,
    };

    this.persist([nextRoom, ...this.currentRooms()]);
  }

  updateRoom(updatedRoom: Room): void {
    const nextRooms = this.currentRooms().map((room) =>
      room.id === updatedRoom.id
        ? { ...updatedRoom, isSeed: room.isSeed ?? updatedRoom.isSeed }
        : room,
    );

    this.persist(nextRooms);
  }

  deleteRoom(roomId: number): void {
    this.persist(this.currentRooms().filter((room) => room.id !== roomId));
  }

  private currentRooms(): Room[] {
    return this.roomsResource.value() ?? [];
  }

  private nextId(): number {
    return Math.max(0, ...this.currentRooms().map((room) => room.id)) + 1;
  }

  private persist(rooms: Room[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    this.hasStoredRooms.set(true);
    this.roomsResource.set(rooms);
  }

  private readStoredRooms(): Room[] | null {
    const rawRooms = localStorage.getItem(STORAGE_KEY);

    if (!rawRooms) {
      return null;
    }

    try {
      return JSON.parse(rawRooms) as Room[];
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
}
