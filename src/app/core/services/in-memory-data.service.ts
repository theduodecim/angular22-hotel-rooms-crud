import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Room } from '../models/room.model';

@Injectable({ providedIn: 'root' })
export class InMemoryDataService implements InMemoryDbService {
  createDb(): { rooms: Room[] } {
    return {
      rooms: [
        {
          id: 1,
          name: 'Habitación 101',
          type: 'double',
          price: 85,
          capacity: 2,
          available: false,
        },
        {
          id: 2,
          name: 'Habitación 102',
          type: 'single',
          price: 55,
          capacity: 1,
          available: true,
        },
        {
          id: 3,
          name: 'Suite Presidencial',
          type: 'suite',
          price: 220,
          capacity: 4,
          available: false,
        },
        {
          id: 4,
          name: 'Habitación 201',
          type: 'double',
          price: 90,
          capacity: 2,
          available: true,
        },
        {
          id: 5,
          name: 'Habitación 305',
          type: 'single',
          price: 60,
          capacity: 1,
          available: true,
        },
        {
          id: 6,
          name: 'Suite Ejecutiva',
          type: 'suite',
          price: 180,
          capacity: 3,
          available: false,
        },
      ],
    };
  }
}
