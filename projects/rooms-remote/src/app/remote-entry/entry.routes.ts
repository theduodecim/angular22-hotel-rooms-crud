import { Routes } from '@angular/router';
import { RoomsListComponent } from '../features/rooms/rooms-list.component';

export const ROOMS_REMOTE_ROUTES: Routes = [{ path: '', component: RoomsListComponent }];
export default ROOMS_REMOTE_ROUTES;
