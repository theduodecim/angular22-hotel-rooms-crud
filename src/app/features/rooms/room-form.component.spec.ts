import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { RoomFormComponent } from './room-form.component';

describe('RoomFormComponent', () => {
  let fixture: ComponentFixture<RoomFormComponent>;
  let component: RoomFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RoomFormComponent] }).compileComponents();
    fixture = TestBed.createComponent(RoomFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('marca inválido el formulario cuando falta name', () => {
    (component as any).model.set({ name: '', type: 'single', price: 10, capacity: 1, available: true });
    expect((component as any).roomForm().invalid()).toBe(true);
  });

  it('marca inválido el formulario cuando falta type', () => {
    (component as any).model.set({ name: 'Habitación 1', type: '', price: 10, capacity: 1, available: true });
    expect((component as any).roomForm().invalid()).toBe(true);
  });

  it('marca inválido el formulario cuando price es menor que 1', () => {
    (component as any).model.set({ name: 'Habitación 1', type: 'single', price: 0, capacity: 1, available: true });
    expect((component as any).roomForm().invalid()).toBe(true);
  });

  it('marca inválido el formulario cuando capacity es menor que 1', () => {
    (component as any).model.set({ name: 'Habitación 1', type: 'single', price: 10, capacity: 0, available: true });
    expect((component as any).roomForm().invalid()).toBe(true);
  });

  it('marca válido el formulario con datos completos', () => {
    (component as any).model.set({ name: 'Habitación 1', type: 'suite', price: 120, capacity: 2, available: true });
    expect((component as any).roomForm().invalid()).toBe(false);
  });

  it('no emite saved cuando submitForm() se ejecuta con el formulario inválido', () => {
    const emitSpy = vi.spyOn(component.saved, 'emit');
    (component as any).model.set({ name: '', type: 'suite', price: 120, capacity: 2, available: true });

    (component as any).submitForm();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('emite el payload trimeado y convertido cuando submitForm() se ejecuta con el formulario válido', () => {
    const emitSpy = vi.spyOn(component.saved, 'emit');
    (component as any).model.set({ name: ' Habitación 401 ', type: 'double', price: '180' as any, capacity: '2' as any, available: false });

    (component as any).submitForm();

    expect(emitSpy).toHaveBeenCalledWith({
      name: 'Habitación 401',
      type: 'double',
      price: 180,
      capacity: 2,
      available: false,
    });
  });
});
