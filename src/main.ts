import { initFederation } from '@angular-architects/native-federation';

function buildRoomsRemoteUrl(): string {
  const { hostname, protocol } = window.location;

  // Codespaces / cloud IDEs: el host tiene el puerto embebido en el subdominio,
  // ej. "algo-4200.app.github.dev" -> reemplazamos "-4200" por "-4201".
  if (hostname.includes('-4200')) {
    return `${protocol}//${hostname.replace('-4200', '-4201')}/remoteEntry.json`;
  }

  // Local / cualquier otro entorno con puertos explícitos en la URL.
  return `${protocol}//${hostname}:4201/remoteEntry.json`;
}

(async () => {
  try {
    await initFederation({
      'rooms-remote': buildRoomsRemoteUrl(),
    });
  } catch (error) {
    console.warn(
      'Native Federation no pudo inicializarse; el CRUD local seguirá disponible.',
      error,
    );
  }

  await import('./bootstrap');
})();
