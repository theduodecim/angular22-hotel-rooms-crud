import { Component, computed, effect, input, output, signal } from '@angular/core';
import { form, FormField, min, required } from '@angular/forms/signals';
import { Room, RoomType } from '../../core/models/room.model';

type RoomFormModel = {
  name: string;
  type: RoomType | '';
  price: number;
  capacity: number;
  available: boolean;
};

@Component({
  selector: 'app-room-form',
  imports: [FormField],
  templateUrl: './room-form.component.html',
})
export class RoomFormComponent {
  readonly room = input<Room | null>(null);
  readonly saved = output<Room | Omit<Room, 'id' | 'isSeed'>>();
  readonly cancelled = output<void>();

  protected readonly roomTypes: RoomType[] = ['single', 'double', 'suite'];
  protected readonly model = signal<RoomFormModel>(this.emptyModel());
  protected readonly roomForm = form(this.model, (path) => {
    required(path.name);
    required(path.type);
    min(path.price, 1);
    min(path.capacity, 1);
  });
  protected readonly title = computed(() =>
    this.room() ? 'Editar habitación' : 'Nueva habitación',
  );

  constructor() {
    effect(() => {
      const room = this.room();
      this.model.set(
        room
          ? {
              name: room.name,
              type: room.type,
              price: room.price,
              capacity: room.capacity,
              available: room.available,
            }
          : this.emptyModel(),
      );
    });
  }

  protected submitForm(): void {
    this.roomForm().markAsTouched();

    if (this.roomForm().invalid()) {
      return;
    }

    const value = this.model();
    const currentRoom = this.room();
    const payload = {
      name: value.name.trim(),
      type: value.type as RoomType,
      price: Number(value.price),
      capacity: Number(value.capacity),
      available: value.available,
    };

    this.saved.emit(currentRoom ? { ...currentRoom, ...payload } : payload);
  }

  private emptyModel(): RoomFormModel {
    return {
      name: '',
      type: '',
      price: 0,
      capacity: 1,
      available: true,
    };
  }
}
