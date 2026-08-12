export type RoomType = 'single' | 'double' | 'suite';

export interface Room {
  id: number;
  name: string;
  type: RoomType;
  price: number;
  capacity: number;
  available: boolean;
  isSeed?: boolean;
}
