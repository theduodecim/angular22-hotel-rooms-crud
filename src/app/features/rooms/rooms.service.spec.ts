import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { Room } from '../../core/models/room.model';
import { RoomsService } from './rooms.service';

const STORAGE_KEY = 'rooms';

const seedRooms: Room[] = [
  { id: 1, name: 'Suite Azul', type: 'suite', price: 220, capacity: 3, available: true },
  { id: 2, name: 'Doble Patio', type: 'double', price: 140, capacity: 2, available: false },
];

function storedRooms(): Room[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Room[];
}

describe('RoomsService', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('crea una habitación en localStorage y actualiza inmediatamente el resource', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedRooms));
    const service = TestBed.inject(RoomsService);

    service.createRoom({ name: 'Single Nueva', type: 'single', price: 80, capacity: 1, available: true });

    const expected: Room[] = [
      { id: 3, name: 'Single Nueva', type: 'single', price: 80, capacity: 1, available: true, isSeed: false },
      ...seedRooms,
    ];
    expect(storedRooms()).toEqual(expected);
    expect(service.roomsResource.value()).toEqual(expected);
  });

  it('actualiza una habitación, persiste el cambio y conserva isSeed cuando el payload no lo trae', () => {
    const originalRooms: Room[] = [
      { ...seedRooms[0], isSeed: true },
      { ...seedRooms[1], isSeed: false },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(originalRooms));
    const service = TestBed.inject(RoomsService);

    service.updateRoom({ id: 1, name: 'Suite Renovada', type: 'suite', price: 250, capacity: 4, available: false });

    const expected: Room[] = [
      { id: 1, name: 'Suite Renovada', type: 'suite', price: 250, capacity: 4, available: false, isSeed: true },
      originalRooms[1],
    ];
    expect(storedRooms()).toEqual(expected);
    expect(service.roomsResource.value()).toEqual(expected);
  });

  it('elimina una habitación de localStorage y actualiza inmediatamente el resource', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedRooms));
    const service = TestBed.inject(RoomsService);

    service.deleteRoom(1);

    expect(storedRooms()).toEqual([seedRooms[1]]);
    expect(service.roomsResource.value()).toEqual([seedRooms[1]]);
  });

  it('carga habitaciones semilla con GET /api/rooms y las persiste marcadas como isSeed', async () => {
    const service = TestBed.inject(RoomsService);
    const request = http.expectOne('/api/rooms');

    request.flush(seedRooms);
    await (TestBed as any).tick();

    const expected = seedRooms.map((room) => ({ ...room, isSeed: true }));
    expect(storedRooms()).toEqual(expected);
    expect(service.roomsResource.value()).toEqual(expected);
  });

  it('setea roomsResource.error() cuando falla el GET inicial', async () => {
    const service = TestBed.inject(RoomsService);
    const request = http.expectOne('/api/rooms');

    request.flush('Error interno', { status: 500, statusText: 'Server Error' });
    await (TestBed as any).tick();

    expect(service.roomsResource.error()).toBeTruthy();
  });
});
