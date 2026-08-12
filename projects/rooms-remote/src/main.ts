import { initFederation } from '@angular-architects/native-federation';

(async () => {
  try {
    await initFederation();
  } catch (error) {
    console.warn(
      'Native Federation no pudo inicializarse en rooms-remote; se inicia standalone.',
      error,
    );
  }

  await import('./bootstrap');
})();
