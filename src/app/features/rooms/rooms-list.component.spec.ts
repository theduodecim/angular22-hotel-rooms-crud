import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, expect, it, beforeEach } from 'vitest';
import { Room } from '../../core/models/room.model';
import { RoomsListComponent } from './rooms-list.component';
import { RoomsService } from './rooms.service';

const initialRooms: Room[] = [
  { id: 1, name: 'Suite Azul', type: 'suite', price: 200, capacity: 3, available: true, isSeed: true },
  { id: 2, name: 'Doble Patio', type: 'double', price: 100, capacity: 2, available: false, isSeed: false },
];

function textContent(fixture: ComponentFixture<RoomsListComponent>): string {
  return fixture.nativeElement.textContent.replace(/\s+/g, ' ').trim();
}

describe('RoomsListComponent', () => {
  let fixture: ComponentFixture<RoomsListComponent>;
  let rooms: ReturnType<typeof signal<Room[]>>;
  let loading: ReturnType<typeof signal<boolean>>;
  let error: ReturnType<typeof signal<Error | null>>;

  beforeEach(async () => {
    rooms = signal<Room[]>(initialRooms);
    loading = signal(false);
    error = signal<Error | null>(null);

    await TestBed.configureTestingModule({
      imports: [RoomsListComponent],
      providers: [
        {
          provide: RoomsService,
          useValue: {
            roomsResource: {
              value: rooms,
              set: rooms.set.bind(rooms),
              isLoading: loading,
              error,
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoomsListComponent);
  });

  it('renderiza la lista según roomsResource.value()', () => {
    fixture.detectChanges();

    const text = textContent(fixture);
    expect(text).toContain('Suite Azul');
    expect(text).toContain('Doble Patio');
  });

  it('recalcula availableRooms() y averagePrice() cuando cambia roomsResource.value()', () => {
    fixture.detectChanges();
    expect((fixture.componentInstance as any).availableRooms()).toBe(1);
    expect((fixture.componentInstance as any).averagePrice()).toBe(150);

    rooms.set([
      { id: 3, name: 'Single Uno', type: 'single', price: 50, capacity: 1, available: true },
      { id: 4, name: 'Suite Dos', type: 'suite', price: 250, capacity: 4, available: true },
    ]);
    fixture.detectChanges();

    expect((fixture.componentInstance as any).availableRooms()).toBe(2);
    expect((fixture.componentInstance as any).averagePrice()).toBe(150);
    expect(textContent(fixture)).toContain('Single Uno');
  });

  it('muestra el estado de loading y oculta la lista', () => {
    loading.set(true);
    fixture.detectChanges();

    const text = textContent(fixture);
    expect(text).toContain('Cargando habitaciones semilla…');
    expect(text).not.toContain('Suite Azul');
  });

  it('muestra el estado de error en vez de la lista', () => {
    error.set(new Error('falló la carga'));
    fixture.detectChanges();

    const text = textContent(fixture);
    expect(text).toContain('Error: falló la carga');
    expect(text).not.toContain('Suite Azul');
  });
});
