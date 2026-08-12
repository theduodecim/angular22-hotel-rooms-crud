import { Routes } from '@angular/router';
import { RoomsListComponent } from './features/rooms/rooms-list.component';

const REMOTE_TIMEOUT_MS = 5000;

type RemoteRoutesModule = {
  default?: Routes;
  ROOMS_REMOTE_ROUTES?: Routes;
};

async function importNativeFederation(): Promise<{
  loadRemoteModule<T = unknown>(options: { remoteName: string; exposedModule: string }): Promise<T>;
}> {
  return new Function('specifier', 'return import(specifier)')(
    '@angular-architects/native-federation',
  );
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error(`Timeout cargando rooms-remote después de ${timeoutMs}ms`)),
      timeoutMs,
    );

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeout));
  });
}

async function loadRoomsRemoteRoutes(): Promise<Routes> {
  try {
    const { loadRemoteModule } = await importNativeFederation();
    const remoteModule = await withTimeout(
      loadRemoteModule<RemoteRoutesModule>({
        remoteName: 'rooms-remote',
        exposedModule: './RoomsRoutes',
      }),
      REMOTE_TIMEOUT_MS,
    );

    return (
      remoteModule.default ??
      remoteModule.ROOMS_REMOTE_ROUTES ?? [{ path: '', component: RoomsListComponent }]
    );
  } catch (error) {
    console.warn(
      'No se pudo cargar rooms-remote; usando RoomsListComponent local como fallback.',
      error,
    );
    return [{ path: '', component: RoomsListComponent }];
  }
}

export const routes: Routes = [
  { path: '', component: RoomsListComponent },
  { path: 'rooms-remote', loadChildren: loadRoomsRemoteRoutes },
  { path: '**', redirectTo: '' },
];
